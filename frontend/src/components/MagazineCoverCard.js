import React from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Crown, Calendar, Eye, BookOpen } from 'lucide-react';

const MagazineCoverCard = ({ issue, onReadClick, canRead, index = 0 }) => {
  if (!issue || !issue.articles || issue.articles.length === 0) {
    return null;
  }

  const heroArticle = issue.articles.find(a => a.hero_image) || issue.articles[0];
  const monthName = issue.displayDate.split(' ')[0].toUpperCase();
  const year = issue.displayDate.split(' ')[1];
  const premiumArticles = issue.articles.filter(a => a.is_premium);
  const totalViews = issue.articles.reduce((sum, article) => sum + (article.view_count || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => canRead ? onReadClick(issue.articles) : null}
    >
      {/* Magazine Cover - GQ Grid Style */}
      <div className="relative mb-6">
        <div 
          className="aspect-[210/297] rounded-xl overflow-hidden shadow-lg bg-cover bg-center relative transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${heroArticle?.hero_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face'})`
          }}
        >
          {/* Magazine Header */}
          <div className="absolute top-4 left-4 right-4">
            <div className="flex items-center justify-between text-white text-xs">
              <div className="font-bold tracking-widest">JUST URBANE</div>
              <div className="font-light">{year}</div>
            </div>
          </div>

          {/* Month Title */}
          <div className="absolute top-10 left-4">
            <h3 className="text-4xl font-bold text-white tracking-tight font-serif">
              {monthName}
            </h3>
            <p className="text-white/80 text-xs font-light uppercase tracking-wide">ISSUE</p>
          </div>

          {/* Featured Story */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
              <div className="text-amber-300 text-xs font-bold uppercase tracking-wide mb-1">
                {heroArticle?.category || 'Featured'}
              </div>
              <h4 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                {heroArticle?.title || 'Premium Content'}
              </h4>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {canRead ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-white fill-current" />
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          {/* Premium Badge */}
          {premiumArticles.length > 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                PREMIUM
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Issue Details */}
      <div className="space-y-4">
        {/* Issue Title and Date */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">{issue.displayDate}</span>
          </div>
          <h4 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
            {issue.displayDate} Issue
          </h4>
        </div>

        {/* Issue Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{issue.articles.length} articles</span>
            </div>
            <div className="flex items-center">
              <Crown className="h-4 w-4 text-amber-600 mr-1" />
              <span>{premiumArticles.length} premium</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Eye className="h-4 w-4 mr-1" />
            <span>{totalViews > 1000 ? `${(totalViews/1000).toFixed(1)}k` : totalViews} views</span>
          </div>
        </div>

        {/* Article Previews */}
        <div className="space-y-2">
          <h5 className="font-semibold text-gray-900 text-sm">Featured articles:</h5>
          <div className="space-y-2">
            {issue.articles.slice(0, 3).map((article, idx) => (
              <div key={article.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {article.hero_image ? (
                    <img 
                      src={article.hero_image} 
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <BookOpen className="h-3 w-3 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 line-clamp-1">
                    {article.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="capitalize">{article.category}</span>
                    {article.is_premium && (
                      <Crown className="h-3 w-3 text-amber-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
            canRead
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white group-hover:scale-105 shadow-lg'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canRead}
        >
          {canRead ? (
            <>
              <BookOpen className="inline h-4 w-4 mr-2" />
              Read Issue
            </>
          ) : (
            <>
              <Lock className="inline h-4 w-4 mr-2" />
              Premium Required
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MagazineCoverCard;