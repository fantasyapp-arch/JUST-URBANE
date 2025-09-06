import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Star, 
  TrendingUp, 
  Clock,
  Eye,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Settings,
  Shuffle,
  Layout,
  Grid,
  Save,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminHomepagePage = () => {
  const [homepageConfig, setHomepageConfig] = useState(null);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSection, setActiveSection] = useState('hero');
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'people', label: 'People' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'travel', label: 'Travel' },
    { value: 'culture', label: 'Culture' },
    { value: 'art', label: 'Art' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const homepageSections = [
    { key: 'hero', label: 'Hero Article', icon: Star, description: 'Main featured article' },
    { key: 'featured_articles', label: 'Featured Articles', icon: Star, description: 'Up to 4 featured articles' },
    { key: 'trending_articles', label: 'Trending', icon: TrendingUp, description: 'Most popular articles' },
    { key: 'latest_articles', label: 'Latest Articles', icon: Clock, description: 'Recently published' },
    { key: 'fashion_articles', label: 'Fashion', icon: Layout, description: 'Fashion category articles' },
    { key: 'people_articles', label: 'People', icon: Layout, description: 'People category articles' },
    { key: 'business_articles', label: 'Business', icon: Layout, description: 'Business category articles' },
    { key: 'technology_articles', label: 'Technology', icon: Layout, description: 'Technology category articles' },
    { key: 'travel_articles', label: 'Travel', icon: Layout, description: 'Travel category articles' },
    { key: 'culture_articles', label: 'Culture', icon: Layout, description: 'Culture category articles' },
    { key: 'entertainment_articles', label: 'Entertainment', icon: Layout, description: 'Entertainment category articles' }
  ];

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchHomepageContent();
    fetchAvailableArticles();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm || selectedCategory !== 'all') {
      fetchAvailableArticles();
    }
  }, [searchTerm, selectedCategory]);

  const fetchHomepageContent = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/homepage/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setHomepageConfig(data);
      } else {
        throw new Error('Failed to fetch homepage content');
      }
    } catch (error) {
      toast.error('Failed to load homepage content');
      console.error('Homepage content error:', error);
    }
  };

  const fetchAvailableArticles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        limit: '50'
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/homepage/articles/available?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableArticles(data.articles);
      } else {
        throw new Error('Failed to fetch articles');
      }
    } catch (error) {
      toast.error('Failed to load articles');
      console.error('Articles error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetHeroArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('article_id', articleId);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/homepage/hero`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        toast.success('Hero article updated successfully');
        fetchHomepageContent();
      } else {
        throw new Error('Failed to set hero article');
      }
    } catch (error) {
      toast.error('Failed to update hero article');
      console.error('Hero article error:', error);
    }
  };

  const handleUpdateSection = async (sectionName, articleIds) => {
    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('article_ids', articleIds.join(','));

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/homepage/section/${sectionName}`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }
      );

      if (response.ok) {
        toast.success(`${sectionName.replace('_', ' ')} section updated successfully`);
        fetchHomepageContent();
      } else {
        throw new Error('Failed to update section');
      }
    } catch (error) {
      toast.error('Failed to update section');
      console.error('Section update error:', error);
    }
  };

  const handleAutoPopulate = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/homepage/auto-populate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Homepage auto-populated successfully!');
        fetchHomepageContent();
      } else {
        throw new Error('Failed to auto-populate homepage');
      }
    } catch (error) {
      toast.error('Failed to auto-populate homepage');
      console.error('Auto-populate error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <img 
                  src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
                  alt="Just Urbane" 
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Home 
                  className="w-6 h-6 text-amber-500"
                  style={{ display: 'none' }}
                />
                <h1 className="text-xl font-bold text-gray-900">Homepage Management</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  previewMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
              </button>
              
              <button
                onClick={handleAutoPopulate}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                <span>Auto-Populate</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Homepage Sections */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Homepage Sections</h2>
              
              <div className="space-y-2">
                {homepageSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.key;
                  const articleCount = homepageConfig?.[section.key]?.length || 0;
                  
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <p className={`text-sm font-medium ${isActive ? 'text-amber-900' : 'text-gray-900'}`}>
                            {section.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      {articleCount > 0 && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isActive ? 'bg-amber-200 text-amber-800' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {articleCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Current Section Display */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {homepageSections.find(s => s.key === activeSection)?.label} Configuration
                </h2>
                <button
                  onClick={() => fetchHomepageContent()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Current Articles in Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Articles</h3>
                {homepageConfig?.[activeSection]?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {homepageConfig[`${activeSection}_data`]?.map((article, index) => (
                      <div key={article.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                        <div className="flex-shrink-0 w-16 h-12 bg-gray-200 rounded overflow-hidden">
                          {article.hero_image ? (
                            <img src={article.hero_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Layout className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                          <p className="text-xs text-gray-500">{article.author_name} • {article.category}</p>
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Eye className="w-3 h-3 mr-1" />
                          {article.views}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No articles assigned to this section</p>
                    <p className="text-xs text-gray-400 mt-1">Select articles from the available list below</p>
                  </div>
                )}
              </div>
            </div>

            {/* Article Selection */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Available Articles</h2>
                <div className="flex items-center space-x-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {availableArticles.map((article) => (
                  <div key={article.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                    <div className="flex-shrink-0 w-20 h-16 bg-gray-200 rounded overflow-hidden">
                      {article.hero_image ? (
                        <img src={article.hero_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layout className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{article.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{article.author_name}</span>
                        <span>•</span>
                        <span className="capitalize">{article.category}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {article.views}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {activeSection === 'hero' ? (
                        <button
                          onClick={() => handleSetHeroArticle(article.id)}
                          className="bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 transition-colors text-sm"
                        >
                          Set as Hero
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const currentArticles = homepageConfig?.[activeSection] || [];
                            const newArticles = [...currentArticles, article.id];
                            handleUpdateSection(activeSection, newArticles);
                          }}
                          disabled={homepageConfig?.[activeSection]?.includes(article.id)}
                          className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {homepageConfig?.[activeSection]?.includes(article.id) ? 'Added' : 'Add to Section'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {availableArticles.length === 0 && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No articles found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomepagePage;