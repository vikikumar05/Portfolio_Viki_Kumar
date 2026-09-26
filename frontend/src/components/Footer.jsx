import { socials } from '../data/socials';
export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-big" aria-hidden="true">VIKI.DEV</div>
      <div className="foot-row">
        <span>Built with React + Node.js · © {new Date().getFullYear()}</span>
        <nav aria-label="Footer">
          {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((l) => <a key={l} href={'#' + l.toLowerCase()}>{l}</a>)}
          <a href={socials.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
      </div>
    </footer>
  );
}
