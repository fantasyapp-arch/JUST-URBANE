import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, Play, Star, Calendar } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { formatDateShort } from '../utils/formatters';

const HomePage = () => {
  // Hero Article
  const heroArticle = {
    title: "The Art of Modern Luxury: Where Heritage Meets Innovation",
    excerpt: "Exploring how contemporary luxury brands balance traditional craftsmanship with cutting-edge innovation to create timeless masterpieces that define the future of premium lifestyle.",
    category: "Culture",
    author: "Arjun Malhotra",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1559839049-2b350c4284cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  };

  // Featured Articles by Category
  const fashionArticles = [
    {
      title: "Timeless Elegance: The Modern Gentleman's Guide",
      excerpt: "Master the art of sophisticated dressing with essential style principles that transcend seasonal trends",
      author: "Priya Sharma",
      date: "Jan 14, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Milan Fashion Week: Spring 2025 Highlights",
      excerpt: "The latest collections from Italy's fashion capital showcase innovation and traditional craftsmanship",
      author: "Alessandro Rossi",
      date: "Jan 13, 2025", 
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1591884807235-1dc6c2e148b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Luxury Accessories: Investment Pieces That Last",
      excerpt: "Building a sophisticated wardrobe with timeless luxury accessories that retain their value",
      author: "Kavya Singh",
      date: "Jan 12, 2025",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const watchesArticles = [
    {
      title: "Patek Philippe: The Pinnacle of Swiss Horology",
      excerpt: "Understanding what makes this manufacturer the most revered name in luxury watchmaking",
      author: "Vikram Singh",
      date: "Jan 11, 2025",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1604242692760-2f7b0c26856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Vintage Watch Collecting: A Beginner's Guide",
      excerpt: "How to start building a prestigious collection of vintage timepieces with confidence",
      author: "Rajesh Gupta",
      date: "Jan 10, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const lifestyleArticles = [
    {
      title: "Atlantis The Palm: A Mythical Journey to Dubai's Crown Jewel",
      excerpt: "Experience the luxury and opulence of Dubai's most iconic resort, where myth meets reality in the heart of Palm Jumeirah",
      author: "Chahat Dalal",
      date: "July 2022",
      readTime: "8 min read",
      image: "https://customer-assets.emergentagent.com/job_slick-page-turner/artifacts/jcqtiy5s_phy2015.rst.ath.atlantiswithpalm-angle-colour-hr.jpg",
      category: "Travel",
      subcategory: "Luxury Stays",
      slug: "atlantis-the-palm-dubai"
    },
    {
      title: "The Art of Fine Dining at Home",
      excerpt: "Creating restaurant-quality culinary experiences in the comfort of your own space",
      author: "Chef Anita Sharma",
      date: "Jan 9, 2025",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Luxury Travel: Hidden Gems of 2025",
      excerpt: "Exclusive destinations that offer unparalleled experiences for the discerning traveler",
      author: "Rohit Kumar", 
      date: "Jan 8, 2025",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const cultureArticles = [
    {
      title: "Contemporary Art: Investment Trends 2025",
      excerpt: "Navigating the modern art market with expert insights and strategic guidance",
      author: "Dr. Maya Patel",
      date: "Jan 7, 2025",
      readTime: "11 min read", 
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Opera Houses: Architectural Marvels",
      excerpt: "Exploring the world's most stunning cultural landmarks and their timeless beauty",
      author: "Isabella Martinez",
      date: "Jan 6, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const videoContent = [
    {
      title: "Inside Swiss Watch Manufacturing",
      duration: "15:42",
      category: "Watches",
      thumbnail: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Fashion Week Runway Review",
      duration: "10:30",
      category: "Fashion",
      thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Luxury Home Design Tour",
      duration: "12:15",
      category: "Lifestyle",
      thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                {heroArticle.category}
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                {heroArticle.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {heroArticle.excerpt}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {heroArticle.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {heroArticle.date}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {heroArticle.readTime}
                </span>
              </div>
              <Link 
                to="/article/hero-article"
                className="inline-flex items-center text-gray-900 font-semibold hover:text-gray-600 transition-colors"
              >
                Read Article
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img 
                src={heroArticle.image}
                alt={heroArticle.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FASHION SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Fashion</h2>
            <p className="text-gray-600 text-lg">Style, trends, and designer insights</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {fashionArticles.map((article, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* WATCHES SECTION */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Watches</h2>
            <p className="text-gray-600 text-lg">Luxury timepieces and horological excellence</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {watchesArticles.map((article, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="md:w-1/2 p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* LUXURY TRAVEL SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Luxury Travel</h2>
            <p className="text-gray-600 text-lg">Premium destinations and luxury experiences</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {lifestyleArticles.map((article, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <Link to={article.slug === 'atlantis-the-palm-dubai' ? '/atlantis-the-palm-dubai' : (article.slug ? `/article/${article.slug}` : '#')} className="block">
                  <div className="relative">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {article.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE SECTION */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Culture</h2>
            <p className="text-gray-600 text-lg">Arts, entertainment, and cultural insights</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {cultureArticles.map((article, index) => (
              <motion.article 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEOS SECTION */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Videos</h2>
            <p className="text-gray-300 text-lg">Premium video content and exclusive interviews</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {videoContent.map((video, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-2">
                    {video.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors">
                    {video.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Stay Updated with Just Urbane
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest in luxury lifestyle, fashion, and culture delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;