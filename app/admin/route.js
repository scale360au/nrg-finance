// Server-side API route — uses service key, never exposed to browser
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');
  const id = searchParams.get('id');

  // Validate PIN server-side
  if (pin !== process.env.ADMIN_PIN) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/nrg_submissions`;
  const headers = {
    'apikey': process.env.SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
  };

  if (id) {
    // Fetch single submission
    const res = await fetch(`${base}?id=eq.${id}&select=*`, { headers });
    const data = await res.json();
    return Response.json(data[0] || null);
  } else {
    // Fetch all submissions (list view)
    const res = await fetch(
      `${base}?select=id,created_at,name,role,email,urgency&order=created_at.desc`,
      { headers }
    );
    const data = await res.json();
    return Response.json(data);
  }
}
