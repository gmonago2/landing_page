import { TrendingUp } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-[#87ae73]" />
            <span className="text-xl font-bold">First Shares</span>
          </div>
          <p className="text-gray-400 mb-2">
            Cut through the Jargon: Stocks, Explained in Plain English
          </p>
          <p className="text-gray-500 text-sm">
            Making investing accessible for everyone, everywhere.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} First Shares. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
