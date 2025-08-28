import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Award, Clock, Eye, Crown, Sparkles, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Hooks
import { useFeaturedArticles, useTrendingArticles, useCategoryArticles } from '../hooks/useArticles';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

const HomePage = () => {
  const { data: featuredArticles = [] } = useFeaturedArticles();
  const { data: trendingArticles = [] } = useTrendingArticles();
  
  // Load articles from categories
  const { data: fashionArticles = [] } = useCategoryArticles('fashion', { limit: 6 });
  const { data: techArticles = [] } = useCategoryArticles('technology', { limit: 4 });

  // Premium Article Card Component
  const PremiumCard = ({ article, layout = 'standard', index = 0 }) => {
    if (layout === 'hero') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.15 }}
        >
          <Link to={`/article/${article.slug || article.id}`} className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 block">
            <div className="relative overflow-hidden">
              <img
                src={article.hero_image}
                alt={article.title}
                className="w-full h-[500px] lg:h-[650px] object-cover group-hover:scale-110 transition-transform duration-1000"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
              
              {/* Premium Badge */}
              {article.is_premium && (
                <div className="absolute top-6 right-6 z-30">
                  <span className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-4 py-2 rounded-full text-sm font-black flex items-center shadow-xl">
                    <Crown className="h-4 w-4 mr-2" />
                    Premium
                  </span>
                </div>
              )}

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-20">
                <div className="max-w-5xl">
                  <span className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 uppercase tracking-wider shadow-lg">
                    {article.category}
                  </span>
                  
                  <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-6 font-serif text-white">
                    {article.title}
                  </h1>
                  
                  {article.dek && (
                    <p className="text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed font-light max-w-4xl">
                      {article.dek}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-8 text-white/90 text-lg">
                    <span className="font-bold text-xl">By {article.author_name}</span>
                    <span className="text-lg">{formatDateShort(article.published_at)}</span>
                    <span className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                      <Clock className="h-5 w-5 mr-2" />
                      {formatReadingTime(article.reading_time)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.15 }}
      >
        <Link to={`/article/${article.slug || article.id}`} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 block">
          <div className="relative overflow-hidden">
            <img
              src={article.hero_image}
              alt={article.title}
              className="w-full h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-600"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            
            {article.is_premium && (
              <div className="absolute top-4 right-4">
                <span className="bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </span>
              </div>
            )}
          </div>

          <div className="p-6 lg:p-8">
            <span className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">
              {article.category}
            </span>
            
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight font-serif group-hover:text-primary-600 transition-colors">
              {article.title}
            </h3>
            
            {article.dek && (
              <p className="text-gray-700 mb-5 leading-relaxed line-clamp-2">
                {article.dek}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="font-semibold">By {article.author_name}</span>
              <span>{formatDateShort(article.published_at)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* ULTRA-PREMIUM HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Hero Article */}
            {featuredArticles[0] && (
              <div className="lg:col-span-8">
                <PremiumCard 
                  article={featuredArticles[0]} 
                  layout="hero"
                  index={0}
                />
              </div>
            )}

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              {/* Stats Widget */}
              <motion.div 
                className="bg-gradient-to-br from-primary-600 to-blue-700 text-white rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <Sparkles className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-bold">This Week</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black">127</div>
                    <div className="text-primary-100 text-xs">Articles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">89K</div>
                    <div className="text-primary-100 text-xs">Readers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">15</div>
                    <div className="text-primary-100 text-xs">Videos</div>
                  </div>
                </div>
              </motion.div>

              {/* Featured Articles */}
              {featuredArticles.slice(1, 4).map((article, index) => (
                <PremiumCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900 mb-6">
              Explore Premium Content
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover luxury lifestyle stories across fashion, technology, automotive, and travel
            </p>
          </motion.div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {[
              { name: 'Fashion', icon: '👔', color: 'from-purple-500 to-pink-600', articles: fashionArticles.length },
              { name: 'Tech', icon: '📱', color: 'from-blue-500 to-cyan-600', articles: techArticles.length },
              { name: 'Auto', icon: '🚗', color: 'from-red-500 to-orange-600', articles: 8 },
              { name: 'Travel', icon: '✈️', color: 'from-green-500 to-teal-600', articles: 12 },
              { name: 'People', icon: '👑', color: 'from-indigo-500 to-purple-600', articles: 15 }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Link
                  to={`/category/${category.name.toLowerCase()}`}
                  className={`block bg-gradient-to-br ${category.color} rounded-3xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                >
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 text-sm">{category.articles} Articles</p>
                  
                  <div className="mt-4 inline-flex items-center bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    Explore
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FASHION SECTION */}
      {fashionArticles.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex items-center justify-between mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                  <span className="text-3xl">👔</span>
                </div>
                <div>
                  <h2 className="text-5xl font-serif font-black text-gray-900 mb-3">Fashion</h2>
                  <p className="text-xl text-gray-600">Style, trends and designer collections</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {fashionArticles.slice(0, 4).map((article, index) => (
                <PremiumCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER SECTION - SINGLE PREMIUM INSTANCE */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg mb-8 shadow-xl">
              <Sparkles className="h-6 w-6 mr-3" />
              EXCLUSIVE ACCESS
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-serif font-black mb-8 leading-tight">
              Join the Elite Circle
            </h2>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              Get exclusive insights, luxury lifestyle trends, and premium content delivered weekly
            </p>

            <div className="max-w-2xl mx-auto">
              <form className="flex flex-col lg:flex-row gap-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-8 py-5 rounded-2xl text-gray-900 border-0 focus:ring-4 focus:ring-white/30 outline-none text-xl font-medium placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold-400 to-yellow-500 hover:from-gold-500 hover:to-yellow-600 text-black px-12 py-5 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  <Crown className="h-6 w-6 mr-3" />
                  Join Elite
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;