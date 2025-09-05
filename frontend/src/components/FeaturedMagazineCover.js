import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Crown, BookOpen, Eye, Calendar } from 'lucide-react';
import DigitalMagazineViewer from './DigitalMagazineViewer';

const FeaturedMagazineCover = ({ issue, onReadClick, canRead }) => {
  const [isMagazineOpen, setIsMagazineOpen] = useState(false);
  
  // Use real magazine data instead of fake issue data
  const realMagazineData = {
    title: "Just Urbane",
    displayDate: "August 2025",
    subtitle: "Premium Digital Magazine",
    articles: issue?.articles || [],
    pdfUrl: "https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf"
  };

  const monthName = "AUGUST";
  const year = "2025";
  const premiumArticles = realMagazineData.articles.filter(a => a.is_premium) || [];
  const totalViews = realMagazineData.articles.reduce((sum, article) => sum + (article.view_count || 0), 0) || 2500;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Side - Magazine Cover */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative group"
      >
        <div 
          className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black relative cursor-pointer transform transition-transform duration-500 hover:scale-105"
          onClick={() => setIsMagazineOpen(true)}
        >
          {/* Magazine Header - GQ Style */}
          <div className="absolute top-8 left-8 right-8">
            <div className="flex items-center justify-between text-white">
              <div className="text-sm font-bold tracking-[0.2em] uppercase">JUST URBANE</div>
              <div className="text-sm font-light">{year}</div>
            </div>
          </div>

          {/* Large Month Title - GQ Style */}
          <div className="absolute top-20 left-8">
            <h1 className="text-7xl lg:text-8xl font-bold text-white tracking-tight leading-none font-serif">
              {monthName}
            </h1>
            <p className="text-white/80 text-lg mt-2 font-light">ISSUE</p>
          </div>

          {/* Main Feature Story */}
          <div className="absolute bottom-24 left-8 right-8">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6">
              <div className="text-amber-300 text-sm font-bold uppercase tracking-wide mb-2">
                DIGITAL MAGAZINE
              </div>
              <h2 className="text-white font-bold text-xl lg:text-2xl mb-3 line-clamp-3 leading-tight">
                Premium Content in A4 Format
              </h2>
              <div className="text-white/90 text-sm font-light">
                High Resolution PDF • Interactive Experience
              </div>
            </div>
          </div>

          {/* Interactive Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 transform group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* PDF Badge */}
          <div className="absolute top-8 right-8">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              PDF • A4
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Issue Details & Preview */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-8"
      >
        {/* Issue Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-amber-600" />
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wide">
              {issue.displayDate} Issue
            </span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            This magazine access is exclusive to our subscribers.
          </h3>
          <p className="text-xl text-gray-600 leading-relaxed">
            Subscribe now and get immediate access.
          </p>
        </div>

        {/* Issue Stats - GQ Style */}
        <div className="grid grid-cols-3 gap-6 py-6 border-y border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{issue.articles.length}</div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-600 mr-1" />
              {premiumArticles.length}
            </div>
            <div className="text-sm text-gray-600">Premium</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
              <Eye className="h-5 w-5 text-gray-600 mr-1" />
              {totalViews > 1000 ? `${(totalViews/1000).toFixed(1)}k` : totalViews}
            </div>
            <div className="text-sm text-gray-600">Views</div>
          </div>
        </div>

        {/* Featured Articles Preview */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-lg">In this issue:</h4>
          <div className="space-y-4">
            {issue.articles.slice(0, 4).map((article, index) => (
              <div key={article.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {article.hero_image ? (
                    <img 
                      src={article.hero_image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                    {article.title}
                  </h5>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="capitalize bg-gray-200 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    {article.is_premium && (
                      <div className="flex items-center text-amber-600">
                        <Crown className="h-3 w-3 mr-1" />
                        <span className="font-medium">Premium</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Pricing - GQ Style */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Did you know our monthly issues can now be read online?
            </h4>
            <p className="text-gray-600">Subscribe to read our {issue.displayDate} issue now.</p>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl text-center">
              <div className="font-bold text-lg">GO DIGITAL 1 YEAR</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 line-through text-sm">₹1500</div>
              <div className="text-3xl font-bold text-gray-900">₹900</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-gray-600 mb-4">OR</div>
            <button
              onClick={() => onReadClick ? onReadClick(issue.articles) : null}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              FREE PREVIEW - READ MAGAZINE
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already purchased? <a href="/login" className="text-amber-600 hover:text-amber-700 font-semibold">Login</a>
            <span className="mx-2">|</span>
            <a href="/pricing" className="text-amber-600 hover:text-amber-700 font-semibold">More plans →</a>
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={() => canRead ? onReadClick(issue.articles) : null}
          className={`w-full py-6 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
            canRead
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canRead}
        >
          {canRead ? (
            <>
              <BookOpen className="inline h-6 w-6 mr-3" />
              Read Digital Magazine
            </>
          ) : (
            <>
              <Lock className="inline h-6 w-6 mr-3" />
              Subscribe to Read Full Magazine
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default FeaturedMagazineCover;