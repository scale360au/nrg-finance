'use client';
import { useState, useRef } from 'react';

const NAVY = '#0D2B4B';
const BLUE_LIGHT = '#E8F0F8';
const BLUE_MID = '#4A90D9';

const stepNames = ['About you', 'The brokerage', 'Advocacy arm', 'Operations & goals', 'Digital presence'];

function RadioOption({ name, value, label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10,
      border: `1px solid ${checked ? NAVY : '#D1D5DB'}`,
      borderRadius: 8, padding: '9px 12px', cursor: 'pointer',
      background: checked ? BLUE_LIGHT : '#fff',
      transition: 'all 0.15s', userSelect: 'none',
    }}>
      <input type="radio" name={name} value={value} checked={checked}
        onChange={() => onChange(value)}
        style={{ accentColor: NAVY, width: 14, height: 14, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#1F2937', lineHeight: 1.4 }}>{label}</span>
    </label>
  );
}

function CheckOption({ value, label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      border: `1px solid ${checked ? NAVY : '#D1D5DB'}`,
      borderRadius: 8, padding: '9px 12px', cursor: 'pointer',
      background: checked ? BLUE_LIGHT : '#fff',
      transition: 'all 0.15s', userSelect: 'none',
    }}>
      <input type="checkbox" checked={checked} onChange={() => onChange(value)}
        style={{ accentColor: NAVY, width: 14, height: 14, flexShrink: 0, marginTop: 1 }} />
      <span style={{ fontSize: 13, color: '#1F2937', lineHeight: 1.4 }}>{label}</span>
    </label>
  );
}

function FieldLabel({ children, required }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 7 }}>
      {children}{required && <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span>}
    </div>
  );
}

function Hint({ children }) {
  return <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 7, marginTop: -3 }}>{children}</div>;
}

function InputField({ id, type = 'text', placeholder, value, onChange }) {
  return (
    <input type={type} id={id} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', border: '1px solid #D1D5DB', borderRadius: 8,
        padding: '9px 12px', fontSize: 14, fontFamily: 'inherit',
        color: '#111827', background: '#fff', outline: 'none', boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = NAVY}
      onBlur={e => e.target.style.borderColor = '#D1D5DB'}
    />
  );
}

function TextArea({ id, placeholder, value, onChange }) {
  return (
    <textarea id={id} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={3}
      style={{
        width: '100%', border: '1px solid #D1D5DB', borderRadius: 8,
        padding: '9px 12px', fontSize: 14, fontFamily: 'inherit',
        color: '#111827', background: '#fff', outline: 'none',
        resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = NAVY}
      onBlur={e => e.target.style.borderColor = '#D1D5DB'}
    />
  );
}

function SectionTag({ children }) {
  return (
    <div style={{
      display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase', color: NAVY, background: BLUE_LIGHT,
      padding: '3px 10px', borderRadius: 4, marginBottom: 12,
    }}>{children}</div>
  );
}

function Card({ children }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
      padding: '1.5rem', marginBottom: 12,
    }}>{children}</div>
  );
}

