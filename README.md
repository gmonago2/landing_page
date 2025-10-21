landing_page

Supabase setup (shared DB)
---------------------------

This project uses Supabase for the waitlist. To attach both `landing_page` and
`landing_pagev2` to the same Supabase project (BADM372) and store signups in two
different tables, follow these steps:

1. Create the second table in the same database
	- Run the SQL in `supabase/migrations/20251021120000_create_waitlist_v2_table.sql` in your Supabase SQL editor, or run it with psql against the project's DB.

2. Configure environment variables for each landing page
	- Both projects should point at the same Supabase project via:
	  - VITE_SUPABASE_URL
	  - VITE_SUPABASE_ANON_KEY

	- Configure table names separately so each landing page writes to a different table:
	  - For landing_page (existing): VITE_WAITLIST_TABLE=waitlist
	  - For landing_pagev2: VITE_WAITLIST_TABLE=waitlist_v2

	- Optionally, to support writing to both tables from the same codebase, set both vars:
	  - VITE_WAITLIST_TABLE=waitlist
	  - VITE_WAITLIST_V2_TABLE=waitlist_v2

3. Security notes
	- The migrations create an INSERT policy allowing `anon` to insert rows. Keep SELECT/UPDATE/DELETE restricted.
	- Admin access (service role key) should be used only on servers/tools that need to read or manage data.

4. Local development
	- Add a `.env.local` file for local dev with the keys above.
	- Restart your dev server after changing env vars.

5. Code
	- `src/components/WaitlistForm.tsx` has been updated to insert into two tables (configurable via env vars) so you can write to both tables as needed.

