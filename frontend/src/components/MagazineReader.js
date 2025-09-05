import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import parseMagazineContent from './MagazineContentParser';

const MagazineReader = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  // Load magazine pages immediately
  useEffect(() => {
    const magazinePages = parseMagazineContent();
    setPages(magazinePages);
    
    // Preload all images for instant page turns
    magazinePages.forEach((page, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
      img.src = page.pageImage;
    });
  }, []);

  // Keyboard navigation for instant response
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextPage();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentPage]);

  // Instant page navigation
  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pages.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextPage(); // Swipe left = next page
      } else {
        prevPage(); // Swipe right = prev page
      }
    }
    setTouchStart(null);
  };

  if (!isOpen || pages.length === 0) return null;

  const currentPageData = pages[currentPage];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Header with minimal controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="text-lg font-bold">JUST URBANE</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main magazine display - optimized for speed */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous page click area */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-w-resize"
          onClick={prevPage}
        />
        
        {/* Next page click area */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-e-resize"
          onClick={nextPage}
        />

        {/* Magazine page - instant display */}
        <div className="relative max-w-4xl max-h-full mx-4 my-16">
          <img
            src={currentPageData.pageImage}
            alt={currentPageData.title}
            className="w-full h-auto shadow-2xl rounded-lg"
            style={{
              aspectRatio: '2622/3236', // Your custom dimensions
              objectFit: 'contain',
              maxHeight: '90vh'
            }}
            loading="eager" // Force immediate loading
            decoding="sync" // Synchronous decoding for instant display
          />
          
          {/* Page loading indicator only for unloaded images */}
          {!imagesLoaded.has(currentPage) && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Loading page {currentPage + 1}...</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows - always visible for instant access */}
      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      
      {currentPage < pages.length - 1 && (
        <button
          onClick={nextPage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Bottom page indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10">
        Page {currentPage + 1} of {pages.length}
      </div>

      {/* Page dots indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentPage ? 'bg-amber-400' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Back Cover Component
const BackCover = () => (
  <div className="h-full flex flex-col justify-center items-center p-8 text-center">
    <div className="mb-8">
      <Crown className="h-16 w-16 text-amber-300 mx-auto mb-4" />
      <h2 className="text-3xl font-bold mb-4">Thank You</h2>
      <p className="text-amber-200 text-lg mb-2">For Reading</p>
      <p className="text-amber-300 font-bold text-2xl">JUST URBANE</p>
    </div>
    
    <div className="space-y-2 text-sm text-amber-200">
      <p>Visit us at justurbane.com</p>
      <p>Follow @justurbane</p>
      <p>Subscribe for premium content</p>
    </div>
  </div>
);

// Subscription Gate Page Component (Better than GQ)
const SubscriptionGatePage = ({ onSubscribe, pageNumber }) => {
  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Page Number */}
      <div className="absolute top-4 left-4 text-xs text-white/40 font-medium">
        {pageNumber}
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Central Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
        {/* Premium Crown with Glow */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl transform animate-bounce">
              <Crown className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            This magazine access is exclusive to our subscribers.
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-8 max-w-sm leading-relaxed">
          Subscribe now and get immediate access.
        </p>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 mb-6 transform hover:scale-105 transition-transform duration-300 shadow-2xl">
          <div className="text-center">
            <p className="text-black font-bold text-lg mb-1">GO DIGITAL 1 YEAR</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-gray-600 line-through text-sm">₹1500</span>
              <span className="text-black font-bold text-2xl">₹900</span>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={onSubscribe}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl mb-4"
        >
          Subscribe Now
        </button>

        {/* Already purchased link */}
        <p className="text-gray-400 text-sm">
          Already purchased?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold underline">
            Login
          </Link>
        </p>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-4 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-8 w-1.5 h-1.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-4 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

// Premium Subscription Modal Component (Better than GQ)
const PremiumSubscriptionModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header with Premium Crown */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 blur-xl rounded-full"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unlock Premium Content
          </h2>
          <p className="text-gray-600">
            Get unlimited access to our digital magazine and exclusive articles.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Unlimited premium articles</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Interactive flip-book magazine</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Ad-free reading experience</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-gray-700">Exclusive member benefits</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-3 mb-8">
          {/* Annual Plan - Featured */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-4 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">Annual Plan</h3>
                <p className="text-gray-600 text-sm">₹900/year • Save 40%</p>
              </div>
              <div className="text-right">
                <div className="text-gray-500 line-through text-sm">₹1500</div>
                <div className="text-2xl font-bold text-amber-600">₹900</div>
              </div>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900">Monthly Plan</h3>
                <p className="text-gray-600 text-sm">₹499/month</p>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹499</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/pricing"
            className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-center py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Subscribe Now
          </Link>
          <Link
            to="/login"
            className="block w-full text-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Already have an account? Login
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Cancel anytime • Secure payment • 7-day money-back guarantee</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MagazineReader;