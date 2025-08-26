import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SortAsc, SortDesc, Calendar, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import NewsletterSignup from '../components/NewsletterSignup';
import { useCategoryArticles } from '../hooks/useArticles';
import { useCategories } from '../hooks/useCategories';

const CategoryPage = () => {
  const { slug } = useParams();
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular, trending
  const [filterBy, setFilterBy] = useState('all'); // all, premium, free, trending
  const [searchQuery, setSearchQuery] = useState('');

  const { data: articles = [], isLoading, error } = useCategoryArticles(slug, { limit: 50 });
  const { data: categories = [] } = useCategories();

  const currentCategory = categories.find(cat => cat.slug === slug);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    if (!articles.length) return [];

    let filtered = articles;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.dek?.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply content filters
    switch (filterBy) {
      case 'premium':
        filtered = filtered.filter(article => article.is_premium);
        break;
      case 'free':
        filtered = filtered.filter(article => !article.is_premium);
        break;
      case 'trending':
        filtered = filtered.filter(article => article.is_trending);
        break;
      default:
        // 'all' - no filter
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
        break;
      case 'popular':
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      case 'trending':
        filtered.sort((a, b) => {
          if (a.is_trending && !b.is_trending) return -1;
          if (!a.is_trending && b.is_trending) return 1;
          return b.view_count - a.view_count;
        });
        break;
      default: // 'newest'
        filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        break;
    }

    return filtered;
  }, [articles, searchQuery, filterBy, sortBy]);

  const categoryInfo = {
    style: {
      title: 'Style',
      description: 'Timeless fashion, designer insights, and luxury style advice',
      icon: '👔',
      gradient: 'from-purple-600 to-pink-600'
    },
    grooming: {
      title: 'Grooming',
      description: 'Personal care, skincare, and grooming essentials',
      icon: '💅',
      gradient: 'from-blue-600 to-cyan-600'
    },
    culture: {
      title: 'Culture',
      description: 'Arts, music, literature, and cultural movements',
      icon: '🎭',
      gradient: 'from-green-600 to-emerald-600'
    },
    watches: {
      title: 'Watches',
      description: 'Horological excellence and luxury timepieces',
      icon: '⌚',
      gradient: 'from-amber-600 to-orange-600'
    },
    tech: {
      title: 'Tech',
      description: 'Latest gadgets and luxury technology',
      icon: '📱',
      gradient: 'from-indigo-600 to-purple-600'
    },
    fitness: {
      title: 'Fitness',
      description: 'Health, wellness, and peak performance',
      icon: '💪',
      gradient: 'from-red-600 to-rose-600'
    },
    travel: {
      title: 'Travel',
      description: 'Luxury destinations and exclusive experiences',
      icon: '✈️',
      gradient: 'from-teal-600 to-cyan-600'
    },
    entertainment: {
      title: 'Entertainment',
      description: 'Movies, shows, and celebrity culture',
      icon: '🎬',
      gradient: 'from-violet-600 to-fuchsia-600'
    }
  };

  const info = categoryInfo[slug] || { title: slug, description: `Articles about ${slug}`, icon: '📰', gradient: 'from-gray-600 to-gray-700' };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero */}
      <div className={`bg-gradient-to-br ${info.gradient} text-white py-20`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">{info.icon}</div>
            <h1 className="font-serif text-5xl md:text-6xl font-black mb-6">
              {info.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              {info.description}
            </p>
            <div className="flex items-center justify-center text-sm opacity-80">
              <span>{filteredAndSortedArticles.length} articles</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${info.title.toLowerCase()} articles...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Content Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Articles</option>
                  <option value="premium">Premium Only</option>
                  <option value="free">Free Articles</option>
                  <option value="trending">Trending</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                {sortBy === 'newest' ? (
                  <SortDesc className="h-4 w-4 text-gray-600" />
                ) : (
                  <SortAsc className="h-4 w-4 text-gray-600" />
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredAndSortedArticles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredAndSortedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ArticleCard 
                  article={article} 
                  size={index === 0 ? 'large' : 'medium'}
                  showCategory={false}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              No Articles Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No articles match your search "${searchQuery}" in ${info.title}.`
                : `No articles match your current filters in ${info.title}.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBy('all');
                  setSortBy('newest');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
              <Link to="/" className="btn-primary">
                Browse All Articles
              </Link>
            </div>
          </motion.div>
        )}

        {/* Load More - if needed for pagination */}
        {filteredAndSortedArticles.length >= 20 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className="btn-secondary">
              Load More Articles
            </button>
          </motion.div>
        )}
      </div>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Related Categories */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="section-title">Explore More Categories</h3>
            <p className="text-gray-600">
              Discover other areas of luxury lifestyle
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== slug)
              .slice(0, 4)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  to={`/category/${key}`}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gold-50 hover:to-gold-100 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h4 className="font-serif text-lg font-semibold text-primary-900 mb-2 group-hover:text-gold-600">
                    {cat.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {cat.description}
                  </p>
                </Link>
              ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;