import { BookOpen, Heart, Brain, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'No More Jargon',
    description: 'We translate complex market terms into everyday language you actually understand. No finance degree required.',
    color: 'bg-[#457B9D]',
    bgGradient: 'from-[#457B9D]/10 to-white'
  },
  {
    icon: Heart,
    title: 'Emotional Support',
    description: 'Investing can feel overwhelming. We provide the reassurance and guidance you need to stay confident through market ups and downs.',
    color: 'bg-[#87ae73]',
    bgGradient: 'from-[#87ae73]/10 to-white'
  },
  {
    icon: Brain,
    title: 'Learn How to Think',
    description: 'Instead of just telling you what to buy, we teach you how to analyze and make informed decisions on your own.',
    color: 'bg-[#f4e98c]',
    bgGradient: 'from-[#f4e98c]/20 to-white'
  },
  {
    icon: Sparkles,
    title: 'Built for Beginners',
    description: 'Whether you\'re 18 or 80, starting your investment journey has never been more accessible and empowering.',
    color: 'bg-gradient-to-br from-[#457B9D] to-[#87ae73]',
    bgGradient: 'from-[#eae6e3] to-white'
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
                className={`group p-8 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border-2 border-gray-200 hover:border-[#457B9D] hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon className={`w-8 h-8 ${index === 2 ? 'text-gray-800' : 'text-white'}`} />
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
