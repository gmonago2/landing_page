export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#f4e98c]">
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-block bg-[#457B9D] text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
            💰 Money Moves, Made Simple
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Your First Shares,<br />
            <span className="text-[#457B9D]">Made Easy</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            No boring jargon. No confusing charts. Just bite-sized investing lessons that actually make sense.
          </p>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
            Whether you're making your first trade or just curious about stocks, we're here to help you learn without the stress.
          </p>
        </div>
      </div>
    </section>
  );
}
