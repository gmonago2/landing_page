import { TrendingUp } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#457B9D]/5 via-[#eae6e3] to-[#87ae73]/5"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#457B9D]/20 mb-8">
            <TrendingUp className="w-4 h-4 text-[#457B9D]" />
            <span className="text-sm font-medium text-[#457B9D]">Cut through the Jargon</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Stocks, Explained in<br />
            <span className="text-[#457B9D]">Plain English</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            We make the stock market beginner-friendly by stripping away confusing jargon and providing emotional support for new investors.
          </p>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Instead of telling you what to buy, we teach you how to think—so you can approach investing with clarity, calm, and confidence, no matter your age or background.
          </p>
        </div>
      </div>
    </section>
  );
}
