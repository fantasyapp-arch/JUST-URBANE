import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, Eye, Calendar, ArrowRight, Star, Sparkles, Clock, Users, Award } from 'lucide-react';
import parseMagazineContent from '../components/MagazineContentParser';

const IssuesPage = () => {
  const navigate = useNavigate();
  
  const openMagazineReader = () => {
    console.log('🔥 Opening magazine reader instantly...');
    navigate('/magazine-reader');
  };

  // Get magazine pages for thumbnails - only use first one
  const pages = parseMagazineContent();
  const featuredMagazine = pages[0];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Clean Header Section */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center bg-amber-500 text-black px-6 py-2 rounded-full text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              DIGITAL MAGAZINE
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Just Urbane Magazine
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Premium lifestyle content featuring luxury fashion, technology, and exclusive interviews
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        
        {/* Featured Magazine & Info Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left: Featured Magazine */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative group cursor-pointer" onClick={openMagazineReader}>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <img
                  src={featuredMagazine?.pageImage || 'https://images.unsplash.com/photo-1586953135225-fc4e67e98b90?w=600&h=800'}
                  alt="Just Urbane Magazine"
                  className="w-full aspect-[2622/3236] object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-6 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <button className="bg-white text-black px-8 py-3 rounded-full font-semibold flex items-center space-x-3 shadow-lg">
                    <Eye className="w-5 h-5" />
                    <span>Read Magazine</span>
                  </button>
                </div>
              </div>
              
              {/* Badge */}
              <div className="absolute -top-3 -right-3 bg-amber-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Latest Issue
              </div>
            </div>
          </motion.div>

          {/* Right: Magazine Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                August 2025 Premium Edition
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dive into our latest digital magazine featuring exclusive celebrity interviews, luxury travel destinations, premium fashion trends, and cutting-edge technology reviews.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
                <div className="text-sm text-gray-600">Pages</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-900">15</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-900">30</div>
                <div className="text-sm text-gray-600">Min Read</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">What's Inside</h3>
              <div className="space-y-3">
                {[
                  'Exclusive Celebrity Interviews',
                  'Luxury Travel Destinations',
                  'Premium Fashion Collections',
                  'Latest Technology Reviews',
                  'Art & Culture Features'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={openMagazineReader}
                className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center space-x-3"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Read Now</span>
              </button>
              
              <Link
                to="/pricing"
                className="border-2 border-black text-black px-8 py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Magazine Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-50 rounded-2xl p-12 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Content Experience</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of readers choose Just Urbane for their luxury lifestyle content
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Award-Winning Content</h3>
              <p className="text-gray-600">Curated by industry experts and recognized for editorial excellence</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Exclusive Access</h3>
              <p className="text-gray-600">Get behind-the-scenes content and exclusive interviews</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Always Fresh</h3>
              <p className="text-gray-600">New content updated regularly with the latest trends</p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center bg-black text-white rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Premium?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start with 3 pages free, then unlock complete access to our premium digital magazine
          </p>
          
          <button
            onClick={openMagazineReader}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3"
          >
            <PlayCircle className="w-6 h-6" />
            <span>Start Reading</span>
          </button>
          
          <div className="mt-6 text-sm text-gray-400">
            ✨ No credit card required for preview
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default IssuesPage;