import { useEffect, useRef, useState } from 'react';

export default function BitByteMolecules() {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const pointer = { x: -1000, y: -1000, active: false };
    let particles = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let mounted = true;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        if (pointer.active && !reduced.matches && !coarse.matches) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;
          const radius = 95;
          if (distance < radius) {
            const push = (1 - distance / radius) ** 2 * 5;
            particle.vx += dx / distance * push;
            particle.vy += dy / distance * push;
          }
        }
        particle.vx += (particle.homeX - particle.x) * 0.075;
        particle.vy += (particle.homeY - particle.y) * 0.075;
        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.color;
        context.fill();
      }
      if (visible && !reduced.matches && !coarse.matches) frame = requestAnimationFrame(draw);
    };

    const build = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.round(bounds.width);
      height = Math.round(bounds.height);
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const mask = document.createElement('canvas');
      mask.width = width;
      mask.height = height;
      const ink = mask.getContext('2d', { willReadFrequently: true });
      const word = 'BITBYTE';
      ink.fillStyle = '#000';
      ink.textAlign = 'center';
      ink.textBaseline = 'middle';
      let fontSize = Math.min(height * 0.76, width * 0.23);
      ink.font = `750 ${fontSize}px Manrope, sans-serif`;
      fontSize *= Math.min(1, width * 0.94 / ink.measureText(word).width);
      ink.font = `750 ${fontSize}px Manrope, sans-serif`;
      ink.fillText(word, width * 0.5, height * 0.51);
      const pixels = ink.getImageData(0, 0, width, height).data;
      const step = width < 600 ? 7 : 9;
      const next = [];
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          if (pixels[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] < 120) continue;
          const variation = Math.sin(x * 0.27 + y * 0.13);
          next.push({ homeX: x, homeY: y, x, y, vx: 0, vy: 0,
            radius: variation > 0.65 ? 2.15 : variation < -0.65 ? 1.25 : 1.7,
            color: variation > 0.72 ? '#ab72c2' : variation < -0.72 ? '#cfb5d5' : '#eee2ea' });
        }
      }
      particles = next;
      cancelAnimationFrame(frame);
      draw();
      if (mounted) setReady(true);
    };

    const move = event => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) draw();
    });
    const resizer = new ResizeObserver(build);
    observer.observe(canvas);
    resizer.observe(canvas);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    document.fonts.ready.then(() => { if (mounted) build(); });

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <div className="bitbyte-molecule-type" data-testid="bitbyte-molecule-type">
    <h1 id="bitbyte-launch-title" className={`bitbyte-molecule-fallback${ready ? ' is-ready' : ''}`} data-testid="products-page-heading">BITBYTE</h1>
    <canvas ref={canvasRef} aria-hidden="true" />
  </div>;
}
