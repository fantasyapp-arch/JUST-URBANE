import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

const HeroSection = ({ featuredArticle, trendingArticles = [] }) => {
  if (!featuredArticle) {
    return (
      <div className="relative bg-gradient-to-br from-primary-50 to-gold-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded mx-auto mb-6 max-w-3xl"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto mb-8 max-w-2xl"></div>
            <div className="h-12 bg-gray-200 rounded mx-auto max-w-xs"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Hero Article */}
      <div className="relative h-screen max-h-[800px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredArticle.hero_image || '/placeholder-hero.jpg'}
            alt={featuredArticle.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-hero.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Category and Premium Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-gold-500 text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide">
                {featuredArticle.category}
              </span>
              {featuredArticle.is_premium && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                  Premium
                </span>
              )}
              {featuredArticle.is_trending && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="hero-title text-white mb-6">
              {featuredArticle.title}
            </h1>

            {/* Description */}
            {featuredArticle.dek && (
              <p className="hero-subtitle text-white/90 mb-8">
                {featuredArticle.dek}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-white/80">
              {featuredArticle.author_name && (
                <span className="font-medium">
                  By {featuredArticle.author_name}
                </span>
              )}
              {featuredArticle.published_at && (
                <span>
                  {formatDateShort(featuredArticle.published_at)}
                </span>
              )}
              {featuredArticle.reading_time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatReadingTime(featuredArticle.reading_time)}</span>
                </div>
              )}
              {featuredArticle.view_count > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{featuredArticle.view_count} views</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              to={`/article/${featuredArticle.slug || featuredArticle.id}`}
              className="inline-flex items-center bg-white text-primary-900 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              Read Full Story
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Trending Stories Bar */}
      {trendingArticles.length > 0 && (
        <div className="bg-primary-900 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <span className="text-gold-400 font-semibold text-sm uppercase tracking-wide mr-6 whitespace-nowrap">
                Trending Now
              </span>
              <div className="flex-1 overflow-hidden">
                <div className="flex space-x-8 animate-marquee">
                  {trendingArticles.slice(0, 5).map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.slug || article.id}`}
                      className="text-white hover:text-gold-300 transition-colors duration-200 whitespace-nowrap text-sm"
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;