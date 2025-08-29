import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Lock, Calendar, Clock, Eye, User, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatReadingTime } from '../utils/formatters';

// Article Left Page Component
export const ArticlePageLeft = ({ article, pageNumber }) => {
  return (
    <div className="h-full p-8 flex flex-col relative overflow-hidden bg-white">
      {/* Page Number */}
      <div className="absolute top-4 left-4 text-xs text-gray-400 font-medium">
        {pageNumber}
      </div>

      {/* Magazine Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Crown className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-bold tracking-wider text-gray-800">JUST URBANE</span>
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          {article.category}
        </div>
      </div>

      {/* Article Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.dek && (
          <p className="text-lg text-gray-600 leading-relaxed mb-6 font-light italic">
            {article.dek}
          </p>
        )}

        {/* Article Meta */}
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span className="font-medium">By {article.author_name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatReadingTime(article.reading_time)}</span>
          </div>
        </div>

        {/* Article Body - First part */}
        <div className="flex-1 prose prose-sm max-w-none">
          <div className="text-gray-700 leading-relaxed text-sm">
            {article.body && article.body.split('\n\n').slice(0, 3).map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify">
                {index === 0 && (
                  <span className="float-left text-6xl font-serif leading-none mr-2 mt-1 text-gray-800">
                    {paragraph.charAt(0)}
                  </span>
                )}
                {index === 0 ? paragraph.slice(1) : paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-px bg-amber-600"></div>
            <Crown className="h-3 w-3 text-amber-600" />
            <div className="w-8 h-px bg-amber-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Article Right Page Component
export const ArticlePageRight = ({ article, pageNumber }) => {
  return (
    <div className="h-full p-8 flex flex-col relative overflow-hidden bg-white">
      {/* Page Number */}
      <div className="absolute top-4 right-4 text-xs text-gray-400 font-medium">
        {pageNumber}
      </div>

      {/* Hero Image */}
      {article.hero_image && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={article.hero_image}
            alt={article.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-article.jpg';
            }}
          />
        </div>
      )}

      {/* Continued Article Body */}
      <div className="flex-1 prose prose-sm max-w-none">
        <div className="text-gray-700 leading-relaxed text-sm">
          {article.body && article.body.split('\n\n').slice(3).map((paragraph, index) => (
            <p key={index} className="mb-4 text-justify">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Article Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {article.is_premium && (
        <div className="absolute bottom-8 right-8">
          <div className="flex items-center bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </div>
        </div>
      )}
    </div>
  );
};

// Locked Article Page Component
export const LockedArticlePage = ({ article }) => {
  return (
    <div className="h-full p-8 flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center">
        {/* Lock Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title Preview */}
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4 line-clamp-2">
          {article.title}
        </h2>

        {/* Blur Preview */}
        <div className="relative mb-6">
          <p className="text-gray-600 text-sm leading-relaxed blur-sm">
            {article.body ? article.body.slice(0, 200) + '...' : 'Premium content preview...'}
          </p>
        </div>

        {/* Premium Notice */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 max-w-sm">
          <div className="flex items-center justify-center mb-3">
            <Crown className="h-5 w-5 text-amber-600 mr-2" />
            <span className="font-bold text-amber-600">Premium Content</span>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            Unlock this article with your premium subscription to continue reading.
          </p>
        </div>
      </div>
    </div>
  );
};

// Subscription Promotion Page Component
export const SubscriptionPromotionPage = () => {
  return (
    <div className="h-full p-8 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-sm">
        {/* Premium Crown */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Crown className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Unlock Premium Content
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Get unlimited access to exclusive articles, digital magazines, and premium insights.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            Unlimited premium articles
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            Digital magazine access
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            Ad-free reading experience
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            Exclusive member benefits
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
          <p className="text-2xl font-bold text-amber-600">₹499</p>
          <p className="text-gray-600 text-sm">per year</p>
        </div>

        <p className="text-xs text-gray-500">
          Cancel anytime • No hidden fees
        </p>
      </div>
    </div>
  );
};

// Table of Contents Modal Component
export const TableOfContentsModal = ({ isOpen, onClose, articles, onPageSelect, currentPage }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Table of Contents</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {/* Cover */}
            <button
              onClick={() => onPageSelect(0)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentPage === 0 ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">Cover</div>
              <div className="text-sm text-gray-500">Page 1</div>
            </button>

            {/* Articles */}
            {articles.map((article, index) => {
              const pageNum = (index * 2) + 2;
              const isCurrentPage = currentPage >= pageNum - 1 && currentPage <= pageNum;
              
              return (
                <button
                  key={article.id}
                  onClick={() => onPageSelect(pageNum - 1)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isCurrentPage ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium line-clamp-2">{article.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Pages {pageNum}-{pageNum + 1}
                      </div>
                    </div>
                    {article.is_premium && (
                      <Crown className="h-4 w-4 text-amber-600 ml-2 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Back Cover */}
            <button
              onClick={() => onPageSelect(articles.length * 2 + 1)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentPage === articles.length * 2 + 1 ? 'bg-amber-100 text-amber-900' : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">Back Cover</div>
              <div className="text-sm text-gray-500">Page {articles.length * 2 + 2}</div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};