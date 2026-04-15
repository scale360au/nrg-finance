import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, formData } = body;

    // ── 1. Generate the AI brief ──────────────────────────────────────
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const aiData = await aiResponse.json();
    const briefText = aiData.content?.find(b => b.type === 'text')?.text || '';

    // ── 2. Save to Supabase ───────────────────────────────────────────
    if (formData) {
      const { error } = await supabase.from('nrg_submissions').insert({
        name: formData.name || null,
        role: formData.role || null,
        email: formData.email || null,
        phone: formData.phone || null,
        urgency: formData.urgency || null,
        form_data: formData,
        ai_brief: briefText,
      });
      if (error) {
        console.error('Supabase insert error:', error.message);
      } else {
        console.log('Submission saved to Supabase');
      }
    }

    return Response.json(aiData);
  } catch (error) {
    console.error('Route error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
