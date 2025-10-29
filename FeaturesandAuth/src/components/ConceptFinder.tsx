import React, { useState } from 'react';
import { Send, MessageCircle, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
}

interface MatchedConcept {
  term: string;
  definition: string;
  category: string;
}

export function ConceptFinder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! Describe what you're thinking about in your own words, and I'll help you find the right investing concept with a clear explanation."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const findMatchingConcept = async (userInput: string): Promise<MatchedConcept | null> => {
    try {
      const { data, error } = await supabase
        .from('investing_terms')
        .select('*');

      if (error) throw error;

      const terms = data || [];
      const lowerInput = userInput.toLowerCase();

      const scoredTerms = terms.map(term => {
        let score = 0;
        const lowerTerm = term.term.toLowerCase();
        const lowerDef = term.definition.toLowerCase();

        if (lowerTerm.includes(lowerInput) || lowerInput.includes(lowerTerm)) {
          score += 10;
        }

        const inputWords = lowerInput.split(/\s+/).filter(w => w.length > 3);
        inputWords.forEach(word => {
          if (lowerTerm.includes(word)) score += 3;
          if (lowerDef.includes(word)) score += 1;
        });

        return { ...term, score };
      });

      scoredTerms.sort((a, b) => b.score - a.score);

      if (scoredTerms[0]?.score > 0) {
        return {
          term: scoredTerms[0].term,
          definition: scoredTerms[0].definition,
          category: scoredTerms[0].category
        };
      }

      return null;
    } catch (error) {
      console.error('Error finding concept:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const concept = await findMatchingConcept(input);

    let botResponse: string;
    if (concept) {
      botResponse = `I think you might be asking about **${concept.term}**.\n\n${concept.definition}\n\n*Category: ${concept.category}*`;
    } else {
      botResponse = "I'm not quite sure what concept you're looking for. Could you try describing it in different words? For example, you might mention what you want to do with your money or what you're trying to understand.";
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse
    };

    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-brand-blue" />
          Smart Concept Finder
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Describe what you're thinking about in your own words, and we'll help you find the right investing concept with a clear explanation.
        </p>
      </div>

      <div className="flex-1 bg-gradient-to-br from-brand-cream/20 to-white border border-gray-200 rounded-xl p-6 overflow-y-auto mb-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                message.type === 'user'
                  ? 'bg-brand-blue text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {message.type === 'bot' && (
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-brand-yellow" />
                  <span className="text-xs font-semibold text-brand-blue">Concept Finder</span>
                </div>
              )}
              <p className="whitespace-pre-line leading-relaxed">
                {message.content.split('**').map((part, i) =>
                  i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                )}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., 'I want to own a piece of a company' or 'buying and selling quickly'"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-brand-blue text-white rounded-lg font-medium hover:bg-brand-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Send
        </button>
      </form>
    </div>
  );
}
