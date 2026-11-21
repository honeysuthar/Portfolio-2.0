import React from 'react';
import './Process.css';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  { num: '01', title: 'Discover',  desc: 'Break down requirements, APIs, and design specs before writing a single line of code. Understanding the "why" shapes the entire build.' },
  { num: '02', title: 'Structure', desc: 'Plan component architecture and state management upfront — avoiding prop-drilling nightmares and spaghetti logic down the road.' },
  { num: '03', title: 'Build',     desc: 'Develop responsive, pixel-accurate UI with clean, reusable components and consistent design tokens throughout.' },
  { num: '04', title: 'Refine',   desc: 'Edge cases, loading/error states, micro-animations. Polish until every interaction feels native and earns trust.' },
  { num: '05', title: 'Ship',     desc: 'Deploy to production, write documentation, and hand off code that the next developer will actually understand.' },
];

const Process = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`process container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="process"
    >
      <div className="process-header">
        <div className="section-label">My Dev Process <span className="line" /></div>
        <h2 className="process-subtitle">
          How I build,{' '}
          <span className="process-subtitle-em">every time.</span>
        </h2>
      </div>

      <div className="process-timeline">
        {steps.map((step, i) => (
          <div className="process-step" key={i}>
            <div className="step-num">{step.num}</div>
            <div className="step-content">
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;
