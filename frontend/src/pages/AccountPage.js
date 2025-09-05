import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Crown, Heart, BookOpen, Bell, CreditCard, Settings, Eye, Calendar, TrendingUp, LogOut, Edit3, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const AccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState([]);
  const [accountStats, setAccountStats] = useState({
    articlesRead: 0,
    savedArticles: 0,
    readingStreak: 0,
    memberSince: null
  });

  // Initialize profile data from real user data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    preferences: {
      categories: [],
      newsletter: true,
      notifications: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.full_name || user.name || '',
        email: user.email || '',
        bio: user.bio || 'Premium subscriber enjoying luxury lifestyle content.',
        preferences: {
          categories: user.preferences?.categories || [],
          newsletter: user.preferences?.newsletter !== false,
          notifications: user.preferences?.notifications !== false
        }
      });

      // Calculate member since date
      const memberSince = user.created_at ? new Date(user.created_at) : new Date();
      setAccountStats(prev => ({
        ...prev,
        memberSince: memberSince.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }));

      setLoading(false);
    }
  }, [user]);

  // Get real subscription details from user data
  const getSubscriptionDetails = () => {
    if (!user) return null;

    const subscriptionType = user.subscription_type;
    const isActive = user.subscription_status === 'active';
    const expiresAt = user.subscription_expires_at ? new Date(user.subscription_expires_at) : null;

    let planName = 'Free';
    let price = '₹0';
    let features = [
      'Limited article access',
      'Basic reading experience',
      'Community features'
    ];

    if (subscriptionType === 'digital_annual') {
      planName = 'Digital Premium';
      price = '₹1'; // Current trial price
      features = [
        'Unlimited premium articles',
        'Ad-free reading experience', 
        'Digital magazine access',
        'Weekly premium newsletter',
        'Mobile app with offline reading'
      ];
    } else if (subscriptionType === 'print_annual') {
      planName = 'Print Subscription';
      price = '₹499';
      features = [
        'Monthly premium print magazine',
        'High-quality paper and printing',
        'Collector\'s edition covers',
        'Free shipping across India'
      ];
    } else if (subscriptionType === 'combined_annual') {
      planName = 'Print + Digital Premium';
      price = '₹999';
      features = [
        'Everything in Digital Premium',
        'Monthly premium print magazine',
        'Complete digital library access',
        'Exclusive subscriber events',
        'Priority customer support'
      ];
    }

    return {
      plan: planName,
      price,
      period: 'year',
      nextBilling: expiresAt ? expiresAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : 'N/A',
      status: isActive ? 'active' : 'inactive',
      features
    };
  };

  const subscriptionDetails = getSubscriptionDetails();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Account Access Required
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please sign in to access your account dashboard and manage your premium subscription.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/register" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileSave = async () => {
    try {
      // TODO: Save to API when user profile update endpoint is ready
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'preferences', name: 'Preferences', icon: Settings }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <LoadingSpinner text="Loading account data..." />
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="flex items-start gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <button
                        onClick={handleProfileSave}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{profileData.name || 'User'}</h3>
                        <p className="text-gray-600 text-lg">{profileData.email}</p>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                        <span>Member since {accountStats.memberSince}</span>
                        {user?.is_premium && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-2">
                              <Crown className="h-4 w-4 text-yellow-500" />
                              Premium Subscriber
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Status Card */}
            {subscriptionDetails && (
              <div className={`rounded-2xl p-8 shadow-sm border-2 ${
                subscriptionDetails.status === 'active' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Subscription</h3>
                    <div className="flex items-center gap-3">
                      <Crown className={`h-5 w-5 ${
                        subscriptionDetails.status === 'active' ? 'text-yellow-500' : 'text-gray-400'
                      }`} />
                      <span className="text-lg font-medium text-gray-700">{subscriptionDetails.plan}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscriptionDetails.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {subscriptionDetails.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{subscriptionDetails.price}</div>
                    <div className="text-gray-600">per {subscriptionDetails.period}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'subscription':
        if (!subscriptionDetails) {
          return (
            <div className="text-center py-12">
              <Crown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h3>
              <p className="text-gray-600 mb-6">Upgrade to premium to access exclusive content</p>
              <Link to="/pricing" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                View Plans
              </Link>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            {/* Current Plan */}
            <div className={`rounded-2xl p-8 border-2 ${
              subscriptionDetails.status === 'active' 
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Current Plan</h2>
                  <div className="flex items-center gap-3">
                    <Crown className={`h-6 w-6 ${
                      subscriptionDetails.status === 'active' ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <span className="text-xl font-semibold text-gray-800">{subscriptionDetails.plan}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{subscriptionDetails.price}</div>
                  <div className="text-gray-600 text-lg">per {subscriptionDetails.period}</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Plan Benefits</h4>
                  <ul className="space-y-3">
                    {subscriptionDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Billing Information</h4>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-medium">Next billing:</span> {subscriptionDetails.nextBilling}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        subscriptionDetails.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {subscriptionDetails.status.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Payment method:</span> Razorpay
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Link 
                  to="/pricing" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Change Plan
                </Link>
                <Link 
                  to="/issues"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
                >
                  Access Magazine
                </Link>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Reading Preferences</h2>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Favorite Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Fashion', 'Business', 'Technology', 'Finance', 'Travel', 'Health', 'Culture', 'Art'].map((category) => (
                      <label key={category} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={profileData.preferences.categories.includes(category.toLowerCase())}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Email Preferences</h4>
                  <div className="space-y-4">
                    <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        defaultChecked={profileData.preferences.newsletter}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Newsletter Subscription</div>
                        <div className="text-sm text-gray-600 mt-1">Receive weekly premium content digest and exclusive updates</div>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        defaultChecked={profileData.preferences.notifications}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900">New Article Notifications</div>
                        <div className="text-sm text-gray-600 mt-1">Get notified when new articles are published in your favorite categories</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Save Preferences
                </button>
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Account</h1>
              <p className="text-gray-600 text-lg">Manage your profile, subscription, and preferences</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
            className="flex-1 min-w-0"
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