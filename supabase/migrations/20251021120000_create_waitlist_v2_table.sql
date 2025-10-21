/*
  Create waitlist_v2 table (same schema and policies as waitlist)
  This creates a second table so landing pages can write into two different
  tables within the same Supabase project/database (BADM372).

  Usage:
  - Run this SQL in your Supabase project's SQL editor, or via the Supabase CLI:
      supabase db connect
      psql "<connection-string>" -f 20251021120000_create_waitlist_v2_table.sql

  - After applying, ensure the anon role has INSERT policy on `waitlist_v2`.
*/

CREATE TABLE IF NOT EXISTS waitlist_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_v2_email ON waitlist_v2(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_v2_created_at ON waitlist_v2(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist_v2 ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert their email into the waitlist_v2
CREATE POLICY "Anyone can join waitlist_v2"
  ON waitlist_v2
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- NOTE: Do NOT create public SELECT/UPDATE/DELETE policies here; keep data writeable only.
