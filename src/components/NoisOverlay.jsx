import React, { useEffect, useRef } from 'react';

const NoisOverlay = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = Math.min(window.innerWidth, 512);
      height = canvas.height = Math.min(window.innerHeight, 512);
    };

    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const render = () => {
      frame++;
      if (frame % 2 === 0) {
        const imgData = ctx.createImageData(width, height);
        const buffer32 = new Uint32Array(imgData.data.buffer);
        const len = buffer32.length;
        for (let i = 0; i < len; i++) {
          if (Math.random() < 0.15) {
            const val = Math.floor(Math.random() * 255);
            buffer32[i] = (255 << 24) | (val << 16) | (val << 8) | val;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.035,
      }}
    />
  );
};

export default NoisOverlay;
