import { useEffect, useRef } from 'react';

const lerp = (a, b, t) => a + (b - a) * t;

const CustomCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: -200, y: -200 });
  const ring    = useRef({ x: -200, y: -200 });
  const rafRef  = useRef(null);

  useEffect(() => {
    const dot   = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    };

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.09);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.09);
      ringEl.style.left = ring.current.x + 'px';
      ringEl.style.top  = ring.current.y + 'px';
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onEnter = () => ringEl.classList.add('cursor-hover');
    const onLeave = () => ringEl.classList.remove('cursor-hover');

    // Delegate: re-attach when DOM changes would be ideal, but this covers all initial els
    const attach = () => {
      document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();

    // Re-attach on new elements
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
