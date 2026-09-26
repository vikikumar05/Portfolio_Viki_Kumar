import { useEffect, useRef } from 'react';
export default function Cursor() {
  const dot = useRef(), ring = useRef(), label = useRef();
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const move = (e) => {
      mx = e.clientX; my = e.clientY;
      const t = e.target.closest?.('[data-cursor],a,button');
      const text = t ? t.dataset.cursor || (t.tagName === 'A' ? 'OPEN' : '') : '';
      ring.current?.classList.toggle('big', !!text);
      ring.current?.classList.toggle('mid', !!t && !text);
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
    };
    const tick = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${mx}px,${my}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      root.style.setProperty('--mx', mx + 'px'); root.style.setProperty('--my', my + 'px');
      raf = requestAnimationFrame(tick);
    };
    addEventListener('mousemove', move, { passive: true }); tick();
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf); root.classList.remove('has-cursor'); };
  }, []);
  return (<><div ref={dot} className="c-dot" aria-hidden="true" /><div ref={ring} className="c-ring" aria-hidden="true"><span ref={label} /></div></>);
}
