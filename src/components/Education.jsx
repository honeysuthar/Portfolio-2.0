import React from 'react';
import './Education.css';
import { useScrollReveal } from '../hooks/useScrollReveal';

const degrees = [
  {
    period: '2022 – 2026',
    degree: 'B.Tech in Information Technology',
    institution: 'Gandhinagar University · Units covered: Software Engineering, Data Structures and Algorithms, Database Management Systems, Computer Networks, Operating Systems, and Web Technologies.',
  },
];

const extras = [
  {
    type: 'TOOL',
    title: 'AI-Assisted Development with Antigravity',
    source: 'Used professionally at NDGYS Internship · 2026',
  },
  {
    type: 'OPEN SOURCE',
    title: 'Active GitHub contributor',
    source: 'github.com/honeysuthar · ongoing',
  },
];

const Education = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`education-section container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="education"
    >
      {/* ── Header ── */}
      <div className="edu-header">
        <div className="section-label edu-section-label">
          <span className="edu-label-icon">▲</span>
          Education
        </div>
        <h2 className="edu-heading">
          Information Technology,<br />
          <span className="edu-heading-em">built for the web.</span>
        </h2>
      </div>

      {/* ── Body ── */}
      <div className="edu-body">

        {/* Left — degrees */}
        <div className="edu-degrees">
          {degrees.map((d, i) => (
            <div className="edu-degree-item" key={i}>
              <span className="edu-degree-period">{d.period}</span>
              <h3 className="edu-degree-title">{d.degree}</h3>
              <p className="edu-degree-inst">{d.institution}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="edu-divider" />

        {/* Right — extras */}
        <div className="edu-extras">
          {extras.map((e, i) => (
            <div className="edu-extra-item" key={i}>
              <span className="edu-extra-type">{e.type}</span>
              <h4 className="edu-extra-title">{e.title}</h4>
              <p className="edu-extra-source">{e.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
