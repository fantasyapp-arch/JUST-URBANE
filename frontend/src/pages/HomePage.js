import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Award, Clock, Eye, Crown, X, Sparkles, Star, Zap } from 'lucide-react';
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

  // Professional Magazine Article Card
  const ProfessionalArticleCard = ({ article, layout = 'standard', index = 0 }) => {
    const layoutStyles = {
      hero: {
        container: 'relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500',
        image: 'w-full h-96 lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-700',
        overlay: 'absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent',
        content: 'absolute bottom-0 left-0 right-0 p-8 lg:p-12 z-20',
        category: 'inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wide',
        title: 'text-3xl lg:text-5xl font-bold leading-tight mb-6 font-serif text-white',
        dek: 'text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-4xl',
        meta: 'flex flex-wrap items-center gap-6 text-white/80 text-sm lg:text-base'
      },
      large: {
        container: 'group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2',
        image: 'w-full h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-500',
        content: 'p-6',
        category: 'inline-block bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wide',
        title: 'text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight font-serif group-hover:text-primary-600 transition-colors',
        dek: 'text-gray-600 mb-6 line-clamp-2 leading-relaxed text-base',
        meta: 'flex items-center justify-between text-sm text-gray-500'
      },
      standard: {
        container: 'group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1',
        image: 'w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500',
        content: 'p-5',
        category: 'inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wide',
        title: 'text-lg lg:text-xl font-semibold text-gray-900 mb-3 leading-tight font-serif group-hover:text-primary-600 transition-colors line-clamp-2',
        dek: 'text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed',
        meta: 'flex items-center justify-between text-xs text-gray-500'
      }
    };

    const styles = layoutStyles[layout] || layoutStyles.standard;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <Link to={`/article/${article.slug || article.id}`} className={styles.container}>
          <div className="relative overflow-hidden">
            <img
              src={article.hero_image}
              alt={article.title}
              className={styles.image}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {/* Hero overlay */}
            {layout === 'hero' && (
              <>
                <div className={styles.overlay}></div>
                <div className={styles.content}>
                  <div className="max-w-4xl">
                    <span className={styles.category}>
                      {article.category}
                    </span>
                    
                    <h1 className={styles.title}>
                      {article.title}
                    </h1>
                    
                    {article.dek && (
                      <p className={styles.dek}>
                        {article.dek}
                      </p>
                    )}
                    
                    <div className={styles.meta}>
                      <span className="font-semibold">By {article.author_name}</span>
                      <span>{formatDateShort(article.published_at)}</span>
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
              </>
            )}
            
            {article.is_premium && (
              <div className="absolute top-6 right-6 z-30">
                <span className="bg-gold-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                  <Crown className="h-4 w-4 mr-2" />
                  Premium
                </span>
              </div>
            )}
          </div>

          {/* Content for non-hero layouts */}
          {layout !== 'hero' && (
            <div className={styles.content}>
              <div className={styles.category}>
                {article.category}
              </div>
              
              <h3 className={styles.title}>
                {article.title}
              </h3>
              
              {article.dek && layout !== 'standard' && (
                <p className={styles.dek}>
                  {article.dek}
                </p>
              )}
              
              <div className={styles.meta}>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">By {article.author_name}</span>
                  <span>{formatDateShort(article.published_at)}</span>
                </div>
                <div className="flex items-center space-x-3">
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
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* PREMIUM PROMOTIONAL BANNER */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-900/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                <span className="font-bold text-lg">LIMITED TIME OFFER!</span>
              </div>
              <div className="hidden md:block">
                <span className="text-lg">
                  Flat <span className="font-bold text-xl text-yellow-300">67% OFF</span> on Just Urbane Digital + Print Magazine. 
                  Save <span className="font-bold text-yellow-300">₹2,401</span>
                </span>
              </div>
              <div className="md:hidden">
                <span className="text-sm">
                  <span className="font-bold text-yellow-300">67% OFF</span> Just Urbane Magazine!
                </span>
              </div>
            </div>
            <Link 
              to="/pricing" 
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <span>BUY NOW</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 py-8">
        
        {/* HERO SECTION - PROFESSIONAL MAGAZINE STYLE */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Hero Article */}
            {featuredArticles[0] && (
              <div className="lg:col-span-8">
                <ProfessionalArticleCard 
                  article={featuredArticles[0]} 
                  layout="hero"
                  index={0}
                />
              </div>
            )}

            {/* Side Articles */}
            <div className="lg:col-span-4 space-y-6">
              {featuredArticles.slice(1, 4).map((article, index) => (
                <ProfessionalArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FASHION SECTION - PROFESSIONAL */}
        {fashionArticles.length > 0 && (
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
                  Fashion
                </h2>
                <p className="text-gray-600 text-lg lg:text-xl">
                  Style, trends and designer collections
                </p>
              </div>
              <Link
                to="/category/fashion"
                className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold group transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Explore Fashion
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Featured Fashion Article */}
              {fashionArticles[0] && (
                <div className="md:col-span-8">
                  <ProfessionalArticleCard 
                    article={fashionArticles[0]} 
                    layout="large"
                    index={0}
                  />
                </div>
              )}
              
              {/* Side Fashion Articles */}
              <div className="md:col-span-4 space-y-6">
                {fashionArticles.slice(1, 4).map((article, index) => (
                  <ProfessionalArticleCard 
                    key={article.id}
                    article={article} 
                    layout="standard"
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* TECHNOLOGY SECTION - PROFESSIONAL */}
        {techArticles.length > 0 && (
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
                  Technology
                </h2>
                <p className="text-gray-600 text-lg lg:text-xl">
                  Latest gadgets, innovation and digital trends
                </p>
              </div>
              <Link
                to="/category/tech"
                className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold group transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Explore Tech
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {techArticles.slice(0, 4).map((article, index) => (
                <ProfessionalArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* TRENDING SECTION - PROFESSIONAL */}
        {trendingArticles.length > 0 && (
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center mb-12">
              <TrendingUp className="h-10 w-10 text-accent-500 mr-4" />
              <div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
                  Trending Now
                </h2>
                <p className="text-gray-600 text-lg lg:text-xl">
                  Most popular stories this week
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingArticles.slice(0, 4).map((article, index) => (
                <ProfessionalArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* DIGITAL MAGAZINE PREMIUM SECTION */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-gold-500/10 to-amber-500/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-400/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <Star className="h-8 w-8 text-gold-400" />
                  <span className="text-gold-400 font-bold text-xl uppercase tracking-wide">Digital Magazine</span>
                </div>
                
                <h2 className="text-4xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                  Experience Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-400">Digital Reading</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Immerse yourself in luxury lifestyle content with our interactive digital magazine. 
                  Full-screen reading, smooth page turns, and premium content at your fingertips.
                </p>
                
                <div className="space-y-4 mb-10">
                  {[
                    'Full-screen immersive reading experience',
                    '6 premium pages with exclusive content',
                    'Smooth page transitions and natural feel',
                    '3 pages free preview available'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-gold-400 to-amber-500 rounded-full"></div>
                      <span className="text-gray-300 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/issues"
                    className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-3"
                  >
                    <Play className="h-6 w-6" />
                    <span>Read Digital Magazine</span>
                  </Link>
                  
                  <Link
                    to="/pricing"
                    className="border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <Crown className="h-6 w-6" />
                    <span>Get Premium Access</span>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop"
                    alt="Just Urbane Magazine Cover"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                  
                  {/* Magazine Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-gold-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>AUGUST 2025</span>
                    </div>
                  </div>
                  
                  {/* Free Preview Badge */}
                  <div className="absolute bottom-6 right-6">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      3 Pages Free
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">6</div>
                    <div className="text-xs text-gray-300">Pages</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold-400">4K+</div>
                    <div className="text-xs text-gray-300">Readers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* PREMIUM CONTENT SECTIONS */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">
              Premium Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore curated content across luxury lifestyle, technology, fashion, and entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Fashion & Style',
                description: 'Latest trends, designer collections, and style guides',
                icon: '👔',
                color: 'from-pink-500 to-rose-600',
                link: '/category/fashion'
              },
              {
                title: 'Technology',
                description: 'Cutting-edge gadgets, AI innovations, and tech reviews',
                icon: '💻',
                color: 'from-blue-500 to-cyan-600',
                link: '/category/tech'
              },
              {
                title: 'Travel & Luxury',
                description: 'Premium destinations, luxury hotels, and travel guides',
                icon: '✈️',
                color: 'from-green-500 to-emerald-600',
                link: '/category/travel'
              },
              {
                title: 'Entertainment',
                description: 'Celebrity interviews, movies, music, and culture',
                icon: '🎬',
                color: 'from-purple-500 to-violet-600',
                link: '/category/entertainment'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <Link 
                  to={category.link}
                  className="group block bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-semibold">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* VIDEOS SECTION - PROFESSIONAL */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
                Videos
              </h2>
              <p className="text-gray-600 text-lg lg:text-xl">
                Exclusive interviews and premium video content
              </p>
            </div>
            <Link
              to="/videos"
              className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold group transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Watch All
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Inside India\'s Most Exclusive Business Club',
                thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
                duration: '12:45',
                category: 'Business Exclusive'
              },
              {
                title: 'Luxury Watch Collection Worth ₹50 Crores',
                thumbnail: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800',
                duration: '8:30',
                category: 'Fashion & Style'
              },
              {
                title: 'AI Billionaire\'s Daily Routine Revealed',
                thumbnail: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800',
                duration: '15:20',
                category: 'Technology'
              }
            ].map((video, index) => (
              <motion.div 
                key={index}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="h-8 w-8 text-primary-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                      {video.category}
                    </span>
                  </div>
                </div>
                <h4 className="text-xl lg:text-2xl font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                  {video.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.section>



      </div>
    </div>
  );
};

export default HomePage;