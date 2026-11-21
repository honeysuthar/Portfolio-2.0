import { useEffect, useRef } from 'react';

const NoiseOverlay = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let frame = 0;

    // Small canvas — CSS stretches it for a grain look
    canvas.width = 256;
    canvas.height = 256;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      frame++;
      if (frame % 2 !== 0) return; // ~30fps

      const imgData = ctx.createImageData(256, 256);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.038,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

export default NoiseOverlay;
