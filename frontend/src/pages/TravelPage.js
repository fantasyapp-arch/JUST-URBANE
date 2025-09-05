import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Star, Camera, Plane, Filter, Search, Globe, Mountain, Waves, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import { useArticles } from '../hooks/useArticles';
import { formatDateShort } from '../utils/formatters';

const TravelPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real travel articles from database
  const { data: articles = [], isLoading } = useArticles({ category: 'travel', limit: 20 });

  // Get article route helper
  const getArticleRoute = (article) => {
    const slug = article.slug;
    if (slug === 'when-in-france-travel-destinations') return '/when-in-france-travel-destinations';
    if (slug === 'sustainable-travel-conscious-guide') return '/sustainable-travel-conscious-guide';
    return `/article/${slug}`;
  };

  // Transform real articles into destination format
  const destinations = articles.map(article => ({
    id: article.id,
    name: article.title,
    slug: article.slug,
    region: article.subcategory === 'adventure' ? 'Europe' : 'Global',
    type: article.subcategory === 'guides' ? 'Sustainable Travel' : 'Adventure Travel',
    hero_image: article.hero_image,
    gallery: [article.hero_image],
    description: article.body.substring(0, 200) + '...',
    experiences: ['Premium experiences', 'Luxury accommodations', 'Cultural immersion', 'Exclusive access'],
    best_time_to_visit: 'Year-round',
    price_range: '₹50,000 - ₹150,000 per trip',
    rating: 4.8,
    featured: true,
    created_at: article.published_at,
    author: article.author_name
  }));

  // Fallback destinations if no real articles (can be removed later)
  const fallbackDestinations = [
    {
      id: '1',
      name: 'Rajasthan Palace Hotels',
      slug: 'rajasthan-palace-hotels',
      region: 'India',
      type: 'Luxury Hotels',
      hero_image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?w=800'
      ],
      description: 'Experience royal luxury in converted palace hotels across Rajasthan, where maharajas once lived and legends were born.',
      experiences: ['Royal dining experiences', 'Elephant safaris', 'Palace tours', 'Cultural performances', 'Heritage walks'],
      best_time_to_visit: 'October to March',
      price_range: '₹15,000 - ₹50,000 per night',
      rating: 4.8,
      featured: true,
      created_at: '2024-11-15T10:00:00Z',
      author: 'Ananya Krishnan'
    },
    {
      id: '2',
      name: 'Kerala Backwater Luxury',
      slug: 'kerala-backwaters-luxury',
      region: 'India',
      type: 'Nature & Wellness',
      hero_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
        'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800'
      ],
      description: 'Serene luxury houseboats navigating the tranquil backwaters of God\'s Own Country, offering unparalleled relaxation.',
      experiences: ['Luxury houseboat cruises', 'Ayurvedic spa treatments', 'Local cuisine tasting', 'Village cultural tours', 'Bird watching'],
      best_time_to_visit: 'December to February',
      price_range: '₹8,000 - ₹25,000 per night',
      rating: 4.7,
      featured: true,
      created_at: '2024-11-12T14:30:00Z',
      author: 'Ananya Krishnan'
    },
    {
      id: '3',
      name: 'Swiss Alpine Luxury Resorts',
      slug: 'swiss-alpine-luxury',
      region: 'Europe',
      type: 'Mountain Resorts',
      hero_image: 'https://images.unsplash.com/photo-1551524164-d526ff10480d?w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1551524164-d526ff10480d?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
      ],
      description: 'World-class alpine resorts offering breathtaking mountain views, Michelin-starred dining, and exclusive ski access.',
      experiences: ['Private ski lessons', 'Michelin-starred dining', 'Helicopter tours', 'Luxury spa treatments', 'Mountain hiking'],
      best_time_to_visit: 'December to April (Winter), June to September (Summer)',
      price_range: '₹40,000 - ₹120,000 per night',
      rating: 4.9,
      featured: false,
      created_at: '2024-11-10T09:15:00Z',
      author: 'Vikram Singh'
    },
    {
      id: '4',
      name: 'Maldives Overwater Villas',
      slug: 'maldives-overwater-villas',
      region: 'Asia Pacific',
      type: 'Beach & Island',
      hero_image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200',
      gallery: [
        'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
      ],
      description: 'Ultimate tropical luxury in overwater villas surrounded by crystal-clear lagoons and pristine coral reefs.',
      experiences: ['Snorkeling and diving', 'Sunset dolphin cruises', 'Private beach dining', 'Couples spa treatments', 'Water sports'],
      best_time_to_visit: 'November to April',
      price_range: '₹60,000 - ₹200,000 per night',
      rating: 4.8,
      featured: false,
      created_at: '2024-11-08T16:45:00Z',
      author: 'Priya Nair'
    }
  ];

  const regions = [
    { id: 'all', name: 'All Regions', count: destinations.length },
    { id: 'India', name: 'India', count: destinations.filter(d => d.region === 'India').length },
    { id: 'Europe', name: 'Europe', count: destinations.filter(d => d.region === 'Europe').length },
    { id: 'Asia Pacific', name: 'Asia Pacific', count: destinations.filter(d => d.region === 'Asia Pacific').length }
  ];

  const travelTypes = [
    { id: 'all', name: 'All Types', icon: '🌍' },
    { id: 'Luxury Hotels', name: 'Luxury Hotels', icon: '🏰' },
    { id: 'Beach & Island', name: 'Beach & Island', icon: '🏝️' },
    { id: 'Mountain Resorts', name: 'Mountain Resorts', icon: '⛰️' },
    { id: 'Nature & Wellness', name: 'Nature & Wellness', icon: '🌿' }
  ];

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        dest.region.toLowerCase().includes(query)
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(dest => dest.region === selectedRegion);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(dest => dest.type === selectedType);
    }

    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return filtered;
  }, [destinations, searchQuery, selectedRegion, selectedType, sortBy]);

  const featuredDestinations = destinations.filter(dest => dest.featured);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
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
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  const DestinationCard = ({ destination, size = 'medium' }) => {
    const isLarge = size === 'large';
    
    return (
      <motion.div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
          isLarge ? 'md:col-span-2' : ''
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`relative ${isLarge ? 'h-80' : 'h-48'}`}>
          <img
            src={destination.hero_image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-primary-900 px-3 py-1 rounded-full text-xs font-medium">
              {destination.region}
            </span>
            {destination.featured && (
              <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Featured
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className={`font-serif text-white font-bold leading-tight ${
              isLarge ? 'text-2xl lg:text-3xl' : 'text-xl'
            }`}>
              {destination.name}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            {renderStars(destination.rating)}
            <span className="category-chip">
              {destination.type}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {destination.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span>Best Time</span>
              </div>
              <p className="font-medium text-gray-900">{destination.best_time_to_visit}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <MapPin className="h-4 w-4" />
                <span>Price Range</span>
              </div>
              <p className="font-medium text-gray-900">{destination.price_range}</p>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Top Experiences</h5>
            <div className="flex flex-wrap gap-1">
              {destination.experiences.slice(0, 3).map((experience, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {experience}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              By {destination.author}
            </div>
            <Link
              to={`/travel/${destination.slug}`}
              className="text-gold-600 hover:text-gold-700 font-medium text-sm flex items-center gap-1"
            >
              Explore
              <Plane className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🌍</div>
            <h1 className="font-serif text-5xl md:text-6xl font-black mb-6">
              Luxury Travel
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover extraordinary destinations and luxury experiences that redefine travel.
            </p>
            <div className="flex items-center justify-center text-sm opacity-80">
              <span>{destinations.length} curated destinations</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Destinations */}
      {featuredDestinations.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="section-title flex items-center justify-center gap-3">
                <Star className="h-8 w-8 text-gold-500" />
                Featured Destinations
              </h2>
              <p className="text-gray-600">
                Hand-picked luxury experiences for the discerning traveler
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} size="large" />
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
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {travelTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 py-12">
        {filteredDestinations.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-6xl mb-6">🗺️</div>
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4">
              No Destinations Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              No destinations match your current filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
                setSelectedType('all');
                setSortBy('newest');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h3 className="text-3xl font-serif font-bold mb-4">
              Ready for Your Next Adventure?
            </h3>
            <p className="text-blue-200 mb-8 text-lg">
              Join our premium community for exclusive travel guides and luxury experiences.
            </p>
            <Link to="/pricing" className="btn-primary bg-gold-500 hover:bg-gold-600">
              Get Travel Guides
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TravelPage;