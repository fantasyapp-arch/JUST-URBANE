import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Eye, Calendar, ArrowRight, Star, Sparkles } from 'lucide-react';
import parseMagazineContent from '../components/MagazineContentParser';

const IssuesPage = () => {
  const navigate = useNavigate();
  
  const openMagazineReader = () => {
    console.log('🔥 Opening magazine reader instantly...');
    navigate('/magazine-reader');
  };

  // Get magazine pages for thumbnails
  const pages = parseMagazineContent();
  
  // Use first 3 pages as thumbnails
  const magazineThumbnails = pages.slice(0, 3);

  const currentIssue = {
    title: 'Just Urbane',
    subtitle: 'August 2025 Edition',
    description: 'Experience luxury lifestyle, premium fashion, and cutting-edge technology through our immersive digital magazine.',
    publishDate: 'August 2025',
    totalPages: pages.length,
    category: 'Premium Lifestyle',
    highlights: [
      'Exclusive Celebrity Interviews',
      'Luxury Travel Destinations', 
      'Premium Fashion Collections',
      'Latest Technology Reviews',
      'Luxury Automotive Features'
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586953135225-fc4e67e98b90?w=1920&h=1080')] bg-cover bg-center"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-amber-400 to-gold-500 text-black px-6 py-2 rounded-full text-sm font-bold tracking-wide">
                <Sparkles className="inline h-4 w-4 mr-2" />
                PREMIUM DIGITAL MAGAZINE
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-amber-200 to-gold-300 bg-clip-text text-transparent leading-tight">
              Just Urbane
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              {currentIssue.subtitle}
            </p>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {currentIssue.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Magazine Preview Section */}
      <div className="container mx-auto px-6 md:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
            Premium Digital Magazine Collection
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover our world-class digital magazine featuring luxury lifestyle, premium fashion, cutting-edge technology, and exclusive content curated for the sophisticated reader
          </p>
        </motion.div>

        {/* Magazine Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {magazineThumbnails.map((page, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={openMagazineReader}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <img
                  src={page.pageImage}
                  alt={`Page ${index + 1} Preview`}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Page Number Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  Page {index + 1}
                </div>
                
                {/* Preview Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {page.title || `Page ${index + 1}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {index === 0 ? 'Fashion & Style' : index === 1 ? 'Celebrity Features' : 'Luxury Travel'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Issue Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Star className="h-6 w-6 text-amber-500" />
                <span className="text-amber-600 font-semibold text-lg">Featured Content</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What's Inside
              </h3>
              
              <div className="space-y-4">
                {currentIssue.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-gold-500 rounded-full"></div>
                    <span className="text-gray-700 text-lg">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-white">
                <div className="text-6xl font-bold mb-2">{currentIssue.totalPages}</div>
                <div className="text-xl text-gray-300 mb-4">Premium Pages</div>
                <div className="text-amber-400 font-semibold">
                  {currentIssue.publishDate}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-gold-500/10 to-amber-500/10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Premium?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start with 3 pages free, then unlock the complete digital magazine experience with premium content, exclusive interviews, and luxury lifestyle insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={openMagazineReader}
                className="bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-black font-bold px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-xl"
              >
                <PlayCircle className="h-6 w-6" />
                <span>Start Free Preview</span>
              </button>
              
              <Link
                to="/pricing"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-10 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3"
              >
                <span>View Subscription Plans</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-400">
              <span>✨ No credit card required for preview</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IssuesPage;