import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { useCategoryArticles } from '../hooks/useArticles';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: articles = [], isLoading, error } = useCategoryArticles(slug, { limit: 50 });

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

  const categoryTitles = {
    fashion: "FASHION",
    technology: "TECHNOLOGY",
    tech: "TECH",
    business: "BUSINESS", 
    finance: "FINANCE",
    travel: "TRAVEL",
    health: "HEALTH",
    culture: "CULTURE",
    art: "ART",
    entertainment: "ENTERTAINMENT",
    auto: "AUTO",
    grooming: "GROOMING",
    food: "FOOD",
    aviation: "AVIATION",
    people: "PEOPLE",
    luxury: "LUXURY"
  };

  const categoryLabels = {
    fashion: "Look Good",
    technology: "Get Smart",
    tech: "Get Smart",
    business: "Get Smart",
    finance: "Get Smart",
    travel: "Live Well",
    health: "Live Well",
    culture: "Entertainment",
    art: "Entertainment",
    entertainment: "Entertainment",
    auto: "Live Well",
    grooming: "Look Good",
    food: "Live Well",
    aviation: "Live Well",
    people: "Entertainment",
    luxury: "Live Well"
  };

  const pageTitle = categoryTitles[slug] || slug.toUpperCase();
  const categoryLabel = categoryLabels[slug] || "Category";

  // Subcategories for each main category
  const subcategories = {
    fashion: [
      { name: 'Men', slug: 'men', description: "Men's style & grooming" },
      { name: 'Women', slug: 'women', description: "Women's fashion & beauty" },
      { name: 'Luxury', slug: 'luxury', description: 'Designer collections' },
      { name: 'Accessories', slug: 'accessories', description: 'Watches & jewelry' },
      { name: 'Trends', slug: 'trends', description: 'Latest fashion trends' }
    ],
    technology: [
      { name: 'Gadgets', slug: 'gadgets', description: 'Latest devices' },
      { name: 'Mobile', slug: 'mobile', description: 'Smartphones & apps' },
      { name: 'Smart', slug: 'smart', description: 'Smart home tech' },
      { name: 'AI', slug: 'ai', description: 'Artificial Intelligence' },
      { name: 'Reviews', slug: 'reviews', description: 'Product reviews' }
    ],
    auto: [
      { name: 'Cars', slug: 'cars', description: 'Luxury automobiles' },
      { name: 'Bikes', slug: 'bikes', description: 'Premium motorcycles' },
      { name: 'EVs', slug: 'evs', description: 'Electric vehicles' },
      { name: 'Concept', slug: 'concept', description: 'Future concepts' },
      { name: 'Classics', slug: 'classics', description: 'Vintage classics' }
    ],
    travel: [
      { name: 'Luxury', slug: 'luxury', description: 'Premium destinations' },
      { name: 'Destinations', slug: 'destinations', description: 'Travel guides' },
      { name: 'Guides', slug: 'guides', description: 'Travel tips' },
      { name: 'Resorts', slug: 'resorts', description: 'Luxury hotels' },
      { name: 'Adventure', slug: 'adventure', description: 'Adventure travel' }
    ],
    people: [
      { name: 'Celebrities', slug: 'celebrities', description: 'Celebrity news' },
      { name: 'Entrepreneurs', slug: 'entrepreneurs', description: 'Business leaders' },
      { name: 'Icons', slug: 'icons', description: 'Cultural icons' },
      { name: 'Leaders', slug: 'leaders', description: 'Industry leaders' },
      { name: 'Culture', slug: 'culture', description: 'Cultural figures' }
    ],
    luxury: [
      { name: 'Yachts', slug: 'yachts', description: 'Luxury yachts' },
      { name: 'Real Estate', slug: 'real-estate', description: 'Premium properties' },
      { name: 'Automobiles', slug: 'automobiles', description: 'Luxury cars' },
      { name: 'Private Jets', slug: 'private-jets', description: 'Private aviation' }
    ]
  };

  const currentSubcategories = subcategories[slug] || [];

  // Clean GQ India style Article Card
  const GQStyleCard = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={article.slug === 'atlantis-the-palm-dubai' ? '/atlantis-the-palm-dubai' : 
            article.slug === 'celini-food-review-mumbai' ? '/celini-food-review-mumbai' : 
            article.slug === 'scottish-leader-whiskey-review' ? '/scottish-leader-whiskey-review' :
            article.slug === 'when-in-france-travel-destinations' ? '/when-in-france-travel-destinations' :
            article.slug === 'sustainable-travel-conscious-guide' ? '/sustainable-travel-conscious-guide' :
            article.slug === 'perfect-suit-guide-men-corporate-dressing' ? '/perfect-suit-guide-men-corporate-dressing' :
            article.slug === 'oscars-2022-best-dressed-fashion-red-carpet' ? '/oscars-2022-best-dressed-fashion-red-carpet' :
            article.slug === 'sunseeker-65-sport-luxury-yacht-review' ? '/sunseeker-65-sport-luxury-yacht-review' :
            article.slug === 'double-wristing-smartwatch-traditional-watch-trend' ? '/double-wristing-smartwatch-traditional-watch-trend' :
            article.slug === 'aastha-gill-buzz-queen-bollywood-singer-interview' ? '/aastha-gill-buzz-queen-bollywood-singer-interview' :
            `/article/${article.slug || article.id}`}
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
              {categoryLabel}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link to="/" className="btn-primary">Back to Home</Link>
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
            <span className="text-gray-900 font-bold capitalize">{slug}</span>
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

        {/* Subcategories Navigation - If Available */}
        {currentSubcategories.length > 0 && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-wrap justify-center gap-4">
              {currentSubcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/category/${slug}/${sub.slug}`}
                  className="group bg-gray-100 hover:bg-primary-600 text-gray-700 hover:text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search Bar - Clean and Simple */}
        <motion.div 
          className="max-w-lg mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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

        {/* Articles Grid - Clean GQ India Style */}
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
            transition={{ duration: 0.6, delay: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.6 }}
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
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
          </motion.div>
        )}

        {/* Back Navigation */}
        {filteredArticles.length > 0 && (
          <motion.div 
            className="text-center mt-16 pt-8 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;