import React from 'react';
import './About.css';
import { Sparkles, Rocket, Code2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const stats = [
  {
    icon: <Sparkles size={20} />,
    num: '6 Months',
    sub: 'Internship Experience',
    text: 'Shipping real features in a live production codebase at Dasinfomedia.',
  },
  {
    icon: <Rocket size={20} />,
    num: '5+ Projects',
    sub: 'Built & Deployed',
    text: 'From movie apps and weather dashboards to computer vision tools.',
  },
  {
    icon: <Code2 size={20} />,
    num: 'React & Next.js',
    sub: 'Core Stack',
    text: 'Turning design specs into functional, pixel-accurate UI components.',
  },
];

/* ── How-I-work diagram ───────────────────────────── */
const RUNS = [
  { name: 'Components', tag: 'react',      y: 60,  dur: 2.8 },
  { name: 'Layout',     tag: 'responsive', y: 150, dur: 3.4 },
  { name: 'Motion',     tag: 'interact',   y: 240, dur: 3.0 },
  { name: 'Polish',     tag: 'perf',       y: 330, dur: 3.8 },
];

const GATES = ['Pixel-accurate', 'Responsive', 'Accessible', 'Fast load', 'Code review'];

const MID = 195; // vertical centre of the diagram

const AboutFlow = () => {
  const { ref, isVisible } = useScrollReveal();
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="about-flow">
      <div className="about-flow-head">
        <div className="section-label">How I Work <span className="line" /></div>
        <h2 className="about-title">One mockup,<br /><em>four tracks.</em></h2>
        <p className="about-desc about-flow-desc">
          Every build starts from a design file. I split it into parallel tracks,
          and nothing ships until it clears the quality gates.
        </p>
      </div>

      <div ref={ref} className={`about-flow-card ${isVisible ? 'flow-live' : ''}`}>
        <svg
          className="about-flow-svg"
          viewBox="0 0 1000 410"
          role="img"
          aria-label="Workflow: a design mockup is split into four parallel build tracks, passes five quality gates, and ships as finished projects."
        >
          <defs>
            <radialGradient id="af-glow-purple">
              <stop offset="0%" stopColor="#7b5cfa" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7b5cfa" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="af-glow-gold">
              <stop offset="0%" stopColor="#ffb627" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffb627" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="af-in" x1="0" x2="1">
              <stop offset="0%" stopColor="#7b5cfa" />
              <stop offset="100%" stopColor="#2bd8c8" />
            </linearGradient>
          </defs>

          {/* ── connectors ── */}
          {RUNS.map((r, i) => (
            <path
              key={`in${i}`}
              id={`af-in-${i}`}
              className="af-line af-line-in"
              d={`M139 ${MID} C 235 ${MID}, 240 ${r.y}, 329 ${r.y}`}
            />
          ))}
          {RUNS.map((r, i) => (
            <path
              key={`out${i}`}
              id={`af-out-${i}`}
              className="af-line af-line-out"
              d={`M510 ${r.y} C 575 ${r.y}, 585 ${MID}, 640 ${MID}`}
            />
          ))}
          <line className="af-dash" x1="810" y1={MID} x2="867" y2={MID} />

          {/* travelling dots */}
          {!reduce && RUNS.map((r, i) => (
            <React.Fragment key={`dot${i}`}>
              <circle r="3.2" className="af-dot af-dot-purple">
                <animateMotion dur={`${r.dur}s`} begin={`${i * 0.45}s`} repeatCount="indefinite">
                  <mpath href={`#af-in-${i}`} />
                </animateMotion>
              </circle>
              <circle r="3.2" className="af-dot af-dot-teal">
                <animateMotion dur={`${r.dur}s`} begin={`${i * 0.45 + 1.2}s`} repeatCount="indefinite">
                  <mpath href={`#af-out-${i}`} />
                </animateMotion>
              </circle>
            </React.Fragment>
          ))}
          <circle className="af-dot af-dot-gold af-gold-a" cx="826" cy={MID} r="3.5" />
          <circle className="af-dot af-dot-gold af-gold-b" cx="850" cy={MID} r="3.5" />

          {/* ── start: the mockup ── */}
          <circle cx="105" cy={MID} r="62" fill="url(#af-glow-purple)" className="af-glow" />
          <circle cx="105" cy={MID} r="34" className="af-q-ring" />
          <g transform={`translate(105 ${MID})`} className="af-q-icon">
            <rect x="-11" y="-11" width="22" height="22" rx="4" />
            <line x1="-11" y1="-3" x2="11" y2="-3" />
            <line x1="-3" y1="-3" x2="-3" y2="11" />
          </g>
          <circle cx="139" cy={MID} r="3.5" fill="#7b5cfa" />
          <text x="105" y="268" textAnchor="middle" className="af-title">Design mockup</text>
          <text x="105" y="287" textAnchor="middle" className="af-sub">Read it, plan the build</text>

          {/* ── parallel tracks ── */}
          {RUNS.map((r, i) => (
            <g key={r.name}>
              <circle cx="345" cy={r.y} r="17" className="af-run-ring" />
              <circle cx="345" cy={r.y} r="7" className="af-run-core" />
              <text x="378" y={r.y - 6} className="af-run-name">{r.name}</text>
              <rect x="378" y={r.y + 3} width="120" height="3" rx="1.5" className="af-bar" />
              <rect
                x="378" y={r.y + 3} width="120" height="3" rx="1.5"
                className="af-bar-fill"
                style={{ animationDuration: `${r.dur + 1}s`, animationDelay: `${i * 0.3}s` }}
              />
              <text x="378" y={r.y + 22} className="af-tag">{r.tag}</text>
            </g>
          ))}
          <text x="430" y="395" textAnchor="middle" className="af-caption">
            Parallel tracks, one design system
          </text>

          {/* ── quality gates ── */}
          <rect x="640" y="40" width="170" height="310" rx="16" className="af-gates-box" />
          <text x="725" y="73" textAnchor="middle" className="af-title">Quality gates</text>
          {GATES.map((g, i) => {
            const cy = 109 + i * 50;
            const last = i === GATES.length - 1;
            return (
              <g key={g} className={`af-gate ${last ? 'af-gate-amber' : ''}`} style={{ '--i': i }}>
                <rect x="654" y={cy - 16} width="142" height="32" rx="12" className="af-gate-pill" />
                <circle cx="673" cy={cy} r="7.5" className="af-gate-ring" />
                <path
                  className="af-check"
                  d={`M${673 - 3} ${cy + 0.5} L${673 - 0.8} ${cy + 2.8} L${673 + 3.2} ${cy - 2.2}`}
                />
                <text x="689" y={cy + 4} className="af-gate-text">{g}</text>
              </g>
            );
          })}

          {/* ── result ── */}
          <circle cx="925" cy={MID} r="95" fill="url(#af-glow-gold)" className="af-glow" />
          <circle cx="925" cy={MID} r="58" className="af-result-ring" />
          <text x="925" y={MID + 2} textAnchor="middle" className="af-result-num">5+</text>
          <text x="925" y={MID + 26} textAnchor="middle" className="af-result-label">PROJECTS SHIPPED</text>
          <text x="925" y="287" textAnchor="middle" className="af-title">React &amp; Next.js</text>
          <text x="925" y="306" textAnchor="middle" className="af-sub">6-month internship to now</text>
        </svg>
      </div>
    </div>
  );
};

const About = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`about container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="about"
    >
      <div className="about-inner">
        <div className="about-left">
          <div className="section-label">About Me <span className="line" /></div>
          <h2 className="about-title">Code meets<br /><em>craft.</em></h2>
          <p className="about-desc">
            I'm Honey, a frontend developer specializing in React — I turn design
            mockups into pixel-accurate, production-ready interfaces. During my
            internship at Dasinfomedia, I shipped real features for a live client
            product, translating visual specs into clean, responsive UI components.
          </p>
          <p className="about-desc">
            I care about the details where design and code meet: smooth interactions,
            thoughtful component architecture, and interfaces that feel as good as
            they look.
          </p>
          <a href="#work" className="btn-outline-small">See My Work →</a>
        </div>

        <div className="about-cards">
          {stats.map((s, i) => (
            <div className="about-card" key={i}>
              <div className="about-card-icon">{s.icon}</div>
              <div className="about-card-body">
                <h3>{s.num}</h3>
                <p className="card-sub">{s.sub}</p>
                <p className="card-text">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AboutFlow />
    </section>
  );
};

export default About;