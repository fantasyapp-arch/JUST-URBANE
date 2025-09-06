import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, ArrowUpRight, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArticles } from '../hooks/useArticles';
import { formatDateShort } from '../utils/formatters';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // Fetch articles for real-time search
  const { data: articles = [], isLoading } = useArticles({ limit: 50 });

  // Real-time search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !articles.length) return [];

    const query = searchQuery.toLowerCase();
    return articles.filter(article => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.dek?.toLowerCase().includes(query) ||
        article.body?.toLowerCase().includes(query) ||
        article.author_name?.toLowerCase().includes(query) ||
        article.category?.toLowerCase().includes(query)
      );
    }).slice(0, 6); // Show top 6 results
  }, [articles, searchQuery]);

  // Get article route helper
  const getArticleRoute = (article) => {
    const slug = article.slug;
    if (slug === 'atlantis-the-palm-dubai') return '/atlantis-the-palm-dubai';
    if (slug === 'celini-food-review-mumbai') return '/celini-food-review-mumbai';
    if (slug === 'scottish-leader-whiskey-review') return '/scottish-leader-whiskey-review';
    if (slug === 'when-in-france-travel-destinations') return '/when-in-france-travel-destinations';
    if (slug === 'sustainable-travel-conscious-guide') return '/sustainable-travel-conscious-guide';
    if (slug === 'perfect-suit-guide-men-corporate-dressing') return '/perfect-suit-guide-men-corporate-dressing';
    if (slug === 'oscars-2022-best-dressed-fashion-red-carpet') return '/oscars-2022-best-dressed-fashion-red-carpet';
    if (slug === 'sunseeker-65-sport-luxury-yacht-review') return '/sunseeker-65-sport-luxury-yacht-review';
    if (slug === 'double-wristing-smartwatch-traditional-watch-trend') return '/double-wristing-smartwatch-traditional-watch-trend';
    if (slug === 'aastha-gill-buzz-queen-bollywood-singer-interview') return '/aastha-gill-buzz-queen-bollywood-singer-interview';
    return `/article/${slug}`;
  };

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

  const handleArticleClick = (article) => {
    saveToRecentSearches(article.title);
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

  const popularCategories = [
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Technology', slug: 'technology' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Luxury', slug: 'luxury' },
    { name: 'People', slug: 'people' },
    { name: 'Food', slug: 'food' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-white w-full max-w-3xl mx-4 rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif font-bold text-gray-900">Search Just Urbane</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="search-input"
                      type="text"
                      placeholder="Search articles, authors, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-lg bg-gray-50 hover:bg-white transition-colors"
                    />
                  </div>
                </form>
              </div>

              {/* Search Content */}
              <div className="max-h-96 overflow-y-auto">
                {/* Real-time Search Results */}
                {searchQuery.trim() && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Search Results
                      </h3>
                      {searchResults.length > 0 && (
                        <button
                          onClick={() => {
                            saveToRecentSearches(searchQuery);
                            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                            onClose();
                          }}
                          className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                        >
                          View all results
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex gap-3">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-3">
                        {searchResults.map((article) => (
                          <Link
                            key={article.id}
                            to={getArticleRoute(article)}
                            onClick={() => handleArticleClick(article)}
                            className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                          >
                            <img
                              src={article.hero_image}
                              alt={article.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {article.author_name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDateShort(article.published_at)}
                                </span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs capitalize">
                                  {article.category}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <Search className="h-8 w-8 mx-auto" />
                        </div>
                        <p className="text-gray-600">No articles found for "{searchQuery}"</p>
                        <p className="text-sm text-gray-500 mt-1">Try different keywords or browse categories below</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Categories - Only show when not searching */}
                {!searchQuery.trim() && (
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Browse Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {popularCategories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/category/${category.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches - Only show when not searching */}
                {!searchQuery.trim() && recentSearches.length > 0 && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSearch(search)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">{search}</span>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches - Only show when not searching */}
                {!searchQuery.trim() && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Trending Searches
                    </h3>
                    <div className="space-y-2">
                      {trendingSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickSearch(search)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-4 w-4 text-red-500" />
                            <span className="text-gray-700 font-medium">{search}</span>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;