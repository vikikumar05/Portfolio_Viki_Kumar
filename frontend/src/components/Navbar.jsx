import { useEffect, useState } from 'react';
import { Sun, Moon, Menu, X, Github, Linkedin, FileText } from 'lucide-react';
import { socials } from '../data/socials';
const links = ['Home', 'About', 'Projects', 'Skills', 'Contact'];
export default function Navbar({ theme, toggle }) {
  const [active, setActive] = useState('home'), [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false), [prog, setProg] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((l) => { const el = document.getElementById(l.toLowerCase()); el && io.observe(el); });
    const on = () => { setScrolled(scrollY > 20); setProg(scrollY / (document.body.scrollHeight - innerHeight || 1)); };
    addEventListener('scroll', on, { passive: true }); on();
    return () => { io.disconnect(); removeEventListener('scroll', on); };
  }, []);
  return (
    <header className={'nav' + (scrolled ? ' glass' : '')}>
      <div className="progress" style={{ transform: `scaleX(${prog})` }} />
      <a href="#home" className="logo">VIKI<span>.DEV</span></a>
      <nav className={'links' + (open ? ' open' : '')} aria-label="Primary">
        {links.map((l) => <a key={l} href={'#' + l.toLowerCase()} onClick={() => setOpen(false)} className={active === l.toLowerCase() ? 'active' : ''}>{l}</a>)}
      </nav>
      <div className="right">
        <a href={socials.resume} target="_blank" rel="noreferrer" aria-label="Resume"><FileText size={18} /></a>
        <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
        <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
        <button onClick={toggle} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </header>
  );
}
