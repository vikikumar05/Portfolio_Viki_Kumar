import { useState } from 'react';
import { Send, Phone, Mail, MessageCircle } from 'lucide-react';
import Reveal from '../components/Reveal';
import { api } from '../utils/api';
import { contact } from '../data/contact';
const empty = { name: '', email: '', subject: '', message: '' };
export default function Contact() {
  const [f, setF] = useState(empty), [st, setSt] = useState({ s: 'idle', m: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setSt({ s: 'loading', m: '' });
    const r = await api('/contact', { method: 'POST', body: JSON.stringify(f) });
    if (r.success) { setF(empty); setSt({ s: 'success', m: r.message }); } else setSt({ s: 'error', m: r.message });
  };
  return (
    <section id="contact" className="sec">
      <Reveal>
        <p className="eyebrow">06 / CONTACT</p>
        <h2 className="cta"><span>LET'S</span><span>BUILD</span><span>SOMETHING.</span></h2>
        <div className="cdirect">
          <a href={contact.phoneHref}><Phone size={16} /> {contact.phone}</a>
          <a href={`mailto:${contact.email}`}><Mail size={16} /> {contact.email}</a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>
        </div>
        <div className="clinks">
          <a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </Reveal>
      <form className="form" onSubmit={submit} noValidate>
        {[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['subject', 'Subject', 'text']].map(([k, l, t]) => (
          <label key={k}>{l}<input type={t} value={f[k]} onChange={set(k)} required maxLength={k === 'name' ? 80 : 120} autoComplete={k === 'subject' ? 'off' : k} /></label>))}
        <label className="full">Message<textarea rows="5" value={f.message} onChange={set('message')} required minLength={10} maxLength={2000} /></label>
        <button className="btn primary" disabled={st.s === 'loading'}>{st.s === 'loading' ? 'Sending...' : <>Send Message <Send size={15} /></>}</button>
        <p role="status" className={'msg ' + st.s}>{st.m}</p>
      </form>
    </section>
  );
}
