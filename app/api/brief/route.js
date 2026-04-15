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

    // ── 2. Send email via Resend ──────────────────────────────────────
    if (formData && process.env.RESEND_API_KEY) {
      const f = formData;
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937;">
          <div style="background: #0D2B4B; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0 0 4px;">New pre-Zoom questionnaire submission</p>
            <h1 style="color: #fff; font-size: 20px; margin: 0;">NRG Finance &amp; Advocacy</h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 6px 0 0;">${new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151; width: 40%;">Name</td><td style="padding: 10px 14px;">${f.name || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Role</td><td style="padding: 10px 14px;">${f.role || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Email</td><td style="padding: 10px 14px;">${f.email || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Phone</td><td style="padding: 10px 14px;">${f.phone || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Business age</td><td style="padding: 10px 14px;">${f.opYrs || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Team size</td><td style="padding: 10px 14px;">${f.teamSize || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Settlements/month</td><td style="padding: 10px 14px;">${f.settlements || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Client mix</td><td style="padding: 10px 14px;">${(f.clientTypes || []).join(', ') || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Lead sources</td><td style="padding: 10px 14px;">${(f.leadSources || []).join(', ') || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Lead flow</td><td style="padding: 10px 14px;">${f.leadFlow || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Advocacy stage</td><td style="padding: 10px 14px;">${f.advStage || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Advocacy type</td><td style="padding: 10px 14px;">${f.advType || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Advocacy positioning</td><td style="padding: 10px 14px;">${f.advPosition || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Why advocacy?</td><td style="padding: 10px 14px;">${f.advWhy || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Advocacy uncertainty</td><td style="padding: 10px 14px;">${f.advUncertainty || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">CRM / system</td><td style="padding: 10px 14px;">${f.crm || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Challenges</td><td style="padding: 10px 14px;">${(f.challenges || []).join(', ') || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">12-month goal</td><td style="padding: 10px 14px;">${f.goal12m || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Success outcome</td><td style="padding: 10px 14px;">${f.goalSuccess || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Urgency (1–10)</td><td style="padding: 10px 14px;">${f.urgency || '—'}/10</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Website</td><td style="padding: 10px 14px;">${f.website || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Paid ads</td><td style="padding: 10px 14px;">${f.paidAds || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Social media</td><td style="padding: 10px 14px;">${f.social || '—'}</td></tr>
            <tr><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Call topics</td><td style="padding: 10px 14px;">${f.callNotes || '—'}</td></tr>
            <tr style="background: #F9FAFB;"><td style="padding: 10px 14px; font-weight: 600; color: #374151;">Referral source</td><td style="padding: 10px 14px;">${f.referral || '—'}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #E8F0F8; border-radius: 8px; font-size: 13px; color: #374151;">
            The AI coaching prep brief has been generated for this submission.
          </div>
          <div style="margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 16px; font-size: 12px; color: #9CA3AF;">
            NRG Finance × Scale360 — Automated notification
          </div>
        </div>
      `;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Scale360 <mark@elizabethandrews.com.au>',
          to: ['mark@scale360.com.au'],
          subject: `NRG Finance — Pre-Zoom submission${f.name ? ` (${f.name})` : ''}`,
          html: emailHtml,
        }),
      });
    }

    return Response.json(aiData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
