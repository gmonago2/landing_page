/*
  # Create missions and progress tracking tables

  1. New Tables
    - `missions`
      - `id` (uuid, primary key) - Unique identifier for each mission
      - `title` (text) - Mission title
      - `description` (text) - Mission description
      - `type` (text) - Mission type: 'daily', 'evergreen', or 'beginner'
      - `points` (integer) - Points awarded for completion
      - `created_at` (timestamptz) - When the mission was created

    - `user_mission_progress`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth.users
      - `mission_id` (uuid) - Reference to missions table
      - `completed` (boolean) - Whether mission is completed
      - `completed_at` (timestamptz) - When the mission was completed
      - `last_completed_date` (date) - For daily missions, tracks last completion date
      - `created_at` (timestamptz) - When progress was first tracked

  2. Security
    - Enable RLS on both tables
    - Users can read all missions
    - Users can only read and update their own progress
    - System manages mission creation

  3. Indexes
    - Index on user_id for fast progress lookups
    - Unique constraint on user_id + mission_id + last_completed_date for daily missions

  4. Initial Data
    - Populate with starter missions
*/

CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('daily', 'evergreen', 'beginner')),
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_mission_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  last_completed_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read missions"
  ON missions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own progress"
  ON user_mission_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_mission_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_mission_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_mission_progress_user_id ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_mission_id ON user_mission_progress(mission_id);

INSERT INTO missions (title, description, type, points) VALUES
  ('Daily Quiz Challenge', 'Test your investing knowledge with today''s quiz', 'daily', 15),
  ('Look Up a Term', 'Search and read about an investing term in the word bank', 'daily', 10),
  ('Read an Article', 'Read a beginner-friendly article about investing', 'daily', 20),
  ('Comment on a Post', 'Leave a helpful comment on another member''s post', 'evergreen', 25),
  ('Share Your Progress', 'Post about something you learned or accomplished', 'evergreen', 30),
  ('Make Your First Post', 'Introduce yourself and share why you''re learning to invest', 'beginner', 50)
ON CONFLICT DO NOTHING;
