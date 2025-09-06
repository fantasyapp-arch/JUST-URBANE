import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Image, 
  Video,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  Tag,
  ChevronLeft,
  Plus,
  Settings,
  BarChart3,
  Zap,
  Folder
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminMediaPage = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [selectedTags, setSelectedTags] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const navigate = useNavigate();

  const fileTypes = [
    { value: 'all', label: 'All Files' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' }
  ];

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchMediaFiles();
    fetchMediaStats();
  }, [navigate, currentPage, selectedFileType, searchTerm, selectedTags]);

  const fetchMediaFiles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (selectedFileType !== 'all') {
        params.append('file_type', selectedFileType);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedTags) {
        params.append('tags', selectedTags);
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/media?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.media_files);
        setTotalPages(data.total_pages);
      } else {
        throw new Error('Failed to fetch media files');
      }
    } catch (error) {
      toast.error('Failed to load media files');
      console.error('Media fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/media/stats/overview`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/media/${mediaId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        toast.success('Media file deleted successfully');
        fetchMediaFiles();
      } else {
        throw new Error('Failed to delete media file');
      }
    } catch (error) {
      toast.error('Failed to delete media file');
      console.error('Delete error:', error);
    }
  };

  const handleGenerateResolutions = async (mediaId, resolutions) => {
    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('resolutions', resolutions.join(','));

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/media/${mediaId}/generate-resolutions`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }
      );

      if (response.ok) {
        toast.success('New resolutions generated successfully');
        fetchMediaFiles();
      } else {
        throw new Error('Failed to generate resolutions');
      }
    } catch (error) {
      toast.error('Failed to generate resolutions');
      console.error('Resolution error:', error);
    }
  };

  const handleBulkTag = async (action, tags) => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files first');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('media_ids', selectedFiles.join(','));
      formData.append('tags', tags);
      formData.append('action', action);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/media/bulk-tag`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }
      );

      if (response.ok) {
        toast.success(`Bulk ${action} operation completed`);
        setSelectedFiles([]);
        setShowBulkActions(false);
        fetchMediaFiles();
      } else {
        throw new Error('Bulk operation failed');
      }
    } catch (error) {
      toast.error('Bulk operation failed');
      console.error('Bulk error:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media library...</p>
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
                <Folder 
                  className="w-6 h-6 text-amber-500"
                  style={{ display: 'none' }}
                />
                <h1 className="text-xl font-bold text-gray-900">Media Library</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedFiles.length > 0 && (
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Bulk Actions ({selectedFiles.length})</span>
                </button>
              )}
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Media</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Folder className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_files}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Image className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_images}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Videos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_videos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Storage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatFileSize(stats.storage_stats?.reduce((acc, stat) => acc + stat.total_size, 0) || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* File Type Filter */}
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {fileTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Tags Filter */}
              <input
                type="text"
                placeholder="Filter by tags..."
                value={selectedTags}
                onChange={(e) => setSelectedTags(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <span className="text-sm text-gray-500">
                {mediaFiles.length} files
              </span>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && selectedFiles.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedFiles.length} files selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const tags = prompt('Enter tags to add (comma-separated):');
                    if (tags) handleBulkTag('add', tags);
                  }}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Add Tags
                </button>
                <button
                  onClick={() => {
                    const tags = prompt('Enter tags to remove (comma-separated):');
                    if (tags) handleBulkTag('remove', tags);
                  }}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Remove Tags
                </button>
                <button
                  onClick={() => {
                    setSelectedFiles([]);
                    setShowBulkActions(false);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Media Grid/List */}
        {mediaFiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
            <p className="text-gray-500 mb-6">Start by uploading your first images or videos</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Upload Media
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaFiles.map((media) => (
              <MediaCard 
                key={media.id} 
                media={media} 
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                onDelete={handleDeleteMedia}
                onGenerateResolutions={handleGenerateResolutions}
                onCopyUrl={copyToClipboard}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(mediaFiles.map(m => m.id));
                          } else {
                            setSelectedFiles([]);
                          }
                        }}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mediaFiles.map((media) => (
                    <MediaListRow 
                      key={media.id} 
                      media={media} 
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      onDelete={handleDeleteMedia}
                      onCopyUrl={copyToClipboard}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <MediaUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          setShowUploadModal(false);
          fetchMediaFiles();
          fetchMediaStats();
        }}
      />
    </div>
  );
};

