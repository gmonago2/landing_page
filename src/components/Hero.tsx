import { TrendingUp } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#457B9D]/20 via-[#f4e98c]/10 to-[#87ae73]/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#87ae73]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#457B9D]/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Stocks, Explained in<br />
            <span className="bg-gradient-to-r from-[#457B9D] to-[#87ae73] bg-clip-text text-transparent">Plain English</span>
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
