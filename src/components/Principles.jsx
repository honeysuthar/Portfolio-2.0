import React from 'react';
import './Principles.css';
import { Sparkles, Rocket, Code2, Heart } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const pillars = [
  {
    icon: <Sparkles size={20} />,
    title: 'Details Matter',
    desc: 'Every pixel, every interaction, every edge case. I sweat the small stuff so users never have to notice — they just feel it.',
  },
  {
    icon: <Rocket size={20} />,
    title: 'Ship Fast, Iterate',
    desc: 'Perfect is the enemy of shipped. I build MVPs quickly, gather real feedback, and refine with purpose.',
  },
  {
    icon: <Code2 size={20} />,
    title: 'Clean Code',
    desc: 'Readable, maintainable, well-structured code that the next developer will actually understand and thank you for.',
  },
  {
    icon: <Heart size={20} />,
    title: 'User First',
    desc: 'Every decision starts with the user experience. Performance, accessibility, and delight are non-negotiable.',
  },
];

const Principles = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`principles container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="principles"
    >
      <div className="principles-header">
        <div className="section-label">
          Working Principles <span className="line" />
        </div>
        <h2 className="principles-subtitle">
          What guides <em>my work.</em>
        </h2>
      </div>

      <div className="principles-grid">
        {pillars.map((p, i) => (
          <div className="principle-card" key={i}>
            <div className="principle-icon">{p.icon}</div>
            <h3 className="principle-title">{p.title}</h3>
            <p className="principle-desc">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Principles;
