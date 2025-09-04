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

  // Fetch articles directly
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
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (category && subcategory) {
      fetchArticles();
    }
  }, [category, subcategory]);

  const pageTitle = decodedSubcategory.toUpperCase();
  const categoryLabel = {
    fashion: "Look Good",
    tech: "Get Smart", 
    auto: "Live Well",
    travel: "Live Well",
    grooming: "Look Good",
    food: "Live Well",
    people: "Entertainment"
  }[category] || "Category";

  // Featured articles for specific subcategories
  const featuredArticles = {
    'travel-luxury': [
      {
        id: 'atlantis-the-palm-dubai',
        title: "Atlantis The Palm: A Mythical Journey to Dubai's Crown Jewel",
        dek: "Experience the luxury and opulence of Dubai's most iconic resort, where myth meets reality in the heart of Palm Jumeirah",
        author_name: "Chahat Dalal",
        published_at: "2022-07-01T00:00:00Z",
        reading_time: 8,
        hero_image: "https://customer-assets.emergentagent.com/job_slick-page-turner/artifacts/jcqtiy5s_phy2015.rst.ath.atlantiswithpalm-angle-colour-hr.jpg",
        category: "travel",
        subcategory: "luxury",
        slug: "atlantis-the-palm-dubai",
        view_count: 2850,
        is_premium: false,
        is_featured: true
      }
    ]
  };

  // Get featured articles for current subcategory
  const currentFeatured = featuredArticles[`${category}-${subcategory}`] || [];

  // Combine featured articles with regular articles
  const allArticles = [...currentFeatured, ...articles];

  // Filter articles
  const filteredArticles = allArticles.filter(article => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return article.title.toLowerCase().includes(query) ||
           article.dek?.toLowerCase().includes(query);
  });

  // GQ Style Card
  const GQCard = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={article.slug === 'atlantis-the-palm-dubai' ? '/atlantis-the-palm-dubai' : `/article/${article.slug || article.id}`}
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

        {/* Content Area */}
        {isLoading ? (
          <div className="text-center py-20">
            <LoadingSpinner text="Loading articles..." />
          </div>
        ) : filteredArticles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredArticles.map((article, index) => (
              <GQCard 
                key={article.id} 
                article={article} 
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Content Available
            </h3>
            <p className="text-gray-600 mb-4">
              No articles found in {pageTitle.toLowerCase()} section.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Debug: {articles.length} total articles in {category}/{subcategory}
            </p>
            <Link to={`/category/${category}`} className="btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category}
            </Link>
          </div>
        )}

        {/* Debug Info */}
        <div className="text-center mt-8 text-sm text-gray-400">
          Debug: {articles.length} articles loaded, {filteredArticles.length} after filtering
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;