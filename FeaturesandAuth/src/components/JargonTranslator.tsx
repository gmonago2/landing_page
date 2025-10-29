import React, { useState } from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';
import { WordBank } from './WordBank';
import { ConceptFinder } from './ConceptFinder';

type Tab = 'wordbank' | 'chatbot';

export function JargonTranslator() {
  const [activeTab, setActiveTab] = useState<Tab>('wordbank');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 bg-gradient-to-r from-brand-cream/30 to-white">
          <div className="flex">
            <button
              onClick={() => setActiveTab('wordbank')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-semibold transition-all duration-300 ${
                activeTab === 'wordbank'
                  ? 'bg-white text-brand-blue border-b-4 border-brand-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Word Bank</span>
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 font-semibold transition-all duration-300 ${
                activeTab === 'chatbot'
                  ? 'bg-white text-brand-blue border-b-4 border-brand-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Concept Finder</span>
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'wordbank' && <WordBank />}
          {activeTab === 'chatbot' && <ConceptFinder />}
        </div>
      </div>
    </div>
  );
}
