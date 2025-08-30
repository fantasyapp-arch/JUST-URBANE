import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FullScreenMagazineReader from '../components/FullScreenMagazineReader';
import { Link } from 'react-router-dom';
import { parseMagazineContent } from '../components/MagazineContentParser';

const IssuesPage = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Sample magazine covers - GQ style
  const magazineCovers = [
    {
      id: 1,
      title: 'JUST URBANE',
      subtitle: 'AUGUST 2025',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face',
      current: true
    },
    {
      id: 2,
      title: 'JUST URBANE',
      subtitle: 'JULY 2025',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop',
      current: false
    },
    {
      id: 3,
      title: 'JUST URBANE', 
      subtitle: 'JUNE 2025',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=800&fit=crop',
      current: false
    },
    {
      id: 4,
      title: 'JUST URBANE',
      subtitle: 'MAY 2025',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=800&fit=crop',
      current: false
    }
  ];

  const openMagazineReader = () => {
    console.log('🔥 Opening magazine reader...');
    try {
      // Use your uploaded magazine content
      const magazineContent = parseMagazineContent();
      console.log('📖 Magazine content parsed:', magazineContent);
      setSelectedIssue(magazineContent);
      setIsReaderOpen(true);
      console.log('✅ Magazine reader state updated');
    } catch (error) {
      console.error('❌ Error opening magazine reader:', error);
    }
  };

  const closeMagazineReader = () => {
    setIsReaderOpen(false);
    setSelectedIssue(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-wide">
            Magazine
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read your favourite magazines anywhere, anytime | Enjoy unlimited access to our archives
          </p>
        </div>
      </div>

      {/* Magazine Covers Grid - Clean GQ Style */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {magazineCovers.map((magazine, index) => (
            <motion.div
              key={magazine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Magazine Cover */}
              <div 
                className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg mb-6 relative transform transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${magazine.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Magazine Title Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                  {/* Top - Magazine Name */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold tracking-wider mb-1">
                      {magazine.title}
                    </h2>
                    <p className="text-sm opacity-90 tracking-widest">
                      {magazine.subtitle}
                    </p>
                  </div>

                  {/* Bottom - Preview Button */}
                  <div className="text-center">
                    {magazine.current ? (
                      <button
                        onClick={openMagazineReader}
                        className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
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

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Magazine Info */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {magazine.subtitle} Issue
                </h3>
                {magazine.current && (
                  <p className="text-sm text-green-600 font-medium">
                    3 Pages Free Preview Available
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20 bg-gray-50 rounded-2xl p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Did you know our monthly issues can now be read online?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to read our August 2025 issue now.
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="bg-black text-white px-8 py-4 rounded-xl text-center">
              <div className="font-bold text-lg">GO DIGITAL 1 YEAR</div>
              <div className="text-gray-300 text-sm">Best Value</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 line-through text-lg">₹1500</div>
              <div className="text-4xl font-bold text-gray-900">₹900</div>
              <div className="text-sm text-gray-600">Save 40%</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <Link
              to="/pricing"
              className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-300"
            >
              Subscribe Now
            </Link>
            <div className="text-gray-400">OR</div>
            <button
              onClick={openMagazineReader}
              className="border-2 border-black text-black font-semibold px-8 py-4 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
            >
              Free Preview
            </button>
          </div>
        </motion.div>
      </div>

      {/* Full Screen 3D Magazine Reader */}
      <FullScreenMagazineReader
        isOpen={isReaderOpen}
        onClose={closeMagazineReader}
        magazineContent={selectedIssue}
      />
    </div>
  );
};

export default IssuesPage;