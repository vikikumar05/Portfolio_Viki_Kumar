import mongoose from 'mongoose';
import Message from '../models/Message.js';
import { ok, fail } from '../utils/response.js';
const clean = (v) => String(v ?? '').replace(/[<>]/g, '').trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export async function createMessage(req, res) {
  const b = { name: clean(req.body.name), email: clean(req.body.email), subject: clean(req.body.subject), message: clean(req.body.message) };
  if (!b.name || !b.email || !b.subject || !b.message) return fail(res, 'All fields are required.');
  if (!EMAIL.test(b.email)) return fail(res, 'Please enter a valid email address.');
  if (b.name.length > 80 || b.subject.length > 120) return fail(res, 'Name or subject is too long.');
  if (b.message.length < 10 || b.message.length > 2000) return fail(res, 'Message must be 10-2000 characters.');
  if (mongoose.connection.readyState !== 1) return fail(res, 'Database unavailable. Please try again later.', 503);
  const doc = await Message.create(b);
  return ok(res, 'Message received successfully.', { id: doc._id }, 201);
}
export async function getGithub(req, res) {
  const user = process.env.GITHUB_USERNAME || 'vikikumar05';
  const headers = { 'User-Agent': 'viki-portfolio', ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }) };
  try {
    const [u, r] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }),
      fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=100`, { headers })
    ]);
    if (!u.ok || !r.ok) throw new Error('GitHub API ' + u.status);
    const profile = await u.json(); const repos = await r.json();
    return ok(res, 'GitHub data loaded.', {
      username: profile.login, url: profile.html_url, followers: profile.followers, publicRepos: profile.public_repos,
      stars: repos.reduce((s, x) => s + x.stargazers_count, 0),
      recent: repos.filter((x) => !x.fork).slice(0, 4).map((x) => ({ name: x.name, url: x.html_url, description: x.description, language: x.language, stars: x.stargazers_count }))
    });
  } catch (e) { return fail(res, 'GitHub data unavailable.', 502); }
}
