import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Award, Clock, Eye, Crown } from 'lucide-react';
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
      {/* MAIN CONTENT CONTAINER */}
      <div className="container mx-auto px-4 py-12">
        
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

        {/* PEOPLE OF THE YEAR - PROFESSIONAL MAGAZINE STYLE */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-3xl p-12">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-8">
                <Award className="h-12 w-12 text-gold-500 mr-4" />
                <h2 className="text-4xl lg:text-5xl font-serif font-bold">
                  People of the Year 2025
                </h2>
              </div>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Celebrating exceptional individuals shaping luxury, business, and culture
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  name: 'Ratan Tata',
                  title: 'Business Visionary & Philanthropist',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
                  category: 'Business Leader'
                },
                {
                  name: 'Priyanka Chopra',
                  title: 'Global Entertainment Icon',
                  image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=400&h=500&fit=crop',
                  category: 'Entertainment'
                },
                {
                  name: 'Byju Raveendran',
                  title: 'EdTech Revolutionary',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
                  category: 'Technology'
                }
              ].map((person, index) => (
                <motion.div 
                  key={index}
                  className="group text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                >
                  <div className="relative mb-8 overflow-hidden rounded-2xl">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-gold-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                        {person.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-gold-400 font-semibold text-lg">
                    {person.title}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link 
                to="/people-of-the-year" 
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-bold px-12 py-5 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-2xl text-lg"
              >
                View All Winners
                <ArrowRight className="ml-4 h-6 w-6" />
              </Link>
            </div>
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

        {/* SINGLE NEWSLETTER SECTION - PROFESSIONAL DESIGN */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-6">
                Stay Updated with Just Urbane
              </h3>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Get the latest in luxury lifestyle, fashion trends, and exclusive content delivered to your inbox weekly.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 border-2 border-primary-200 focus:ring-4 focus:ring-primary-200 focus:border-primary-500 outline-none text-lg"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
                >
                  Subscribe Free
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                No spam, unsubscribe anytime. Join 50,000+ premium readers.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default HomePage;