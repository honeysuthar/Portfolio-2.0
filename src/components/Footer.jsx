import React from 'react';
import './Footer.css';
import { Triangle, ArrowUpRight, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';



/* ══ Footer ═════════════════════════════════════════════════ */
const EMAIL = 'honeysuthar0805@gmail.com';

const Footer = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <footer className="footer" id="contact">
      <div
        ref={ref}
        className={`footer-inner container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      >
        <div className="footer-main">
          <div className="footer-copy-col">
            <div className="footer-eyebrow">
              <Triangle size={13} aria-hidden="true" />
              <span>Contact</span>
            </div>

            <h2 className="footer-title">Let’s talk.</h2>

            <p className="footer-desc">
              Open to Frontend Developer internships and entry-level roles.
              Based in Ahmedabad, happy to work with teams anywhere.
            </p>

            <a href={`mailto:${EMAIL}`} className="footer-email">
              {EMAIL}
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>

            <div className="footer-actions">
              <a
                href="https://www.linkedin.com/in/honey-suthar/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn footer-btn--primary"
              >
                LinkedIn <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/honeysuthar"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
              >
                GitHub <ArrowRight size={16} aria-hidden="true" />
              </a>

            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 Honey Suthar · Ahmedabad</span>
          <div className="footer-bottom-links">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;