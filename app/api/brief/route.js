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

    // ── 2. Save to Supabase (anon key insert) ─────────────────────────
    if (formData) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/nrg_submissions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            name: formData.name || null,
            role: formData.role || null,
            email: formData.email || null,
            phone: formData.phone || null,
            urgency: formData.urgency || null,
            form_data: formData,
            ai_brief: briefText,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.text();
        console.error('Supabase insert error:', err);
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
