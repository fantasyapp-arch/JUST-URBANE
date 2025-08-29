import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { api } from '../utils/api';
import { formatDateShort } from '../utils/formatters';

const SubcategoryPage = () => {
  const { category, subcategory } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Direct API call to fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching: category=${category}, subcategory=${subcategory}`);
        const response = await api.get('/articles', {
          params: { category, subcategory, limit: 50 }
        });
        setArticles(response.data || []);
        console.log(`Got ${response.data?.length || 0} articles`);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (category && subcategory) {
      fetchArticles();
    }
  }, [category, subcategory]);

  const pageTitle = subcategory.toUpperCase();
  const categoryLabel = {
    fashion: "Look Good",
    tech: "Get Smart",
    auto: "Live Well",
    travel: "Live Well",
    grooming: "Look Good",
    food: "Live Well",
    people: "Entertainment"
  }[category] || "Category";

  // Filter articles
  const filteredArticles = articles.filter(article => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return article.title.toLowerCase().includes(query) ||
           article.dek?.toLowerCase().includes(query);
  });

  // GQ Style Article Card
  const GQStyleCard = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/article/${article.slug || article.id}`}
        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="relative overflow-hidden">
          <img
            src={article.hero_image}
            alt={article.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        <div className="p-6">
          <div className="mb-4">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              {categoryLabel}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">
            {article.title}
          </h3>
          
          <div className="text-sm text-gray-500">
            <span className="font-medium">By {article.author_name}</span>
            <br />
            <span>{formatDateShort(article.published_at)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to={`/category/${category}`} className="hover:text-gray-900 font-medium capitalize">{category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold capitalize">{subcategory}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        
        {/* Page Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-wider">
            {pageTitle}
          </h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${pageTitle.toLowerCase()} articles...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none text-lg"
            />
          </div>
        </motion.div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <LoadingSpinner text={`Loading ${pageTitle.toLowerCase()} articles...`} />
          </div>
        ) : filteredArticles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredArticles.map((article, index) => (
              <GQStyleCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchQuery ? 'No Articles Found' : 'No Content Available'}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchQuery 
                ? `No articles match "${searchQuery}"`
                : `No articles found in ${pageTitle.toLowerCase()} section.`
              }
              <br />
              <small>Debug: {category}/{subcategory} - {articles.length} total articles</small>
            </p>
            <Link to={`/category/${category}`} className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;

const SubcategoryPage = () => {
  const { category, subcategory } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: articles = [], isLoading, error } = useQuery(
    ['subcategory-articles', category, subcategory],
    async () => {
      const response = await api.get('/articles', { 
        params: { category, subcategory } 
      });
      return response.data;
    },
    {
      enabled: !!(category && subcategory),
      staleTime: 5 * 60 * 1000,
    }
  );

  // Filter articles
  const filteredArticles = useMemo(() => {
    if (!articles.length) return [];

    let filtered = articles;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.dek?.toLowerCase().includes(query) ||
        article.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    return filtered;
  }, [articles, searchQuery]);

  const subcategoryTitles = {
    men: "MEN",
    women: "WOMEN", 
    luxury: "LUXURY",
    accessories: "ACCESSORIES",
    trends: "TRENDS"
  };

  const pageTitle = subcategoryTitles[subcategory] || subcategory.toUpperCase();

  // Clean GQ India style Article Card
  const GQStyleCard = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/article/${article.slug || article.id}`}
        className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={article.hero_image}
            alt={article.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category Tag - GQ Style */}
          <div className="mb-4">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Look Good
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">
            {article.title}
          </h3>
          
          {/* Meta */}
          <div className="text-sm text-gray-500">
            <span className="font-medium">By {article.author_name}</span>
            <br />
            <span>{formatDateShort(article.published_at)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Section Not Found</h1>
          <Link to={`/category/${category}`} className="btn-primary">Back to {category}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb - GQ Style */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to={`/category/${category}`} className="hover:text-gray-900 font-medium capitalize">{category}</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold capitalize">{subcategory}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        
        {/* Page Title - Exactly like GQ India */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-wider">
            {pageTitle}
          </h1>
        </motion.div>

        {/* Search Bar - Clean and Simple */}
        <motion.div 
          className="max-w-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${pageTitle.toLowerCase()} articles...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none text-lg"
            />
          </div>
        </motion.div>

        {/* Articles Grid - GQ India Style */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredArticles.map((article, index) => (
              <GQStyleCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchQuery ? 'No Articles Found' : 'Coming Soon'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No articles match "${searchQuery}"`
                : `We're working on amazing ${pageTitle.toLowerCase()} content.`
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-secondary mr-4"
              >
                Clear Search
              </button>
            )}
            <Link to={`/category/${category}`} className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category}
            </Link>
          </motion.div>
        )}

        {/* Back Navigation */}
        {filteredArticles.length > 0 && (
          <motion.div 
            className="text-center mt-16 pt-8 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to={`/category/${category}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category.charAt(0).toUpperCase() + category.slice(1)}
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubcategoryPage;