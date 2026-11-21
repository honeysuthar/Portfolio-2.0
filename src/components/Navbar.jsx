import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div className={`navbar-wrap${scrolled ? ' scrolled' : ''}`}>
        <nav className="navbar container">
          <a href="#home" className="nav-logo" onClick={close}>
            HONEY<span>SUTHAR</span>
          </a>

          <ul className="nav-links">
            {[['#home','Home'],['#about','About'],['#work','Work'],['#experience','Experience'],['#education','Education'],['#contact','Contact']].map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>

          <a href="#contact" className="btn-outline nav-cta">Let's Talk →</a>

          <button
            className={`hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      <div className={`mobile-drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        {[['#home','Home'],['#about','About'],['#work','Work'],['#experience','Experience'],['#education','Education'],['#contact','Contact']].map(([href, label]) => (
          <a key={href} href={href} onClick={close}>{label}</a>
        ))}
        <a href="#contact" className="btn-outline" onClick={close}>Let's Talk →</a>
      </div>
    </>
  );
};

export default Navbar;
