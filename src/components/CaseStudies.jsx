import React from 'react';
import './CaseStudies.css';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CaseStudies = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`case-studies container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="section-header">
        <div className="section-label">Currently Building <span className="line" /></div>
        <a href="https://github.com/honeysuthar" target="_blank" rel="noopener noreferrer" className="btn-outline-small">
          View on GitHub →
        </a>
      </div>

      <div className="bookify-card">
        {/* Left border accent */}
        <div className="bookify-accent-bar" />

        {/* Content */}
        <div className="bookify-content">
          <div className="bookify-badge">
            <span className="bookify-pulse" />
            Ongoing
          </div>

          <h3 className="bookify-title">Bookify</h3>

          <p className="bookify-tagline">
            A reading habit app that turns your library into an evolving reading identity.
          </p>

          <p className="bookify-desc">
            Most reading trackers just log what you've read. Bookify tracks{' '}
            <em>who you're becoming</em> as a reader — streaks, XP, and a
            personality engine built from your genre DNA. Currently building
            the core reading-session loop and dashboard.
          </p>

          <div className="bookify-stack">
            {['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS', 'PostgreSQL'].map(t => (
              <span key={t} className="bookify-tag">{t}</span>
            ))}
          </div>

          <a href="https://github.com/honeysuthar" target="_blank" rel="noopener noreferrer" className="btn-outline-small">
            View Repo →
          </a>
        </div>

        {/* Visual */}
        <div className="bookify-visual">
          <div className="bookify-rings">
            <div className="ring ring-3" />
            <div className="ring ring-2" />
            <div className="ring ring-1" />
            <div className="bookify-core">📚</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
