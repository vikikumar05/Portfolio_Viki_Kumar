import { useEffect, useState } from 'react';
import { Github, Star } from 'lucide-react';
import Reveal from '../components/Reveal';
import { api } from '../utils/api';
import { socials } from '../data/socials';
export default function GithubSection() {
  const [s, setS] = useState({ loading: true });
  useEffect(() => { api('/github').then((r) => setS(r.success ? { data: r.data } : { error: true })); }, []);
  const d = s.data;
  return (
    <section id="github" className="sec">
      <Reveal><p className="eyebrow">05 / GITHUB</p><h2 className="h">Open Source Activity</h2></Reveal>
      {s.loading && <p className="muted">Loading GitHub data...</p>}
      {s.error && <p className="muted">Live GitHub stats are unavailable right now. <a className="ul" href={socials.github} target="_blank" rel="noreferrer">Visit my GitHub profile</a>.</p>}
      {d && (<>
        <div className="stats"><div><b>{d.publicRepos}</b><span>Repositories</span></div><div><b>{d.followers}</b><span>Followers</span></div><div><b>{d.stars}</b><span>Stars</span></div></div>
        <div className="plist">{d.recent.map((r) => <a key={r.name} className="proj" href={r.url} target="_blank" rel="noreferrer"><h3><Github size={16} /> {r.name}</h3><p>{r.description || 'No description'}</p><div className="tags"><span>{r.language || 'n/a'}</span><span><Star size={11} /> {r.stars}</span></div></a>)}</div>
      </>)}
    </section>
  );
}
