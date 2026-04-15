'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const NAVY = '#0D2B4B';
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function UrgencyBadge({ score }) {
  const color = score >= 8 ? '#DC2626' : score >= 5 ? '#D97706' : '#16A34A';
  const bg = score >= 8 ? '#FEE2E2' : score >= 5 ? '#FEF3C7' : '#DCFCE7';
  return (
    <span style={{ background: bg, color, fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>
      {score}/10
    </span>
  );
}

function Row({ label, value }) {
  if (!value || value === '—') return null;
  return (
    <tr>
      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#6B7280', fontSize: 13, width: '38%', verticalAlign: 'top' }}>{label}</td>
      <td style={{ padding: '8px 12px', fontSize: 13, color: '#111827' }}>{Array.isArray(value) ? value.join(', ') : value}</td>
    </tr>
  );
}

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  async function loadSubmissions() {
    setLoading(true);
    const { data, error } = await supabase
      .from('nrg_submissions')
      .select('id, created_at, name, role, email, urgency')
      .order('created_at', { ascending: false });
    if (!error) setSubmissions(data || []);
    setLoading(false);
  }

  async function loadDetail(id) {
    const { data } = await supabase
      .from('nrg_submissions')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setSelected(data);
  }

  function handlePin() {
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      loadSubmissions();
    } else {
      setPinError(true);
      setPin('');
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '2.5rem', width: 320, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, background: '#E8F0F8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 6 }}>Admin Access</h2>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: '1.5rem' }}>NRG Finance submission dashboard</p>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={e => e.key === 'Enter' && handlePin()}
            style={{
              width: '100%', border: `1px solid ${pinError ? '#DC2626' : '#D1D5DB'}`, borderRadius: 8,
              padding: '10px 12px', fontSize: 14, fontFamily: 'inherit', textAlign: 'center',
              letterSpacing: '0.2em', outline: 'none', boxSizing: 'border-box', marginBottom: 8,
            }}
          />
          {pinError && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 8 }}>Incorrect PIN</p>}
          <button onClick={handlePin} style={{
            width: '100%', background: NAVY, color: '#fff', border: 'none', borderRadius: 8,
            padding: '11px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          }}>Unlock →</button>
        </div>
      </div>
    );
  }

  const f = selected?.form_data || {};

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', fontFamily: "'Montserrat', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: NAVY, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Scale360 Admin</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 2 }}>NRG Finance — Submissions</div>
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>

        {/* Sidebar — submission list */}
        <div style={{ width: 280, background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', flexShrink: 0 }}>
          {loading && <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: 13 }}>Loading...</div>}
          {!loading && submissions.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: 13 }}>No submissions yet</div>
          )}
          {submissions.map(s => (
            <div key={s.id} onClick={() => { loadDetail(s.id); setActiveTab('form'); }}
              style={{
                padding: '14px 16px', borderBottom: '1px solid #F3F4F6', cursor: 'pointer',
                background: selected?.id === s.id ? '#E8F0F8' : '#fff',
                borderLeft: selected?.id === s.id ? `3px solid ${NAVY}` : '3px solid transparent',
              }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{s.name || 'Unknown'}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.role || '—'}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(s.created_at)}</span>
                {s.urgency && <UrgencyBadge score={s.urgency} />}
              </div>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF', fontSize: 14 }}>
              ← Select a submission to view
            </div>
          ) : (
            <div style={{ maxWidth: 780 }}>

              {/* Submission header */}
              <div style={{ background: NAVY, borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>{selected.email} · {selected.phone}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {selected.urgency && <UrgencyBadge score={selected.urgency} />}
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{formatDate(selected.created_at)}</span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: '1.25rem', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 4 }}>
                {['form', 'brief'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '8px', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: 600,
                    background: activeTab === tab ? NAVY : 'transparent',
                    color: activeTab === tab ? '#fff' : '#6B7280',
                  }}>
                    {tab === 'form' ? '📋 Form Responses' : '🧠 AI Coaching Brief'}
                  </button>
                ))}
              </div>

              {/* Form responses tab */}
              {activeTab === 'form' && (
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                  {[
                    ['About', [
                      ['Name', f.name], ['Role', f.role], ['Email', f.email], ['Phone', f.phone],
                      ['Business age', f.opYrs], ['Team size', f.teamSize],
                    ]],
                    ['Brokerage', [
                      ['Settlements/month', f.settlements], ['Client mix', f.clientTypes],
                      ['Lead sources', f.leadSources], ['Lead flow', f.leadFlow],
                    ]],
                    ['Advocacy arm', [
                      ['Stage', f.advStage], ['Type', f.advType], ['Positioning', f.advPosition],
                      ['Why advocacy?', f.advWhy], ['Biggest uncertainty', f.advUncertainty],
                    ]],
                    ['Operations & Goals', [
                      ['CRM', f.crm], ['Challenges', f.challenges],
                      ['12-month goal', f.goal12m], ['Success outcome', f.goalSuccess],
                      ['Urgency', f.urgency ? `${f.urgency}/10` : null],
                    ]],
                    ['Digital Presence', [
                      ['Website', f.website], ['Paid ads', f.paidAds], ['Social media', f.social],
                      ['Call topics', f.callNotes], ['Referral source', f.referral],
                    ]],
                  ].map(([section, rows]) => (
                    <div key={section}>
                      <div style={{ background: '#F9FAFB', padding: '8px 12px', borderTop: '1px solid #E5E7EB', fontSize: 11, fontWeight: 600, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {section}
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {rows.map(([label, value]) => <Row key={label} label={label} value={value} />)}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* AI brief tab */}
              {activeTab === 'brief' && (
                <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '1.5rem' }}>
                  {selected.ai_brief ? (
                    <div
                      style={{ fontSize: 14, lineHeight: 1.8, color: '#1F2937' }}
                      dangerouslySetInnerHTML={{
                        __html: selected.ai_brief.replace(/<!-- SECTION_BREAK -->/g, '<hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0"/>')
                      }}
                    />
                  ) : (
                    <p style={{ color: '#9CA3AF', fontSize: 14 }}>No brief generated for this submission.</p>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
