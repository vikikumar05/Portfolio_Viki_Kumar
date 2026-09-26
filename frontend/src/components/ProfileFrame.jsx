import { useRef, useState, useEffect } from 'react';
const REDUCE = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function ProfileFrame() {
  const box = useRef(), s = useRef({ tx: 0, ty: 0, x: 0, y: 0, v: 0, raf: 0 });
  const [ok, setOk] = useState(true), [burst, setBurst] = useState(0);
  const loop = () => {
    const q = s.current, el = box.current; if (!el) return;
    q.x += (q.tx - q.x) * 0.1; q.y += (q.ty - q.y) * 0.1; q.v *= 0.92;
    el.style.setProperty('--rx', (-q.y * 12).toFixed(2) + 'deg');
    el.style.setProperty('--ry', (q.x * 14).toFixed(2) + 'deg');
    el.style.setProperty('--tx', (q.x * 14).toFixed(1) + 'px');
    el.style.setProperty('--ty', (q.y * 14).toFixed(1) + 'px');
    el.style.setProperty('--v', q.v.toFixed(3));
    q.raf = Math.abs(q.tx - q.x) + Math.abs(q.ty - q.y) + q.v > 0.004 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!s.current.raf) s.current.raf = requestAnimationFrame(loop); };
  const move = (e) => {
    if (REDUCE) return;
    const b = box.current.getBoundingClientRect(), q = s.current;
    q.tx = (e.clientX - b.left) / b.width - 0.5; q.ty = (e.clientY - b.top) / b.height - 0.5;
    q.v = Math.min(1, Math.max(q.v, Math.hypot(e.movementX || 0, e.movementY || 0) / 40));
    box.current.style.setProperty('--sx', (q.tx + 0.5) * 100 + '%'); box.current.style.setProperty('--sy', (q.ty + 0.5) * 100 + '%');
    kick();
  };
  const leave = () => { s.current.tx = 0; s.current.ty = 0; kick(); };
  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);
  return (
    <div className="pf" ref={box} onPointerMove={move} onPointerDown={move} onPointerLeave={leave} onClick={() => !REDUCE && setBurst((n) => n + 1)} data-cursor="EXPLORE">
      <div className="pf-tilt">
        <div className="pf-img">
          {ok ? (<>
            <img src="/images/profile.jpg" alt="Viki Kumar" onError={() => setOk(false)} />
            <img className="ch r" src="/images/profile.jpg" alt="" aria-hidden="true" />
            <img className="ch b" src="/images/profile.jpg" alt="" aria-hidden="true" />
          </>) : (<div className="pf-empty"><b>VK</b><span>Add your photo at<br />public/images/profile.jpg</span></div>)}
          <div className="scan" /><div className="spot" />
          {burst > 0 && <i key={burst} className="ripple" />}
        </div>
        <span className="cn tl" /><span className="cn tr" /><span className="cn bl" /><span className="cn br" />
        <em className="lb l1">VIKI.DEV</em><em className="lb l2">FULL STACK</em><em className="lb l3">AI / WEB</em>
        {/* <span className="touch-hint">TAP TO EXPLORE</span> */}
      </div>
    </div>
  );
}
