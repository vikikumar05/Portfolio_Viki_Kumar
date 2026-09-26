import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
const S = ({ t, children }) => children ? <section><h4>{t}</h4>{children}</section> : null;
export default function ProjectModal({ p, onClose }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onClose]);
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal" role="dialog" aria-modal="true" aria-label={p.title} initial={{ y: 40, scale: 0.97 }} animate={{ y: 0, scale: 1 }} onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <h3>{p.title}</h3>
        <S t="Overview">{p.overview && <p>{p.overview}</p>}</S>
        <S t="Problem">{p.problem && <p>{p.problem}</p>}</S>
        <S t="Solution">{p.solution && <p>{p.solution}</p>}</S>
        <S t="Features"><ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul></S>
        <S t="Tech Stack"><div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div></S>
        <S t="Challenges">{p.challenges && <p>{p.challenges}</p>}</S>
        <S t="Architecture">{p.architecture && <p>{p.architecture}</p>}</S>
        <div className="row">
          {p.github && <a className="btn" href={p.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>}
          {p.demo && <a className="btn" href={p.demo} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Live Demo</a>}
        </div>
      </motion.div>
    </motion.div>
  );
}
