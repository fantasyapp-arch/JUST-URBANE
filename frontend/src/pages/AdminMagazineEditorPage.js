import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  Upload, 
  ArrowLeft,
  FileText,
  Image,
  Calendar,
  Star,
  Eye,
  BookOpen,
  Trash2,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminMagazineEditorPage = () => {
  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const navigate = useNavigate();
  const { magazineId } = useParams();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i + 1);

  useEffect(() => {
    // Check admin authentication
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (magazineId && magazineId !== 'new') {
      fetchMagazine();
    } else {
      // New magazine
      setMagazine({
        id: null,
        title: '',
        description: '',
        month: months[new Date().getMonth()],
        year: currentYear,
        cover_image: '',
        pdf_url: '',
        is_featured: false,
        is_published: true,
        pages: [],
        file_size: 0
      });
      setLoading(false);
    }
  }, [navigate, magazineId]);

  const fetchMagazine = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/magazines/${magazineId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMagazine(data);
      } else if (response.status === 404) {
        toast.error('Magazine not found');
        navigate('/admin/magazines');
      } else {
        throw new Error('Failed to fetch magazine');
      }
    } catch (error) {
      toast.error('Failed to load magazine');
      console.error('Magazine fetch error:', error);
      navigate('/admin/magazines');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!magazine.title?.trim() || !magazine.description?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const method = magazineId && magazineId !== 'new' ? 'PUT' : 'POST';
      const url = magazineId && magazineId !== 'new' 
        ? `${process.env.REACT_APP_BACKEND_URL}/api/admin/magazines/${magazineId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admin/magazines`;

      // Prepare form data for file uploads
      const formData = new FormData();
      formData.append('title', magazine.title);
      formData.append('description', magazine.description);
      formData.append('month', magazine.month);
      formData.append('year', magazine.year.toString());
      formData.append('is_featured', magazine.is_featured);
      formData.append('is_published', magazine.is_published);

      // Add PDF file if provided
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }

      // Add cover image if provided
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile);
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(magazineId && magazineId !== 'new' ? 'Magazine updated successfully' : 'Magazine created successfully');
        
        // If it was a new magazine, redirect to edit mode with the new ID
        if (magazineId === 'new' && data.magazine_id) {
          navigate(`/admin/magazines/edit/${data.magazine_id}`);
        } else {
          // Refresh the magazine data
          fetchMagazine();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save magazine');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save magazine');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this magazine? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/magazines/${magazineId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        toast.success('Magazine deleted successfully');
        navigate('/admin/magazines');
      } else {
        throw new Error('Failed to delete magazine');
      }
    } catch (error) {
      toast.error('Failed to delete magazine');
      console.error('Delete error:', error);
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB
        toast.error('PDF file size must be less than 50MB');
        return;
      }
      setPdfFile(file);
    } else if (type === 'cover') {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('Image file size must be less than 10MB');
        return;
      }
      setCoverImageFile(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading magazine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/magazines')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Magazines</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                {magazineId && magazineId !== 'new' ? 'Edit Magazine' : 'New Magazine'}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {magazineId && magazineId !== 'new' && (
                <>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  
                  {magazine?.pdf_url && (
                    <a
                      href={magazine.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  )}
                </>
              )}
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Magazine'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Magazine Title *
                  </label>
                  <input
                    type="text"
                    value={magazine?.title || ''}
                    onChange={(e) => setMagazine({...magazine, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter magazine title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={magazine?.description || ''}
                    onChange={(e) => setMagazine({...magazine, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter magazine description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month
                    </label>
                    <select
                      value={magazine?.month || ''}
                      onChange={(e) => setMagazine({...magazine, month: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <select
                      value={magazine?.year || currentYear}
                      onChange={(e) => setMagazine({...magazine, year: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">File Uploads</h2>
              </div>

              <div className="space-y-4">
                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Magazine PDF {magazineId === 'new' ? '*' : '(Optional)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {pdfFile ? pdfFile.name : 'Select a PDF file to upload'}
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'pdf')}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label
                        htmlFor="pdf-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 cursor-pointer"
                      >
                        Choose PDF File
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Maximum file size: 50MB</p>
                    </div>
                  </div>
                  {magazine?.pdf_url && (
                    <p className="text-sm text-green-600 mt-2">
                      Current PDF: <a href={magazine.pdf_url} target="_blank" rel="noopener noreferrer" className="underline">View PDF</a>
                    </p>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {coverImageFile ? coverImageFile.name : 'Select a cover image'}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cover')}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 cursor-pointer"
                      >
                        Choose Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
                    </div>
                  </div>
                  {magazine?.cover_image && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 mb-2">Current cover image:</p>
                      <img 
                        src={magazine.cover_image} 
                        alt="Cover" 
                        className="w-32 h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Featured Magazine</label>
                    <p className="text-xs text-gray-500">Highlight this magazine</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={magazine?.is_featured || false}
                      onChange={(e) => setMagazine({...magazine, is_featured: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Published</label>
                    <p className="text-xs text-gray-500">Make magazine visible</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={magazine?.is_published !== false}
                      onChange={(e) => setMagazine({...magazine, is_published: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Magazine Info */}
            {magazineId && magazineId !== 'new' && magazine && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Magazine Info</h2>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono text-xs">{magazine.id}</span>
                  </div>
                  {magazine.file_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Size:</span>
                      <span>{formatFileSize(magazine.file_size)}</span>
                    </div>
                  )}
                  {magazine.upload_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upload Date:</span>
                      <span>{new Date(magazine.upload_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {magazine.created_by && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span>{magazine.created_by}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMagazineEditorPage;