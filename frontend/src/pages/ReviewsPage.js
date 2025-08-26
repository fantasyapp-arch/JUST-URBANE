import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, Search, TrendingUp, Award, ShoppingCart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { formatPrice } from '../utils/formatters';

const ReviewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, rating, price-low, price-high
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock reviews data - in real app, this would come from API
  const reviews = [
    {
      id: '1',
      title: 'Apple Watch Ultra 2: The Ultimate Luxury Smartwatch',
      slug: 'apple-watch-ultra-2-review',
      product: 'Apple Watch Ultra 2',
      brand: 'Apple',
      score: 9.2,
      pros: ['Premium titanium build', 'Exceptional battery life', 'Comprehensive health tracking', 'Bright Always-On display'],
      cons: ['High price point', 'Limited customization', 'Size may be too large for some'],
      specs: {
        'Display': '49mm Always-On Retina',
        'Material': 'Titanium',
        'Battery Life': 'Up to 36 hours',
        'Water Resistance': '100m'
      },
      price_inr: 89900,
      affiliate_links: {
        'Apple Store': 'https://apple.com',
        'Amazon': 'https://amazon.in'
      },
      body: 'The Apple Watch Ultra 2 represents the pinnacle of smartwatch engineering, combining luxury materials with cutting-edge technology.',
      images: ['https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800'],
      category: 'tech',
      author_name: 'Vikram Singh',
      created_at: '2024-11-15T10:00:00Z',
      featured: true
    },
    {
      id: '2',
      title: 'Rolex Submariner: Timeless Diving Excellence',
      slug: 'rolex-submariner-review',
      product: 'Rolex Submariner Date',
      brand: 'Rolex',
      score: 9.8,
      pros: ['Iconic design', 'Swiss craftsmanship', 'Excellent resale value', 'Water resistance to 300m'],
      cons: ['Premium price', 'Long waiting lists', 'Limited availability'],
      specs: {
        'Case Size': '41mm',
        'Material': 'Oystersteel',
        'Movement': 'Perpetual, self-winding',
        'Water Resistance': '300m'
      },
      price_inr: 850000,
      affiliate_links: {
        'Rolex Authorized Dealer': 'https://rolex.com'
      },
      body: 'The Rolex Submariner remains the gold standard for luxury dive watches, combining functionality with timeless elegance.',
      images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
      category: 'watches',
      author_name: 'Rahul Sharma',
      created_at: '2024-11-10T14:30:00Z',
      featured: true
    },
    {
      id: '3',
      title: 'Tom Ford Oud Wood: Luxury Fragrance Perfection',
      slug: 'tom-ford-oud-wood-review',
      product: 'Tom Ford Oud Wood',
      brand: 'Tom Ford',
      score: 8.9,
      pros: ['Sophisticated scent profile', 'Long-lasting', 'Premium packaging', 'Versatile for any occasion'],
      cons: ['Very expensive', 'May be too strong for some', 'Limited availability'],
      specs: {
        'Volume': '50ml / 100ml',
        'Fragrance Family': 'Oriental Woody',
        'Top Notes': 'Rosewood, Cardamom',
        'Base Notes': 'Oud, Sandalwood'
      },
      price_inr: 24500,
      affiliate_links: {
        'Tom Ford': 'https://tomford.com',
        'Sephora': 'https://sephora.com'
      },
      body: 'Tom Ford Oud Wood is a masterclass in luxury fragrance composition, perfect for the discerning gentleman.',
      images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'],
      category: 'grooming',
      author_name: 'Priya Nair',
      created_at: '2024-11-08T09:15:00Z',
      featured: false
    },
    {
      id: '4',
      title: 'Sony WH-1000XM5: Premium Audio Excellence',
      slug: 'sony-wh1000xm5-review',
      product: 'Sony WH-1000XM5',
      brand: 'Sony',
      score: 9.0,
      pros: ['Best-in-class noise cancellation', 'Exceptional sound quality', '30-hour battery life', 'Comfortable design'],
      cons: ['Not foldable', 'Touch controls can be sensitive', 'Premium price'],
      specs: {
        'Driver Size': '30mm',
        'Battery Life': '30 hours',
        'Noise Cancellation': 'Industry-leading',
        'Weight': '250g'
      },
      price_inr: 32990,
      affiliate_links: {
        'Sony': 'https://sony.com',
        'Amazon': 'https://amazon.in',
        'Flipkart': 'https://flipkart.com'
      },
      body: 'The Sony WH-1000XM5 sets the benchmark for premium wireless headphones with exceptional audio quality.',
      images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'],
      category: 'tech',
      author_name: 'Vikram Singh',
      created_at: '2024-11-05T16:20:00Z',
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Reviews', count: reviews.length },
    { id: 'tech', name: 'Technology', count: reviews.filter(r => r.category === 'tech').length },
    { id: 'watches', name: 'Watches', count: reviews.filter(r => r.category === 'watches').length },
    { id: 'grooming', name: 'Grooming', count: reviews.filter(r => r.category === 'grooming').length },
    { id: 'style', name: 'Style', count: reviews.filter(r => r.category === 'style').length },
    { id: 'travel', name: 'Travel', count: reviews.filter(r => r.category === 'travel').length }
  ];

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(query) ||
        review.product.toLowerCase().includes(query) ||
        review.brand.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(review => review.category === selectedCategory);
    }

    // Apply sorting
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
      default: // 'newest'
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const featuredReviews = reviews.filter(review => review.featured);

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 8) return 'text-blue-600 bg-blue-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderStars = (score) => {
    const fullStars = Math.floor(score / 2);
    const hasHalfStar = (score % 2) >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-200 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  const ReviewCard = ({ review }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <img
          src={review.images[0]}
          alt={review.product}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(review.score)}`}>
            {review.score}/10
          </span>
        </div>
        {review.featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Award className="h-3 w-3" />
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {renderStars(review.score)}
          <span className="text-sm text-gray-600 ml-2">({review.score}/10)</span>
        </div>

        <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2 hover:text-gold-600 transition-colors">
          <Link to={`/reviews/${review.slug}`}>
            {review.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {review.body}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-900">{review.product}</p>
            <p className="text-sm text-gray-600">{review.brand}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-900">
              {formatPrice(review.price_inr)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="category-chip">
            {review.category}
          </span>
          <div className="flex gap-2">
            <Link
              to={`/reviews/${review.slug}`}
              className="text-gold-600 hover:text-gold-700 font-medium text-sm"
            >
              Read Review
            </Link>
            {Object.keys(review.affiliate_links).length > 0 && (
              <button className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm">
                <ShoppingCart className="h-3 w-3" />
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">⭐</div>
            <h1 className="font-serif text-5xl md:text-6xl font-black mb-6">
              Premium Reviews
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              In-depth reviews of luxury products, from timepieces to technology, tested by our expert team.
            </p>
            <div className="flex items-center justify-center text-sm opacity-80">
              <span>{reviews.length} expert reviews</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Reviews */}
      {featuredReviews.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="section-title flex items-center justify-center gap-3">
                <Award className="h-8 w-8 text-gold-500" />
                Featured Reviews
              </h2>
              <p className="text-gray-600">
                Our top-rated products and most comprehensive reviews
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {featuredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="flex flex-col lg:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews, products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredAndSortedReviews.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredAndSortedReviews.map((review, index) => (
              <div
                key={review.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              No Reviews Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No reviews match your search "${searchQuery}".`
                : "No reviews match your current filters."
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('newest');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Review Categories */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="section-title">Browse by Category</h3>
            <p className="text-gray-600">
              Explore reviews in your areas of interest
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {categories.filter(cat => cat.id !== 'all').map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="group bg-gray-50 hover:bg-gold-50 rounded-2xl p-6 text-center transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-3xl mb-3">
                  {category.id === 'tech' && '📱'}
                  {category.id === 'watches' && '⌚'}
                  {category.id === 'grooming' && '💅'}
                  {category.id === 'style' && '👔'}
                  {category.id === 'travel' && '✈️'}
                </div>
                <h4 className="font-serif text-lg font-semibold text-primary-900 mb-2 group-hover:text-gold-600">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {category.count} reviews
                </p>
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-3xl font-serif font-bold mb-4">
              Want Detailed Reviews?
            </h3>
            <p className="text-primary-200 mb-8 text-lg">
              Join our premium community to access comprehensive reviews, buying guides, and exclusive product insights.
            </p>
            <Link to="/pricing" className="btn-primary bg-gold-500 hover:bg-gold-600">
              Get Premium Access
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;