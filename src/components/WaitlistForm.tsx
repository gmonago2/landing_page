import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TARGET_TABLE = import.meta.env.VITE_WAITLIST_TABLE || 'waitlist';

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
      const { error } = await supabase.from(TARGET_TABLE).insert([payload]);

      // Treat unique-constraint (duplicate) errors as success (Postgres 23505) or 409 status
      if (error) {
        const isDuplicate = error.code === '23505' || error.status === 409;
        if (isDuplicate) {
          setStatus('success');
          setMessage("You're already on the list — thanks!");
          setEmail('');
          return;
        }

        // other errors
        console.error('Waitlist insert error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
        return;
      }

      setStatus('success');
      setMessage("You're on the list! We'll be in touch soon.");
      setEmail('');
    } catch (err) {
      console.error('Waitlist submit caught error:', err);
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
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

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-brand">
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
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {message && (
              <div className={`flex items-start gap-3 p-4 rounded-xl ${
                status === 'success' ? 'bg-mint/10 text-mint' : 'bg-red-50 text-red-600'
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
              className="w-full py-3 px-6 bg-brand hover:bg-brand/90 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? "Welcome aboard 🎉" : 'Get early access'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Zero spam. We only send the good stuff. Promise. ✌️
          </p>
        </div>
      </div>
    </section>
  );
}

export default WaitlistForm;
