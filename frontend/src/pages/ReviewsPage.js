import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Search, TrendingUp, Award, ShoppingCart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { formatPrice, formatDateShort } from '../utils/formatters';
import { useArticles } from '../hooks/useArticles';

const ReviewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, rating, price-low, price-high
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real articles that can serve as reviews (food and luxury articles)
  const { data: articles = [], isLoading } = useArticles({ limit: 20 });

  // Get article route helper
  const getArticleRoute = (article) => {
    const slug = article.slug;
    if (slug === 'celini-food-review-mumbai') return '/celini-food-review-mumbai';
    if (slug === 'scottish-leader-whiskey-review') return '/scottish-leader-whiskey-review';
    if (slug === 'sunseeker-65-sport-luxury-yacht-review') return '/sunseeker-65-sport-luxury-yacht-review';
    if (slug === 'double-wristing-smartwatch-traditional-watch-trend') return '/double-wristing-smartwatch-traditional-watch-trend';
    return `/article/${slug}`;
  };

  // Transform articles into review format
  const reviews = articles.filter(article => 
    article.category === 'food' || 
    article.category === 'luxury' || 
    article.category === 'technology'
  ).map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    product: article.title.split(':')[0] || article.title,
    brand: article.category === 'food' ? 'Restaurant' : 'Luxury Brand',
    score: 9.2, // Default high score for our quality articles
    pros: ['Premium quality', 'Excellent service', 'Great value', 'Highly recommended'],
    cons: ['Premium pricing', 'Limited availability'],
    specs: {
      'Category': article.category,
      'Author': article.author_name,
      'Reading Time': `${article.reading_time} minutes`,
      'Published': formatDateShort(article.published_at)
    },
    price_inr: article.category === 'luxury' ? 500000 : 15000,
    affiliate_links: {},
    body: article.body,
    images: [article.hero_image],
    category: article.category,
    author_name: article.author_name,
    created_at: article.published_at,
    featured: true
  }));

  // Filter categories based on available reviews
  const availableCategories = [...new Set(reviews.map(review => review.category))];

  // Categories for filtering (updated to use real categories)
  const categories = [
    { id: 'all', name: 'All Categories', icon: '📱' },
    ...availableCategories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: cat === 'food' ? '🍽️' : cat === 'luxury' ? '⛵' : '📱'
    }))
  ];

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(query) ||
        review.product.toLowerCase().includes(query) ||
        review.brand.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(review => review.category === selectedCategory);
    }

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price_inr - b.price_inr);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price_inr - a.price_inr);
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return filtered;
  }, [reviews, searchQuery, selectedCategory, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Loading Reviews...</h1>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6">Premium Reviews</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              In-depth reviews of luxury products, premium experiences, and lifestyle essentials from our expert team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {filteredReviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link to={getArticleRoute(review)} className="block">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={review.images[0]}
                        alt={review.product}
                        className="w-full h-64 md:h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {review.category}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-bold text-lg">{review.score}</span>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        {review.title}
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {review.body.substring(0, 200)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {review.author_name}</span>
                        <span>{formatDateShort(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Reviews Found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;