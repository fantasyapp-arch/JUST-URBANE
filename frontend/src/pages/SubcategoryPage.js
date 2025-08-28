import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, SortDesc, Search, ArrowLeft, Crown, TrendingUp, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { useSubcategoryArticles } from '../hooks/useArticles';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

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
      description: "Sophisticated style guides, grooming essentials, and luxury menswear for the modern gentleman",
      gradient: 'from-gray-800 to-black',
      bgImage: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&h=600&fit=crop'
    },
    women: {
      title: "Women's Fashion & Style", 
      description: "Elegant fashion, beauty trends, and luxury lifestyle for the contemporary woman",
      gradient: 'from-pink-600 to-rose-700',
      bgImage: 'https://images.unsplash.com/photo-1580478491436-fd6a937acc9e?w=1200&h=600&fit=crop'
    },
    luxury: {
      title: "Luxury Fashion",
      description: "High-end designer collections, exclusive brands, and premium fashion pieces",
      gradient: 'from-gold-600 to-yellow-700',
      bgImage: 'https://images.unsplash.com/photo-1553544260-f87e671974ee?w=1200&h=600&fit=crop'
    },
    accessories: {
      title: "Fashion Accessories",
      description: "Premium watches, jewelry, bags, and luxury accessories",
      gradient: 'from-purple-600 to-indigo-700',
      bgImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&h=600&fit=crop'
    }
  };

  const info = subcategoryInfo[subcategory] || { 
    title: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} ${category}`, 
    description: `Latest articles in ${subcategory} ${category}`,
    gradient: 'from-blue-600 to-indigo-700',
    bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop'
  };

  // Professional Article Card for subcategory page
  const ProfessionalCard = ({ article, featured = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={featured ? "lg:col-span-2" : ""}
    >
      <Link
        to={`/article/${article.slug || article.id}`}
        className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      >
        <div className="relative overflow-hidden">
          <img
            src={article.hero_image}
            alt={article.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${
              featured ? 'h-80' : 'h-64'
            }`}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          
          {/* Premium Badge */}
          {article.is_premium && (
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </span>
            </div>
          )}

          {/* Trending Badge */}
          {article.is_trending && (
            <div className="absolute top-4 left-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </span>
            </div>
          )}
        </div>

        <div className={`p-6 ${featured ? 'lg:p-8' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {article.category}
            </span>
            {article.tags?.includes('men') && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                Men's
              </span>
            )}
          </div>
          
          <h3 className={`font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-3 ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            {article.title}
          </h3>
          
          {article.dek && (
            <p className={`text-gray-600 leading-relaxed line-clamp-2 mb-4 ${
              featured ? 'text-lg' : 'text-base'
            }`}>
              {article.dek}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="font-semibold">By {article.author_name}</span>
              <span>{formatDateShort(article.published_at)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatReadingTime(article.reading_time)}
              </span>
              <span className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {article.view_count?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

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
            <Link to="/" className="hover:text-primary-600 font-medium">Home</Link>
            <span>/</span>
            <Link to={`/category/${category}`} className="hover:text-primary-600 font-medium capitalize">{category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold capitalize">{subcategory}</span>
          </nav>
        </div>
      </div>

      {/* PROFESSIONAL HERO SECTION */}
      <div className="relative overflow-hidden py-20" style={{
        backgroundImage: `linear-gradient(${info.gradient}), url('${info.bgImage}')`,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl lg:text-7xl font-black mb-6 leading-tight">
              {info.title}
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {info.description}
            </p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">{filteredAndSortedArticles.length} Premium Articles</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FILTERS AND SEARCH BAR */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${info.title.toLowerCase()} articles...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 outline-none text-lg"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ARTICLES GRID - PROFESSIONAL LAYOUT */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredAndSortedArticles.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Featured Article */}
            {filteredAndSortedArticles[0] && (
              <div className="mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Link
                    to={`/article/${filteredAndSortedArticles[0].slug || filteredAndSortedArticles[0].id}`}
                    className="group block relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-700"
                  >
                    <div className="lg:flex">
                      {/* Image */}
                      <div className="lg:w-2/3 relative overflow-hidden">
                        <img
                          src={filteredAndSortedArticles[0].hero_image}
                          alt={filteredAndSortedArticles[0].title}
                          className="w-full h-96 lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-r from-transparent via-transparent to-black/30"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-6 left-6 flex gap-3">
                          <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                            FEATURED
                          </span>
                          {filteredAndSortedArticles[0].is_premium && (
                            <span className="bg-gold-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center">
                              <Crown className="h-4 w-4 mr-1" />
                              Premium
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:w-1/3 p-8 lg:p-12 flex flex-col justify-center">
                        <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider inline-block">
                          {filteredAndSortedArticles[0].category}
                        </span>
                        
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight group-hover:text-primary-600 transition-colors">
                          {filteredAndSortedArticles[0].title}
                        </h2>
                        
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                          {filteredAndSortedArticles[0].dek}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                          <span className="font-semibold">By {filteredAndSortedArticles[0].author_name}</span>
                          <span>{formatDateShort(filteredAndSortedArticles[0].published_at)}</span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatReadingTime(filteredAndSortedArticles[0].reading_time)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {filteredAndSortedArticles[0].view_count?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* More Articles Grid */}
            {filteredAndSortedArticles.length > 1 && (
              <div>
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-serif font-bold text-gray-900">
                    More in {info.title}
                  </h3>
                  <Link
                    to={`/category/${category}`}
                    className="flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to {category}
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAndSortedArticles.slice(1).map((article, index) => (
                    <ProfessionalCard 
                      key={article.id} 
                      article={article} 
                      featured={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-8xl mb-8">👔</div>
            <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              {searchQuery ? 'No Articles Found' : 'Coming Soon'}
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              {searchQuery 
                ? `No articles match "${searchQuery}" in ${info.title}.`
                : `We're working on amazing ${info.title.toLowerCase()} content for you.`
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              )}
              <Link to={`/category/${category}`} className="btn-primary">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Explore {category}
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* RELATED CATEGORIES */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Explore More {category}
            </h3>
            <p className="text-gray-600 text-lg">
              Discover other areas of luxury lifestyle
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {['Men', 'Women', 'Luxury', 'Accessories'].filter(sub => sub.toLowerCase() !== subcategory).map((sub) => (
              <Link
                key={sub}
                to={`/category/${category}/${sub.toLowerCase()}`}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-blue-50 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2 shadow-sm hover:shadow-lg"
              >
                <div className="text-4xl mb-4">
                  {sub === 'Men' && '👔'}
                  {sub === 'Women' && '👗'}  
                  {sub === 'Luxury' && '💎'}
                  {sub === 'Accessories' && '⌚'}
                </div>
                <h4 className="font-serif text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {sub} {category}
                </h4>
                <p className="text-sm text-gray-600">
                  Explore {sub.toLowerCase()} collection
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;