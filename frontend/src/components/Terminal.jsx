import { useState } from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { socials } from '../data/socials';
export default function Terminal() {
  const [lines, setLines] = useState(['Type "help" to begin.']), [v, setV] = useState('');
  const cmds = {
    help: () => 'Commands: help, about, skills, projects, contact, github, clear',
    about: () => profile.bio,
    skills: () => Object.values(profile.skills).flat().slice(0, 14).join(', '),
    projects: () => projects.map((p) => '- ' + p.title).join('\n'),
    contact: () => 'GitHub: ' + socials.github + '\nLinkedIn: ' + socials.linkedin,
    github: () => socials.github
  };
  const run = (e) => {
    e.preventDefault(); const c = v.trim().toLowerCase(); setV('');
    if (!c) return;
    if (c === 'clear') return setLines([]);
    setLines((l) => [...l, '> ' + c, cmds[c] ? cmds[c]() : `Unknown command: ${c}`]);
  };
  return (
    <div className="term" role="region" aria-label="Interactive terminal">
      <div className="term-bar"><i /><i /><i /><b>viki@lab ~</b></div>
      <pre aria-live="polite">{lines.join('\n')}</pre>
      <form onSubmit={run}><span>&gt;</span><input value={v} onChange={(e) => setV(e.target.value)} aria-label="Terminal command" placeholder="help" /></form>
    </div>
  );
}
