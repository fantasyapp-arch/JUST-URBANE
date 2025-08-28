import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Eye, User, Tag, Crown, Share2, Heart, BookOpen, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonArticle } from '../components/LoadingSpinner';
import NewsletterSignup from '../components/NewsletterSignup';
import PremiumContentGate from '../components/PremiumContentGate';
import { useAuth } from '../context/AuthContext';
import { useArticle } from '../hooks/useArticles';
import { formatDate, formatReadingTime } from '../utils/formatters';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: article, isLoading, error } = useArticle(slug);

  useEffect(() => {
    // Scroll to top on article load
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <SkeletonArticle />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-primary-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  const isLocked = article?.is_locked || (article?.is_premium && !canReadPremium);

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.dek,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gold-600">Home</Link>
            <span>/</span>
            <Link to={`/category/${article.category}`} className="hover:text-gold-600 capitalize">
              {article.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{article.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        {/* Article Header */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category and Premium Badge */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              to={`/category/${article.category}`}
              className="category-chip hover:bg-primary-200 transition-colors"
            >
              {article.category}
            </Link>
            {article.is_premium && (
              <span className="premium-badge">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </span>
            )}
            {article.is_trending && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Trending
              </span>
            )}
            {article.is_sponsored && (
              <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full">
                Sponsored
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-primary-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Subtitle/Dek */}
          {article.dek && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
              {article.dek}
            </p>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between py-6 border-t border-b border-gray-200 mb-12">
            <div className="flex flex-wrap items-center gap-6">
              {/* Author */}
              <Link
                to={`/author/${article.author_name?.toLowerCase().replace(' ', '-')}`}
                className="flex items-center hover:text-gold-600 transition-colors"
              >
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{article.author_name}</span>
              </Link>

              {/* Date */}
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <time>{formatDate(article.published_at)}</time>
              </div>

              {/* Reading Time */}
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{formatReadingTime(article.reading_time)}</span>
              </div>

              {/* Views */}
              {article.view_count > 0 && (
                <div className="flex items-center text-gray-600">
                  <Eye className="h-5 w-5 mr-2" />
                  <span>{article.view_count.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <button
                onClick={shareArticle}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 bg-gold-100 hover:bg-gold-200 text-gold-700 rounded-lg transition-colors">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        {article.hero_image && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={article.hero_image}
                alt={article.title}
                className="w-full h-96 md:h-[600px] object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-article.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Premium Content Gate */}
          {!canReadPremium && (
            <motion.div 
              className="bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-200 rounded-2xl p-8 mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Crown className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
                Premium Content
              </h3>
              <p className="text-gray-700 mb-6 max-w-md mx-auto">
                This article is available to premium subscribers. Join thousands of readers who enjoy unlimited access to our luxury lifestyle content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing" className="btn-primary">
                  View Plans
                </Link>
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div 
            className={`prose prose-lg lg:prose-xl max-w-none ${shouldBlur ? 'premium-blur' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {article.body.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}

            {/* Newsletter Signup - Inline */}
            {canReadPremium && (
              <div className="my-12">
                <NewsletterSignup variant="inline" />
              </div>
            )}
          </motion.div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && canReadPremium && (
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="bg-gray-100 hover:bg-gold-100 text-gray-700 hover:text-gold-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Articles */}
          {canReadPremium && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif font-bold text-primary-900 mb-4">
                  Continue Reading
                </h3>
                <p className="text-gray-600">
                  Discover more stories from our {article.category} collection
                </p>
              </div>
              
              <div className="text-center">
                <Link
                  to={`/category/${article.category}`}
                  className="inline-flex items-center btn-primary"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore {article.category} Articles
                </Link>
              </div>
            </motion.div>
          )}

          {/* Back to Category */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link
              to={`/category/${article.category}`}
              className="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {article.category} Articles
            </Link>
          </motion.div>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;