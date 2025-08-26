import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Award, Calendar, Eye, Clock, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

// Components
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import NewsletterSignup from '../components/NewsletterSignup';

// Hooks
import { useFeaturedArticles, useTrendingArticles, useCategoryArticles } from '../hooks/useArticles';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

const HomePage = () => {
  const { data: featuredArticles = [], isLoading: loadingFeatured } = useFeaturedArticles();
  const { data: trendingArticles = [], isLoading: loadingTrending } = useTrendingArticles();
  
  // Load articles from different categories
  const { data: fashionArticles = [] } = useCategoryArticles('fashion', { limit: 6 });
  const { data: businessArticles = [] } = useCategoryArticles('business', { limit: 4 });
  const { data: techArticles = [] } = useCategoryArticles('technology', { limit: 4 });
  const { data: entertainmentArticles = [] } = useCategoryArticles('entertainment', { limit: 4 });

  // Premium article card component with perfect alignment
  const PremiumArticleCard = ({ article, layout = 'standard', index = 0 }) => {
    const layoutStyles = {
      hero: {
        container: 'relative group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500',
        image: 'w-full h-96 lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-700',
        overlay: 'absolute inset-0 hero-overlay',
        content: 'hero-content',
        category: 'inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wide',
        title: 'text-3xl lg:text-5xl font-bold leading-tight mb-6 font-serif max-w-4xl',
        dek: 'text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl',
        meta: 'flex items-center space-x-6 text-white/80 text-sm'
      },
      large: {
        container: 'group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2',
        image: 'w-full h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-500',
        overlay: '',
        content: 'p-6',
        category: 'inline-block bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wide',
        title: 'text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight font-serif group-hover:text-primary-600 transition-colors',
        dek: 'text-gray-600 mb-6 line-clamp-2 leading-relaxed text-base',
        meta: 'flex items-center justify-between text-sm text-gray-500'
      },
      standard: {
        container: 'group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1',
        image: 'w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500',
        overlay: '',
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
            {/* Fixed overlay for hero layout */}
            {layout === 'hero' && (
              <>
                <div className={styles.overlay}></div>
                <div className={styles.content}>
                  <div className={styles.category}>
                    {article.category}
                  </div>
                  
                  <h3 className={styles.title}>
                    {article.title}
                  </h3>
                  
                  {article.dek && (
                    <p className={styles.dek}>
                      {article.dek}
                    </p>
                  )}
                  
                  <div className={styles.meta}>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">By {article.author_name}</span>
                      <span>{formatDateShort(article.published_at)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
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
              <div className="absolute top-6 right-6 z-20">
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
      {/* Premium Subscription Banner - FIXED STYLING */}
      <div className="bg-primary-900 text-white py-3 border-b border-primary-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">
                U
              </div>
              <span className="font-medium">Limited Time Offer! Flat 55% OFF on Premium Subscription. Save ₹3000</span>
            </div>
            <Link 
              to="/pricing" 
              className="bg-accent-600 hover:bg-accent-700 px-6 py-2 rounded-lg font-bold text-white transition-colors transform hover:scale-105 shadow-lg"
            >
              Subscribe Now!
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Hero Section - Perfect GQ Style */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Hero Article - Large Featured */}
            {featuredArticles[0] && (
              <div className="lg:col-span-8">
                <PremiumArticleCard 
                  article={featuredArticles[0]} 
                  layout="hero"
                  index={0}
                />
              </div>
            )}

            {/* Side Articles */}
            <div className="lg:col-span-4 space-y-6">
              {featuredArticles.slice(1, 4).map((article, index) => (
                <PremiumArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Fashion Section */}
        {fashionArticles.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                  Fashion
                </h2>
                <p className="text-gray-600 text-lg">
                  Style, trends and designer collections
                </p>
              </div>
              <Link
                to="/category/fashion"
                className="flex items-center text-gray-700 hover:text-gray-900 font-semibold group transition-colors"
              >
                View All
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Featured Fashion Article */}
              {fashionArticles[0] && (
                <div className="md:col-span-8">
                  <PremiumArticleCard 
                    article={fashionArticles[0]} 
                    layout="large"
                    index={0}
                  />
                </div>
              )}
              
              {/* Side Fashion Articles */}
              <div className="md:col-span-4 space-y-4">
                {fashionArticles.slice(1, 4).map((article, index) => (
                  <PremiumArticleCard 
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

        {/* Business Section */}
        {businessArticles.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                  Business
                </h2>
                <p className="text-gray-600 text-lg">
                  Leadership, strategy and success stories
                </p>
              </div>
              <Link
                to="/category/business"
                className="flex items-center text-gray-700 hover:text-gray-900 font-semibold group transition-colors"
              >
                View All
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {businessArticles.slice(0, 4).map((article, index) => (
                <PremiumArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Technology Section */}
        {techArticles.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                  Technology
                </h2>
                <p className="text-gray-600 text-lg">
                  Latest gadgets and innovation
                </p>
              </div>
              <Link
                to="/category/technology"
                className="flex items-center text-gray-700 hover:text-gray-900 font-semibold group transition-colors"
              >
                View All
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {techArticles.slice(0, 4).map((article, index) => (
                <PremiumArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* People of the Year - Premium Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl p-12">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <Award className="h-12 w-12 text-yellow-500 mr-4" />
                <h2 className="text-4xl font-serif font-bold">
                  People of the Year 2025
                </h2>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Celebrating exceptional individuals who are shaping luxury, business, and culture
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Ratan Tata',
                  title: 'Business Visionary & Philanthropist',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                  category: 'Business Leader',
                  achievement: 'Transforming Indian business landscape with ethical leadership'
                },
                {
                  name: 'Priyanka Chopra',
                  title: 'Global Entertainment Icon',
                  image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=400&h=400&fit=crop',
                  category: 'Entertainment',
                  achievement: 'Breaking barriers in Hollywood while championing Indian culture globally'
                },
                {
                  name: 'Byju Raveendran',
                  title: 'EdTech Revolutionary',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
                  category: 'Technology',
                  achievement: 'Revolutionizing education through technology and innovation'
                }
              ].map((person, index) => (
                <motion.div 
                  key={index}
                  className="group text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                >
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                        {person.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-yellow-400 font-semibold mb-3">
                    {person.title}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {person.achievement}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link 
                to="/people-of-the-year" 
                className="inline-flex items-center bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105"
              >
                View All Winners
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Videos Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                Videos
              </h2>
              <p className="text-gray-600 text-lg">
                Exclusive interviews and premium video content
              </p>
            </div>
            <Link
              to="/videos"
              className="flex items-center text-gray-700 hover:text-gray-900 font-semibold group transition-colors"
            >
              Watch All
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {video.category}
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-serif font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {video.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trending Stories */}
        {trendingArticles.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="flex items-center mb-8">
              <TrendingUp className="h-8 w-8 text-red-500 mr-4" />
              <div>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                  Trending Now
                </h2>
                <p className="text-gray-600 text-lg">
                  Most popular stories this week
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingArticles.slice(0, 4).map((article, index) => (
                <PremiumArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Newsletter Signup */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <NewsletterSignup variant="inline" />
        </motion.section>

      </div>

      {/* Bottom Newsletter */}
      <NewsletterSignup />
    </div>
  );
};

export default HomePage;