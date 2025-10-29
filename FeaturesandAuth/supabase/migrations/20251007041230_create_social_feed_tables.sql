/*
  # Create social feed tables for posts and comments

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth.users
      - `content` (text) - Post content
      - `post_type` (text) - Type: 'milestone', 'story', 'question', 'celebration'
      - `created_at` (timestamptz) - When post was created
      - `updated_at` (timestamptz) - When post was last updated

    - `comments`
      - `id` (uuid, primary key) - Unique identifier
      - `post_id` (uuid) - Reference to posts table
      - `user_id` (uuid) - Reference to auth.users
      - `content` (text) - Comment content
      - `created_at` (timestamptz) - When comment was created

  2. Security
    - Enable RLS on both tables
    - All authenticated users can read all posts and comments
    - Users can create posts and comments
    - Users can only update/delete their own posts and comments

  3. Indexes
    - Index on post_id for fast comment lookups
    - Index on user_id for user content lookups
    - Index on created_at for chronological ordering

  4. Functions
    - Function to get post with comment count
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  post_type text DEFAULT 'story' CHECK (post_type IN ('milestone', 'story', 'question', 'celebration')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
