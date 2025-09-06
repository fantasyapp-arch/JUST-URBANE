import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  Upload, 
  Eye, 
  ArrowLeft,
  FileText,
  Image,
  Tag,
  User,
  Clock,
  Star,
  TrendingUp,
  Crown,
  Globe,
  Archive,
  Copy,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminArticleEditorPage = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const navigate = useNavigate();
  const { articleId } = useParams();

  const categories = [
    'fashion', 'people', 'business', 'technology', 
    'travel', 'culture', 'art', 'entertainment', 'health', 'finance'
  ];

  const subcategories = {
    fashion: ['men', 'women', 'accessories', 'trends', 'designers'],
    people: ['celebrities', 'interviews', 'profiles', 'entrepreneurs'],
    business: ['startups', 'finance', 'markets', 'leadership'],
    technology: ['gadgets', 'software', 'ai', 'innovation'],
    travel: ['destinations', 'guides', 'luxury', 'adventure'],
    culture: ['art', 'music', 'books', 'lifestyle'],
    entertainment: ['movies', 'tv', 'music', 'events']
  };

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (articleId && articleId !== 'new') {
      fetchArticle();
    } else {
      // New article
      setArticle({
        id: null,
        title: '',
        body: '',
        summary: '',
        author_name: '',
        category: 'fashion',
        subcategory: '',
        tags: [],
        featured: false,
        trending: false,
        premium: false,
        reading_time: 5,
        hero_image: '',
        status: 'draft'
      });
      setLoading(false);
    }
  }, [navigate, articleId]);

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/articles/${articleId}/edit`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticle({
          ...data,
          tags: data.tags || []
        });
      } else {
        throw new Error('Failed to fetch article');
      }
    } catch (error) {
      toast.error('Failed to load article');
      console.error('Article fetch error:', error);
      navigate('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      
      const formData = new FormData();
      formData.append('title', article.title);
      formData.append('body', article.body);
      formData.append('summary', article.summary);
      formData.append('author_name', article.author_name);
      formData.append('category', article.category);
      formData.append('subcategory', article.subcategory || '');
      formData.append('tags', article.tags.join(','));
      formData.append('featured', article.featured.toString());
      formData.append('trending', article.trending.toString());
      formData.append('premium', article.premium.toString());
      formData.append('reading_time', article.reading_time.toString());
      formData.append('hero_image', article.hero_image || '');
      formData.append('status', article.status || 'draft');

      const url = article.id 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/articles/${article.id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admin/articles`;
      
      const method = article.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(article.id ? 'Article updated successfully!' : 'Article created successfully!');
        
        if (!article.id) {
          // New article created, redirect to edit it
          navigate(`/admin/articles/edit/${result.article_id}`);
        }
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Save failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save article');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      
      const formData = new FormData();
      formData.append('title', article.title);
      formData.append('summary', article.summary);
      formData.append('author_name', article.author_name);
      formData.append('category', article.category);
      formData.append('subcategory', article.subcategory || '');
      formData.append('tags', article.tags.join(','));
      formData.append('featured', article.featured.toString());
      formData.append('trending', article.trending.toString());
      formData.append('premium', article.premium.toString());
      formData.append('reading_time', article.reading_time.toString());
      formData.append('hero_image_url', article.hero_image || '');
      formData.append('content_file', fileToUpload);

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/articles/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Article uploaded successfully!');
        navigate(`/admin/articles/edit/${result.article_id}`);
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload article');
      console.error('Upload error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!article.id) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/articles/${article.id}/duplicate`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success('Article duplicated successfully!');
        navigate(`/admin/articles/edit/${result.new_article_id}`);
      } else {
        throw new Error('Failed to duplicate article');
      }
    } catch (error) {
      toast.error('Failed to duplicate article');
      console.error('Duplicate error:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!article.id) return;

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('status', newStatus);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/articles/${article.id}/status`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }
      );

      if (response.ok) {
        setArticle({ ...article, status: newStatus });
        toast.success(`Article ${newStatus} successfully!`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Status error:', error);
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !article.tags.includes(tag)) {
      setArticle({ ...article, tags: [...article.tags, tag] });
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setArticle({ ...article, tags: article.tags.filter(tag => tag !== tagToRemove) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article editor...</p>
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
                onClick={() => navigate('/admin/articles')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Articles</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                {article?.id ? 'Edit Article' : 'Create New Article'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status Badge */}
              {article?.status && (
                <span className={`px-3 py-1 text-sm rounded-full ${
                  article.status === 'published' ? 'bg-green-100 text-green-800' :
                  article.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                </span>
              )}

              {/* Action Buttons */}
              {article?.id && (
                <button
                  onClick={handleDuplicate}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
              )}

              <button
                onClick={() => setUploadMode(!uploadMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  uploadMode ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{uploadMode ? 'Manual Edit' : 'File Upload'}</span>
              </button>

              <button
                onClick={uploadMode ? handleFileUpload : handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : uploadMode ? 'Upload' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Editor */}
          <div className="lg:col-span-2 space-y-6">
            {uploadMode ? (
              /* File Upload Mode */
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Article File</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content File (RTF or TXT)
                    </label>
                    <input
                      type="file"
                      accept=".rtf,.txt"
                      onChange={(e) => setFileToUpload(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload RTF or plain text files. Maximum size: 5MB
                    </p>
                  </div>

                  {fileToUpload && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">{fileToUpload.name}</p>
                          <p className="text-xs text-blue-600">
                            {(fileToUpload.size / 1024).toFixed(1)} KB • {fileToUpload.type || 'Text file'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Manual Editor Mode */
              <>
                {/* Title and Summary */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        value={article?.title || ''}
                        onChange={(e) => setArticle({ ...article, title: e.target.value })}
                        className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter article title..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Summary *
                      </label>
                      <textarea
                        value={article?.summary || ''}
                        onChange={(e) => setArticle({ ...article, summary: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Brief article summary..."
                      />
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Article Content</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>{article?.body?.length || 0} characters</span>
                    </div>
                  </div>
                  
                  <textarea
                    value={article?.body || ''}
                    onChange={(e) => setArticle({ ...article, body: e.target.value })}
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                    placeholder="Write your article content here..."
                  />
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Article Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={article?.author_name || ''}
                      onChange={(e) => setArticle({ ...article, author_name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={article?.category || ''}
                    onChange={(e) => setArticle({ ...article, category: e.target.value, subcategory: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {article?.category && subcategories[article.category] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      value={article?.subcategory || ''}
                      onChange={(e) => setArticle({ ...article, subcategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="">Select subcategory</option>
                      {subcategories[article.category].map(sub => (
                        <option key={sub} value={sub}>
                          {sub.charAt(0).toUpperCase() + sub.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reading Time (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={article?.reading_time || 5}
                      onChange={(e) => setArticle({ ...article, reading_time: parseInt(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image URL
                  </label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={article?.hero_image || ''}
                      onChange={(e) => setArticle({ ...article, hero_image: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Article Flags */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Flags</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={article?.featured || false}
                    onChange={(e) => setArticle({ ...article, featured: e.target.checked })}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">Featured Article</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={article?.trending || false}
                    onChange={(e) => setArticle({ ...article, trending: e.target.checked })}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Trending Article</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={article?.premium || false}
                    onChange={(e) => setArticle({ ...article, premium: e.target.checked })}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Premium Content</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {article?.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Add tag and press Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTagAdd(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            {/* Status Actions */}
            {article?.id && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleStatusChange('published')}
                    disabled={article.status === 'published'}
                    className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Publish</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('draft')}
                    disabled={article.status === 'draft'}
                    className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange('archived')}
                    disabled={article.status === 'archived'}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArticleEditorPage;