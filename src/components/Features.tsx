import { BookOpen, Heart, Brain, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Bite-Sized Lessons',
    description: 'Learn investing in 5-minute chunks. No overwhelming textbooks or boring lectures—just quick, easy explanations.',
    color: 'bg-[#457B9D]',
    bgColor: 'bg-[#457B9D]/5',
    borderColor: 'border-[#457B9D]'
  },
  {
    icon: Heart,
    title: 'Zero Judgment Zone',
    description: 'Ask anything. We get it—everyone starts somewhere. No question is too basic, no confusion too simple.',
    color: 'bg-[#87ae73]',
    bgColor: 'bg-[#87ae73]/5',
    borderColor: 'border-[#87ae73]'
  },
  {
    icon: Brain,
    title: 'Build Your Confidence',
    description: 'Learn to trust your own decisions. We teach you how to think like an investor, not just follow hot tips.',
    color: 'bg-[#f4e98c]',
    bgColor: 'bg-[#f4e98c]/20',
    borderColor: 'border-[#f4e98c]'
  },
  {
    icon: Sparkles,
    title: 'Start Small, Dream Big',
    description: 'You don\'t need thousands to start. We\'ll show you how to begin with whatever you have right now.',
    color: 'bg-[#457B9D]',
    bgColor: 'bg-white',
    borderColor: 'border-[#87ae73]'
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[#eae6e3]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Why First Shares?
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            We built this for people like you—curious, ready to learn, but tired of feeling lost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group p-8 rounded-2xl ${feature.bgColor} border-4 ${feature.borderColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <Icon className={`w-10 h-10 ${index === 2 ? 'text-gray-800' : 'text-white'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
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
