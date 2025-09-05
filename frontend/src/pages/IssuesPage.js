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
        
        <div className="relative z-10 container mx-auto px-6 md:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-amber-400 to-gold-500 text-black px-8 py-3 rounded-full text-lg font-bold tracking-wide shadow-lg">
                <Sparkles className="inline h-5 w-5 mr-3" />
                PREMIUM DIGITAL MAGAZINE
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-10 bg-gradient-to-r from-white via-amber-200 to-gold-300 bg-clip-text text-transparent leading-tight">
              Just Urbane
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-6 font-light">
              {currentIssue.subtitle}
            </p>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 px-4">
          {magazineThumbnails.map((page, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={openMagazineReader}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 bg-white p-2">
                <img
                  src={page.pageImage}
                  alt={`Premium Magazine Page ${index + 1}`}
                  className="w-full h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay */}
                <div className="absolute inset-2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                {/* Premium Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-gold-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                  Premium Content
                </div>
                
                {/* Preview Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-3 shadow-xl">
                    <Eye className="h-5 w-5" />
                    <span>Read Magazine</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {page.title || `Premium Edition Page ${index + 1}`}
                </h3>
                <p className="text-lg text-gray-600">
                  {index === 0 ? 'Luxury Fashion & Style' : index === 1 ? 'Exclusive Celebrity Features' : 'Premium Lifestyle & Travel'}
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
          className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 mb-20 mx-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <Star className="h-8 w-8 text-amber-500" />
                <span className="text-amber-600 font-bold text-xl">Premium Magazine Features</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Luxury Content Inside
              </h3>
              
              <div className="space-y-6">
                {currentIssue.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-gold-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-xl font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl p-10 text-white shadow-2xl">
                <div className="text-7xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-gold-500 bg-clip-text text-transparent">{currentIssue.totalPages}</div>
                <div className="text-2xl text-gray-300 mb-6">Premium Pages</div>
                <div className="text-amber-400 font-bold text-lg">
                  {currentIssue.publishDate}
                </div>
                <div className="mt-4 text-gray-400 text-sm">
                  World-Class Content
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
          className="bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden mx-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-gold-500/20 to-amber-500/20"></div>
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-bold mb-8">
              Experience Premium Digital Magazine
            </h3>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in luxury lifestyle content with our premium digital magazine. Start with 3 pages free preview, then unlock the complete premium experience with exclusive interviews, luxury insights, and world-class content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button
                onClick={openMagazineReader}
                className="bg-gradient-to-r from-amber-500 to-gold-600 hover:from-amber-600 hover:to-gold-700 text-black font-bold px-12 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-4 shadow-2xl text-lg"
              >
                <PlayCircle className="h-7 w-7" />
                <span>Start Premium Preview</span>
              </button>
              
              <Link
                to="/pricing"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-12 py-5 rounded-2xl transition-all duration-300 flex items-center space-x-4 text-lg"
              >
                <span>View Premium Plans</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
            
            <div className="mt-10 text-lg text-gray-400">
              <span>✨ No credit card required for premium preview</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IssuesPage;