// Media Card Component for Grid View
const MediaCard = ({ media, selectedFiles, setSelectedFiles, onDelete, onGenerateResolutions, onCopyUrl }) => {
  const [showActions, setShowActions] = useState(false);
  const isSelected = selectedFiles.includes(media.id);

  const handleSelect = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setSelectedFiles(selectedFiles.filter(id => id !== media.id));
    } else {
      setSelectedFiles([...selectedFiles, media.id]);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow relative group ${
        isSelected ? 'ring-2 ring-amber-500' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
      </div>

      {/* File Preview */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {media.file_type === 'image' ? (
          <img
            src={media.resolutions?.thumbnail?.url || media.url}
            alt={media.alt_text || media.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Video</p>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate" title={media.filename}>
          {media.filename}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {formatFileSize(media.file_size)} • {formatDate(media.uploaded_at)}
        </p>
        
        {/* Tags */}
        {media.tags && media.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {media.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
            {media.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{media.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Actions Overlay */}
      {showActions && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
          <button
            onClick={() => onCopyUrl(media.url)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Copy URL"
          >
            <Copy className="w-4 h-4 text-gray-700" />
          </button>
          
          {media.file_type === 'image' && (
            <button
              onClick={() => onGenerateResolutions(media.id, ['small', 'medium', 'large'])}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Generate Resolutions"
            >
              <Zap className="w-4 h-4 text-gray-700" />
            </button>
          )}
          
          <button
            onClick={() => onDelete(media.id)}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Media List Row Component for List View
const MediaListRow = ({ media, selectedFiles, setSelectedFiles, onDelete, onCopyUrl }) => {
  const isSelected = selectedFiles.includes(media.id);

  const handleSelect = (e) => {
    e.stopPropagation();
    if (isSelected) {
      setSelectedFiles(selectedFiles.filter(id => id !== media.id));
    } else {
      setSelectedFiles([...selectedFiles, media.id]);
    }
  };

  return (
    <tr className={`hover:bg-gray-50 ${isSelected ? 'bg-amber-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12">
            {media.file_type === 'image' ? (
              <img
                src={media.resolutions?.thumbnail?.url || media.url}
                alt={media.alt_text || media.filename}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
              {media.filename}
            </div>
            <div className="text-sm text-gray-500">
              {media.alt_text && media.alt_text.substring(0, 50)}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          media.file_type === 'image' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {media.file_type === 'image' ? <Image className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
          {media.file_type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatFileSize(media.file_size)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(media.uploaded_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onCopyUrl(media.url)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
            title="Copy URL"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(media.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Media Upload Modal Component
const MediaUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState('');
  const [resolutions, setResolutions] = useState(['thumbnail', 'small', 'medium']);

  const availableResolutions = ['thumbnail', 'small', 'medium', 'large', 'hero', 'cover', 'square'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('alt_text', altText);
      formData.append('tags', tags);
      formData.append('generate_resolutions', resolutions.join(','));

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Media files uploaded successfully!');
        onSuccess();
        // Reset form
        setFiles([]);
        setAltText('');
        setTags('');
        setResolutions(['thumbnail', 'small', 'medium']);
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload media files');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Media Files</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Files (Images/Videos) *
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 50MB per file</p>
              
              {files.length > 0 && (
                <div className="mt-3 space-y-1">
                  {files.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center justify-between">
                      <span>{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text (for images)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Describe the images"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="fashion, portrait, hero, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generate Resolutions (for images)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableResolutions.map(resolution => (
                  <label key={resolution} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={resolutions.includes(resolution)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setResolutions([...resolutions, resolution]);
                        } else {
                          setResolutions(resolutions.filter(r => r !== resolution));
                        }
                      }}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">{resolution}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Files'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMediaPage;