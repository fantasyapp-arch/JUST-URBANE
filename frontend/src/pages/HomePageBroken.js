import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Award, Clock, Eye, Crown, Sparkles, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Components
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';

// Hooks
import { useFeaturedArticles, useTrendingArticles, useCategoryArticles } from '../hooks/useArticles';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

const HomePage = () => {
  const { data: featuredArticles = [], isLoading: loadingFeatured } = useFeaturedArticles();
  const { data: trendingArticles = [], isLoading: loadingTrending } = useTrendingArticles();
  
  // Load articles from categories
  const { data: fashionArticles = [] } = useCategoryArticles('fashion', { limit: 6 });
  const { data: techArticles = [] } = useCategoryArticles('technology', { limit: 4 });
  const { data: autoArticles = [] } = useCategoryArticles('auto', { limit: 4 });
  const { data: travelArticles = [] } = useCategoryArticles('travel', { limit: 4 });

  // Ultra-Premium Article Card Component
  const UltraPremiumCard = ({ article, layout = 'standard', index = 0 }) => {
    const layouts = {
      hero: {
        container: 'group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2',
        imageContainer: 'relative overflow-hidden',
        image: 'w-full h-[500px] lg:h-[650px] object-cover group-hover:scale-110 transition-transform duration-1000',
        overlay: 'absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent',
        content: 'absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-20',
        category: 'inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 uppercase tracking-wider shadow-lg backdrop-blur-sm',
        title: 'text-4xl lg:text-6xl font-black leading-tight mb-6 font-serif text-white',
        dek: 'text-xl lg:text-2xl text-white/95 mb-8 leading-relaxed font-light max-w-4xl',
        meta: 'flex flex-wrap items-center gap-8 text-white/90 text-lg'
      },
      large: {
        container: 'group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100',
        imageContainer: 'relative overflow-hidden',
        image: 'w-full h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700',
        overlay: '',
        content: 'p-8',
        category: 'inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider',
        title: 'text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight font-serif group-hover:text-primary-600 transition-colors',
        dek: 'text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3',
        meta: 'flex items-center justify-between text-sm text-gray-500'
      },
      featured: {
        container: 'group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-primary-50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-primary-100',
        imageContainer: 'relative overflow-hidden',
        image: 'w-full h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-600',
        overlay: '',
        content: 'p-6 lg:p-8',
        category: 'inline-flex items-center bg-gradient-to-r from-primary-500 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold mb-4 uppercase tracking-wider shadow-lg',
        title: 'text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight font-serif group-hover:text-primary-600 transition-colors',
        dek: 'text-gray-700 mb-5 leading-relaxed line-clamp-2',
        meta: 'flex items-center justify-between text-sm text-gray-500'
      }
    };

    const style = layouts[layout] || layouts.featured;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.15 }}
        whileHover={{ scale: 1.02 }}
      >
        <Link to={`/article/${article.slug || article.id}`} className={style.container}>
          <div className={style.imageContainer}>
            <img
              src={article.hero_image}
              alt={article.title}
              className={style.image}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {style.overlay && <div className={style.overlay}></div>}
            
            {/* Premium Badge */}
            {article.is_premium && (
              <div className="absolute top-6 right-6 z-30">
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 text-black px-4 py-2 rounded-full text-sm font-black flex items-center shadow-xl backdrop-blur-sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Premium
                </span>
              </div>
            )}

            {/* Trending Badge */}
            {article.is_trending && (
              <div className="absolute top-6 left-6 z-30">
                <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-black flex items-center shadow-xl backdrop-blur-sm animate-pulse">
                  <Zap className="h-4 w-4 mr-2" />
                  Trending
                </span>
              </div>
            )}
          </div>

          {/* Content Overlay for Hero */}
          {layout === 'hero' && (
            <div className={style.content}>
              <div className="max-w-5xl">
                <span className={style.category}>
                  {article.category}
                </span>
                
                <h1 className={style.title}>
                  {article.title}
                </h1>
                
                {article.dek && (
                  <p className={style.dek}>
                    {article.dek}
                  </p>
                )}
                
                <div className={style.meta}>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-xl">By {article.author_name}</span>
                    <span className="text-lg">{formatDateShort(article.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Clock className="h-5 w-5 mr-2" />
                      {formatReadingTime(article.reading_time)}
                    </span>
                    <span className="flex items-center bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <Eye className="h-5 w-5 mr-2" />
                      {article.view_count?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content for Other Layouts */}
          {layout !== 'hero' && (
            <div className={style.content}>
              <span className={style.category}>
                {article.category}
              </span>
              
              <h3 className={style.title}>
                {article.title}
              </h3>
              
              {article.dek && (
                <p className={style.dek}>
                  {article.dek}
                </p>
              )}
              
              <div className={style.meta}>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">By {article.author_name}</span>
                  <span>{formatDateShort(article.published_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatReadingTime(article.reading_time)}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {article.view_count?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* PREMIUM HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-8 pb-16">
          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Hero Article */}
            {featuredArticles[0] && (
              <div className="lg:col-span-8">
                <UltraPremiumCard 
                  article={featuredArticles[0]} 
                  layout="hero"
                  index={0}
                />
              </div>
            )}

            {/* Sidebar Articles */}
            <div className="lg:col-span-4 space-y-8">
              {/* Quick Stats */}
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
                    <div className="text-primary-100 text-xs">New Articles</div>
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
                <UltraPremiumCard 
                  key={article.id}
                  article={article} 
                  layout="featured"
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM CATEGORIES SHOWCASE */}
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
              { name: 'Auto', icon: '🚗', color: 'from-red-500 to-orange-600', articles: autoArticles.length },
              { name: 'Travel', icon: '✈️', color: 'from-green-500 to-teal-600', articles: travelArticles.length },
              { name: 'People', icon: '👑', color: 'from-indigo-500 to-purple-600', articles: 12 }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link
                  to={`/category/${category.name.toLowerCase()}`}
                  className="group relative block"
                >
                  <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 text-white text-center shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }}></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/90 text-sm">{category.articles} Articles</p>
                      
                      <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                        Explore
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM CONTENT SECTIONS */}
      
      {/* Fashion Section */}
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
                  <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900 mb-3">
                    Fashion
                  </h2>
                  <p className="text-xl lg:text-2xl text-gray-600">
                    Style, trends and designer collections
                  </p>
                </div>
              </div>
              <Link
                to="/category/fashion"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center"
              >
                Explore Fashion
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Featured Fashion Article */}
              {fashionArticles[0] && (
                <div className="lg:col-span-8">
                  <UltraPremiumCard 
                    article={fashionArticles[0]} 
                    layout="large"
                    index={0}
                  />
                </div>
              )}
              
              {/* Side Articles */}
              <div className="lg:col-span-4 space-y-6">
                {fashionArticles.slice(1, 4).map((article, index) => (
                  <UltraPremiumCard 
                    key={article.id}
                    article={article} 
                    layout="featured"
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Technology Section */}
      {techArticles.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex items-center justify-between mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                  <span className="text-3xl">📱</span>
                </div>
                <div>
                  <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900 mb-3">
                    Technology
                  </h2>
                  <p className="text-xl lg:text-2xl text-gray-600">
                    Latest gadgets, smart tech and innovation
                  </p>
                </div>
              </div>
              <Link
                to="/category/tech"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center"
              >
                Explore Tech
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {techArticles.slice(0, 4).map((article, index) => (
                <UltraPremiumCard 
                  key={article.id}
                  article={article} 
                  layout="featured"
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING SECTION */}
      {trendingArticles.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex items-center justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900">
                    Trending Now
                  </h2>
                </div>
                <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto">
                  Most popular stories captivating our readers this week
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingArticles.slice(0, 4).map((article, index) => (
                <UltraPremiumCard 
                  key={article.id}
                  article={article} 
                  layout="featured"
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PEOPLE OF THE YEAR - ULTRA PREMIUM */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-gold-400 to-yellow-500 text-black px-8 py-4 rounded-full font-black text-lg mb-8 shadow-2xl">
              <Award className="h-8 w-8 mr-3" />
              ANNUAL AWARDS 2025
            </div>
            <h2 className="text-5xl lg:text-7xl font-serif font-black text-white mb-8 leading-tight">
              People of the Year
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Celebrating visionaries, innovators, and leaders who are reshaping luxury and culture
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: 'Ratan Tata',
                title: 'Business Visionary',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80',
                category: 'Business Leader',
                achievement: 'Transforming Indian business with ethical leadership and philanthropy'
              },
              {
                name: 'Priyanka Chopra',
                title: 'Global Icon',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80',
                category: 'Entertainment',
                achievement: 'Breaking barriers globally while championing Indian culture'
              },
              {
                name: 'Byju Raveendran',
                title: 'Tech Revolutionary',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80',
                category: 'Technology',
                achievement: 'Revolutionizing education through innovation and accessibility'
              }
            ].map((person, index) => (
              <motion.div 
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-gradient-to-r from-gold-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-black shadow-xl">
                      {person.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-serif font-bold mb-2 group-hover:text-gold-300 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-gold-400 font-bold text-lg mb-3">
                      {person.title}
                    </p>
                    <p className="text-gray-200 leading-relaxed">
                      {person.achievement}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <Link 
              to="/people-of-the-year" 
              className="inline-flex items-center bg-gradient-to-r from-gold-400 to-yellow-500 hover:from-gold-500 hover:to-yellow-600 text-black font-black px-12 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-xl"
            >
              <Star className="h-6 w-6 mr-3" />
              View All Winners
              <ArrowRight className="ml-4 h-6 w-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PREMIUM VIDEOS SECTION */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-between mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                <Play className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900 mb-3">
                  Exclusive Videos
                </h2>
                <p className="text-xl lg:text-2xl text-gray-600">
                  Behind-the-scenes interviews and premium content
                </p>
              </div>
            </div>
            <Link
              to="/videos"
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center"
            >
              Watch All
              <Play className="ml-3 h-6 w-6" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Inside India\'s Most Exclusive Business Club',
                thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80',
                duration: '12:45',
                category: 'Business Exclusive',
                views: '89K'
              },
              {
                title: 'Luxury Watch Collection Worth ₹50 Crores',
                thumbnail: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80',
                duration: '8:30',
                category: 'Fashion & Style',
                views: '156K'
              },
              {
                title: 'AI Billionaire\'s Daily Routine Revealed',
                thumbnail: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80',
                duration: '15:20',
                category: 'Technology',
                views: '234K'
              }
            ].map((video, index) => (
              <motion.div 
                key={index}
                className="group relative cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.2 + index * 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl">
                      <Play className="h-10 w-10 text-primary-600 ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Info Overlays */}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/80 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {video.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {video.views} views
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                    {video.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      {/* PREMIUM NEWSLETTER - SINGLE INSTANCE */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
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
              
              <div className="flex items-center justify-center mt-8 text-white/80">
                <div className="flex -space-x-3 mr-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-full border-4 border-white/20 shadow-xl"
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">
                  Join 50,000+ premium readers
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MAGAZINE SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
          >
            <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900 mb-6">
              Premium Magazine Experience
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From digital exclusives to luxury print editions
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Digital Magazine */}
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.8 }}
            >
              <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-3xl p-8 mb-6 group-hover:from-primary-200 group-hover:to-blue-200 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Digital Edition</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Instant access to all premium articles, exclusive interviews, and digital magazine issues
                </p>
              </div>
              <div className="text-3xl font-black text-primary-600 mb-2">₹499</div>
              <div className="text-gray-500 mb-6">per year</div>
              <Link to="/pricing" className="btn-primary">
                Get Digital Access
              </Link>
            </motion.div>

            {/* Print Magazine */}
            <motion.div 
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3 }}
            >
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 mb-6 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Print Edition</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Luxury print magazine delivered monthly with premium paper and exclusive covers
                </p>
              </div>
              <div className="text-3xl font-black text-gray-800 mb-2">₹499</div>
              <div className="text-gray-500 mb-6">per year</div>
              <Link to="/pricing" className="btn-secondary">
                Get Print Edition
              </Link>
            </motion.div>

            {/* Combined Package */}
            <motion.div 
              className="text-center group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-gold-400 to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-black shadow-xl">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="bg-gradient-to-br from-gold-50 to-yellow-50 rounded-3xl p-8 mb-6 group-hover:from-gold-100 group-hover:to-yellow-100 transition-all duration-300 border-2 border-gold-200">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <Crown className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Access</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Everything digital plus luxury print delivery - the ultimate premium experience
                </p>
              </div>
              <div className="text-3xl font-black text-gold-600 mb-2">₹999</div>
              <div className="text-gray-500 mb-2">per year</div>
              <div className="text-green-600 font-bold mb-6">Save ₹499</div>
              <Link to="/pricing" className="bg-gradient-to-r from-gold-500 to-yellow-600 hover:from-gold-600 hover:to-yellow-700 text-black font-black px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl">
                Best Value
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;