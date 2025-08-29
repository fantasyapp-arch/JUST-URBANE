import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, BookOpen, Crown, Lock, Play, Users, 
  TrendingUp, Award, ArrowRight, Eye, Clock, Download, MoreHorizontal, Grid3X3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../hooks/useArticles';
import MagazineReader from '../components/MagazineReader';
import FeaturedMagazineCover from '../components/FeaturedMagazineCover';
import MagazineCoverCard from '../components/MagazineCoverCard';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const IssuesPage = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'archive'
  const { user, isAuthenticated } = useAuth();
  const { data: articles, isLoading } = useArticles();

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';

  // Group articles by month for magazine issues
  const groupArticlesByMonth = (articles) => {
    if (!articles) return {};
    
    const grouped = {};
    articles.forEach(article => {
      const date = new Date(article.published_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const displayDate = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = {
          displayDate,
          articles: [],
          date: date
        };
      }
      grouped[monthYear].articles.push(article);
    });
    
    return grouped;
  };

  const monthlyIssues = groupArticlesByMonth(articles);
  const sortedIssues = Object.entries(monthlyIssues).sort(([a], [b]) => b.localeCompare(a));

  const openMagazineReader = (issueArticles) => {
    setSelectedIssue(issueArticles);
    setIsReaderOpen(true);
  };

  const closeMagazineReader = () => {
    setIsReaderOpen(false);
    setSelectedIssue(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - GQ Style */}
      <div className="border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Magazine
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Read your favourite magazines anywhere, anytime | Enjoy unlimited access to our archives | 
              Download the latest issues on the Just Urbane App
            </p>
          </div>

          {/* GQ-Style Tab Navigation */}
          <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-xl p-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('archive')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === 'archive'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span>Archive</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Preview Tab Content */}
        {activeTab === 'preview' && sortedIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Current Issue Featured Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  {sortedIssues[0][1].displayDate} issue
                </h2>
                <button
                  onClick={() => setActiveTab('archive')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  View Archive →
                </button>
              </div>

              {/* Featured Magazine Cover Layout */}
              <FeaturedMagazineCover
                issue={sortedIssues[0][1]}
                onReadClick={openMagazineReader}
                canRead={canReadPremium}
              />
            </div>

            {/* Magazine Page Preview Thumbnails - GQ Style */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Page Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sample magazine page thumbnails */}
                {[1, 2, 3, 4].map((pageNum) => (
                  <motion.div
                    key={pageNum}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: pageNum * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => openMagazineReader(sortedIssues[0][1].articles)}
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 relative">
                      {/* Simulated page content */}
                      <div className="absolute inset-0 p-3">
                        <div className="text-xs text-gray-600 mb-2">Page {pageNum}</div>
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-16 bg-gray-300 rounded mt-3"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 bg-gray-300 rounded"></div>
                            <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
                            <div className="h-1.5 bg-gray-300 rounded w-3/5"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lock overlay for pages beyond preview */}
                      {pageNum > 3 && !canReadPremium && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <Lock className="h-4 w-4 text-gray-700" />
                          </div>
                        </div>
                      )}

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <Play className="h-4 w-4 text-gray-800 fill-current" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {pageNum <= 3 || canReadPremium ? 'Preview Available' : 'Premium Only'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* App Promotion Section - GQ Style */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white text-center mb-16">
              <h3 className="text-2xl font-bold mb-4">UPGRADE YOUR READING EXPERIENCE</h3>
              <p className="text-slate-300 mb-6">Subscribe to get access to our exclusive GQ reader app</p>
              <Link
                to="/pricing"
                className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="h-5 w-5 mr-2" />
                SUBSCRIBE
              </Link>
            </div>
          </motion.div>
        )}

        {/* Archive Tab Content */}
        {activeTab === 'archive' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Magazine Archive</h2>
              <p className="text-gray-600 text-lg">Explore our collection of premium digital magazines</p>
            </div>

            {/* Archive Grid - GQ Style */}
            {sortedIssues.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedIssues.map(([monthKey, issue], index) => (
                  <MagazineCoverCard
                    key={monthKey}
                    issue={issue}
                    onReadClick={openMagazineReader}
                    canRead={canReadPremium}
                    index={index}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Global Subscription Prompt - GQ Style */}
        {!canReadPremium && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 text-center border border-amber-200"
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Did you know our monthly issues can now be read online?
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Subscribe to read our {sortedIssues[0]?.[1]?.displayDate} issue now.
              </p>
              
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl text-center shadow-lg">
                  <div className="font-bold text-xl mb-1">GO DIGITAL 1 YEAR</div>
                  <div className="text-amber-100 text-sm">Best Value</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 line-through text-lg mb-1">₹1500</div>
                  <div className="text-4xl font-bold text-gray-900">₹900</div>
                  <div className="text-sm text-gray-600">Save 40%</div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-6 mb-8">
                <Link
                  to="/pricing"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  SUBSCRIBE NOW
                </Link>
                <div className="text-gray-400 text-lg">OR</div>
                <button
                  onClick={() => sortedIssues.length > 0 && openMagazineReader(sortedIssues[0][1].articles)}
                  className="border-2 border-amber-500 text-amber-700 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 transition-all duration-300"
                >
                  FREE PREVIEW
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Already purchased? <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold underline">Login</Link>
                <span className="mx-4">|</span>
                <Link to="/pricing" className="text-amber-600 hover:text-amber-700 font-semibold underline">More plans →</Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Magazine Reader */}
      <MagazineReader
        articles={selectedIssue}
        isOpen={isReaderOpen}
        onClose={closeMagazineReader}
      />
    </div>
  );
};

// Featured Issue Card Component
const FeaturedIssueCard = ({ issue, monthKey, onReadClick, canRead, isCurrent }) => {
  const premiumArticles = issue.articles.filter(a => a.is_premium);
  const totalViews = issue.articles.reduce((sum, article) => sum + (article.view_count || 0), 0);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {isCurrent && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  Latest
                </span>
              )}
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                {issue.displayDate}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {issue.displayDate} Issue
            </h3>
            <p className="text-gray-600">
              {issue.articles.length} articles • {premiumArticles.length} premium
            </p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Eye className="h-4 w-4 mr-1" />
              {totalViews.toLocaleString()} views
            </div>
          </div>
        </div>

        {/* Article Previews */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {issue.articles.slice(0, 4).map((article, index) => (
            <div key={article.id} className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                  {article.title}
                </h4>
                {article.is_premium && (
                  <Crown className="h-4 w-4 text-amber-600 ml-2 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <span className="capitalize">{article.category}</span>
                <span>•</span>
                <span>{article.author_name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Interactive Reading
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {totalViews > 1000 ? 'Popular' : 'Rising'}
            </div>
          </div>

          <button
            onClick={() => canRead ? onReadClick(issue.articles) : null}
            className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              canRead
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white transform hover:scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canRead}
          >
            {canRead ? (
              <>
                <BookOpen className="h-5 w-5 mr-2" />
                Read Magazine
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Premium Required
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Regular Issue Card Component
const IssueCard = ({ issue, monthKey, onReadClick, canRead, index }) => {
  const premiumArticles = issue.articles.filter(a => a.is_premium);
  const totalViews = issue.articles.reduce((sum, article) => sum + (article.view_count || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{issue.displayDate}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
            {issue.displayDate} Issue
          </h3>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            {totalViews.toLocaleString()} views
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Articles</span>
          <span className="font-semibold">{issue.articles.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Premium Content</span>
          <div className="flex items-center">
            <Crown className="h-3 w-3 text-amber-600 mr-1" />
            <span className="font-semibold">{premiumArticles.length}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => canRead ? onReadClick(issue.articles) : null}
        className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
          canRead
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white group-hover:scale-[1.02]'
            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!canRead}
      >
        {canRead ? (
          <>
            <BookOpen className="h-4 w-4 mr-2" />
            Read Issue
          </>
        ) : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Premium Required
          </>
        )}
      </button>
    </motion.div>
  );
};

// Featured Magazine Cover Component - GQ Style
const FeaturedMagazineCover = ({ issue, onReadClick, canRead }) => {
  const heroArticle = issue.articles.find(a => a.hero_image) || issue.articles[0];
  const monthName = issue.displayDate.split(' ')[0].toUpperCase();
  const year = issue.displayDate.split(' ')[1];

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Left Side - Magazine Cover */}
      <div className="relative">
        <div 
          className="aspect-[3/4] rounded-lg overflow-hidden shadow-2xl bg-cover bg-center relative group cursor-pointer transform transition-transform duration-300 hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroArticle?.hero_image || '/placeholder-magazine.jpg'})`
          }}
          onClick={() => canRead ? onReadClick(issue.articles) : null}
        >
          {/* Magazine Header */}
          <div className="absolute top-6 left-6 right-6">
            <div className="flex items-center justify-between text-white">
              <div className="text-xs font-bold tracking-widest">JUST URBANE</div>
              <div className="text-xs">{year}</div>
            </div>
          </div>

          {/* Magazine Title */}
          <div className="absolute top-16 left-6">
            <h1 className="text-6xl font-bold text-white tracking-tight leading-none">
              {monthName}
            </h1>
          </div>

          {/* Main Headline */}
          <div className="absolute bottom-20 left-6 right-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h2 className="text-white font-bold text-lg mb-2 line-clamp-2">
                {heroArticle?.title || 'Premium Content'}
              </h2>
              <div className="text-white/80 text-sm uppercase tracking-wide">
                {heroArticle?.category || 'lifestyle'}
              </div>
            </div>
          </div>

          {/* Interactive Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {canRead ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Play className="h-8 w-8 text-white" />
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Issue Details */}
      <div className="space-y-6">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {issue.displayDate} Issue
          </h3>
          <p className="text-gray-600">
            {issue.articles.length} articles • {issue.articles.filter(a => a.is_premium).length} premium content
          </p>
        </div>

        {/* Featured Articles Preview */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">In this issue:</h4>
          {issue.articles.slice(0, 4).map((article, index) => (
            <div key={article.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                {article.hero_image ? (
                  <img 
                    src={article.hero_image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-article.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                  {article.title}
                </h5>
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

        {/* Action Button */}
        <button
          onClick={() => canRead ? onReadClick(issue.articles) : null}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
            canRead
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white transform hover:scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canRead}
        >
          {canRead ? (
            <>
              <BookOpen className="inline h-5 w-5 mr-2" />
              Read Digital Magazine
            </>
          ) : (
            <>
              <Lock className="inline h-5 w-5 mr-2" />
              Subscribe to Read
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Magazine Cover Card Component - Grid Item
const MagazineCoverCard = ({ issue, onReadClick, canRead, index }) => {
  const heroArticle = issue.articles.find(a => a.hero_image) || issue.articles[0];
  const monthName = issue.displayDate.split(' ')[0].toUpperCase();
  const year = issue.displayDate.split(' ')[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => canRead ? onReadClick(issue.articles) : null}
    >
      {/* Magazine Cover */}
      <div 
        className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-cover bg-center relative transform transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroArticle?.hero_image || '/placeholder-magazine.jpg'})`
        }}
      >
        {/* Magazine Header */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-center justify-between text-white text-xs">
            <div className="font-bold tracking-widest">JUST URBANE</div>
            <div>{year}</div>
          </div>
        </div>

        {/* Magazine Title */}
        <div className="absolute top-8 left-4">
          <h3 className="text-3xl font-bold text-white tracking-tight">
            {monthName}
          </h3>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded p-2">
            <div className="text-white font-semibold text-sm line-clamp-1">
              {heroArticle?.title || 'Premium Content'}
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {canRead ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Play className="h-6 w-6 text-white" />
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Issue Info */}
      <div className="mt-4">
        <h4 className="font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
          {issue.displayDate}
        </h4>
        <p className="text-sm text-gray-600">
          {issue.articles.length} articles
        </p>
      </div>
    </motion.div>
  );
};

export default IssuesPage;