import { AlertCircle, HelpCircle, Frown } from 'lucide-react';

const painPoints = [
  {
    icon: HelpCircle,
    problem: 'What does P/E ratio even mean?',
    solution: 'We break it down: it\'s just comparing a stock\'s price to how much money the company makes. Simple.'
  },
  {
    icon: AlertCircle,
    problem: 'Everyone says different things',
    solution: 'We teach you principles, not predictions—so you can filter noise and make your own choices.'
  },
  {
    icon: Frown,
    problem: 'I\'m scared I\'ll lose everything',
    solution: 'We help you understand risk, set realistic expectations, and invest with confidence instead of fear.'
  }
];

export function PainPoints() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#457B9D]/5 to-[#87ae73]/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#f4e98c] flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#457B9D]" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#457B9D] uppercase tracking-wide mb-2">
                          The Problem
                        </div>
                        <p className="text-lg font-medium text-gray-900">
                          "{point.problem}"
                        </p>
                      </div>
                      <div className="hidden md:block w-px h-12 bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#87ae73] uppercase tracking-wide mb-2">
                          Our Solution
                        </div>
                        <p className="text-gray-700">
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
