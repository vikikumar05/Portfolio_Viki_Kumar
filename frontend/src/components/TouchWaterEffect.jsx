import { useEffect, useRef } from 'react';

// Touch/tablet-only water-surface layer. Rebuilt to use real optical
// distortion of the live page (via backdrop-filter + an SVG feTurbulence /
// feDisplacementMap filter) instead of drawing any rings/circles. A soft
// radial mask feathers each disturbance's edge so nothing reads as a shape -
// only the underlying content bending. Never mounts on desktop mouse setups.
// The attached reference video/gif were used only as a behavioural reference
// (localized depression -> outward decaying wave); no code or asset from
// them is used here.

const POOL = 5;

function supportsWaterFilter() {
  try {
    return typeof CSS !== 'undefined' && CSS.supports &&
      (CSS.supports('backdrop-filter', 'url(#a)') || CSS.supports('-webkit-backdrop-filter', 'url(#a)'));
  } catch { return false; }
}

export default function TouchWaterEffect() {
  const rootRef = useRef(null);
  const blobRefs = useRef([]);
  const ambientRef = useRef(null);
  const capableRef = useRef(
    typeof window !== 'undefined' &&
    (matchMedia('(pointer:coarse)').matches || navigator.maxTouchPoints > 0 || 'ontouchstart' in window) &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches &&
    supportsWaterFilter()
  );

  useEffect(() => {
    if (!capableRef.current) return;

    // Cache the feDisplacementMap nodes whose "scale" attribute drives amplitude.
    const ambDisp = document.getElementById('wa-disp-amb');
    const blobDisp = Array.from({ length: POOL }, (_, i) => document.getElementById('wa-disp-' + i));

    const pool = Array.from({ length: POOL }, () => ({ active: false, x: 0, y: 0, size: 0, peak: 0, t0: 0, dur: 1, rot: 0 }));
    const touchSlot = new Map(); // touch identifier -> pool index
    const lastTouch = new Map(); // identifier -> {x,y,t}

    let raf = 0, running = false;
    let waveAmp = 0, waveDir = 1, lastScrollY = scrollY, lastScrollT = performance.now();
    const AMB_MAX = 6.5;

    const nextSlot = () => {
      let idle = pool.findIndex((p) => !p.active);
      if (idle !== -1) return idle;
      // evict the oldest-started slot
      let oldest = 0;
      for (let i = 1; i < pool.length; i++) if (pool[i].t0 < pool[oldest].t0) oldest = i;
      return oldest;
    };

    const spawn = (x, y, size, peak, dur) => {
      const i = nextSlot();
      const p = pool[i];
      p.active = true; p.x = x; p.y = y; p.size = size; p.peak = peak; p.dur = dur; p.t0 = performance.now();
      p.rot = Math.random() * 360;
      const el = blobRefs.current[i];
      if (el) {
        el.style.width = size + 'px'; el.style.height = size + 'px';
        el.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0) rotate(${p.rot}deg)`;
        el.style.backdropFilter = `url(#wa-${i})`;
        el.style.webkitBackdropFilter = `url(#wa-${i})`;
      }
      wake();
    };

    const tick = () => {
      const now = performance.now();
      let alive = false;

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) continue;
        const t = (now - p.t0) / p.dur;
        if (t >= 1) {
          p.active = false;
          const el = blobRefs.current[i];
          if (el) { el.style.backdropFilter = 'none'; el.style.webkitBackdropFilter = 'none'; el.style.opacity = 0; }
          if (blobDisp[i]) blobDisp[i].setAttribute('scale', '0');
          continue;
        }
        alive = true;
        // quick soft attack, slow easeOut release
        const amp = t < 0.12 ? p.peak * (t / 0.12) : p.peak * Math.pow(1 - (t - 0.12) / 0.88, 1.6);
        if (blobDisp[i]) blobDisp[i].setAttribute('scale', amp.toFixed(2));
        const el = blobRefs.current[i];
        if (el) { el.style.opacity = Math.min(1, amp / (p.peak * 0.4 || 1)) * 0.9 + 0.1; }
      }

      if (waveAmp > 0.05) {
        alive = true;
        waveAmp *= 0.9;
        if (ambDisp) ambDisp.setAttribute('scale', waveAmp.toFixed(2));
        if (ambientRef.current) {
          ambientRef.current.style.backdropFilter = 'url(#wa-amb)';
          ambientRef.current.style.webkitBackdropFilter = 'url(#wa-amb)';
          ambientRef.current.style.transform = `translate3d(0, ${(waveAmp * 0.35 * waveDir).toFixed(2)}px, 0)`;
        }
      } else if (ambientRef.current && ambientRef.current.style.backdropFilter !== 'none') {
        if (ambDisp) ambDisp.setAttribute('scale', '0');
        ambientRef.current.style.backdropFilter = 'none';
        ambientRef.current.style.webkitBackdropFilter = 'none';
        ambientRef.current.style.transform = 'none';
      }

      if (alive) raf = requestAnimationFrame(tick); else running = false;
    };
    const wake = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };

    const onTouchStart = (e) => {
      for (const t of e.changedTouches) {
        spawn(t.clientX, t.clientY, Math.min(innerWidth, innerHeight) * 0.46, 13, 1150);
        lastTouch.set(t.identifier, { x: t.clientX, y: t.clientY, t: performance.now() });
      }
    };
    const onTouchMove = (e) => {
      for (const t of e.touches) {
        const prev = lastTouch.get(t.identifier);
        const now = performance.now();
        if (!prev) { lastTouch.set(t.identifier, { x: t.clientX, y: t.clientY, t: now }); continue; }
        const dt = now - prev.t, dist = Math.hypot(t.clientX - prev.x, t.clientY - prev.y);
        if (dt > 40 || dist > 22) {
          const velocity = dist / Math.max(dt, 8); // px/ms
          const fast = Math.min(1, velocity / 1.6);
          spawn(t.clientX, t.clientY, 130 + fast * 90, 5 + fast * 8, 420 + fast * 260);
          lastTouch.set(t.identifier, { x: t.clientX, y: t.clientY, t: now });
        }
      }
    };
    const onTouchEnd = (e) => { for (const t of e.changedTouches) lastTouch.delete(t.identifier); };

    const onScroll = () => {
      const now = performance.now();
      const dy = scrollY - lastScrollY;
      const dt = Math.max(8, now - lastScrollT);
      const velocity = dy / dt;
      if (dy !== 0) waveDir = dy > 0 ? 1 : -1;
      waveAmp = Math.min(AMB_MAX, waveAmp + Math.min(AMB_MAX, Math.abs(velocity) * 22));
      lastScrollY = scrollY; lastScrollT = now;
      wake();
    };

    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchmove', onTouchMove, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    addEventListener('touchcancel', onTouchEnd, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
      removeEventListener('touchcancel', onTouchEnd);
      removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!capableRef.current) return null;

  return (
    <div ref={rootRef} aria-hidden="true">
      <svg className="wa-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="wa-amb" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap id="wa-disp-amb" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {Array.from({ length: POOL }).map((_, i) => (
            <filter key={i} id={`wa-${i}`} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={(0.014 + i * 0.004).toFixed(3)} numOctaves={2} seed={11 + i * 6} result="n" />
              <feDisplacementMap id={`wa-disp-${i}`} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          ))}
        </defs>
      </svg>
      <div ref={ambientRef} className="wa-ambient" />
      {Array.from({ length: POOL }).map((_, i) => (
        <div key={i} ref={(el) => (blobRefs.current[i] = el)} className="wa-blob" />
      ))}
    </div>
  );
}
