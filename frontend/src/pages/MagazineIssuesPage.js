import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, BookOpen, Crown, Lock, Play, Users, 
  TrendingUp, Award, ArrowRight, Eye, Clock, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../hooks/useArticles';
import MagazineReader from '../components/MagazineReader';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const MagazineIssuesPage = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
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
      <div className="border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              TESTING - NEW MAGAZINE PAGE DESIGN
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read your favourite magazines anywhere, anytime | Enjoy unlimited access to our archives | 
              Download the latest issues on the Just Urbane App
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Current Issue Section */}
        {sortedIssues.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {sortedIssues[0][1].displayDate} issue
              </h2>
              <Link
                to="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Archive →
              </Link>
            </div>

            {/* Featured Magazine Cover Layout */}
            <FeaturedMagazineCover
              issue={sortedIssues[0][1]}
              onReadClick={openMagazineReader}
              canRead={canReadPremium}
            />
          </div>
        )}

        {/* Additional Issues Grid - GQ Style */}
        {sortedIssues.length > 1 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedIssues.slice(1).map(([monthKey, issue], index) => (
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

        {/* Subscription Prompt */}
        {!canReadPremium && (
          <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Did you know our monthly issues can now be read online? Subscribe to read our {sortedIssues[0]?.[1]?.displayDate} issue now.
            </h3>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded font-bold">
                GO DIGITAL 1 YEAR
              </div>
              <div className="text-right">
                <div className="text-gray-500 line-through text-sm">₹1500</div>
                <div className="text-2xl font-bold">₹900</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-gray-600 mb-4">OR</div>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded font-bold inline-block">
                FREE PREVIEW
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Already purchased? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              <span className="mx-4">|</span>
              <Link to="/pricing" className="text-blue-600 hover:underline">More plans →</Link>
            </div>
          </div>
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
          className="aspect-[210/297] rounded-lg overflow-hidden shadow-2xl bg-cover bg-center relative group cursor-pointer transform transition-transform duration-300 hover:scale-105"
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
        className="aspect-[5/7] rounded-lg overflow-hidden shadow-lg bg-cover bg-center relative transform transition-transform duration-300 group-hover:scale-105"
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

export default MagazineIssuesPage;