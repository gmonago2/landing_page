/*
  # Create FAQ and chat support tables

  1. New Tables
    - `faq_items`
      - `id` (uuid, primary key) - Unique identifier
      - `question` (text) - FAQ question
      - `answer` (text) - FAQ answer
      - `category` (text) - Category: 'fear', 'confidence', 'getting_started', 'mistakes'
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz) - When item was created

    - `chat_messages`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth.users
      - `message` (text) - User message
      - `response` (text) - Bot response
      - `created_at` (timestamptz) - When message was sent

  2. Security
    - Enable RLS on both tables
    - Anyone can read FAQ items (they're public)
    - Users can only read their own chat messages
    - Users can create their own chat messages

  3. Indexes
    - Index on category and order for FAQ items
    - Index on user_id and created_at for chat messages

  4. Initial Data
    - Populate with common FAQ items
*/

CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL CHECK (category IN ('fear', 'confidence', 'getting_started', 'mistakes')),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read FAQ items"
  ON faq_items
  FOR SELECT
  USING (true);

CREATE POLICY "Users can read own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category, order_index);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON chat_messages(user_id, created_at DESC);

INSERT INTO faq_items (question, answer, category, order_index) VALUES
  (
    'What if I lose all my money?',
    'This is one of the most common fears, and it''s completely valid. Here''s the reality: with diversified investments like index funds, you''re spreading your risk across hundreds or thousands of companies. For you to "lose everything," every single one would need to fail simultaneously, which has never happened in history. Even during the 2008 financial crisis, diversified portfolios eventually recovered. The key is diversification, long-term thinking, and only investing money you won''t need immediately.',
    'fear',
    1
  ),
  (
    'Am I too late to start investing?',
    'Absolutely not! Whether you''re 25 or 55, the best time to start is now. Yes, starting earlier gives you more time for compound growth, but starting today is always better than starting tomorrow. Many successful investors started later in life. The important thing is to start with what you have, even if it''s small amounts, and be consistent.',
    'fear',
    2
  ),
  (
    'What if I make a huge mistake?',
    'First, everyone makes mistakes—even experienced investors. The good news is that most investing mistakes are recoverable. Start small, learn as you go, and avoid putting all your money into one investment. Common beginner mistakes like panic selling or not diversifying are lessons that help you grow. Remember: you''re learning a skill, and skills take practice.',
    'fear',
    3
  ),
  (
    'How do I know if I''m making the right decision?',
    'There''s rarely one "right" decision in investing. Instead, focus on making informed decisions based on your goals, risk tolerance, and timeline. Start with simple, diversified investments like index funds. Avoid decisions based on fear or excitement. If you''re unsure, starting with small amounts while you learn is perfectly fine. Progress over perfection.',
    'confidence',
    1
  ),
  (
    'I don''t understand the terminology. Does that mean I''m not ready?',
    'Not at all! Everyone starts without knowing the terminology. The fact that you''re aware of this and seeking to learn shows you''re on the right path. You don''t need to understand everything before starting. Learn key concepts gradually: stocks, bonds, diversification, and index funds are great starting points. This platform is designed to help you learn the jargon as you go.',
    'confidence',
    2
  ),
  (
    'What if people judge me for asking "stupid" questions?',
    'There are no stupid questions in investing—only questions that haven''t been asked yet. Everyone started exactly where you are. The smartest investors are the ones who keep asking questions. This community is specifically designed to be a judgment-free space for beginners. We''re all learning together.',
    'confidence',
    3
  ),
  (
    'How much money do I need to start?',
    'You can start with as little as $10-50 per month with many modern investing platforms. You don''t need thousands of dollars to begin. What matters more is consistency and developing the habit. Starting small lets you learn without risking large amounts while you build confidence.',
    'getting_started',
    1
  ),
  (
    'Should I pay off debt first or start investing?',
    'Generally, prioritize high-interest debt (like credit cards) before investing. However, if your employer offers a 401(k) match, contribute enough to get that match—it''s free money. For low-interest debt (like mortgages), you can often do both: pay it down while also investing. Every situation is unique to your interest rates and financial goals.',
    'getting_started',
    2
  ),
  (
    'What''s the difference between a stock and a bond?',
    'A stock is a piece of ownership in a company. When you buy stock, you own a tiny portion of that company and benefit when it grows. A bond is like a loan you give to a company or government. They pay you interest over time and return your principal when the bond matures. Stocks are generally riskier but offer higher potential returns; bonds are more stable but offer lower returns.',
    'getting_started',
    3
  ),
  (
    'How do I avoid common beginner mistakes?',
    'Key tips: 1) Diversify—don''t put all your money in one stock. 2) Think long-term—don''t panic sell when the market dips. 3) Start with simple investments like index funds. 4) Invest regularly, not based on market timing. 5) Only invest money you won''t need for 5+ years. 6) Keep learning, but don''t let fear of mistakes stop you from starting.',
    'mistakes',
    1
  ),
  (
    'Should I try to time the market?',
    'No. Even professional investors struggle to time the market consistently. Research shows that time IN the market beats timing the market. Instead of waiting for the "perfect" moment, invest regularly regardless of market conditions (this is called dollar-cost averaging). You''ll buy some shares when prices are high and some when they''re low, averaging out over time.',
    'mistakes',
    2
  ),
  (
    'Is investing just gambling?',
    'No, though it can feel similar when you''re starting. Gambling is based on chance with odds against you. Investing is based on owning pieces of real businesses that create value over time. Historically, the stock market has grown over long periods despite short-term ups and downs. The key differences: diversification, time horizon, and owning assets that produce value.',
    'mistakes',
    3
  );
