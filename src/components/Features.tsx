import { BookOpen, Heart, Brain, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'No More Jargon',
    description: 'We translate complex market terms into everyday language you actually understand. No finance degree required.'
  },
  {
    icon: Heart,
    title: 'Emotional Support',
    description: 'Investing can feel overwhelming. We provide the reassurance and guidance you need to stay confident through market ups and downs.'
  },
  {
    icon: Brain,
    title: 'Learn How to Think',
    description: 'Instead of just telling you what to buy, we teach you how to analyze and make informed decisions on your own.'
  },
  {
    icon: Sparkles,
    title: 'Built for Beginners',
    description: 'Whether you\'re 18 or 80, starting your investment journey has never been more accessible and empowering.'
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
                className="group p-8 rounded-2xl bg-gradient-to-br from-[#eae6e3] to-white border border-gray-200 hover:border-[#457B9D]/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-[#457B9D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
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
