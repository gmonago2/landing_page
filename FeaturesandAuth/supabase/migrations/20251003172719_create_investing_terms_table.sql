/*
  # Create investing terms table

  1. New Tables
    - `investing_terms`
      - `id` (uuid, primary key) - Unique identifier for each term
      - `term` (text) - The investing term or jargon word
      - `definition` (text) - Plain English explanation of the term
      - `category` (text) - Category classification (basics, stocks, bonds, etc.)
      - `created_at` (timestamptz) - When the term was added
      - `updated_at` (timestamptz) - When the term was last updated

  2. Security
    - Enable RLS on `investing_terms` table
    - Add policy for authenticated users to read all terms
    - Add policy for service role to manage terms

  3. Data
    - Populate initial set of common investing terms
*/

CREATE TABLE IF NOT EXISTS investing_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  definition text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE investing_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read terms"
  ON investing_terms
  FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO investing_terms (term, definition, category) VALUES
  ('Stock', 'A stock is a small piece of ownership in a company. When you buy a stock, you become a part-owner of that business. If the company does well, your stock can become more valuable.', 'basics'),
  ('Bond', 'A bond is like an IOU from a company or government. When you buy a bond, you''re lending them money. They promise to pay you back with interest over time. It''s generally safer than stocks but offers smaller returns.', 'basics'),
  ('Portfolio', 'Your portfolio is simply the collection of all your investments. Think of it as a basket that holds all your stocks, bonds, and other investments together.', 'basics'),
  ('Dividend', 'A dividend is a payment some companies give to their stockholders. It''s like getting a small bonus check just for owning the stock. Not all companies pay dividends.', 'stocks'),
  ('Index Fund', 'An index fund is a type of investment that owns a little bit of many different companies all at once. Instead of picking individual stocks, you buy into the whole group. It''s an easy way to spread out your risk.', 'funds'),
  ('ETF', 'ETF stands for Exchange-Traded Fund. It''s similar to an index fund—you own many companies at once—but you can buy and sell it throughout the day like a regular stock.', 'funds'),
  ('Mutual Fund', 'A mutual fund is a professionally managed collection of stocks and bonds. You pool your money with other investors, and an expert decides what to buy and sell. You typically buy or sell once per day at the end of trading.', 'funds'),
  ('Bull Market', 'A bull market is when stock prices are generally going up over time. People feel optimistic about investing. Think of a bull charging forward—that''s the market moving up.', 'market'),
  ('Bear Market', 'A bear market is when stock prices are generally going down over time. People feel pessimistic. Think of a bear swiping down with its paw—that''s the market moving down. These are normal and temporary.', 'market'),
  ('Volatility', 'Volatility describes how much and how quickly prices move up and down. High volatility means big swings—like a roller coaster. Low volatility means steadier, calmer movement.', 'market'),
  ('Asset Allocation', 'Asset allocation is how you divide your money between different types of investments like stocks, bonds, and cash. It''s about balancing risk and potential reward based on your goals and timeline.', 'strategy'),
  ('Diversification', 'Diversification means spreading your money across many different investments instead of putting everything into one place. It''s the "don''t put all your eggs in one basket" approach to reduce risk.', 'strategy'),
  ('Risk Tolerance', 'Your risk tolerance is how comfortable you are with your investments going up and down in value. Some people can handle the ups and downs, while others prefer steadier, safer choices.', 'basics'),
  ('Compound Interest', 'Compound interest is when your investment earnings start earning money too. It''s like a snowball rolling down a hill, getting bigger and bigger over time. The longer you invest, the more powerful it becomes.', 'basics'),
  ('Capital Gains', 'Capital gains are the profit you make when you sell an investment for more than you paid for it. If you bought a stock for $10 and sold it for $15, your capital gain is $5.', 'basics'),
  ('Recession', 'A recession is a period when the economy shrinks instead of grows. Businesses may struggle, unemployment can rise, and stock prices often fall. They''re temporary and a normal part of economic cycles.', 'market'),
  ('Day Trading', 'Day trading is buying and selling stocks within the same day, trying to profit from small price movements. It''s risky and stressful—not recommended for beginners. Long-term investing is usually smarter.', 'strategy'),
  ('Blue Chip Stock', 'A blue chip stock is a share in a large, well-established, and financially stable company with a history of reliable performance. Think of big names everyone knows. They''re generally considered safer investments.', 'stocks'),
  ('Market Cap', 'Market cap (market capitalization) is the total value of all a company''s shares. You calculate it by multiplying the stock price by the number of shares. It tells you how big the company is.', 'stocks'),
  ('Expense Ratio', 'An expense ratio is the yearly fee you pay to own a mutual fund or ETF, shown as a percentage. For example, a 0.5% expense ratio means you pay $5 per year for every $1,000 invested. Lower is better.', 'funds')
ON CONFLICT DO NOTHING;
