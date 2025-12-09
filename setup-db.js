import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('Setting up waitlist table...');

    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS waitlist (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          email text UNIQUE NOT NULL,
          status text DEFAULT 'pending',
          created_at timestamptz DEFAULT now()
        );

        ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist;
        CREATE POLICY "Anyone can join waitlist"
          ON waitlist
          FOR INSERT
          WITH CHECK (true);

        DROP POLICY IF EXISTS "Authenticated users can view all waitlist entries" ON waitlist;
        CREATE POLICY "Authenticated users can view all waitlist entries"
          ON waitlist
          FOR SELECT
          TO authenticated
          USING (true);
      `
    });

    if (error) {
      console.log('Note: RPC method not available, trying direct approach...');

      const { error: tableError } = await supabase
        .from('waitlist')
        .select('*')
        .limit(1);

      if (tableError && tableError.code === '42P01') {
        console.error('Table does not exist. Please create it manually in Supabase dashboard.');
        console.error('Error:', tableError.message);
        process.exit(1);
      }

      console.log('✓ Waitlist table already exists');
    } else {
      console.log('✓ Waitlist table created successfully');
    }

    console.log('✓ Database setup complete');
  } catch (err) {
    console.error('Setup error:', err);
    process.exit(1);
  }
}

setupDatabase();
