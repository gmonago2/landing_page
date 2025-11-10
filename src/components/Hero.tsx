export function Hero() {
  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // try to focus the email input inside the waitlist section for a smooth UX
      setTimeout(() => {
        const input = el.querySelector('input[type="email"]') as HTMLElement | null;
        if (input) {
          input.focus();
        } else {
          try {
            (el as HTMLElement).focus({ preventScroll: true });
          } catch {}
        }
      }, 350);
    }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#f4e98c]">
      {/* Combined decorative block: blends yellow (hero bg), green, and white into a single gradient shape */}
      <div className="absolute -top-8 right-8 w-64 h-64 rounded-3xl rotate-12 bg-gradient-to-br from-[#f4e98c] via-[#87ae73] to-white opacity-95 shadow-xl"></div>
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-[#457B9D] rounded-full"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="inline-block bg-[#457B9D] text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
            Learn by doing — not by guessing
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Invest with confidence —
            <br />
            <span className="text-[#457B9D]">step-by-step and stress-free</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Bite-sized lessons, real examples, and tools that help you make your first moves in the market without the jargon.
          </p>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
            Built for beginners and busy people — learn at your pace and start building confidence with small, guided steps.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={scrollToWaitlist}
              className="py-4 px-8 bg-[#457B9D] hover:bg-[#457B9D]/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg text-lg"
              aria-label="Join the waitlist"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
