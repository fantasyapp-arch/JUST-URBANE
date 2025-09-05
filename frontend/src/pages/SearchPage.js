import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Clock, TrendingUp, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { useArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // all, premium, free
  const [sortBy, setSortBy] = useState('relevance'); // relevance, newest, popular

  const { data: articles = [], isLoading } = useArticles({ limit: 100 });
  const { data: categories = [] } = useCategories();

  // Update search params when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Search and filter logic
  const searchResults = useMemo(() => {
    if (!articles.length) return [];

    let filtered = articles;

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => {
        return (
          article.title.toLowerCase().includes(query) ||
          article.dek?.toLowerCase().includes(query) ||
          article.body?.toLowerCase().includes(query) ||
          article.author_name?.toLowerCase().includes(query) ||
          article.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          article.category?.toLowerCase().includes(query)
        );
      });
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Apply content type filter
    if (selectedType === 'premium') {
      filtered = filtered.filter(article => article.is_premium);
    } else if (selectedType === 'free') {
      filtered = filtered.filter(article => !article.is_premium);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        break;
      case 'popular':
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      case 'relevance':
      default:
        // For relevance, we could implement a more sophisticated scoring system
        // For now, we'll prioritize trending and featured articles, then by views
        filtered.sort((a, b) => {
          const scoreA = (a.is_trending ? 100 : 0) + (a.is_featured ? 50 : 0) + (a.view_count / 100);
          const scoreB = (b.is_trending ? 100 : 0) + (b.is_featured ? 50 : 0) + (b.view_count / 100);
          return scoreB - scoreA;
        });
        break;
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory, selectedType, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all' || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-4">
                Search Just Urbane
              </h1>
              <p className="text-gray-600 text-lg">
                Find premium lifestyle content, expert insights, and luxury stories
              </p>
            </div>

            {/* Search Form */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['luxury', 'fashion', 'watches', 'travel', 'tech', 'grooming'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gold-100 text-gray-700 hover:text-gold-700 rounded-full text-sm transition-colors"
                >
                  #{term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              {/* Results Count */}
              {searchQuery && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{searchResults.length}</span> results for "
                  <span className="font-medium">{searchQuery}</span>"
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              >
                <option value="all">All Content</option>
                <option value="premium">Premium Only</option>
                <option value="free">Free Articles</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-gold-600 hover:text-gold-700 text-sm font-medium"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-12">
        {!searchQuery && !hasActiveFilters ? (
          /* Empty State - No Search */
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              Start Your Search
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Enter a keyword above to search through our collection of premium lifestyle articles.
            </p>
            
            {/* Popular Categories */}
            <div className="max-w-2xl mx-auto">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Popular Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-200 hover:border-gold-200 transition-all duration-200"
                  >
                    <h5 className="font-medium text-gray-900 group-hover:text-gold-600 transition-colors">
                      {category.name}
                    </h5>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description?.slice(0, 40)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : isLoading ? (
          /* Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          /* Results */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <ArticleCard 
                    article={article} 
                    size={index === 0 ? 'large' : 'medium'}
                    showCategory={true}
                  />
                </motion.div>
              ))}
            </div>

            {/* Search Tips */}
            {searchQuery && (
              <motion.div 
                className="mt-16 bg-white rounded-2xl p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h4 className="font-serif text-xl font-semibold text-primary-900 mb-4">
                  Search Tips
                </h4>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Keywords</h5>
                      <p className="text-gray-600">Search by title, content, or author name</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Categories</h5>
                      <p className="text-gray-600">Filter by style, tech, travel, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gold-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Authors</h5>
                      <p className="text-gray-600">Find articles by your favorite writers</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* No Results */
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-6xl mb-6">😔</div>
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              No Results Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `We couldn't find any articles matching "${searchQuery}". Try different keywords or browse our categories.`
                : "No articles match your current filters. Try adjusting your search criteria."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  clearFilters();
                }}
                className="btn-secondary"
              >
                Clear Search
              </button>
              <Link to="/" className="btn-primary">
                Browse All Articles
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Trending Searches */}
      {!searchQuery && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="section-title mb-8">Trending Searches</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['sustainable fashion', 'luxury watches', 'wellness retreats', 'premium tech', 'travel destinations', 'grooming essentials'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="bg-gradient-to-r from-gold-100 to-gold-200 hover:from-gold-200 hover:to-gold-300 text-gold-800 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;