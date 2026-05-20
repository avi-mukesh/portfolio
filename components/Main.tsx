"use client";
import React from 'react';
// V3 — Modern Minimal
// Space Grotesk + JetBrains Mono, generous whitespace, electric blue accent.

type CursorStyle = 'bar' | 'block' | 'underscore' | 'none';

interface Tweaks {
  accent: string;
  typewriter: string[];
  subtitle: string;
  typingSpeed: number;
  marquee: boolean;
  pulse: boolean;
  cursor: CursorStyle;
  cubeColor: boolean;
}

interface V3TypewriterProps {
  words: string[];
  accent: string;
  speed?: number;
  cursor?: CursorStyle;
}

interface V3EquityChartProps {
  accent?: string;
}

interface Project {
  name: string;
  lang: string;
  year: string;
  blurb: string;
  href?: string;
}

interface TimelineItem {
  years: string;
  role: string;
  org: React.ReactNode;
  detail: string;
}

declare global {
  interface Window {
    tweaks?: Partial<Tweaks>;
    V3Portfolio: () => React.JSX.Element;
  }
}

const defaultTweaks = {
  accent: '#0066ff',
  typewriter: [
    'researching quant strategies.',
    'shipping software.',
    'tutoring maths.',
    'speedcubing & lifting.',
  ],
  subtitle:
    'MMath Warwick (First Class, 83%). Software Developer at Singletrack, four-plus years of maths tutoring, and a quant-finance creator on Instagram. Currently building a cross-sectional momentum strategy on crypto as the capstone for the WallStreetQuants bootcamp. Speedcubing and lifting in between.',
  typingSpeed: 50,
  marquee: true,
  pulse: true,
  cursor: 'bar',
  cubeColor: true,
} satisfies Tweaks;

function V3Typewriter({ words, accent, speed = 50, cursor = 'bar' }: V3TypewriterProps) {
  const [idx, setIdx] = React.useState(0);
  const [text, setText] = React.useState('');
  const [phase, setPhase] = React.useState<'typing' | 'holding' | 'deleting'>('typing');

  React.useEffect(() => {
    setIdx(0);
    setText('');
    setPhase('typing');
  }, [words]);

  React.useEffect(() => {
    const target = words[idx] || '';
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === 'typing') {
      if (text.length < target.length) {
        t = setTimeout(() => setText(target.slice(0, text.length + 1)), speed + Math.random() * 35);
      } else {
        t = setTimeout(() => setPhase('holding'), 1600);
      }
    } else if (phase === 'holding') {
      t = setTimeout(() => setPhase('deleting'), 900);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), Math.max(14, speed * 0.5));
      } else {
        setPhase('typing');
        setIdx((idx + 1) % words.length);
      }
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [text, phase, idx, words, speed]);

  return (
    <span>
      <span style={{ color: accent }}>{text}</span>
      {cursor === 'none' ? null : cursor === 'block' ?
      <span style={{
        display: 'inline-block', width: '0.5em', height: '0.85em', verticalAlign: '-0.05em',
        background: accent, marginLeft: 4,
        animation: 'v3blink 1.05s steps(2) infinite'
      }} /> :
      cursor === 'underscore' ?
      <span style={{
        display: 'inline-block', width: '0.6em', height: 4, verticalAlign: 'baseline',
        background: accent, marginLeft: 6, marginBottom: -2,
        animation: 'v3blink 1.05s steps(2) infinite'
      }} /> :

      <span style={{
        display: 'inline-block', width: 4, height: '0.9em', verticalAlign: '-0.08em',
        background: accent, marginLeft: 4,
        animation: 'v3blink 1.05s steps(2) infinite'
      }} />
      }
    </span>);

}

