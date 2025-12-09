import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function insertEmail(email) {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email, status: 'pending' }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return { ok: false, conflict: true };
      }
      console.error('Supabase insert error:', error);
      return { ok: false, conflict: false };
    }

    return { ok: true };
  } catch (err) {
    console.error('Insert email error:', err);
    return { ok: false, conflict: false };
  }
}

export async function listEmails(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .select('email, created_at')
      .order('created_at', { ascending: false })
      .limit(Math.max(1, Math.min(500, limit)));

    if (error) {
      console.error('Supabase list error:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('List emails error:', err);
    return [];
  }
}
