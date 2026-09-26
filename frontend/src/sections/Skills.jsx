import { useState } from 'react';
import Reveal from '../components/Reveal';
import Terminal from '../components/Terminal';
import { profile } from '../data/profile';
const P = { 'C++': [150, 40], JavaScript: [250, 40], 'React.js': [100, 110], 'Tailwind CSS': [50, 200], 'Node.js': [260, 150], 'Express.js': [430, 90], Postman: [600, 60], MongoDB: [330, 240], 'MongoDB Compass': [400, 330], Laravel: [110, 320], PHP: [40, 400], MySQL: [200, 400], XAMPP: [230, 300], Python: [620, 180], 'OpenAI API': [540, 290], Selenium: [650, 360], 'Speech Recognition': [540, 400], Git: [330, 420], GitHub: [420, 420] };
const cat = (n) => Object.keys(profile.skills).find((k) => profile.skills[k].includes(n)) || 'Programming';
const edges = [...new Set(Object.entries(profile.related).flatMap(([a, l]) => l.filter((b) => P[a] && P[b]).map((b) => [a, b].sort().join('|'))))].map((k) => k.split('|'));
export default function Skills() {
  const [h, setH] = useState(null);
  const rel = h ? profile.related[h] || [] : [];
  const linked = (n) => !!h && (rel.includes(n) || (profile.related[n] || []).includes(h));
  return (
    <section id="skills" className="sec">
      <Reveal><p className="eyebrow">03 / SKILLS</p><h2 className="h">Technology Ecosystem</h2></Reveal>
      <div className="net">
        <svg viewBox="0 0 700 450" role="img" aria-label="Technology network">
          {edges.map(([a, b]) => <line key={a + b} className={'ed' + (h && (a === h || b === h) ? ' hi' : h ? ' dim' : '')} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} />)}
          {Object.entries(P).map(([n, [x, y]]) => (
            <g key={n} className={'nd' + (h === n ? ' on' : linked(n) ? ' rel' : h ? ' dim' : '')} transform={`translate(${x} ${y})`} tabIndex={0}
              onMouseEnter={() => setH(n)} onFocus={() => setH(n)} onMouseLeave={() => setH(null)} onBlur={() => setH(null)}>
              <circle r="8" /><text y="24" textAnchor="middle">{n}</text>
            </g>))}
        </svg>
      </div>
      <div className="grid2">
        <div className="info" aria-live="polite">{h ? <><b>{h}</b> <span>{cat(h)}</span><p>{rel.length ? 'Works with: ' + rel.join(', ') : 'Part of my core toolkit.'}</p></> : <p>Hover or focus a node to explore how technologies connect.</p>}</div>
        <Terminal />
      </div>
    </section>
  );
}
