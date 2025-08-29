import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Eye, User, Tag, Crown, Share2, Heart, ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonArticle } from '../components/LoadingSpinner';
import PremiumContentGate from '../components/PremiumContentGate';
import MagazineReader from '../components/MagazineReader';
import { useAuth } from '../context/AuthContext';
import { useArticle, useArticles } from '../hooks/useArticles';
import { formatDate, formatReadingTime } from '../utils/formatters';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: article, isLoading, error } = useArticle(slug);

  useEffect(() => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist.
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
    }
  };

  // Category Labels like GQ India
  const categoryLabels = {
    fashion: "Look Good",
    technology: "Get Smart", 
    tech: "Get Smart",
    business: "Get Smart",
    finance: "Get Smart",
    travel: "Live Well",
    health: "Live Well",
    culture: "Entertainment",
    art: "Entertainment",
    entertainment: "Entertainment",
    auto: "Live Well",
    grooming: "Look Good",
    food: "Live Well",
    aviation: "Live Well", 
    people: "Entertainment",
    luxury: "Live Well"
  };

  const categoryLabel = categoryLabels[article.category] || "Category";

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb - GQ Style */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to={`/category/${article.category}`} className="hover:text-gray-900 font-medium capitalize">
              {article.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{article.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-16">
        {/* Article Header - Professional GQ Style */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category Label */}
          <div className="mb-6">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">
              {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Subtitle/Dek */}
          {article.dek && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
              {article.dek}
            </p>
          )}

          {/* Article Meta - Clean Style */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200 text-sm text-gray-500">
            {/* Author */}
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">By {article.author_name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time>{formatDate(article.published_at)}</time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatReadingTime(article.reading_time)}</span>
            </div>

            {/* Views */}
            {article.view_count > 0 && (
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{article.view_count.toLocaleString()} views</span>
              </div>
            )}

            {/* Share */}
            <button
              onClick={shareArticle}
              className="flex items-center hover:text-gray-700 transition-colors ml-auto"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </motion.div>

        {/* Hero Image */}
        {article.hero_image && (
          <motion.div 
            className="mb-12 max-w-6xl mx-auto"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Article Content - GQ India Hybrid Model */}
          <motion.div 
            className="prose prose-lg lg:prose-xl max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Show content based on access */}
            {article.is_premium && isLocked ? (
              // Premium content gate for locked articles
              <PremiumContentGate article={article} showPreview={true} />
            ) : (
              // Full content for free articles or subscribed users
              <div>
                {article.body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && !isLocked && (
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
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
                    className="bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to Category */}
          <motion.div 
            className="mt-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to={`/category/${article.category}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
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