function V3EquityChart({ accent = '#2350ff' }: V3EquityChartProps) {
  const points = [100, 102, 99, 108, 115, 113, 122, 119, 128, 141, 137, 146, 151, 144, 158, 163, 159, 171, 167, 182, 186, 195, 188, 201, 213];
  const W = 840,H = 280,padL = 48,padR = 24,padT = 24,padB = 36;
  const yMin = 95,yMax = 220;
  const sx = (i: number) => padL + i / (points.length - 1) * (W - padL - padR);
  const sy = (y: number) => H - padB - (y - yMin) / (yMax - yMin) * (H - padT - padB);
  const linePath = points.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${sx(points.length - 1)} ${sy(yMin)} L ${sx(0)} ${sy(yMin)} Z`;
  const ticksY = [100, 140, 180, 220];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="v3grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.18" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticksY.map((t) =>
      <g key={t}>
          <line x1={padL} x2={W - padR} y1={sy(t)} y2={sy(t)} stroke="#eaeaea" strokeWidth="1" />
          <text x={padL - 10} y={sy(t) + 4} fontSize="11" fill="#9a9a9a" fontFamily="'JetBrains Mono', monospace" textAnchor="end">{t}</text>
        </g>
      )}
      {[0, 6, 12, 18, 24].map((i) =>
      <text key={i} x={sx(i)} y={H - 14} fontSize="11" fill="#9a9a9a" fontFamily="'JetBrains Mono', monospace" textAnchor="middle">W{i}</text>
      )}
      <path d={areaPath} fill="url(#v3grad)" />
      <path d={linePath} fill="none" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={sx(points.length - 1)} cy={sy(points[points.length - 1])} r="4" fill={accent} />
      <circle cx={sx(points.length - 1)} cy={sy(points[points.length - 1])} r="9" fill={accent} opacity="0.15" />
    </svg>);

}

function V3Portfolio() {
  const tweaks: Tweaks = {
    ...defaultTweaks,
    ...(typeof window !== 'undefined' ? window.tweaks : undefined),
  };

  const bg = '#fafafa';
  const text = '#0a0a0a';
  const muted = '#6b6b6b';
  const dim = '#a8a8a8';
  const rule = '#eaeaea';
  const card = '#ffffff';
  const accent = tweaks.accent || '#2350ff';
  const cubeColor = tweaks.cubeColor !== false;
  const typewriterWords = tweaks.typewriter || [
  'shipping software.',
  'researching crypto momentum.',
  'tutoring maths.'];

  const subtitleText = tweaks.subtitle ||
  'Software developer with a maths background. MMath from Warwick (First Class, 83%) in 2023, two roles since — currently at Singletrack, previously at Dorset Software. Researching crypto momentum on the side and looking to move into quant.';
  const showPulse = tweaks.pulse !== false;

  const styles: Record<'root' | 'mono' | 'container' | 'nav' | 'section', React.CSSProperties> = {
    root: {
      width: '100%', minHeight: '100%',
      background: bg, color: text,
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      fontSize: 16, lineHeight: 1.55,
      boxSizing: 'border-box',
      containerType: 'inline-size',
      containerName: 'v3root'
    },
    mono: { fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
    container: { maxWidth: 1080, margin: '0 auto', padding: '0 64px' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0' },
    section: { padding: '88px 0', borderTop: `1px solid ${rule}` }
  };

  const projects: Project[] = [
  { name: 'crypto-xs-momo', lang: 'Python', year: '2026', blurb: 'A cross-sectional momentum strategy on crypto combining recent price returns, tweet-attention divergence (tweet counts, not sentiment) and order-flow taker imbalance. Backtested 2022–2024 across 8 cryptocurrencies. Writeup in progress.' },
  { name: 'Quant Finance Content', lang: 'Instagram · @avi_mukesh', year: 'ongoing', blurb: 'Short-form videos translating mathematical finance concepts (e.g. put-call parity, Monte Carlo, CAPM, value-at-risk, random walks) for a mathematically-inclined audience.', href: 'https://www.instagram.com/avi_mukesh/' },
  { name: 'premier-league-predictor', lang: 'Python · AWS SageMaker', year: '2023', blurb: 'AWS ML Engineer Nanodegree capstone. Random Forest classifier on a Kaggle Premier League dataset. 60% precision after tuning.' },
  { name: '80in8', lang: 'Next.js', year: '2026', blurb: 'A mental arithmetic trainer. 80 questions in 8 minutes. Contains maths tips and tricks to help you improve.', href: 'https://80in8.com' }];


  const timeline: TimelineItem[] = [
  { years: 'Jan 2025 — Now', role: 'Software Developer', org: 'Singletrack', detail: 'Working with the product team on a B2B SaaS platform for firms in the capital markets industry. Developing features, fixing defects, and handling support tickets. Stack: Apex, Lightning Web Components, AWS, Heroku, Ruby on Rails.' },
  { years: 'Feb 2026 — Now', role: 'Quant Research Bootcamp · Capstone', org: 'WallStreetQuants', detail: '12-week buy-side quant program. Capstone is the cross-sectional momentum strategy detailed in Research above.' },
  { years: 'Sep 2023 — Dec 2024', role: 'Software Developer', org: 'Dorset Software', detail: 'Led the test team for a client-facing API used by a leading insurance firm. ASP.NET and SQL; Postman flows that materially improved efficiency of subsequent testing phases.' },
  { years: 'Dec 2021 — Now', role: 'Maths Tutor', org: <>GoStudent → MyTutor · <a href="https://mukeshacademy.com" target="_blank" rel="noreferrer" className="v3-link">mukeshacademy.com</a></>, detail: 'Four-plus years of one-to-one tutoring. Three and a half years at GoStudent through to May 2025, now at MyTutor, plus a handful of private students who find me through mukeshacademy.com. GCSE and A-Level across pure, stats and mechanics.' }];


  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) =>
  <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: text, textDecoration: 'none', fontSize: 14 }} className="v3-nav-link">{children}</a>;


  return (
    <div style={styles.root}>
      <style>{`
        @keyframes v3blink { 50% { opacity: 0 } }
        .v3-nav-link { position: relative; }
        .v3-nav-link::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 1.5px; width: 0; background: ${accent}; transition: width .25s ease; }
        .v3-nav-link:hover::after { width: 100%; }
        .v3-link { color: ${text}; text-decoration: none; background-image: linear-gradient(${accent},${accent}); background-position: 0 100%; background-repeat: no-repeat; background-size: 100% 1.5px; transition: color .15s; padding-bottom: 1px; }
        .v3-link:hover { color: ${accent}; }
        .v3-card { background: ${card}; border: 1px solid ${rule}; padding: 28px; border-radius: 6px; transition: transform .25s, box-shadow .25s, border-color .25s; }
        .v3-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -16px rgba(35,80,255,.18); border-color: ${accent}; }
        .v3-dot { display: inline-block; width: 8px; height: 8px; background: ${accent}; border-radius: 50%; vertical-align: middle; }
        .v3-pulse { animation: v3pulse 2.4s ease-out infinite; }
        @keyframes v3pulse { 0%,100% { box-shadow: 0 0 0 0 ${accent}55 } 50% { box-shadow: 0 0 0 6px ${accent}00 } }

        .v3-cube { width: 64px; height: 64px; position: relative; transform-style: preserve-3d; animation: v3cubespin 14s linear infinite; transform: rotateX(-22deg) rotateY(-32deg); }
        .v3-cube-face {
          position: absolute; width: 64px; height: 64px; box-sizing: border-box;
          border: 1.5px solid #111;
          background:
            linear-gradient(90deg, transparent calc(33.3% - 0.75px), #111 calc(33.3% - 0.75px), #111 calc(33.3% + 0.75px), transparent calc(33.3% + 0.75px), transparent calc(66.6% - 0.75px), #111 calc(66.6% - 0.75px), #111 calc(66.6% + 0.75px), transparent calc(66.6% + 0.75px)),
            linear-gradient(0deg, transparent calc(33.3% - 0.75px), #111 calc(33.3% - 0.75px), #111 calc(33.3% + 0.75px), transparent calc(33.3% + 0.75px), transparent calc(66.6% - 0.75px), #111 calc(66.6% - 0.75px), #111 calc(66.6% + 0.75px), transparent calc(66.6% + 0.75px)),
            var(--face, #fafafa);
        }
        .v3-cube-front  { --face: ${cubeColor ? '#ffffff' : '#ffffff'}; transform: translateZ(32px); }
        .v3-cube-back   { --face: ${cubeColor ? '#f5cf3a' : '#ededed'}; transform: rotateY(180deg) translateZ(32px); }
        .v3-cube-right  { --face: ${cubeColor ? accent : '#dcdcdc'}; transform: rotateY(90deg)  translateZ(32px); }
        .v3-cube-left   { --face: ${cubeColor ? '#2fa05a' : '#cfcfcf'}; transform: rotateY(-90deg) translateZ(32px); }
        .v3-cube-top    { --face: ${cubeColor ? '#e8612f' : '#e3e3e3'}; transform: rotateX(90deg)  translateZ(32px); }
        .v3-cube-bottom { --face: ${cubeColor ? '#d63022' : '#d4d4d4'}; transform: rotateX(-90deg) translateZ(32px); }
        @keyframes v3cubespin {
          0%   { transform: rotateX(-22deg) rotateY(-32deg); }
          100% { transform: rotateX(-22deg) rotateY(328deg); }
        }

        /* ------- Responsive ------- */
        @container v3root (max-width: 860px) {
          .v3-container   { padding: 0 36px !important; }
          .v3-hero        { padding: 72px 0 88px !important; }
          .v3-h1          { font-size: 88px !important; }
          .v3-tw          { font-size: 52px !important; }
          .v3-hero-row    { grid-template-columns: 1fr !important; gap: 40px !important; }
          .v3-research-bullets { grid-template-columns: 1fr !important; }
          .v3-projects-grid    { grid-template-columns: 1fr !important; }
          .v3-cv-grid     { grid-template-columns: 160px 1fr !important; column-gap: 24px !important; }
          .v3-off-grid    { grid-template-columns: 1fr !important; }
          .v3-h2          { font-size: 40px !important; }
          .v3-contact-h2  { font-size: 56px !important; }
          .v3-section     { padding: 72px 0 !important; }
        }
        @container v3root (max-width: 560px) {
          .v3-container   { padding: 0 20px !important; }
          .v3-nav-links   { display: none !important; }
          .v3-hero        { padding: 48px 0 64px !important; }
          .v3-h1          { font-size: 52px !important; letter-spacing: -0.04em !important; }
          .v3-tw          {
            font-size: clamp(17px, 5.1vw, 22px) !important;
            white-space: nowrap !important;
            line-height: 1.1 !important;
            min-height: 1.3em !important;
            margin-top: 14px !important;
          }
          .v3-hero-subtitle { font-size: 18px !important; }
          .v3-cv-grid     { grid-template-columns: 1fr !important; row-gap: 18px !important; }
          .v3-cv-years    { padding-top: 0 !important; margin-bottom: -8px !important; }
          .v3-cert-grid   { grid-template-columns: 1fr !important; }
          .v3-cubing-grid { gap: 14px !important; }
          .v3-cubing-grid > div { padding-right: 0 !important; }
          .v3-cubing-header { gap: 16px !important; }
          .v3-cubing-cube { width: 72px !important; height: 72px !important; flex-basis: 72px !important; }
          .v3-card-padded { padding: 22px !important; }
          .v3-research-card { padding: 22px 22px 18px !important; }
          .v3-research-card-head { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .v3-h2          { font-size: 30px !important; }
          .v3-contact-h2  { font-size: 32px !important; word-break: break-word !important; overflow-wrap: anywhere !important; }
          .v3-cubing-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 10px !important; }
          .v3-cubing-grid .v3-cubing-value { font-size: 20px !important; }
          .v3-cubing-grid .v3-cubing-label { font-size: 9px !important; letter-spacing: 0.04em !important; }
          .v3-section     { padding: 56px 0 !important; }
          .v3-footer-row  { flex-direction: column !important; gap: 6px !important; }
          .v3-research-head { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .v3-research-head > div:last-child { text-align: left !important; }
          .v3-equity-head { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
        }
        @media (max-width: 640px) {
          .v3-tw { font-size: 18px !important; }
        }
        @media (max-width: 480px) {
          .v3-tw { font-size: 16px !important; }
        }
      `}</style>

      <div style={styles.container} className="v3-container">
        {/* Nav */}
        <nav style={styles.nav}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={showPulse ? "v3-dot v3-pulse" : "v3-dot"} style={{ borderRadius: '50%' }}></span>
            <span style={{ ...styles.mono, fontSize: 13, letterSpacing: '-0.01em' }}>avi.mukesh</span>
          </div>
          <div className="v3-nav-links" style={{ display: 'flex', gap: 32 }}>
            <NavLink href="#research">Research</NavLink>
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="#cv">CV</NavLink>
            <NavLink href="#off-keyboard">Off-keyboard</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </div>
        </nav>

        {/* Hero */}
        <section className="v3-hero" style={{ padding: '96px 0 112px' }}>
          <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em', marginBottom: 28 }}>
            01 / Hello
          </div>
          <h1 className="v3-h1" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 104, lineHeight: 1.0, letterSpacing: '-0.045em',
            fontWeight: 500, margin: 0,
          }}>
            Avi Mukesh.
          </h1>
          <div className="v3-tw" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 64, lineHeight: 1.1, letterSpacing: '-0.035em',
            fontWeight: 500, marginTop: 20, minHeight: '1.2em',
            whiteSpace: 'nowrap',
          }}>
            <V3Typewriter
              accent={accent}
              speed={tweaks.typingSpeed}
              cursor={tweaks.cursor}
              words={typewriterWords} />
          </div>

          <div className="v3-hero-row" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'start' }}>
            <p className="v3-hero-subtitle" style={{ fontSize: 22, lineHeight: 1.45, color: text, margin: 0, maxWidth: 560 }}>
              {subtitleText}
            </p>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '50%', flex: '0 0 96px',
                  backgroundImage: "url('/portrait.jpg')",
                  backgroundSize: 'cover', backgroundPosition: 'center 30%',
                  border: `1px solid ${rule}`
                }} />
                <div style={{ ...styles.mono, fontSize: 12, color: muted, lineHeight: 1.9, paddingTop: 2 }}>
                  <div><span style={{ color: dim }}>location ———————</span> Gillingham, Kent</div>
                  <div><span style={{ color: dim }}>education ——————</span> MMath, Warwick (1st)</div>
                  <div><span style={{ color: dim }}>current role ———</span> SWE, Singletrack</div>
                  <div><span style={{ color: dim }}>quant program ——</span> WSQ bootcamp</div>
                  <div><span style={{ color: dim }}>tutoring ———————</span> 4+ years</div>
                  <div><span style={{ color: dim }}>off-keyboard ———</span> cubes, lifts, books</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research */}
        <section id="research" className="v3-section" style={styles.section}>
          <div className="v3-research-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em' }}>
              02 / Research
            </div>
            <div style={{ ...styles.mono, fontSize: 11, color: muted, letterSpacing: '0.06em', textAlign: 'right' }}>
              <span style={{ color: accent }}>●</span>&nbsp; writeup in progress
            </div>
          </div>

          <h2 className="v3-h2" style={{ fontSize: 56, lineHeight: 1.02, letterSpacing: '-0.035em', fontWeight: 500, margin: '0 0 32px', maxWidth: 880 }}>
            A cross-sectional momentum<br />strategy on crypto.
          </h2>

          <p style={{ fontSize: 19, lineHeight: 1.6, color: text, margin: 0, maxWidth: 740 }}>
            A Python implementation combining three signals — recent price momentum, tweet-attention
            divergence (driven by tweet counts, not sentiment) and order-flow taker imbalance — applied
            cross-sectionally to a basket of eight Binance assets. Weekly rebalance with a 20bps
            per-side cost model, and a BTC regime filter that flips short exposure to long in bull markets.
          </p>

          <div className="v3-research-bullets" style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 64px', maxWidth: 920 }}>
            {[
            <>Net <span style={{ color: accent, fontWeight: 600 }}>Sharpe 2.25</span> across the backtest, against BTC buy-and-hold at 0.68 and an equal-weight basket at 0.51. Near-zero beta suggests the alpha is not crypto market exposure.</>,
            <>Tweet-attention divergence is the dominant alpha source (information coefficient <span style={{ color: accent, fontWeight: 600 }}>+0.096</span> in 2022), with measurable decay over time — consistent with increasing market efficiency.</>,
            <>The BTC regime filter (short → long in bull markets) improves risk-adjusted returns across <span style={{ color: accent, fontWeight: 600 }}>all</span> in-sample years.</>,
            <>Turnover settles at <span style={{ color: accent, fontWeight: 600 }}>0.174</span> at 20bps/side; net Sharpe stays within 0.6 of gross.</>,
            <>A 2D parameter sweep across price and tweet lookback windows shows the result is a robust neighbourhood, not a lucky local optimum.</>].
            map((b, i) =>
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
                <span style={{ ...styles.mono, fontSize: 13, color: muted, fontVariantNumeric: 'tabular-nums', flex: '0 0 auto' }}>0{i + 1}</span>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: text }}>{b}</p>
              </div>
            )}
          </div>

          <div className="v3-research-card" style={{ marginTop: 56, background: card, border: `1px solid ${rule}`, borderRadius: 8, padding: '32px 36px 28px' }}>
            <div className="v3-equity-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Equity curve <span style={{ color: muted, fontWeight: 400, fontSize: 13 }}>· illustrative shape, not actual backtest output</span></div>
              <div style={{ ...styles.mono, fontSize: 12, color: muted }}>
                <span style={{ color: accent }}>━</span>&nbsp; xs-momo
              </div>
            </div>
            <V3EquityChart accent={accent} />
          </div>

          <div style={{ ...styles.mono, fontSize: 12, color: dim, marginTop: 16, letterSpacing: '0.02em', fontStyle: 'italic' }}>
            * the curve above is a hand-drawn illustration of the strategy's behaviour, not the real backtest output. Built as the WallStreetQuants capstone — full writeup in progress, happy to share the draft on request.
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="v3-section" style={styles.section}>
          <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em', marginBottom: 24 }}>
            03 / Projects
          </div>
          <h2 className="v3-h2" style={{ fontSize: 48, letterSpacing: '-0.03em', fontWeight: 500, margin: '0 0 40px' }}>Code in the open.</h2>
          <div className="v3-projects-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {projects.map((p) =>
            <a key={p.name} href={p.href ?? `https://github.com/avi-mukesh/${p.name}`} target="_blank" rel="noopener noreferrer" className="v3-card" style={{ textDecoration: 'none', color: text, display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <div style={{ ...styles.mono, fontSize: 16, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ ...styles.mono, fontSize: 12, color: muted }}>{p.year}</div>
                </div>
                <div style={{ fontSize: 15, color: text, lineHeight: 1.55 }}>{p.blurb}</div>
                <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ ...styles.mono, fontSize: 11, color: muted, letterSpacing: '0.04em' }}>{p.lang}</span>
                  <span style={{ ...styles.mono, fontSize: 12, color: accent }}>→</span>
                </div>
              </a>
            )}
          </div>
        </section>

        {/* CV */}
        <section id="cv" className="v3-section" style={styles.section}>
          <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em', marginBottom: 24 }}>
            04 / Where I've been
          </div>
          <h2 className="v3-h2" style={{ fontSize: 48, letterSpacing: '-0.03em', fontWeight: 500, margin: '0 0 40px' }}>Where I've been.</h2>
          <div className="v3-cv-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', rowGap: 32, columnGap: 32 }}>
            {timeline.map((t, i) =>
            <React.Fragment key={i}>
                <div className="v3-cv-years" style={{ ...styles.mono, fontSize: 13, color: muted, paddingTop: 6 }}>{t.years}</div>
                <div style={{ paddingBottom: 32, borderBottom: `1px solid ${rule}` }}>
                  <div style={{ fontSize: 22, fontWeight: 500 }}>{t.role}</div>
                  <div style={{ fontSize: 16, color: muted, marginTop: 2 }}>{t.org}</div>
                  <div style={{ fontSize: 15, color: text, marginTop: 10, maxWidth: 560 }}>{t.detail}</div>
                </div>
              </React.Fragment>
            )}
            <div className="v3-cv-years" style={{ ...styles.mono, fontSize: 13, color: muted, paddingTop: 6 }}>2019 — 23</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>MMath Mathematics, <span style={{ color: accent }}>First Class (83%)</span></div>
              <div style={{ fontSize: 16, color: muted, marginTop: 2 }}>University of Warwick</div>
              <div style={{ fontSize: 15, color: text, marginTop: 10, maxWidth: 560 }}>
                Modules included Mathematics of Machine Learning, Topics in Data Science, Numerical Methods,
                Mathematics by Computer, Advanced PDEs. Course Rep, Rubik's Cube Society, programming mentor.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em', marginBottom: 14 }}>Also certified in</div>
            <div className="v3-cert-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px', fontSize: 15 }}>
              <div>
                <a href="https://www.udemy.com/certificate/UC-8c114ec5-6614-430e-8135-fe2ce0abdcfb/" target="_blank" rel="noreferrer" className="v3-link">Quantitative Finance &amp; Algorithmic Trading in Python</a> <span style={{ color: muted }}>· Udemy</span>
              </div>
              <div>
                <a href="https://www.udacity.com/certificate/CG9Q6ZDM" target="_blank" rel="noreferrer" className="v3-link">Machine Learning Engineer Nanodegree</a> <span style={{ color: muted }}>· AWS / Udacity</span>
              </div>
              <div>
                <a href="https://www.coursera.org/account/accomplishments/verify/43IRUEZ2XGCY" target="_blank" rel="noreferrer" className="v3-link">Machine Learning</a> <span style={{ color: muted }}>· Stanford / Coursera</span>
              </div>
            </div>
          </div>
        </section>

        {/* Off-keyboard — hobbies / lifts / reading */}
        <section id="off-keyboard" className="v3-section" style={styles.section}>
          <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em', marginBottom: 24 }}>
            05 / Off-keyboard
          </div>
          <h2 className="v3-h2" style={{ fontSize: 48, letterSpacing: '-0.03em', fontWeight: 500, margin: '0 0 12px', lineHeight: 1.05 }}>
            Outside of work.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: muted, margin: '0 0 40px', maxWidth: 620 }}>
            A few things I spend time on.
          </p>

          <div className="v3-off-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
            {/* Speedcubing card */}
            <div className="v3-card v3-card-padded" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="v3-cubing-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
                <div>
                  <div style={{ ...styles.mono, fontSize: 11, color: muted, letterSpacing: '0.08em', marginBottom: 6 }}>SPEEDCUBING</div>
                  <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>Speedcubing.</div>
                  <div style={{ fontSize: 15, color: muted, marginTop: 8, maxWidth: 380 }}>
                    Rubik's Cube Society at Warwick. Occasional UK competitions.
                  </div>
                </div>
                <div className="v3-cubing-cube" style={{ perspective: 300, width: 96, height: 96, flex: '0 0 96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="v3-cube">
                    <div className="v3-cube-face v3-cube-front" />
                    <div className="v3-cube-face v3-cube-back" />
                    <div className="v3-cube-face v3-cube-right" />
                    <div className="v3-cube-face v3-cube-left" />
                    <div className="v3-cube-face v3-cube-top" />
                    <div className="v3-cube-face v3-cube-bottom" />
                  </div>
                </div>
              </div>

              <div className="v3-cubing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, borderTop: `1px solid ${rule}`, paddingTop: 20 }}>
                {[
                { label: '3×3 single', value: '11.09', unit: 's' },
                { label: '3×3 average', value: '13.09', unit: 's' },
                { label: '4×4 single', value: '1:01.52', unit: '' }].
                map((r) =>
                <div key={r.label}>
                    <div className="v3-cubing-label" style={{ ...styles.mono, fontSize: 11, color: muted, letterSpacing: '0.06em', marginBottom: 8 }}>{r.label.toUpperCase()}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span className="v3-cubing-value" style={{ ...styles.mono, fontSize: 28, fontWeight: 500, color: text, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
                      {r.unit && <span style={{ ...styles.mono, fontSize: 11, color: dim }}>{r.unit}</span>}
                    </div>
                  </div>
                )}
              </div>

              <a href="https://www.worldcubeassociation.org/persons/2020MUKE01" target="_blank" rel="noreferrer" className="v3-link" style={{ ...styles.mono, fontSize: 12, color: accent, alignSelf: 'flex-start' }}>
                WCA profile ↗
              </a>
            </div>

            {/* Right column stack: lifts + reading */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 20 }}>
              <div className="v3-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ ...styles.mono, fontSize: 11, color: muted, letterSpacing: '0.08em', marginBottom: 6 }}>LIFTING</div>
                  <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.01em' }}>Current PBs.</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16 }}>
                  {[
                  { lift: 'Bench', kg: 110 },
                  { lift: 'Squat', kg: 130 },
                  { lift: 'Deadlift', kg: 205 }].
                  map((l) =>
                  <div key={l.lift}>
                      <div style={{ ...styles.mono, fontSize: 10, color: muted, letterSpacing: '0.06em', marginBottom: 4 }}>{l.lift.toUpperCase()}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                        <span style={{ ...styles.mono, fontSize: 26, fontWeight: 500, color: text, fontVariantNumeric: 'tabular-nums' }}>{l.kg}</span>
                        <span style={{ ...styles.mono, fontSize: 11, color: dim }}>kg</span>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ ...styles.mono, fontSize: 11, color: muted, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${rule}`, display: 'flex', justifyContent: 'space-between' }}>
                  <span>total <span style={{ color: text }}>445</span>&nbsp;kg</span>
                  <span>@ <span style={{ color: text }}>72</span>&nbsp;kg BW</span>
                </div>
              </div>

              <div className="v3-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ ...styles.mono, fontSize: 11, color: muted, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: accent }} />
                  CURRENTLY READING
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}>Gödel, Escher, Bach</div>
                  <div style={{ fontSize: 14, color: muted, marginTop: 2, fontStyle: 'italic' }}>Douglas Hofstadter · 1979</div>
                </div>
                <div style={{ fontSize: 13, color: muted, lineHeight: 1.55, marginTop: 'auto' }}>
                  An Eternal Golden Braid.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="v3-section" style={{ ...styles.section, paddingBottom: 0 }}>
          <div style={{ ...styles.mono, fontSize: 12, color: muted, letterSpacing: '0.06em', marginBottom: 24 }}>
            06 / Get in touch
          </div>
          <h2 className="v3-contact-h2" style={{ fontSize: 72, letterSpacing: '-0.035em', fontWeight: 500, margin: '0 0 40px', lineHeight: 1.02 }}>
            Say hello.<br />
            <a href="mailto:avimukesh10@gmail.com" target="_blank" rel="noopener noreferrer" className="v3-link" style={{ color: accent }}>avimukesh10@gmail.com</a>
          </h2>
          <div style={{ display: 'flex', gap: 28, ...styles.mono, fontSize: 14, color: muted, flexWrap: 'wrap' }}>
            <a className="v3-link" href="https://github.com/avi-mukesh" target="_blank" rel="noopener noreferrer">github.com/avi-mukesh ↗</a>
            <a className="v3-link" href="https://www.linkedin.com/in/avi-mukesh/" target="_blank" rel="noopener noreferrer">linkedin.com/in/avi-mukesh ↗</a>
          </div>
          <div className="v3-footer-row" style={{ marginTop: 96, paddingTop: 24, paddingBottom: 40, borderTop: `1px solid ${rule}`, display: 'flex', justifyContent: 'space-between', ...styles.mono, fontSize: 12, color: dim }}>
            <span>© 2026 Avi Mukesh</span>
            <span>set in Space Grotesk + JetBrains Mono</span>
          </div>
        </section>
      </div>
    </div>);

}

export default V3Portfolio;