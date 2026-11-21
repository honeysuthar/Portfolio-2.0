import React, { useState } from 'react';
import './Experience.css';
import { useScrollReveal } from '../hooks/useScrollReveal';

const experiences = [
  {
    period: 'Jun 2026 – Aug 2026',
    role: 'IT Intern',
    company: 'New Delhi Global Youth Summit (Remote)',
    summary:
      'Built the frontend of Anvyo AI using Antigravity, an AI-assisted coding tool, while working fully remotely. Identified and fixed bugs to keep the product working correctly throughout development, and managed my own tasks to meet deadlines without in-person supervision.',
    details: [
      'Developed and maintained the Anvyo AI frontend entirely remotely using an AI-assisted workflow.',
      'Identified and resolved bugs proactively to keep the product stable throughout the development cycle.',
      'Self-managed tasks and deadlines with no direct in-person supervision.',
    ],
  },
  {
    period: 'Jan 2026 – Jul 2026',
    role: 'Frontend Web Developer Intern',
    company: 'Dasinfomedia Pvt. Ltd.',
    summary:
      'Built and shipped multiple pages and an internal company tool using Vite and Next.js in a production codebase for a live product used by real clients. Turned design mockups into responsive, pixel-accurate interfaces and collaborated on a shared codebase via Git feature-branch and pull-request workflows.',
    details: [
      'Delivered an additional product feature in Python, extending existing functionality per team requirements.',
      'Participated in sprint planning and daily stand-ups, reporting progress directly to a senior developer.',
      'Used Git feature-branch and pull-request workflows to collaborate without conflicts on a shared codebase.',
    ],
  },
];

const stats = [
  { value: '2',   label: 'internships at real product companies' },
  { value: '5+',  label: 'projects shipped to production' },
  { value: '1+',  label: 'year of active development' },
];

const ExperienceItem = ({ exp, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`exp-item ${open ? 'exp-item--open' : ''}`}>
      {/* Timeline dot */}
      <div className="exp-dot">
        <span className="exp-dot-icon">▲</span>
      </div>

      {/* Content */}
      <div className="exp-content">
        <span className="exp-period">{exp.period}</span>
        <h3 className="exp-role">{exp.role}</h3>
        <span className="exp-company">{exp.company}</span>
        <p className="exp-summary">{exp.summary}</p>

        <button
          className="exp-details-toggle"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          DETAILS
          <span className="exp-details-arrow">{open ? '▴' : '▾'}</span>
        </button>

        {open && (
          <ul className="exp-details-list">
            {exp.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Experience = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`experience-section container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="experience"
    >
      {/* ── Left panel ── */}
      <div className="exp-left">
        <div className="section-label exp-section-label">
          <span className="exp-label-icon">▲</span>
          Experience
        </div>

        <h2 className="exp-heading">
          Real teams,<br />real products.
        </h2>

        <p className="exp-subheading">
          Internships at a remote AI startup and a software company — shipping code in production codebases used by real clients.
        </p>

        <div className="exp-stats">
          {stats.map((s, i) => (
            <div className="exp-stat" key={i}>
              <span className="exp-stat-value">{s.value}</span>
              <span className="exp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right timeline ── */}
      <div className="exp-right">
        <div className="exp-timeline-line" />
        {experiences.map((exp, i) => (
          <ExperienceItem exp={exp} index={i} key={i} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
