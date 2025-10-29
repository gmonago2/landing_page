/*
  # Create investment plans table

  1. New Tables
    - `investment_plans`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth.users
      - `monthly_investment` (decimal) - Amount user can invest monthly
      - `goal_5_years` (decimal) - Target portfolio value in 5 years
      - `goal_10_years` (decimal) - Target portfolio value in 10 years
      - `risk_tolerance` (text) - Risk level: 'conservative', 'moderate', or 'aggressive'
      - `investment_experience` (text) - Experience level
      - `time_horizon` (text) - Investment timeline preference
      - `esg_important` (boolean) - Whether ESG factors matter
      - `esg_causes_support` (text[]) - Causes user supports
      - `esg_causes_avoid` (text[]) - Causes user wants to avoid
      - `investment_focus` (text) - Focus area: 'domestic', 'international', or 'balanced'
      - `recommended_strategy` (text) - Generated strategy recommendation
      - `created_at` (timestamptz) - When plan was created
      - `updated_at` (timestamptz) - When plan was last updated

  2. Security
    - Enable RLS on investment_plans table
    - Users can only read and modify their own plans
    - One plan per user (enforced by unique constraint)

  3. Indexes
    - Index on user_id for fast lookups
    - Unique constraint on user_id to ensure one plan per user
*/

CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  monthly_investment decimal(10, 2) DEFAULT 0,
  goal_5_years decimal(12, 2),
  goal_10_years decimal(12, 2),
  risk_tolerance text CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  investment_experience text,
  time_horizon text,
  esg_important boolean DEFAULT false,
  esg_causes_support text[] DEFAULT '{}',
  esg_causes_avoid text[] DEFAULT '{}',
  investment_focus text CHECK (investment_focus IN ('domestic', 'international', 'balanced')),
  recommended_strategy text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own investment plan"
  ON investment_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investment plan"
  ON investment_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investment plan"
  ON investment_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_investment_plans_user_id ON investment_plans(user_id);
