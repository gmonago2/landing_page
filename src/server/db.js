import { promises as fs } from 'fs';
import { resolve } from 'path';

const DB_PATH = resolve(process.cwd(), 'waitlist.json');

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    if (e && e.code === 'ENOENT') return { items: [] };
    throw e;
  }
}

async function writeDb(json) {
  const data = JSON.stringify(json, null, 2);
  await fs.writeFile(DB_PATH, data, 'utf-8');
}

export async function insertEmail(email) {
  const db = await readDb();
  const exists = db.items.some((x) => x.email === email);
  if (exists) return { ok: false, conflict: true };
  db.items.unshift({ email, created_at: new Date().toISOString() });
  await writeDb(db);
  return { ok: true };
}

export async function listEmails(limit = 100) {
  const db = await readDb();
  return db.items.slice(0, Math.max(1, Math.min(500, limit)));
}
