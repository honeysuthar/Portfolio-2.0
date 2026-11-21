import React from 'react';
import './Marquee.css';

const ITEMS = [
  'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS',
  'Node.js', 'Python', 'Three.js', 'Figma',
  'Git', 'REST APIs', 'PostgreSQL', 'Prisma', 'Vite',
];

/* same accents as the rest of the site: amber, purple, teal */
const ACCENTS = ['#f5a623', '#8b6cff', '#2dd4bf'];

const Row = ({ items, variant, reverse }) => (
  <div className={`marquee-row marquee-row--${variant}${reverse ? ' is-reverse' : ''}`}>
    {/* two identical groups → the track slides exactly -50% for a seamless loop */}
    <div className="marquee-track">
      {[0, 1].map((g) => (
        <div className="marquee-group" key={g}>
          {items.map((item, i) => (
            <span
              key={`${g}-${i}`}
              className="marquee-item"
              style={{ '--c': ACCENTS[i % ACCENTS.length] }}
            >
              {variant === 'chip' && <i className="marquee-dot" />}
              <span className="marquee-text">{item}</span>
              {variant === 'big' && <i className="marquee-tri" />}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const MarqueeBand = () => (
  <div className="marquee-wrapper" aria-hidden="true">
    <Row items={ITEMS} variant="big" />
    <Row items={[...ITEMS].reverse().concat(ITEMS)} variant="chip" reverse />
  </div>
);

export default MarqueeBand;