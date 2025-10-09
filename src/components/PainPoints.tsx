import { AlertCircle, HelpCircle, Frown } from 'lucide-react';

const painPoints = [
  {
    icon: HelpCircle,
    problem: 'What does P/E ratio even mean?',
    solution: 'Short explainer: it compares price to earnings — we show what it actually tells you, in plain terms.',
    iconBg: 'bg-gold',
    iconColor: 'text-gray-800'
  },
  {
    icon: AlertCircle,
    problem: 'So much conflicting advice',
    solution: 'We teach principles, not hot takes — so you can make choices that fit your life and goals.',
    iconBg: 'bg-brand',
    iconColor: 'text-white'
  },
  {
    icon: Frown,
    problem: 'I\'m scared I\'ll lose everything',
    solution: 'We help you understand risk, set realistic expectations, and invest with confidence instead of fear.',
    iconBg: 'bg-[#87ae73]',
    iconColor: 'text-white'
  }
];

export function PainPoints() {
  return (
    <section className="py-20 bg-sand relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-mint/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand/10 rounded-full blur-3xl"></div>
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#457B9D]">
            Sound Familiar?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These are the real struggles new investors face. Here's how we solve them.
          </p>
        </div>

        <div className="space-y-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#457B9D]/30"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-full ${point.iconBg} flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-10 h-10 ${point.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#457B9D] uppercase tracking-wide mb-2">
                          The Problem
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          "{point.problem}"
                        </p>
                      </div>
                      <div className="hidden md:block w-1 h-16 bg-brand rounded-full" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#87ae73] uppercase tracking-wide mb-2">
                          Our Solution
                        </div>
                        <p className="text-gray-700 font-medium">
                          {point.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
