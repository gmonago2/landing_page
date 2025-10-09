import { TrendingUp } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#f4e98c] text-gray-900 py-12 border-t-4 border-[#87ae73]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8 text-[#457B9D]" />
            <span className="text-2xl font-black">First Shares</span>
          </div>
          <p className="text-gray-800 mb-2 font-bold text-lg">
            Money Moves, Made Simple
          </p>
          <p className="text-gray-700 text-sm font-medium">
            Making investing approachable for the next generation.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-[#87ae73] text-center text-gray-700 text-sm font-medium">
          © {new Date().getFullYear()} First Shares. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
