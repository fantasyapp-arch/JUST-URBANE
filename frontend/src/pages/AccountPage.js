import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Crown, Heart, BookOpen, Bell, CreditCard, Settings, Eye, Calendar, TrendingUp, LogOut, Edit3, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Premium User',
    email: 'premium@justurbane.com',
    bio: 'Passionate about luxury lifestyle, fashion, and premium experiences.',
    preferences: {
      categories: ['style', 'watches', 'travel'],
      newsletter: true,
      notifications: true
    }
  });

  // Mock data - in real app, this would come from API
  const accountStats = {
    articlesRead: 127,
    savedArticles: 23,
    readingStreak: 15,
    memberSince: '2024-01-15'
  };

  const subscriptionDetails = {
    plan: 'Premium',
    price: '₹499',
    period: 'month',
    nextBilling: '2024-12-26',
    status: 'active'
  };

  const savedArticles = [
    {
      id: '1',
      title: 'The Art of Sustainable Fashion',
      slug: 'sustainable-fashion-art',
      dek: 'How luxury brands are embracing sustainability',
      hero_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      category: 'style',
      author_name: 'Ananya Krishnan',
      reading_time: 7,
      published_at: '2024-08-11T10:33:54.332Z',
      view_count: 4537,
      is_premium: true,
      tags: ['sustainability', 'luxury', 'fashion']
    },
    // Add more mock saved articles as needed
  ];

  const recentActivity = [
    { type: 'read', article: 'Swiss Watchmaking Excellence', time: '2 hours ago' },
    { type: 'saved', article: 'Luxury Travel Destinations', time: '1 day ago' },
    { type: 'read', article: 'Premium Grooming Guide', time: '3 days ago' },
    { type: 'subscription', article: 'Upgraded to Premium', time: '1 week ago' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-primary-900 mb-4">
            Account Access Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to access your account dashboard and manage your premium subscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSave = () => {
    // In real app, this would save to API
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'saved', name: 'Saved Articles', icon: Heart },
    { id: 'reading', name: 'Reading History', icon: BookOpen },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-primary-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <button
                        onClick={handleProfileSave}
                        className="flex items-center gap-2 btn-primary"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-semibold text-primary-900">{profileData.name}</h3>
                      <p className="text-gray-600 mb-2">{profileData.email}</p>
                      <p className="text-gray-700 mb-4">{profileData.bio}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Member since January 2024</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Crown className="h-4 w-4 text-gold-500" />
                          Premium Subscriber
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <BookOpen className="h-8 w-8 text-gold-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900 mb-1">{accountStats.articlesRead}</div>
                <div className="text-sm text-gray-600">Articles Read</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900 mb-1">{accountStats.savedArticles}</div>
                <div className="text-sm text-gray-600">Saved Articles</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900 mb-1">{accountStats.readingStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-primary-900 mb-1">11</div>
                <div className="text-sm text-gray-600">Months Active</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                      {activity.type === 'read' && <Eye className="h-5 w-5 text-gold-600" />}
                      {activity.type === 'saved' && <Heart className="h-5 w-5 text-gold-600" />}
                      {activity.type === 'subscription' && <Crown className="h-5 w-5 text-gold-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.article}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-8 border border-gold-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">Current Plan</h2>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-gold-600" />
                    <span className="text-lg font-semibold text-gold-700">{subscriptionDetails.plan}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-900">{subscriptionDetails.price}</div>
                  <div className="text-gray-600">per {subscriptionDetails.period}</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Plan Benefits</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                      Unlimited premium articles
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                      Ad-free reading experience
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                      Weekly premium newsletter
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                      Full magazine archive access
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Billing Information</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>Next billing: <span className="font-medium">{subscriptionDetails.nextBilling}</span></p>
                    <p>Status: <span className="font-medium text-green-600 capitalize">{subscriptionDetails.status}</span></p>
                    <p>Payment method: <span className="font-medium">•••• 4242</span></p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/pricing" className="btn-secondary">
                  Change Plan
                </Link>
                <button className="btn-secondary">
                  Manage Billing
                </button>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Subscription History */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">Billing History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 font-medium text-gray-900">Description</th>
                      <th className="text-left py-3 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: 'Nov 26, 2024', description: 'Premium Monthly', amount: '₹499', status: 'Paid' },
                      { date: 'Oct 26, 2024', description: 'Premium Monthly', amount: '₹499', status: 'Paid' },
                      { date: 'Sep 26, 2024', description: 'Premium Monthly', amount: '₹499', status: 'Paid' },
                    ].map((bill, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-gray-700">{bill.date}</td>
                        <td className="py-3 text-gray-700">{bill.description}</td>
                        <td className="py-3 font-medium text-gray-900">{bill.amount}</td>
                        <td className="py-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {bill.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'saved':
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-2">Saved Articles</h2>
              <p className="text-gray-600">Your bookmarked articles for later reading</p>
            </div>
            
            {savedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} size="medium" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Articles</h3>
                <p className="text-gray-600 mb-6">Start saving articles you want to read later</p>
                <Link to="/" className="btn-primary">
                  Browse Articles
                </Link>
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-primary-900 mb-6">Reading Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Favorite Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Style', 'Grooming', 'Culture', 'Watches', 'Tech', 'Fitness', 'Travel', 'Entertainment'].map((category) => (
                      <label key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={profileData.preferences.categories.includes(category.toLowerCase())}
                          className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={profileData.preferences.newsletter}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Newsletter</div>
                        <div className="text-sm text-gray-600">Receive weekly premium content digest</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={profileData.preferences.notifications}
                        className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">New Article Notifications</div>
                        <div className="text-sm text-gray-600">Get notified when new articles are published in your favorite categories</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="btn-primary">Save Preferences</button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <LoadingSpinner text="Loading..." />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary-900 mb-2">My Account</h1>
              <p className="text-gray-600">Manage your profile, subscription, and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="lg:flex gap-12">
          {/* Sidebar Navigation */}
          <motion.div 
            className="lg:w-64 mb-8 lg:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gold-100 text-gold-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            key={activeTab}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;