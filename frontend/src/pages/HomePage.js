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
    <div className="min-h-screen bg-gray-100 w-full">
      {/* PREMIUM PROMOTIONAL BANNER */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-gold-500/10"></div>
        <div className="relative z-10 container mx-auto px-4 py-3">
          <div className="flex items-center justify-center md:justify-between">
            <div className="flex items-center justify-center space-x-3 md:space-x-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-gold-400 animate-pulse" />
                <span className="font-bold text-sm md:text-lg tracking-wide">LIMITED TIME OFFER!</span>
              </div>
              <div className="hidden md:block">
                <span className="text-base md:text-lg">
                  Flat <span className="font-bold text-lg md:text-xl text-gold-400">67% OFF</span> on Just Urbane Digital + Print Magazine. 
                  Save <span className="font-bold text-gold-400">₹2,401</span>
                </span>
              </div>
              <div className="md:hidden">
                <span className="text-xs">
                  <span className="font-bold text-gold-400">67% OFF</span> Just Urbane Magazine!
                </span>
              </div>
            </div>
            <Link 
              to="/pricing" 
              className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black font-bold px-4 py-2 md:px-6 md:py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 ml-4 md:ml-0"
            >
              <span className="text-sm md:text-base">BUY NOW</span>
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="w-full">
        
        {/* HERO SECTION - PROFESSIONAL MAGAZINE STYLE */}
        <section className="bg-white w-full py-6">
          <div className="w-full px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
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
            <div className="lg:col-span-4 space-y-4">
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
          </div>
        </section>

        {/* FASHION SECTION - PROFESSIONAL */}
        {fashionArticles.length > 0 && (
          <motion.section 
            className="bg-gray-50 w-full py-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-full px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
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

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
                  <div className="md:col-span-4 space-y-4">
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
              </div>
            </div>
          </motion.section>
        )}

        {/* TECHNOLOGY SECTION - PROFESSIONAL */}
        {techArticles.length > 0 && (
          <motion.section 
            className="bg-white w-full py-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="w-full px-4">
              <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(techArticles.length > 0 ? techArticles.slice(0, 4) : [
                {
                  id: 1,
                  title: 'Apple Vision Pro: The Future of Computing is Here',
                  hero_image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop',
                  category: 'Technology',
                  author_name: 'Tech Editor',
                  published_at: '2025-08-30',
                  reading_time: 5,
                  view_count: 1234,
                  slug: 'apple-vision-pro-future'
                },
                {
                  id: 2,
                  title: 'Electric Supercars: Performance Meets Sustainability',
                  hero_image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop',
                  category: 'Automotive',
                  author_name: 'Auto Expert',
                  published_at: '2025-08-29',
                  reading_time: 7,
                  view_count: 987,
                  slug: 'electric-supercars'
                },
                {
                  id: 3,
                  title: 'AI in Business: Transforming Corporate Strategy',
                  hero_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
                  category: 'Business Tech',
                  author_name: 'Business Analyst',
                  published_at: '2025-08-28',
                  reading_time: 6,
                  view_count: 1456,
                  slug: 'ai-business-strategy'
                },
                {
                  id: 4,
                  title: 'Luxury Smart Homes: Technology Meets Comfort',
                  hero_image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
                  category: 'Smart Home',
                  author_name: 'Home Tech',
                  published_at: '2025-08-27',
                  reading_time: 8,
                  view_count: 876,
                  slug: 'luxury-smart-homes'
                }
              ]).map((article, index) => (
                <ProfessionalArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
                ))}
              </div>
            </div>
          </div>
          </motion.section>
        )}



        {/* TRENDING ARTICLES - GQ STYLE */}
        <motion.section 
          className="bg-gray-50 w-full py-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
            <div className="border-t-2 border-gray-900 pt-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">
                  Trending
                </h2>
                <Link
                  to="/trending"
                  className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                >
                  View All
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
              {/* Use trending articles or fallback content */}
              {(trendingArticles.length > 0 ? trendingArticles.slice(0, 3) : [
                {
                  id: 1,
                  title: 'The Future of Luxury: How Technology is Reshaping Premium Experiences',
                  hero_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
                  category: 'Technology',
                  author_name: 'Arjun Menon',
                  published_at: '2025-08-29',
                  reading_time: 6,
                  view_count: 2847,
                  slug: 'future-luxury-technology'
                },
                {
                  id: 2,
                  title: 'Sustainable Fashion: The New Status Symbol Among Elite Circles',
                  hero_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
                  category: 'Fashion',
                  author_name: 'Priya Sharma',
                  published_at: '2025-08-28',
                  reading_time: 8,
                  view_count: 1923,
                  slug: 'sustainable-fashion-status'
                },
                {
                  id: 3,
                  title: 'India\'s Most Exclusive Private Members Clubs: An Inside Look',
                  hero_image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&h=400&fit=crop',
                  category: 'Culture',
                  author_name: 'Vikram Singh',
                  published_at: '2025-08-27',
                  reading_time: 12,
                  view_count: 3156,
                  slug: 'exclusive-private-clubs'
                }
              ]).map((article, index) => (
                <ProfessionalArticleCard 
                  key={article.id}
                  article={article} 
                  layout="standard"
                  index={index}
                />
                ))}
              </div>
            </div>
          </div>
        </div>
        </motion.section>

        {/* AUTOMOTIVE SECTION - COMPACT */}
        <motion.section 
          className="bg-white w-full py-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
        >
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                Automotive
              </h2>
              <Link
                to="/category/automotive"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Lamborghini Revuelto: The New Hybrid Beast',
                image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
                category: 'Supercars'
              },
              {
                title: 'Mercedes EQS: Redefining Electric Luxury',
                image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
                category: 'Electric'
              },
              {
                title: 'Porsche 911 GT3 RS: Track-Focused Excellence',
                image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
                category: 'Sports Cars'
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.96 + index * 0.05 }}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight text-sm">
                    {article.title}
                  </h3>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
        </motion.section>

        {/* LIFESTYLE SECTION - MIXED LAYOUT */}
        <motion.section 
          className="bg-gray-50 w-full py-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="w-full px-4">
            <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">
                Lifestyle
              </h2>
              <Link
                to="/category/lifestyle"
                className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
              >
                View All
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured Lifestyle Article */}
            <motion.div 
              className="group cursor-pointer"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <Link to="/article/luxury-watch-investment">
                <div className="relative overflow-hidden rounded-lg shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=800&h=500&fit=crop"
                    alt="Luxury Watch Investment"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded text-sm font-bold mb-4 inline-block">
                      WATCHES
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors leading-tight mb-4">
                      The Art of Watch Investment: Building a Premium Collection
                    </h3>
                    <div className="flex items-center text-white/80 text-sm space-x-4">
                      <span>By Rohit Khanna</span>
                      <span>•</span>
                      <span>Aug 28, 2025</span>
                      <span>•</span>
                      <span>10 min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Lifestyle Article List */}
            <div className="space-y-3">
              {[
                {
                  title: 'Mumbai\'s Hidden Speakeasies: Where the Elite Unwind',
                  image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=250&fit=crop',
                  category: 'Culture',
                  author: 'Ananya Desai',
                  date: '25 Aug 2025',
                  readTime: '7 min'
                },
                {
                  title: 'Luxury Car Trends: The Rise of Electric Supercars',
                  image: 'https://images.unsplash.com/photo-1549399810-ec2d17c20e7c?w=400&h=250&fit=crop',
                  category: 'Automotive',
                  author: 'Karan Malhotra',
                  date: '23 Aug 2025',
                  readTime: '5 min'
                },
                {
                  title: 'Fine Dining Revolution: India\'s Michelin Star Pursuit',
                  image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=250&fit=crop',
                  category: 'Food & Drink',
                  author: 'Chef Raghav Iyer',
                  date: '20 Aug 2025',
                  readTime: '9 min'
                }
              ].map((article, index) => (
                <motion.div 
                  key={index}
                  className="group cursor-pointer flex gap-4 bg-white hover:bg-gray-50 transition-colors duration-300 p-4 rounded-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-32 h-20 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                        {article.category}
                      </span>
                    </div>
                    <h4 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-2">
                      {article.title}
                    </h4>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </motion.section>

        {/* WATCHES & LUXURY SECTION - COMPACT */}
        <motion.section 
          className="mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25 }}
        >
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                Watches & Luxury
              </h2>
              <Link
                to="/category/watches"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  title: 'Rolex Submariner: The Ultimate Dive Watch',
                  image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=200&fit=crop',
                  price: '₹8,50,000'
                },
                {
                  title: 'Patek Philippe Aquanaut: Sporty Elegance',
                  image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=300&h=200&fit=crop',
                  price: '₹28,00,000'
                },
                {
                  title: 'Audemars Piguet Royal Oak: Icon Redefined',
                  image: 'https://images.unsplash.com/photo-1606859440495-1306a78b3dd1?w=300&h=200&fit=crop',
                  price: '₹35,00,000'
                },
                {
                  title: 'Richard Mille: The Future of Watchmaking',
                  image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&h=200&fit=crop',
                  price: '₹85,00,000'
                }
              ].map((watch, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.26 + index * 0.05 }}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={watch.image}
                      alt={watch.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-gold-500 text-black px-2 py-1 rounded text-xs font-bold">
                        {watch.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight text-sm">
                      {watch.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* BUSINESS & FINANCE SECTION */}
        <motion.section 
          className="mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">
                Business & Finance
              </h2>
              <Link
                to="/category/business"
                className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Startup Unicorns: The New Billionaire Playbook',
                  image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
                  category: 'Business',
                  readTime: '6 min'
                },
                {
                  title: 'Crypto Investment Strategies for High Net Worth Individuals',
                  image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
                  category: 'Finance',
                  readTime: '8 min'
                },
                {
                  title: 'Real Estate Empire: Mumbai\'s Premium Property Market',
                  image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
                  category: 'Real Estate',
                  readTime: '10 min'
                },
                {
                  title: 'Angel Investing: How India\'s Elite Build Wealth',
                  image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
                  category: 'Investment',
                  readTime: '7 min'
                }
              ].map((article, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 text-white px-3 py-1 rounded text-xs font-bold">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* VIDEOS SECTION - GQ STYLE */}
        <motion.section 
          className="mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <div className="border-t-2 border-gray-900 pt-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-1">
                  Videos
                </h2>
                <p className="text-gray-600 text-base lg:text-lg">
                  Exclusive interviews and premium video content
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Featured Video */}
              <motion.div 
                className="group cursor-pointer"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=500&fit=crop"
                    alt="Featured Video"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="h-8 w-8 text-red-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                      Video
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                      12:45
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-3">
                    Inside India's Most Exclusive Business Club
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    A rare glimpse into the private chambers of India's business elite and their networking secrets.
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    <span>6 May 2025</span>
                  </div>
                </div>
              </motion.div>

              {/* Video List */}
              <div className="space-y-3">
                {[
                  {
                    title: 'Luxury Watch Collection Worth ₹50 Crores',
                    thumbnail: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?w=400&h=250&fit=crop',
                    duration: '8:30',
                    category: 'No Filter',
                    date: '17 April 2025'
                  },
                  {
                    title: 'AI Billionaire\'s Daily Routine Revealed',
                    thumbnail: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400&h=250&fit=crop',
                    duration: '15:20',
                    category: 'My Essentials',
                    date: '7 February 2025'
                  }
                ].map((video, index) => (
                  <motion.div 
                    key={index}
                    className="group cursor-pointer flex gap-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                  >
                    <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-20 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="h-3 w-3 text-red-600 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1">
                        <span className="bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          {video.category}
                        </span>
                      </div>
                      <h4 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-2">
                        {video.title}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {video.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* GROOMING & WELLNESS SECTION */}
        <motion.section 
          className="mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">
                Grooming & Wellness
              </h2>
              <Link
                to="/category/grooming"
                className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
              >
                View All
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'The Complete Guide to Premium Men\'s Skincare Routines',
                  image: 'https://images.unsplash.com/photo-1506629905877-d4461ba3c9c8?w=600&h=400&fit=crop',
                  category: 'Skincare',
                  author: 'Dr. Sameer Khurana',
                  date: '22 Aug 2025',
                  layout: 'large'
                },
                {
                  title: 'Mental Health: Executive Stress Management Techniques',
                  image: 'https://images.unsplash.com/photo-1591019479261-1a103efda8e6?w=400&h=300&fit=crop',
                  category: 'Wellness',
                  author: 'Dr. Neha Gupta',
                  date: '20 Aug 2025',
                  layout: 'standard'
                },
                {
                  title: 'Luxury Fitness: Private Gyms for the Elite',
                  image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                  category: 'Fitness',
                  author: 'Fitness Expert Rajesh',
                  date: '18 Aug 2025',
                  layout: 'standard'
                }
              ].map((article, index) => (
                <motion.div
                  key={index}
                  className={`group cursor-pointer ${index === 0 ? 'lg:row-span-2' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          index === 0 ? 'h-64 lg:h-80' : 'h-48'
                        }`}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className={`font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-4 ${
                        index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'
                      }`}>
                        {article.title}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CULTURE & ENTERTAINMENT FINAL SECTION */}
        <motion.section 
          className="mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
        >
          <div className="border-t-2 border-gray-900 pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900">
                Culture & Entertainment
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {[
                {
                  title: 'Bollywood\'s Power Players: The New Generation of Producers',
                  image: 'https://images.unsplash.com/photo-1489599126737-8fdbab4da1d1?w=300&h=200&fit=crop',
                  category: 'Entertainment'
                },
                {
                  title: 'Art Market Boom: Contemporary Indian Artists to Watch',
                  image: 'https://images.unsplash.com/photo-1544967919-6f7de8aa5e35?w=300&h=200&fit=crop',
                  category: 'Art'
                },
                {
                  title: 'Music Festivals: The Elite Social Calendar',
                  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
                  category: 'Music'
                },
                {
                  title: 'Fashion Week Highlights: Designer Spotlight',
                  image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=200&fit=crop',
                  category: 'Fashion'
                },
                {
                  title: 'Literature Scene: India\'s Rising Authors',
                  image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
                  category: 'Books'
                }
              ].map((article, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight text-sm">
                        {article.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FOOD & DRINK SECTION - COMPACT */}
        <motion.section 
          className="mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                Food & Drink
              </h2>
              <Link
                to="/category/food-drink"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="grid md:grid-cols-6 gap-4">
              {[
                {
                  title: 'Mumbai\'s Best Fine Dining Restaurants 2025',
                  image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=250&h=180&fit=crop',
                  category: 'Dining'
                },
                {
                  title: 'Premium Whiskey Collection Guide',
                  image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=250&h=180&fit=crop',
                  category: 'Spirits'
                },
                {
                  title: 'Michelin Star Chefs in India',
                  image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=250&h=180&fit=crop',
                  category: 'Chefs'
                },
                {
                  title: 'Wine Investment: Rare Vintage Guide',
                  image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=250&h=180&fit=crop',
                  category: 'Wine'
                },
                {
                  title: 'Private Chef Services for Elite',
                  image: 'https://images.unsplash.com/photo-1556909114-5bb7f7b2b214?w=250&h=180&fit=crop',
                  category: 'Services'
                },
                {
                  title: 'Luxury Food Experiences Worldwide',
                  image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=250&h=180&fit=crop',
                  category: 'Travel'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.81 + index * 0.03 }}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1 left-1">
                      <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-serif font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight text-xs">
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* NEWSLETTER SUBSCRIPTION - CLEAN GQ STYLE */}
        <motion.section 
          className="mb-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
        >
          <div className="border-t border-gray-200 pt-2 pb-1">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-4">
                Newsletter
              </h3>
              <p className="text-gray-600 mb-6">
                Get the best of Just Urbane delivered to your inbox weekly
              </p>
              
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 border-r-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 border border-gray-900 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.section>



      </div>
    </div>
  );
};

export default HomePage;