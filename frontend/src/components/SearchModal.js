import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save to recent searches
  const saveToRecentSearches = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter(item => item !== trimmed)
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleQuickSearch = (query) => {
    saveToRecentSearches(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the input when modal opens
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const trendingSearches = [
    'luxury watches',
    'sustainable fashion',
    'wellness retreats',
    'premium tech',
    'travel destinations',
    'grooming essentials'
  ];

  const quickCategories = [
    { name: 'Style', icon: '👔' },
    { name: 'Tech', icon: '📱' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Watches', icon: '⌚' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="p-6 border-b border-gray-200">
                <form onSubmit={handleSearch} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search articles, authors, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none text-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </form>
              </div>

              {/* Search Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {/* Quick Categories */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Categories</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleQuickSearch(category.name.toLowerCase())}
                        className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gold-50 rounded-xl transition-colors text-left"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSearch(search)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                        >
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Searches
                  </h3>
                  <div className="space-y-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                      >
                        <TrendingUp className="h-4 w-4 text-red-500" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd> to search</span>
                    <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd> to close</span>
                  </div>
                  <div className="font-medium text-gold-600">
                    Search our premium content library
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;