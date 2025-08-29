import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, BookOpen, Crown, Lock, Play, Users, 
  TrendingUp, Award, ArrowRight, Eye, Clock, Download, MoreHorizontal, Grid3X3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../hooks/useArticles';
import MagazineReader from '../components/MagazineReader';
import FullScreenMagazineReader from '../components/FullScreenMagazineReader';
import FeaturedMagazineCover from '../components/FeaturedMagazineCover';
import MagazineCoverCard from '../components/MagazineCoverCard';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { parseMagazineContent } from '../components/MagazineContentParser';

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
    // Use your uploaded magazine content instead of articles
    const magazineContent = parseMagazineContent();
    setSelectedIssue(magazineContent);
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

      {/* Full Screen 3D Magazine Reader */}
      <FullScreenMagazineReader
        isOpen={isReaderOpen}
        onClose={closeMagazineReader}
        magazineContent={selectedIssue}
      />
    </div>
  );
};



export default IssuesPage;