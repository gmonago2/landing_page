import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InvestingTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export function WordBank() {
  const [terms, setTerms] = useState<InvestingTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('investing_terms')
        .select('*')
        .order('term');

      if (error) throw error;
      setTerms(data || []);
    } catch (error) {
      console.error('Error loading terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(terms.map(t => t.category)))];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Loading terms...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-brand-blue" />
          Plain English Word Bank
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Every confusing term explained in simple language. No more feeling lost when reading about investing.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for a term..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">No terms found. Try a different search.</p>
          </div>
        ) : (
          filteredTerms.map(term => (
            <div
              key={term.id}
              className="bg-gradient-to-br from-brand-cream/20 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
                <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-sm font-medium rounded-full">
                  {term.category}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{term.definition}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
