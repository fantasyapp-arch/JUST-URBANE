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
          date: date,
          coverImage: generateMagazineCover(displayDate, articles.filter(a => {
            const aDate = new Date(a.published_at);
            const aMonthYear = `${aDate.getFullYear()}-${String(aDate.getMonth() + 1).padStart(2, '0')}`;
            return aMonthYear === monthYear;
          }))
        };
      }
      grouped[monthYear].articles.push(article);
    });
    
    return grouped;
  };

  // Generate magazine cover design
  const generateMagazineCover = (displayDate, issueArticles) => {
    const heroArticle = issueArticles.find(a => a.hero_image) || issueArticles[0];
    return {
      bgImage: heroArticle?.hero_image || '/placeholder-magazine.jpg',
      title: displayDate.split(' ')[0].toUpperCase(),
      year: displayDate.split(' ')[1],
      headline: heroArticle?.title || 'Premium Content',
      category: heroArticle?.category || 'lifestyle'
    };
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
              Magazine
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

export default MagazineIssuesPage;