import { AlertCircle, HelpCircle, Frown } from 'lucide-react';

const painPoints = [
  {
    icon: HelpCircle,
    problem: '"Wait, what even is a stock?"',
    solution: 'We start from the absolute basics. No assumptions, no fancy words—just real talk about how this stuff works.',
    iconBg: 'bg-[#f4e98c]',
    iconColor: 'text-gray-800',
    cardBg: 'bg-white',
    borderColor: 'border-[#f4e98c]'
  },
  {
    icon: AlertCircle,
    problem: '"Everyone has different advice..."',
    solution: 'Forget the noise. We teach you the fundamentals so you can make choices that feel right for YOU.',
    iconBg: 'bg-[#457B9D]',
    iconColor: 'text-white',
    cardBg: 'bg-white',
    borderColor: 'border-[#457B9D]'
  },
  {
    icon: Frown,
    problem: '"What if I mess up and lose money?"',
    solution: 'Real talk: risk exists. But we\'ll help you understand it, manage it, and invest in a way that lets you sleep at night.',
    iconBg: 'bg-[#87ae73]',
    iconColor: 'text-white',
    cardBg: 'bg-white',
    borderColor: 'border-[#87ae73]'
  }
];

export function PainPoints() {
  return (
    <section className="py-24 bg-[#457B9D] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Sound Familiar?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            These are real thoughts from real people. Here's how we help.
          </p>
        </div>

        <div className="space-y-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className={`${point.cardBg} rounded-3xl p-8 shadow-xl border-4 ${point.borderColor} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-24 h-24 rounded-2xl ${point.iconBg} flex items-center justify-center shadow-lg`}>
                      <Icon className={`w-12 h-12 ${point.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                      <div className="flex-1">
                        <div className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                          You Might Be Thinking
                        </div>
                        <p className="text-xl font-bold text-gray-900 mb-2">
                          {point.problem}
                        </p>
                      </div>
                      <div className="hidden md:block w-1 h-20 bg-[#87ae73] rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs font-black text-[#87ae73] uppercase tracking-wider mb-2">
                          Here's The Deal
                        </div>
                        <p className="text-gray-800 font-medium text-lg">
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
