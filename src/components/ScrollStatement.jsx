import { useEffect, useRef } from 'react';
import './ScrollStatement.css';

const TEXT =
  'I build fast, accessible, and beautiful interfaces — from first prototype to production deployment, with clean code and thoughtful architecture that scales.';

const ScrollStatement = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll('.word');

    const onScroll = () => {
      const viewH = window.innerHeight;
      words.forEach((word) => {
        const { top } = word.getBoundingClientRect();
        // Light up words that are in the lower 70% of viewport
        if (top < viewH * 0.82) {
          word.classList.add('lit');
        } else {
          word.classList.remove('lit');
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="scroll-statement container">
      <p className="statement-text">
        {TEXT.split(' ').map((word, i) => (
          <span key={i} className="word">
            {word}{' '}
          </span>
        ))}
      </p>
    </section>
  );
};

export default ScrollStatement;
