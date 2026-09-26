import { useState } from 'react';
import Reveal from '../components/Reveal';
const steps = [['IDEA', 'Define the problem and what "done" looks like.'], ['DESIGN', 'Sketch flows, data models and the interface.'], ['CODE', 'Build components and services in small, testable pieces.'], ['API', 'Connect frontend and backend through clean REST contracts.'], ['TEST', 'Check behaviour with Postman and real user flows.'], ['DEPLOY', 'Ship it, watch it, and iterate.']];
export default function Pipeline() {
  const [on, setOn] = useState(0);
  return (
    <section id="process" className="sec">
      <Reveal><p className="eyebrow">04 / PROCESS</p><h2 className="h">The Way I Build</h2></Reveal>
      <div className="pipe" style={{ '--p': (on + 1) / steps.length }}>
        <div className="pipe-bar" />
        {steps.map(([t, d], i) => (
          <button key={t} className={'st' + (i <= on ? ' lit' : '') + (i === on ? ' on' : '')} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)}>
            <i>{String(i + 1).padStart(2, '0')}</i><h4>{t}</h4><p>{d}</p>
          </button>))}
      </div>
    </section>
  );
}
