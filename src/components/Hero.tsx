import { TrendingUp } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-24 pb-28 overflow-hidden bg-sand">
      <div className="absolute top-16 left-8 w-64 h-64 bg-mint/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-16 right-8 w-80 h-80 bg-brand/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Money Moves, Made Simple
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
            Bite-sized investing tips and friendly explainers for people 18–35. No jargon, just the stuff that helps you start — and keep going.
          </p>

          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-10">
            Learn in minutes. Build confidence. Take small, low-pressure steps that grow into smart money habits.
          </p>
        </div>
      </div>
    </section>
  );
}
