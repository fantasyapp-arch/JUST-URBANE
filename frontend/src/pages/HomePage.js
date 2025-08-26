import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Award, Calendar, Eye, Clock } from 'lucide-react';
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
  
  // Load articles from different categories for GQ-style sections
  const { data: fashionArticles = [] } = useCategoryArticles('fashion', { limit: 6 });
  const { data: businessArticles = [] } = useCategoryArticles('business', { limit: 4 });
  const { data: techArticles = [] } = useCategoryArticles('technology', { limit: 4 });
  const { data: entertainmentArticles = [] } = useCategoryArticles('entertainment', { limit: 4 });

  // GQ-style category configuration
  const categories = [
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Style, trends & designer collections',
      gradient: 'from-purple-600 to-pink-600',
      articles: fashionArticles
    },
    {
      name: 'Business', 
      slug: 'business',
      description: 'Leadership, strategy & success stories',
      gradient: 'from-blue-600 to-indigo-600',
      articles: businessArticles
    },
    {
      name: 'Technology',
      slug: 'technology', 
      description: 'Latest gadgets & innovation',
      gradient: 'from-cyan-600 to-blue-600',
      articles: techArticles
    },
    {
      name: 'Finance',
      slug: 'finance',
      description: 'Investment & wealth management',
      gradient: 'from-green-600 to-emerald-600',
      articles: []
    },
    {
      name: 'Travel',
      slug: 'travel',
      description: 'Luxury destinations & experiences',
      gradient: 'from-teal-600 to-cyan-600',
      articles: []
    },
    {
      name: 'Health',
      slug: 'health',
      description: 'Wellness, fitness & optimal living',
      gradient: 'from-red-600 to-rose-600',
      articles: []
    },
    {
      name: 'Culture',
      slug: 'culture',
      description: 'Arts, music & cultural insights',
      gradient: 'from-amber-600 to-orange-600',
      articles: []
    },
    {
      name: 'Art',
      slug: 'art',
      description: 'Contemporary art & exhibitions',
      gradient: 'from-indigo-600 to-purple-600',
      articles: []
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Movies, shows & celebrity insights',
      gradient: 'from-violet-600 to-fuchsia-600',
      articles: entertainmentArticles
    }
  ];

  // Mock video content for GQ-style video section
  const featuredVideos = [
    {
      id: '1',
      title: 'Inside India\'s Most Exclusive Watch Collection',
      thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      duration: '12:45',
      category: 'Watches',
      author: 'Urbane Team'
    },
    {
      id: '2', 
      title: 'How Luxury Hotels Are Redefining Service',
      thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      duration: '8:30',
      category: 'Travel',
      author: 'Travel Editor'
    },
    {
      id: '3',
      title: 'Tech Billionaire\'s Daily Routine Revealed',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      duration: '15:20',
      category: 'Business',
      author: 'Business Team'
    }
  ];

  const GQStyleArticleCard = ({ article, layout = 'standard' }) => {
    const getLayoutClasses = () => {
      switch (layout) {
        case 'hero':
          return {
            container: 'relative overflow-hidden rounded-lg group cursor-pointer col-span-2 row-span-2',
            image: 'h-96 w-full object-cover group-hover:scale-105 transition-transform duration-700',
            content: 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white',
            title: 'text-3xl font-serif font-bold leading-tight mb-3',
            category: 'bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-md text-sm font-medium mb-4',
            meta: 'text-white/80 text-sm'
          };
        case 'large':
          return {
            container: 'relative overflow-hidden rounded-lg group cursor-pointer col-span-1 row-span-2',
            image: 'h-80 w-full object-cover group-hover:scale-105 transition-transform duration-700',
            content: 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white',
            title: 'text-xl font-serif font-bold leading-tight mb-2',
            category: 'bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium mb-3',
            meta: 'text-white/70 text-xs'
          };
        case 'small':
          return {
            container: 'bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer',
            image: 'h-32 w-full object-cover group-hover:scale-105 transition-transform duration-500',
            content: 'p-3',
            title: 'text-sm font-serif font-semibold text-gray-900 leading-tight mb-2 line-clamp-2',
            category: 'text-xs text-gray-500 mb-2',
            meta: 'text-xs text-gray-400'
          };
        default: // standard
          return {
            container: 'bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer',
            image: 'h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500',
            content: 'p-4',
            title: 'text-lg font-serif font-semibold text-gray-900 leading-tight mb-2 line-clamp-2',
            category: 'text-xs text-gray-500 mb-2 uppercase tracking-wide',
            meta: 'text-xs text-gray-400 flex items-center gap-3'
          };
      }
    };

    const classes = getLayoutClasses();

    return (
      <Link to={`/article/${article.slug || article.id}`} className={classes.container}>
        <div className="relative overflow-hidden">
          <img
            src={article.hero_image || '/placeholder-image.jpg'}
            alt={article.title}
            className={classes.image}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        <div className={classes.content}>
          <div className={classes.category}>
            {article.category}
          </div>
          
          <h3 className={classes.title}>
            {article.title}
          </h3>
          
          <div className={classes.meta}>
            <span>By {article.author_name}</span>
            <span>{formatDateShort(article.published_at)}</span>
          </div>
        </div>
      </Link>
    );
  };

  const VideoCard = ({ video }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 text-gray-900 ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
          {video.category}
        </div>
        <h4 className="text-sm font-serif font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
          {video.title}
        </h4>
        <div className="text-xs text-gray-400">
          By {video.author}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Subscription Banner - GQ Style */}
      <div className="bg-black text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <img src="/placeholder-magazine-cover.jpg" alt="Magazine" className="h-8 w-6 object-cover rounded" />
            <span>Limited Time Offer! Flat 55% OFF on Premium Subscription. Save ₹3000</span>
            <Link to="/pricing" className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white font-medium transition-colors">
              Subscribe Now!
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid - GQ Style Layout */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Grid - Mixed Layout like GQ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
          {/* Main Featured Article - Large Hero */}
          {featuredArticles[0] && (
            <motion.div 
              className="lg:col-span-2 lg:row-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <GQStyleArticleCard article={featuredArticles[0]} layout="hero" />
            </motion.div>
          )}

          {/* Side Articles - GQ Style */}
          <div className="lg:col-span-2 grid gap-4">
            {featuredArticles.slice(1, 5).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              >
                <GQStyleArticleCard article={article} layout="standard" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Sections - GQ Style */}
        {categories.map((category, categoryIndex) => (
          category.articles && category.articles.length > 0 && (
            <motion.section 
              key={category.slug}
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * categoryIndex }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
                <Link
                  to={`/category/${category.slug}`}
                  className="flex items-center text-gray-700 hover:text-gray-900 font-medium group"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Mixed Grid Layout - GQ Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Featured article in this category */}
                {category.articles[0] && (
                  <div className="md:col-span-2">
                    <GQStyleArticleCard article={category.articles[0]} layout="large" />
                  </div>
                )}
                
                {/* Smaller articles */}
                <div className="space-y-4">
                  {category.articles.slice(1, 3).map((article) => (
                    <GQStyleArticleCard 
                      key={article.id} 
                      article={article} 
                      layout="small" 
                    />
                  ))}
                </div>
                
                <div className="space-y-4">
                  {category.articles.slice(3, 5).map((article) => (
                    <GQStyleArticleCard 
                      key={article.id} 
                      article={article} 
                      layout="small" 
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )
        ))}

        {/* People of the Year Section - GQ Style */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2 flex items-center">
                  <Award className="h-8 w-8 text-gold-400 mr-3" />
                  People of the Year 2025
                </h2>
                <p className="text-gray-300">
                  Celebrating exceptional individuals who are shaping our world
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Virat Kohli',
                  title: 'Cricket Legend & Style Icon',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                  category: 'Sports & Style'
                },
                {
                  name: 'Alia Bhatt',
                  title: 'Actor & Producer',
                  image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=400',
                  category: 'Entertainment'
                },
                {
                  name: 'Byju Raveendran',
                  title: 'Tech Entrepreneur',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                  category: 'Business'
                }
              ].map((person, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        {person.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {person.title}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/people-of-the-year" className="inline-flex items-center bg-gold-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-gold-400 transition-colors">
                View All Winners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Videos Section - GQ Style */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Videos
              </h2>
              <p className="text-gray-600">
                Exclusive interviews, behind-the-scenes, and premium video content
              </p>
            </div>
            <Link
              to="/videos"
              className="flex items-center text-gray-700 hover:text-gray-900 font-medium group"
            >
              Watch All
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </motion.section>

        {/* Latest Updates - Mixed Grid */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Latest Updates
              </h2>
              <p className="text-gray-600">
                Fresh stories across all categories
              </p>
            </div>
          </div>

          {/* GQ-style mixed grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Mix different article sizes */}
            {[...trendingArticles.slice(0, 8)].map((article, index) => (
              <div 
                key={article.id}
                className={`${index === 0 ? 'md:col-span-2 lg:col-span-3' : 
                           index === 1 ? 'md:col-span-2 lg:col-span-3' :
                           'md:col-span-2 lg:col-span-2'}`}
              >
                <GQStyleArticleCard 
                  article={article} 
                  layout={index < 2 ? 'large' : 'standard'}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter - Inline like GQ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <NewsletterSignup variant="inline" className="mb-16" />
        </motion.section>

      </div>

      {/* Bottom Newsletter */}
      <NewsletterSignup />
    </div>
  );
};

export default HomePage;