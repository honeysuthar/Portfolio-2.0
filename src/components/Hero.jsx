import React from 'react';
import './Hero.css';
import BrainCanvas from './BrainCanvas';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Hero = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`hero container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="home"
    >
      <div className="hero-inner">

        {/* ── Left: Content ── */}
        <div className="hero-content">
          <div className="hero-label">
            <span className="pulse-dot" />
            Frontend Developer · React &amp; Next.js
          </div>

          <h1 className="hero-title">
            Building<br />
            <span className="grad">Web Apps</span><br />
            <span className="italic">That Perform.</span>
          </h1>

          <p className="hero-desc">
            I turn design mockups into pixel-accurate, production-ready interfaces.
            Specializing in React and Next.js with a sharp eye for detail and a
            passion for smooth, immersive interactions.
          </p>

          <div className="hero-actions">
            <a href="#work"    className="btn-primary">View Work →</a>
            <a href="#contact" className="btn-outline">Let's Talk →</a>
          </div>

          <div className="hero-stats">
            <span className="hero-stat-chip">6 Months Experience</span>
            <span className="hero-stat-sep">|</span>
            <span className="hero-stat-chip">5+ Projects</span>
            <span className="hero-stat-sep">|</span>
            <span className="hero-stat-chip">React &amp; Next.js</span>
          </div>
        </div>

        {/* ── Right: 3D Particle Brain ── */}
        <div className="hero-visual">
          <div className="brain-glow" />
          <BrainCanvas />
        </div>

      </div>
    </section>
  );
};

export default Hero;
