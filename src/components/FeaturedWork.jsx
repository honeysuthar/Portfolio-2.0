import React, { useEffect, useRef, useState } from 'react';
import './FeaturedWork.css';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* year / role are editable — change them to whatever is true for you */
const projects = [
  {
    id: 1,
    title: 'Bookify',
    year: '2026 – Now',
    role: 'Creator and developer',
    desc: "A reading habit app that tracks who you're becoming as a reader — streaks, XP, and a personality engine built from your genre DNA.",
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS', 'PostgreSQL'],
    orb: [245, 166, 35], // amber
    link: 'https://bookify-swart-gamma.vercel.app/',
  },
  {
    id: 2,
    title: 'Movie Discovery App',
    year: '2026',
    role: 'Developer',
    desc: 'Browse, search, and discover films with real-time data from TMDB API. Dark cinematic UI with responsive layouts.',
    tags: ['React.js', 'TMDB API', 'CSS'],
    orb: [139, 108, 255], // purple
    link: 'https://honey-framework-training-movie-app.netlify.app',
  },
  {
    id: 3,
    title: 'Weather Forecast App',
    year: '2026',
    role: 'Developer',
    desc: 'Real-time weather with location search, current conditions, and a clean minimal dashboard.',
    tags: ['React.js', 'OpenWeather API'],
    orb: [45, 212, 191], // teal
    link: 'https://honeysuthar.github.io/weather-app/',
  },
  {
    id: 4,
    title: 'JJK Hand Seal FX',
    year: '2026',
    role: 'Developer',
    desc: 'Real-time hand gesture recognition with anime-inspired visual overlay using computer vision.',
    tags: ['Python', 'OpenCV', 'MediaPipe'],
    orb: [232, 84, 112], // rose
    link: 'https://github.com/honeysuthar/jjk_fx_app',
  },
  {
    id: 5,
    title: 'iPhone Calculator',
    year: '2026',
    role: 'Developer',
    desc: 'Pixel-perfect iPhone calculator clone with complete arithmetic logic and iOS-accurate styling.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    orb: [96, 156, 255], // blue
    link: 'https://honeysuthar.github.io/iphonecalc/',
  },
  {
    id: 6,
    title: 'I Love You Heart',
    year: '2026',
    role: 'Developer',
    desc: 'Animated love heart with particle trails built entirely with pure CSS & JavaScript.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    orb: [255, 128, 184], // pink
    link: 'https://honeysuthar.github.io/loveheart/',
  },
];

/* ── Glowing sphere of outlined triangles ────────────────── */
const TriangleOrb = ({ color, active }) => {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SIZE = 190;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const main = `rgb(${color.join(',')})`;
    const white = 'rgb(236,236,242)';

    const pts = Array.from({ length: 52 }, () => {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = Math.cbrt(Math.random());
      return {
        x: s * Math.cos(th) * r,
        y: u * r,
        z: s * Math.sin(th) * r,
        size: 4.5 + Math.random() * 6.5,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.6,
        col: Math.random() < 0.18 ? white : main,
      };
    });

    let raf = 0;
    let visible = true;
    let angle = Math.random() * 6;
    let speed = 1;
    let last = 0;

    const draw = (t) => {
      const dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      speed += ((activeRef.current ? 3.2 : 1) - speed) * 0.06;
      if (!reduce) angle += dt * 0.00035 * speed;

      const c = SIZE / 2;
      const R = SIZE * 0.36;
      const ca = Math.cos(angle), sa = Math.sin(angle);
      const pitch = 0.35;
      const cb = Math.cos(pitch), sb = Math.sin(pitch);

      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.lineWidth = 1.4;
      for (const p of pts) {
        const x1 = p.x * ca + p.z * sa;
        const z1 = -p.x * sa + p.z * ca;
        const y1 = p.y * cb - z1 * sb;
        const z2 = p.y * sb + z1 * cb;
        const px = c + x1 * R;
        const py = c + y1 * R;
        const size = p.size * (1 + z2 * 0.18);
        const rot = p.rot + (reduce ? 0 : t * 0.0004 * p.spin);

        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = rot + (i * Math.PI * 2) / 3;
          const vx = px + Math.cos(a) * size;
          const vy = py + Math.sin(a) * size;
          if (i === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.globalAlpha = 0.3 + 0.7 * ((z2 + 1) / 2);
        ctx.strokeStyle = p.col;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    draw(0);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [color]);

  return <canvas ref={canvasRef} className="project-orb-canvas" aria-hidden="true" />;
};

/* ── Card ────────────────────────────────────────────────── */
const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      style={{ '--orb': project.orb.join(',') }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="project-orb">
        <TriangleOrb color={project.orb} active={hovered} />
      </div>

      <div className="project-year">{project.year}</div>
      <h3 className="project-title">{project.title}</h3>
      <div className="project-role">{project.role}</div>
      <p className="project-desc">{project.desc}</p>
      <span className="project-more">Read more →</span>
    </a>
  );
};

const FeaturedWork = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`featured-work container reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
      id="work"
    >
      <div className="section-header">
        <div className="section-label">Featured Work <span className="line" /></div>
        <a
          href="https://github.com/honeysuthar"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-small"
        >
          View All →
        </a>
      </div>

      <div className="projects-grid">
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  );
};

export default FeaturedWork;