/*
  # Create Waitlist Table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each waitlist entry
      - `email` (text, unique, not null) - Email address of the waitlist subscriber
      - `created_at` (timestamptz) - Timestamp when the email was added
      - `metadata` (jsonb) - Optional field for storing additional information (e.g., referral source, user agent)
  
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public INSERT access (anyone can join the waitlist)
    - No SELECT, UPDATE, or DELETE policies (only admins should access this data)
  
  3. Indexes
    - Index on email for faster duplicate checking
    - Index on created_at for chronological queries
  
  4. Important Notes
    - Email uniqueness is enforced at the database level
    - Public can only insert, cannot view or modify existing entries
    - All timestamps default to current time
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert their email into the waitlist
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No SELECT, UPDATE, or DELETE policies - only authenticated admins should access this data through admin tools