import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createMessage, getGithub } from '../controllers/contactController.js';
const r = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many requests. Try again later.' } });
r.post('/contact', limiter, createMessage);
r.get('/github', getGithub);
export default r;
