import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.toLowerCase().trim() }]);

      if (error) {
        if (error.code === '23505') {
          setStatus('error');
          setMessage("You're already on the waitlist!");
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage('Welcome aboard! We\'ll be in touch soon.');
        setEmail('');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      console.error('Waitlist error:', error);
    }
  };

  return (
    <section className="py-24 bg-[#eae6e3]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Invest with Confidence?
          </h2>
          <p className="text-xl text-gray-700">
            Join our waitlist and be the first to experience stress-free investing.
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
                  ? 'bg-[#87ae73]/10 text-[#87ae73]'
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
              className="w-full py-4 px-8 bg-[#457B9D] hover:bg-[#457B9D]/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none text-lg"
            >
              {status === 'loading' ? 'Joining...' : status === 'success' ? 'You\'re on the list!' : 'Join the Waitlist'}
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
