import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, BookOpen, Crown, Lock, Play, Users, 
  TrendingUp, Award, ArrowRight, Eye, Clock 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Crown className="h-12 w-12 text-amber-400" />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Digital Magazine
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Immerse yourself in premium content with our interactive flip-book magazine experience
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-amber-300">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Interactive Reading
              </div>
              <div className="flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Premium Content
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Exclusive Access
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Subscription Status */}
        {!canReadPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-200 rounded-2xl p-8 mb-12 text-center"
          >
            <Crown className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Subscription Required
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Access our premium magazine experience with unlimited articles, exclusive content, 
              and ad-free reading for just ₹499/year.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Crown className="h-5 w-5 mr-2" />
              Subscribe Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>
        )}

        {/* Featured Current Issue */}
        {sortedIssues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Current Issue</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience our latest magazine issue with interactive flip-book technology
              </p>
            </div>

            <FeaturedIssueCard
              issue={sortedIssues[0][1]}
              monthKey={sortedIssues[0][0]}
              onReadClick={openMagazineReader}
              canRead={canReadPremium}
              isCurrent={true}
            />
          </motion.div>
        )}

        {/* All Issues Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">All Issues</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {sortedIssues.length} Issues Available
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {sortedIssues.map(([monthKey, issue], index) => (
              <IssueCard
                key={monthKey}
                issue={issue}
                monthKey={monthKey}
                onReadClick={openMagazineReader}
                canRead={canReadPremium}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-8 text-white"
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {sortedIssues.length}
              </div>
              <div className="text-gray-300">Digital Issues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {articles?.length || 0}
              </div>
              <div className="text-gray-300">Premium Articles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {articles?.filter(a => a.is_premium).length || 0}
              </div>
              <div className="text-gray-300">Exclusive Content</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-2">
                {canReadPremium ? 'Unlimited' : 'Limited'}
              </div>
              <div className="text-gray-300">Access Level</div>
            </div>
          </div>
        </motion.div>
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