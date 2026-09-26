import { useEffect, useRef } from 'react';
export default function Background() {
  const ref = useRef();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = ref.current, ctx = c.getContext('2d'), fine = matchMedia('(pointer:fine)').matches;
    let w, h, raf, frame = 0, color = '#8b9bff'; const m = { x: -999, y: -999 };
    const resize = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    resize();
    const ps = Array.from({ length: fine ? 70 : 22 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
    const tick = () => {
      if (frame++ % 120 === 0) color = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || color;
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = color; ctx.strokeStyle = color;
      for (const p of ps) {
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy) || 1;
        if (d < 150) { p.x += (dx / d) * (150 - d) * 0.02; p.y += (dy / d) * (150 - d) * 0.02; }
        p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
        ctx.globalAlpha = 0.55; ctx.fillRect(p.x, p.y, 1.8, 1.8);
      }
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y);
        if (d < 110) { ctx.globalAlpha = (1 - d / 110) * 0.2; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
      }
      raf = requestAnimationFrame(tick);
    };
    const mv = (e) => { m.x = e.clientX; m.y = e.clientY; };
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) tick(); };
    addEventListener('mousemove', mv, { passive: true }); addEventListener('resize', resize); document.addEventListener('visibilitychange', vis); tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', mv); removeEventListener('resize', resize); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return <canvas ref={ref} className="bgc" aria-hidden="true" />;
}
