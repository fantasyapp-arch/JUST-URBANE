import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SortAsc, SortDesc, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { useSubcategoryArticles } from '../hooks/useArticles';

const SubcategoryPage = () => {
  const { category, subcategory } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: articles = [], isLoading, error } = useSubcategoryArticles(category, subcategory, { limit: 50 });

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

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
        break;
      case 'popular':
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      default: // 'newest'
        filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        break;
    }

    return filtered;
  }, [articles, searchQuery, sortBy]);

  const subcategoryInfo = {
    men: {
      title: "Men's Fashion & Style",
      description: "Sophisticated style guides, grooming tips, and luxury menswear for the modern gentleman",
      gradient: 'from-gray-700 to-gray-900'
    },
    women: {
      title: "Women's Fashion & Style", 
      description: "Elegant fashion, beauty trends, and luxury lifestyle for the contemporary woman",
      gradient: 'from-pink-500 to-rose-600'
    },
    luxury: {
      title: "Luxury Fashion",
      description: "High-end designer collections, luxury brands, and exclusive fashion pieces",
      gradient: 'from-gold-500 to-yellow-600'
    },
    accessories: {
      title: "Fashion Accessories",
      description: "Premium watches, jewelry, bags, and accessories to complete your look",
      gradient: 'from-purple-500 to-indigo-600'
    },
    trends: {
      title: "Fashion Trends",
      description: "Latest fashion movements, seasonal trends, and style forecasts",
      gradient: 'from-green-500 to-teal-600'
    }
  };

  const info = subcategoryInfo[subcategory] || { 
    title: `${category} - ${subcategory}`, 
    description: `Latest articles in ${subcategory}`,
    gradient: 'from-blue-500 to-indigo-600'
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Section Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The section you're looking for doesn't exist.
          </p>
          <Link to={`/category/${category}`} className="btn-primary">
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to={`/category/${category}`} className="hover:text-primary-600 capitalize">{category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">{subcategory}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero */}
      <div className={`bg-gradient-to-br ${info.gradient} text-white py-16`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
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
                placeholder={`Search ${subcategory} articles...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {sortBy === 'newest' ? (
                  <SortDesc className="h-4 w-4 text-gray-600" />
                ) : (
                  <SortAsc className="h-4 w-4 text-gray-600" />
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
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
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              No Articles Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No articles match your search "${searchQuery}" in ${info.title}.`
                : `No articles found in ${info.title} section.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setSearchQuery('')}
                className="btn-secondary"
              >
                Clear Search
              </button>
              <Link to={`/category/${category}`} className="btn-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {category}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;