function BriefCard({ icon, label, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0.875rem 1.25rem', borderBottom: '1px solid #F3F4F6',
        background: '#F9FAFB',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, background: BLUE_LIGHT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0,
        }}>{icon}</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{label}</span>
      </div>
      <div style={{ padding: '1rem 1.25rem', fontSize: 14, color: '#1F2937', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

const initialData = {
  name: '', role: '', email: '', phone: '',
  opYrs: '', teamSize: '', settlements: '',
  clientTypes: [], leadSources: [], leadFlow: '',
  advStage: '', advType: '', advPosition: '', advWhy: '', advUncertainty: '',
  crm: '', challenges: [],
  goal12m: '', goalSuccess: '', urgency: 5,
  website: '', paidAds: '', social: '',
  callNotes: '', referral: '',
};

export default function Page() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [briefHtml, setBriefHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('Analysing questionnaire responses');
  const briefRef = useRef(null);

  const set = (field, val) => setData(d => ({ ...d, [field]: val }));
  const toggleArr = (field, val) => setData(d => ({
    ...d,
    [field]: d[field].includes(val) ? d[field].filter(x => x !== val) : [...d[field], val],
  }));

  function goTo(n) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildPrompt() {
    return `You are an expert business coach preparing a coaching prep brief for Mark, founder of Scale360 (a business coaching company), ahead of a Zoom discovery call with NRG Finance & Advocacy — a Melbourne-based mortgage brokerage that has recently launched a buyer's advocacy arm.

Here are the questionnaire responses from NRG Finance:

CONTACT: ${data.name || 'Not provided'} | ${data.role || ''} | ${data.email || ''}
BUSINESS AGE: ${data.opYrs || 'Not answered'}
TEAM SIZE: ${data.teamSize || 'Not answered'}
MONTHLY SETTLEMENTS: ${data.settlements || 'Not answered'}
CLIENT MIX: ${data.clientTypes.join(', ') || 'Not answered'}
LEAD SOURCES: ${data.leadSources.join(', ') || 'Not answered'}
LEAD FLOW CONSISTENCY: ${data.leadFlow || 'Not answered'}
ADVOCACY STAGE: ${data.advStage || 'Not answered'}
ADVOCACY TYPE: ${data.advType || 'Not answered'}
ADVOCACY POSITIONING: ${data.advPosition || 'Not answered'}
WHY THEY ADDED ADVOCACY: ${data.advWhy || 'Not provided'}
BIGGEST ADVOCACY UNCERTAINTY: ${data.advUncertainty || 'Not provided'}
CRM / SYSTEM: ${data.crm || 'Not answered'}
CHALLENGES: ${data.challenges.join(', ') || 'Not answered'}
12-MONTH GOAL: ${data.goal12m || 'Not provided'}
SUCCESS OUTCOME FROM SCALE360: ${data.goalSuccess || 'Not provided'}
URGENCY (1-10): ${data.urgency}/10
WEBSITE STATUS: ${data.website || 'Not answered'}
PAID ADS: ${data.paidAds || 'Not answered'}
SOCIAL MEDIA: ${data.social || 'Not answered'}
SPECIFIC CALL TOPICS: ${data.callNotes || 'None specified'}
HOW THEY HEARD ABOUT SCALE360: ${data.referral || 'Not provided'}

Generate a structured coaching prep brief for Mark. Use clean HTML with inline styles only. Color palette:
- Main text: #111827
- Muted text: #6B7280  
- Accent navy: #0D2B4B
- Light blue fill: #E8F0F8
- Green tag bg: #D1FAE5, text: #065F46
- Amber tag bg: #FEF3C7, text: #92400E
- Red tag bg: #FEE2E2, text: #991B1B
- Divider: #F3F4F6

Include exactly these 7 sections. Each section is just its content — no card wrappers, no headers (those are rendered outside). Separate sections with: <!-- SECTION_BREAK -->

SECTION 1 — BUSINESS SNAPSHOT
3–4 sentence paragraph. Who NRG Finance is, their stage, team size, and settlement volume. Mention the advocacy arm and its current status.

SECTION 2 — KEY STRENGTHS
2–3 sentences identifying genuine strengths or positives visible in the data.

SECTION 3 — KEY CHALLENGES & RISKS
3–5 pointed <p> observations. Direct coach-facing language. Be specific and analytical.

SECTION 4 — ADVOCACY ARM ANALYSIS
3–4 sentences on the advocacy opportunity and integration challenge. Flag strategic risks worth probing.

SECTION 5 — DIGITAL PRESENCE GAPS
2–3 sentences on online presence weaknesses based on their answers.

SECTION 6 — RECOMMENDED FOCUS AREAS
4–5 agenda items for the call. Format each as:
<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #F3F4F6">
  <div style="width:22px;height:22px;border-radius:50%;background:#0D2B4B;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">N</div>
  <div style="font-size:13px;color:#111827;line-height:1.5">Focus area text</div>
</div>
Replace N with the number. Last item has no border-bottom.

SECTION 7 — URGENCY & FIT ASSESSMENT
2–3 sentences. How ready and urgent does NRG Finance appear? How strong a fit for Scale360's coaching programs?

Output only raw HTML. No markdown, no code fences, no backtick blocks. Just the 7 sections separated by <!-- SECTION_BREAK -->.`;
  }

  async function submitForm() {
    setLoading(true);
    goTo(6);
    const msgs = [
      'Analysing questionnaire responses',
      'Mapping challenges to coaching priorities',
      'Identifying strategic opportunities',
      'Building focus agenda for Mark',
    ];
    let mi = 0;
    const t = setInterval(() => { mi = (mi + 1) % msgs.length; setLoadMsg(msgs[mi]); }, 1800);

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt(), formData: data }),
      });
      const json = await res.json();
      const text = json.content?.find(b => b.type === 'text')?.text || '';
      setBriefHtml(text);
    } catch (e) {
      setBriefHtml('<p style="color:#DC2626">Error generating brief. Please refresh and try again.</p>');
    } finally {
      clearInterval(t);
      setLoading(false);
    }
  }

  function copyBrief() {
    const el = briefRef.current;
    if (el) navigator.clipboard.writeText(el.innerText);
  }

  const sections = briefHtml ? briefHtml.split('<!-- SECTION_BREAK -->').map(s => s.trim()) : [];
  const briefSections = [
    { icon: '🏢', label: 'Business snapshot' },
    { icon: '✅', label: 'Key strengths' },
    { icon: '⚠️', label: 'Key challenges & risks' },
    { icon: '🏠', label: 'Advocacy arm analysis' },
    { icon: '🌐', label: 'Digital presence gaps' },
    { icon: '🎯', label: 'Recommended focus areas for the call' },
    { icon: '🔥', label: 'Urgency & fit assessment' },
  ];

  const inputStyle = {
    width: '100%', border: '1px solid #D1D5DB', borderRadius: 8,
    padding: '9px 12px', fontSize: 14, fontFamily: 'inherit',
    color: '#111827', background: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', padding: '1.5rem 1rem 4rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* HERO HEADER */}
        <div style={{
          background: NAVY, borderRadius: 12, padding: '1.75rem',
          marginBottom: '1.75rem', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -50, right: -50, width: 200, height: 200,
            borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
            <img src="https://www.nrgfinance.com.au/wp-content/uploads/2024/08/NRG.png"
              alt="NRG Finance" style={{ height: 34, width: 'auto' }}
              onError={e => e.target.style.display = 'none'} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: 6, padding: '5px 10px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: BLUE_MID, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
                PREPARED BY SCALE360
              </span>
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4, position: 'relative' }}>
            NRG Finance &amp; Advocacy — Business Assessment
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, position: 'relative' }}>
            {step === 6 ? 'Your answers have been received.' : 'Help us understand your business before our Zoom call. Takes 5–7 minutes.'}
          </div>
        </div>

        {/* PROGRESS BAR */}
        {step >= 1 && step <= 5 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{stepNames[step - 1]}</span>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{step} of 5</span>
            </div>
            <div style={{ height: 3, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${step * 20}%`, background: NAVY, borderRadius: 2, transition: 'width 0.35s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i < step ? NAVY : i === step ? BLUE_MID : '#E5E7EB',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <Card>
            <SectionTag>Step 1</SectionTag>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 5 }}>Let's start with the basics</h2>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: '1.75rem' }}>Who are we talking to, and where does NRG Finance sit right now?</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div><FieldLabel required>Your name</FieldLabel><InputField value={data.name} onChange={v => set('name', v)} placeholder="First and last name" /></div>
              <div><FieldLabel>Your role at NRG</FieldLabel><InputField value={data.role} onChange={v => set('role', v)} placeholder="e.g. Director, Principal Broker" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div><FieldLabel required>Email</FieldLabel><InputField type="email" value={data.email} onChange={v => set('email', v)} placeholder="contact@nrgfinance.com.au" /></div>
              <div><FieldLabel>Phone</FieldLabel><InputField type="tel" value={data.phone} onChange={v => set('phone', v)} placeholder="0400 000 000" /></div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How long has NRG Finance been operating?</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {['Under 12 months', '1–3 years', '3–5 years', '5+ years'].map(v => (
                  <RadioOption key={v} name="opYrs" value={v} label={v} checked={data.opYrs === v} onChange={v => set('opYrs', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How many people are currently in the business?</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {['Just me (sole operator)', '2–5 people', '6–10 people', '10+ people'].map(v => (
                  <RadioOption key={v} name="teamSz" value={v} label={v} checked={data.teamSize === v} onChange={v => set('teamSize', v)} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
              <button onClick={() => goTo(2)} style={{
                flex: 1, background: NAVY, color: '#fff', border: 'none', borderRadius: 8,
                padding: '11px 20px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              }}>Continue →</button>
            </div>
          </Card>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <Card>
            <SectionTag>Step 2</SectionTag>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 5 }}>The brokerage today</h2>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: '1.75rem' }}>Settlement volumes, client mix, and how leads are currently coming in.</p>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Roughly how many settlements per month?</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {['1–5 per month', '6–15 per month', '16–30 per month', '30+ per month'].map(v => (
                  <RadioOption key={v} name="sett" value={v} label={v} checked={data.settlements === v} onChange={v => set('settlements', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>What types of clients make up most of your book?</FieldLabel>
              <Hint>Select all that apply</Hint>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {['First home buyers', 'Owner-occupiers refinancing', 'Property investors', 'Upgraders / downsizers', 'Commercial / SMSF', 'Mixed / unsure'].map(v => (
                  <CheckOption key={v} value={v} label={v} checked={data.clientTypes.includes(v)} onChange={v => toggleArr('clientTypes', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Where does most new business come from?</FieldLabel>
              <Hint>Select all that apply</Hint>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Word of mouth / referrals', 'Real estate agent referrals', 'Google search / SEO', 'Paid advertising (Google Ads / social)', 'Accountant or financial planner referrals', 'Not tracking lead sources'].map(v => (
                  <CheckOption key={v} value={v} label={v} checked={data.leadSources.includes(v)} onChange={v => toggleArr('leadSources', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How consistent is your lead flow right now?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Very inconsistent — feast or famine', 'Some months strong, others slow', 'Reasonably steady', 'Consistent and growing'].map(v => (
                  <RadioOption key={v} name="flow" value={v} label={v} checked={data.leadFlow === v} onChange={v => set('leadFlow', v)} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
              <button onClick={() => goTo(1)} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => goTo(3)} style={{ flex: 1, background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>Continue →</button>
            </div>
          </Card>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <Card>
            <SectionTag>Step 3</SectionTag>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 5 }}>The NRG Advocacy arm</h2>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: '1rem' }}>You've recently launched an advocacy offering — tell us where that sits strategically.</p>

            <div style={{ background: '#F9FAFB', borderLeft: `2px solid ${NAVY}`, borderRadius: '0 8px 8px 0', padding: '9px 13px', marginBottom: '1.25rem', fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>
              NRG Advocacy is a natural extension of the brokerage. How you position, price, and integrate the two services is one of the key questions we'll work through together.
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Where is the advocacy arm right now?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Still planning — not yet live', 'Just launched — no clients yet', 'Early stage — first few clients', 'Active and growing'].map(v => (
                  <RadioOption key={v} name="advStage" value={v} label={v} checked={data.advStage === v} onChange={v => set('advStage', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>What type of advocacy are you offering?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {["Buyer's advocacy (property search & acquisition)", 'Vendor advocacy', "Both buyer's and vendor", 'Still deciding'].map(v => (
                  <RadioOption key={v} name="advType" value={v} label={v} checked={data.advType === v} onChange={v => set('advType', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How are you positioning advocacy alongside the brokerage?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Fully integrated — one combined NRG offering', 'Separate brand, separate service', 'Cross-referral model — same clients, separate engagements', "Haven't decided yet"].map(v => (
                  <RadioOption key={v} name="advPos" value={v} label={v} checked={data.advPosition === v} onChange={v => set('advPosition', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Why did you decide to add advocacy?</FieldLabel>
              <TextArea value={data.advWhy} onChange={v => set('advWhy', v)} placeholder="e.g. Clients kept asking us for help finding properties. We wanted to own more of the transaction..." />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>What's the biggest uncertainty about advocacy right now?</FieldLabel>
              <TextArea value={data.advUncertainty} onChange={v => set('advUncertainty', v)} placeholder="e.g. How to price it, how to market it separately from the brokerage..." />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
              <button onClick={() => goTo(2)} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => goTo(4)} style={{ flex: 1, background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>Continue →</button>
            </div>
          </Card>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <Card>
            <SectionTag>Step 4</SectionTag>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 5 }}>Operations, systems & goals</h2>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: '1.75rem' }}>How the business runs today — and where you want it to go.</p>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>What CRM or loan management system are you using?</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {['Connective', 'Salestrekker', 'PLAN Loanapp', 'Podium', 'Spreadsheets / manual', 'Other'].map(v => (
                  <RadioOption key={v} name="crm" value={v} label={v} checked={data.crm === v} onChange={v => set('crm', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>What are the biggest operational challenges right now?</FieldLabel>
              <Hint>Select all that apply</Hint>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Not enough leads', 'Too reliant on referrals — no predictable pipeline', 'Too much admin / process bottlenecks', 'Difficulty scaling without more headcount', 'Integrating advocacy into the existing workflow', 'Weak online presence / not found on Google', 'Lead conversion — enquiries not turning into clients', 'Managing team performance'].map(v => (
                  <CheckOption key={v} value={v} label={v} checked={data.challenges.includes(v)} onChange={v => toggleArr('challenges', v)} />
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '1.5rem 0' }} />

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Where do you want NRG to be in 12 months?</FieldLabel>
              <TextArea value={data.goal12m} onChange={v => set('goal12m', v)} placeholder="Settlement volumes, revenue, team size, the advocacy arm..." />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>What would a successful outcome from Scale360 look like?</FieldLabel>
              <TextArea value={data.goalSuccess} onChange={v => set('goalSuccess', v)} placeholder="e.g. Consistent monthly pipeline, advocacy generating $X/month, less time in the day-to-day..." />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How urgent is growth right now?</FieldLabel>
              <Hint>1 = no rush · 10 = need to move now</Hint>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                <input type="range" min={1} max={10} value={data.urgency} step={1}
                  onChange={e => set('urgency', parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: NAVY }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', minWidth: 48, textAlign: 'right' }}>{data.urgency} / 10</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
              <button onClick={() => goTo(3)} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
              <button onClick={() => goTo(5)} style={{ flex: 1, background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>Continue →</button>
            </div>
          </Card>
        )}

        {/* ── STEP 5 ── */}
        {step === 5 && (
          <Card>
            <SectionTag>Step 5</SectionTag>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 5 }}>Online presence & marketing</h2>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: '1.75rem' }}>A quick snapshot of NRG's digital footprint — often where the fastest wins are found.</p>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How would you describe the NRG Finance website right now?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Working well — generating leads consistently', "Exists but doesn't really generate leads", 'Needs a rebuild or refresh', 'Not sure how it performs'].map(v => (
                  <RadioOption key={v} name="web" value={v} label={v} checked={data.website === v} onChange={v => set('website', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Are you running any paid advertising?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Yes — Google Ads', 'Yes — Meta / social ads', 'Yes — both', 'No paid advertising currently'].map(v => (
                  <RadioOption key={v} name="ads" value={v} label={v} checked={data.paidAds === v} onChange={v => set('paidAds', v)} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How active is NRG on social media?</FieldLabel>
              <div style={{ display: 'grid', gap: 7 }}>
                {['Very active — consistent content and engagement', 'Sporadic — post occasionally, no real strategy', 'Minimal — profiles exist but rarely used', 'Not really active on social'].map(v => (
                  <RadioOption key={v} name="soc" value={v} label={v} checked={data.social === v} onChange={v => set('social', v)} />
                ))}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '1.5rem 0' }} />

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>Anything specific you want covered in the Zoom call?</FieldLabel>
              <TextArea value={data.callNotes} onChange={v => set('callNotes', v)} placeholder="Any burning questions, context, or specific topics..." />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <FieldLabel>How did you hear about Scale360?</FieldLabel>
              <select value={data.referral} onChange={e => set('referral', e.target.value)}
                style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: 8, padding: '9px 12px', fontSize: 14, fontFamily: 'inherit', color: '#111827', background: '#fff', outline: 'none' }}>
                <option value="">Select...</option>
                <option>Google search</option>
                <option>LinkedIn</option>
                <option>Referral from someone I know</option>
                <option>Mark reached out directly</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
              <button onClick={() => goTo(4)} style={{ background: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>← Back</button>
              <button onClick={submitForm} style={{ flex: 1, background: NAVY, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer' }}>
                Submit & Generate Brief →
              </button>
            </div>
          </Card>
        )}

        {/* ── BRIEF SCREEN ── */}
        {step === 6 && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{
                  width: 36, height: 36, border: `2px solid #E5E7EB`,
                  borderTopColor: NAVY, borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
                }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 6 }}>Submitting your answers...</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>Just a moment</div>
              </div>
            ) : (
              <div style={{
                background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
                padding: '2.5rem 2rem', textAlign: 'center',
              }}>
                {/* Tick icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#E8F0F8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 10 }}>
                  Thanks — all done!
                </h2>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, maxWidth: 400, margin: '0 auto 1.75rem' }}>
                  We've received your answers. Mark will review everything before your Zoom call so you can get straight into the session without going over the basics.
                </p>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 2rem' }}>
                  Keep an eye on your inbox — we'll be in touch to confirm the time and send through any prep notes.
                </p>

                {/* CTA */}
                <a href="https://calendly.com/mark-scale360/30min" target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-block', background: NAVY, color: '#fff',
                    padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                    textDecoration: 'none', marginBottom: '2rem',
                  }}>
                  Book your Zoom call →
                </a>

                {/* Footer logos */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
                  <img src="https://www.nrgfinance.com.au/wp-content/uploads/2024/08/NRG.png"
                    alt="NRG" style={{ height: 24, width: 'auto', opacity: 0.5 }}
                    onError={e => e.target.style.display = 'none'} />
                  <span style={{ fontSize: 11, color: '#D1D5DB' }}>×</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#D1D5DB', letterSpacing: '0.05em' }}>SCALE360</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
