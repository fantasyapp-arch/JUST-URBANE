import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Calendar, User, Clock, ArrowRight } from 'lucide-react';

const IssuesPage = () => {
  const navigate = useNavigate();
  
  const openMagazineReader = () => {
    console.log('🔥 Opening magazine reader instantly...');
    // Navigate immediately to magazine reader - no animations
    navigate('/magazine-reader');
  };

  // Sample magazine issues data
  const magazineIssues = [
    {
      id: 1,
      title: 'Just Urbane',
      subtitle: 'August 2025 Issue',
      description: 'Premium Lifestyle & Technology - Featuring exclusive interviews, luxury travel guides, and cutting-edge tech reviews.',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      publishDate: 'August 2025',
      author: 'Editorial Team',
      readTime: '45 min read',
      isLatest: true,
      pages: 92,
      category: 'Lifestyle & Tech',
      featured: true,
      previewAvailable: true,
      tags: ['Tech Reviews', 'Luxury Travel', 'Fashion', 'Automotive']
    },
    {
      id: 2,
      title: 'Just Urbane',
      subtitle: 'July 2025 Issue',
      description: 'Summer Special - Discover the latest in premium fashion, exotic destinations, and innovative gadgets.',
      coverImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=600&fit=crop&crop=face',
      publishDate: 'July 2025',
      author: 'Editorial Team',
      readTime: '50 min read',
      isLatest: false,
      pages: 88,
      category: 'Fashion & Travel',
      featured: false,
      previewAvailable: false,
      tags: ['Summer Fashion', 'Travel', 'Gadgets', 'Lifestyle']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Digital Magazine Issues
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Immerse yourself in premium lifestyle content with our interactive digital magazine experience
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured Issue Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Magazine Cover */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <img
                  src={magazineIssues[0].coverImage}
                  alt={`${magazineIssues[0].title} - ${magazineIssues[0].subtitle}`}
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                
                {/* Preview Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    {magazineIssues[0].previewAvailable ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('🎯 Button clicked!');
                          openMagazineReader();
                        }}
                        className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                        type="button"
                      >
                        <PlayCircle className="h-5 w-5" />
                        <span>Free Preview</span>
                      </button>
                    ) : (
                      <div className="bg-white/10 backdrop-blur-sm text-white/60 px-6 py-3 rounded-full font-semibold mx-auto text-center">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Issue Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Latest Issue
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    3 Pages Free Preview Available
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {magazineIssues[0].title}
                </h2>
                <h3 className="text-xl text-gray-600 mb-4">{magazineIssues[0].subtitle}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {magazineIssues[0].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{magazineIssues[0].publishDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{magazineIssues[0].author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{magazineIssues[0].readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{magazineIssues[0].pages} Pages</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {magazineIssues[0].tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Did you know our monthly issues can now be read online?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Experience premium digital magazine reading with smooth page transitions, 
            high-quality visuals, and interactive content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('🎯 Bottom Free Preview button clicked!');
                openMagazineReader();
              }}
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
              type="button"
            >
              Free Preview
            </button>
            <Link
              to="/pricing"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Subscribe for Full Access</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IssuesPage;