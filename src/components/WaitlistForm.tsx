import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Configure the two target tables via environment variables so both landing pages
// can write into the same Supabase database but different tables.
const WAITLIST_TABLE_A = import.meta.env.VITE_WAITLIST_TABLE || 'waitlist';
const WAITLIST_TABLE_B = import.meta.env.VITE_WAITLIST_V2_TABLE || 'waitlist_v2';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const payload = { email: email.toLowerCase().trim() };

      // Insert into both tables in parallel. We treat unique-constraint (already exists)
      // specially so a duplicate in one table doesn't hide success in the other.
      const [resA, resB] = await Promise.all([
        supabase.from(WAITLIST_TABLE_A).insert([payload]),
        supabase.from(WAITLIST_TABLE_B).insert([payload])
      ]);

      const errA = (resA as any).error;
      const errB = (resB as any).error;

      // Helper to check unique violation (Postgres 23505)
      const isUniqueErr = (e: any) => e && (e.code === '23505' || e.status === 409);

      if ((errA && !isUniqueErr(errA)) || (errB && !isUniqueErr(errB))) {
        // One of the inserts failed for a reason other than duplicate
        console.error('Waitlist insert errors:', { errA, errB });
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        return;
      }

      // If at least one insert succeeded, treat as success.
      const succeededA = !errA || isUniqueErr(errA) === false;
      const succeededB = !errB || isUniqueErr(errB) === false;

      if ((errA && isUniqueErr(errA)) && (errB && isUniqueErr(errB))) {
        setStatus('error');
        setMessage("You're already on both waitlists!");
        return;
      }

      // If here, at least one insert succeeded (or both succeeded)
      setStatus('success');
      setMessage("You're on the list! We'll be in touch soon.");
      setEmail('');

      // Log outcomes for diagnostic purposes
      console.log('Waitlist inserts:', { tableA: WAITLIST_TABLE_A, resA, tableB: WAITLIST_TABLE_B, resB });
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Waitlist error:', error);
    }
  };

  return (
  <section className="py-20 bg-sand">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            Join the "Money Moves" waitlist
          </h2>
          <p className="text-base text-gray-700">
            Bite-sized investing lessons, friendly nudges, and real steps to help your money work for you.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === 'loading' || status === 'success'}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#457B9D] focus:outline-none focus:ring-2 focus:ring-[#457B9D]/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {message && (
              <div className={`flex items-start gap-3 p-4 rounded-xl ${
                  status === 'success'
                    ? 'bg-mint/10 text-mint'
                    : 'bg-red-50 text-red-600'
                }`}>
                {status === 'success' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <p className="font-medium">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-3 px-6 bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow hover:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? 'Welcome aboard 🎉' : "Get early access"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            No spam, ever. We respect your inbox as much as we respect your investment journey.
          </p>
        </div>
      </div>
    </section>
  );
}
