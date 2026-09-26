import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, FileText } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import ProfileFrame from '../components/ProfileFrame';
import { profile } from '../data/profile';
import { socials } from '../data/socials';
const Word = ({ t, i }) => (
  <span className="mask"><motion.span style={{ display: 'block' }} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.2, 0.7, 0.1, 1] }}>{t}</motion.span></span>
);
export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-copy">
        <span className="pill"><i /> AVAILABLE FOR OPPORTUNITIES</span>
        <h1 className="disp" aria-label={profile.name}><Word t="VIKI" i={0} /><Word t="KUMAR" i={1} /></h1>
        <p className="role">Full Stack Developer <b>/</b> AI Enthusiast</p>
        <motion.p className="lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>{profile.tagline}</motion.p>
        <div className="row">
          <Magnetic href="#projects" className="btn primary">Explore Work <ArrowUpRight size={16} /></Magnetic>
          <Magnetic href="#contact">Let's Connect</Magnetic>
        </div>
        <div className="row small">
          <a href={socials.github} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
          <a href={socials.resume} target="_blank" rel="noreferrer"><FileText size={15} /> Resume</a>
        </div>
      </div>
      <div className="hero-vis"><ProfileFrame /><span className="meta">VIKI.DEV / DIGITAL LAB — AI / WEB / SYSTEMS</span></div>
    </section>
  );
}
