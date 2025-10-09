import { BookOpen, Heart, Brain, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'No More Jargon',
    description: 'Clear explanations that actually stick — no finance degree required.',
    color: 'bg-brand',
    bg: 'bg-sand'
  },
  {
    icon: Heart,
    title: 'Stress-free Starts',
    description: 'Tiny, actionable steps to get you started — and keep you going, even when the market feels noisy.',
    color: 'bg-mint',
    bg: 'bg-sand'
  },
  {
    icon: Brain,
    title: 'Think Like an Investor',
    description: 'Short lessons that teach you how to evaluate ideas yourself — not just copy tips from the internet.',
    color: 'bg-gold',
    bg: 'bg-sand'
  },
  {
    icon: Sparkles,
    title: 'Made for First-timers',
    description: 'Tools and tips designed for people who want to learn without pressure. Start small — win big over time.',
    color: 'bg-brand',
    bg: 'bg-sand'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Investing Feels So Hard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The stock market is full of confusing terms, conflicting advice, and fear. We're here to change that.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group p-8 rounded-2xl ${feature.bg} border-2 border-gray-100 hover:border-brand hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md text-white`}>
                  <Icon className={`w-8 h-8 ${index === 2 ? 'text-gray-800' : 'text-white'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: index === 0 ? '#457B9D' : index === 1 ? '#87ae73' : index === 2 ? '#f4e98c' : '#457B9D' }} />
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
