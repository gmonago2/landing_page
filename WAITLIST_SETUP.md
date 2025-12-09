# Waitlist Database Setup

## Manual Setup in Supabase Dashboard

Since automatic setup has limitations, follow these steps in your Supabase dashboard:

### 1. Create the Waitlist Table

Go to the SQL Editor in your Supabase dashboard and run:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

### 2. Enable Row Level Security

```sql
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
```

### 3. Create RLS Policies

**Policy 1 - Allow anyone to join:**
```sql
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  WITH CHECK (true);
```

**Policy 2 - Allow authenticated users to view entries:**
```sql
CREATE POLICY "Authenticated users can view all waitlist entries"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);
```

## Backend Setup

The waitlist form automatically connects to your local server (`src/server/index.js`) which now uses Supabase to store data.

### Key Files:
- `src/server/db.js` - Database operations using Supabase client
- `src/server/index.js` - Express API server
- `src/components/WaitlistForm.tsx` - Frontend form component

### Environment Variables:
The following are already set in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public API key

The server will use:
- `SUPABASE_SERVICE_ROLE_KEY` - Must be added to `.env` for backend operations

## Running Locally

1. Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file
2. The local dev server will start the Express API on port 8787
3. Form submissions will POST to `/api/waitlist`
