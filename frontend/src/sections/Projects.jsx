import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../components/Reveal';
import ProjectModal from '../components/ProjectModal';
import { projects, categories } from '../data/projects';
const HUES = [255, 290, 200, 330];
const tilt = (e) => {
  const el = e.currentTarget, b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
  el.style.setProperty('--gx', x * 100 + '%'); el.style.setProperty('--gy', y * 100 + '%');
  el.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg'); el.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
};
const reset = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); };
export default function Projects() {
  const [cat, setCat] = useState('ALL'), [sel, setSel] = useState(null);
  const list = projects.filter((p) => cat === 'ALL' || p.categories.includes(cat));
  return (
    <section id="projects" className="sec">
      <Reveal><p className="eyebrow">02 / WORK</p><h2 className="h">Selected Work</h2></Reveal>
      <div className="filters" role="tablist">{categories.map((c) => <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}</div>
      <motion.div layout className="showcase">
        <AnimatePresence mode="popLayout">
          {list.map((p) => {
            const idx = projects.indexOf(p), num = String(idx + 1).padStart(2, '0');
            return (
              <motion.article layout key={p.id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.45 }}
                className="proj cine" style={{ '--h': HUES[idx % 4] }} data-cursor="VIEW" tabIndex={0} role="button" onClick={() => setSel(p)} onKeyDown={(e) => e.key === 'Enter' && setSel(p)}>
                <div className="pi" onMouseMove={tilt} onMouseLeave={reset}>
                  <div className="pv"><span className="big">{num}</span><div className="pv-tags">{p.tags.slice(0, 3).map((t) => <span key={t}>{t}</span>)}</div><div className="pv-light" /></div>
                  <div className="pm">
                    <span className="num">PROJECT {num}</span>
                    <h3>{p.title}</h3>
                    <p>{p.overview}</p>
                    <div className="tags">{p.tags.slice(0, 5).map((t) => <span key={t}>{t}</span>)}</div>
                    <span className="go">VIEW DETAILS →</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>{sel && <ProjectModal p={sel} onClose={() => setSel(null)} />}</AnimatePresence>
    </section>
  );
}
