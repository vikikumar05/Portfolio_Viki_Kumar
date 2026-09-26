import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Reveal from '../components/Reveal';
import { profile } from '../data/profile';
const IDENTS = ['DEVELOPER', 'PROBLEM SOLVER', 'FULL STACK', 'AI EXPLORER'];
export default function About() {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-22%']);
  return (
    <section id="about" className="sec" ref={ref}>
      <Reveal><p className="eyebrow">01 / ABOUT — WHO I AM</p></Reveal>
      <Reveal delay={0.1}><h2 className="statement">I turn ideas into working software. <span>Full-stack, AI-assisted, built to be used.</span></h2></Reveal>
      {/* Desktop: scroll-linked parallax row (unchanged, hidden <=1024px). */}
      <motion.div className="words" style={{ x }} aria-hidden="true"><span>DEVELOPER</span><span>PROBLEM SOLVER</span><span>FULL STACK</span><span>AI EXPLORER</span></motion.div>
      {/* Mobile/tablet: own seamless-loop marquee, own sizing, clipped to the viewport (shown only <=1024px). */}
      <div className="words-mobile" aria-hidden="true">
        <div className="mtrack">{[...IDENTS, ...IDENTS].map((w, i) => <span key={i}>{w}</span>)}</div>
      </div>
      <div className="grid2">
        <Reveal>
          <p className="lead">{profile.bio}</p>
          <p className="muted">{profile.education}</p>
          <div className="stats">{profile.stats.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</div>
          <div className="status" role="group" aria-label="Developer status">
            <h4>VIKI.DEV STATUS</h4>
            <p><em /> {profile.status.availability}</p>
            <p>BUILDING: {profile.status.building}</p>
            <p>LEARNING: {profile.status.learning}</p>
            <p>{profile.status.collab}</p>
          </div>
        </Reveal>
        <div className="tl">
          <div className="tl-line"><motion.b style={{ scaleY: scrollYProgress }} /></div>
          {profile.timeline.map((t, i) => (
            <motion.div key={t} className="tl-item" initial={{ opacity: 0.25, x: 0 }} whileInView={{ opacity: 1, x: 10 }} viewport={{ margin: '-35% 0px -35% 0px' }} transition={{ duration: 0.4 }}>
              <i>{String(i + 1).padStart(2, '0')}</i><span>{t}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
