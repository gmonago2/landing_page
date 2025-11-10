import express from 'express';
import cors from 'cors';
import { insertEmail, listEmails } from './db.js';

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/waitlist', async (req, res) => {
  const limit = Number(req.query.limit || 100);
  const rows = await listEmails(Math.min(Math.max(limit, 1), 500));
  res.json({ items: rows });
});

app.post('/api/waitlist', async (req, res) => {
  try {
    const email = String((req.body?.email || '')).toLowerCase().trim();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
  const result = await insertEmail(email);
    if (result.ok) return res.status(201).json({ ok: true });
    if (result.conflict) return res.status(409).json({ error: 'Already on the waitlist' });
    return res.status(500).json({ error: 'DB error' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
