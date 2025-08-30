import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Crown, Lock, Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FullScreenMagazineReader = ({ isOpen, onClose, magazineContent = [] }) => {
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  const FREE_PREVIEW_PAGES = 3; // Only first 3 pages are free

  const pages = magazineContent && magazineContent.length > 0 ? magazineContent : [];

  useEffect(() => {
    if (pages && Array.isArray(pages)) {
      setTotalPages(pages.length);
    }
  }, [pages]);

  useEffect(() => {
    // Disable body scrolling when magazine is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePageFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    
    // Show subscription modal when user tries to go beyond free preview
    if (!canReadPremium && newPage >= FREE_PREVIEW_PAGES) {
      setTimeout(() => {
        setShowSubscriptionModal(true);
      }, 500);
    }
  };

  const nextPage = () => {
    if (flipBookRef.current) {
      // Prevent going beyond free preview for non-premium users
      if (!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) {
        setShowSubscriptionModal(true);
        return;
      }
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const closeReader = () => {
    setShowSubscriptionModal(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  // Loading state
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" 
           style={{ width: '100vw', height: '100vh' }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading Magazine...</p>
        </div>
      </div>
    );
  }

  // Calculate optimal size for truly full-screen experience
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const pageWidth = Math.min(screenWidth * 0.45, 500); // 45% of screen width, max 500px
  const pageHeight = Math.min(screenHeight * 0.9, 700); // 90% of screen height, max 700px

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ 
          width: '100vw', 
          height: '100vh',
          position: 'fixed !important',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        {/* Close Button - Top Right */}
        <button
          onClick={closeReader}
          className="absolute top-4 right-4 text-white rounded-full transition-all duration-200 backdrop-blur-sm shadow-lg p-3"
          style={{ zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Page Counter - Top Left */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm" style={{ zIndex: 10000 }}>
          {currentPage + 1} / {totalPages}
          {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
            <span className="ml-2 text-green-400">(Free Preview)</span>
          )}
        </div>

        {/* Magazine Container - Truly Full Screen */}
        <div className="w-full h-full flex items-center justify-center relative">
          <HTMLFlipBook
            ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.9}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            className="magazine-flipbook shadow-2xl"
            style={{
              boxShadow: '0 40px 80px -10px rgba(0, 0, 0, 0.9)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            flippingTime={600}
            usePortrait={true}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
          >
            {pages.map((page, index) => {
              const isPageLocked = !canReadPremium && index >= FREE_PREVIEW_PAGES;
              
              return (
                <div 
                  key={page?.id || `page-${index}`} 
                  className="magazine-page bg-white relative overflow-hidden" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: '8px'
                  }}
                >
                  {isPageLocked ? (
                    <MagazinePageContent page={page} pageNumber={index + 1} isBlurred={true} />
                  ) : (
                    <MagazinePageContent page={page} pageNumber={index + 1} />
                  )}
                </div>
              );
            })}
          </HTMLFlipBook>
        </div>

        {/* Navigation Arrows - Positioned for full screen */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 p-4 text-white/80 hover:text-white hover:scale-110 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ zIndex: 10000 }}
        >
          <ChevronLeft className="h-16 w-16 drop-shadow-lg" />
        </button>

        <button
          onClick={nextPage}
          disabled={(!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) || currentPage >= totalPages - 1}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 text-white/80 hover:text-white hover:scale-110 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ zIndex: 10000 }}
        >
          <ChevronRight className="h-16 w-16 drop-shadow-lg" />
        </button>

        {/* Full Screen Subscription Modal - After 3 pages */}
        <AnimatePresence>
          {showSubscriptionModal && (
            <FullScreenPurchaseModal onClose={() => setShowSubscriptionModal(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

// Magazine Page Content Component - Enhanced for full screen
const MagazinePageContent = ({ page, pageNumber, isBlurred = false }) => {
  if (!page) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (page.type === 'cover') {
    return (
      <div 
        className={`h-full relative overflow-hidden bg-cover bg-center ${isBlurred ? 'blur-sm' : ''}`}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${page.image})`
        }}
      >
        {/* Magazine Cover Design - Full Screen Optimized */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          {/* Top - Magazine Logo */}
          <div className="text-center">
            <h1 className="text-7xl font-bold tracking-widest mb-4 drop-shadow-lg">{page.title}</h1>
            <div className="text-amber-300 text-2xl tracking-widest uppercase font-light">{page.content}</div>
          </div>

          {/* Center - Issue Info */}
          <div className="text-center">
            <div className="text-6xl font-light mb-6 drop-shadow-lg">{page.subtitle}</div>
            <div className="text-2xl text-amber-200 tracking-wider">Premium Digital Edition</div>
          </div>

          {/* Bottom - Cover Features */}
          <div className="text-center space-y-4">
            <div className="text-2xl font-semibold">INSIDE THIS ISSUE</div>
            <div className="text-lg space-y-2 text-gray-200 leading-relaxed">
              <div>• Men's Fashion & Luxury Accessories</div>
              <div>• Technology Innovations & Smart Living</div>
              <div>• Premium Travel & Exclusive Destinations</div>
              <div>• Elite Investment & Business Strategies</div>
            </div>
          </div>
        </div>
        
        {isBlurred && <PurchaseOverlay />}
      </div>
    );
  }

  // Article Page Design - Enhanced for full screen
  return (
    <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
      {/* Magazine Page Layout */}
      <div className="h-full p-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center space-x-3">
            <Crown className="h-5 w-5 text-amber-600" />
            <span className="text-lg font-bold tracking-wider text-gray-800">JUST URBANE</span>
          </div>
          <div className="text-lg text-gray-500 uppercase tracking-wider font-medium">{page.category}</div>
        </div>

        {/* Article Title */}
        <h1 className="text-5xl font-serif font-bold text-gray-900 leading-tight mb-8">
          {page.title}
        </h1>

        {/* Hero Image */}
        {page.image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-60 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex-1">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {/* Drop Cap */}
            <p className="text-justify mb-6">
              <span className="float-left text-8xl font-serif leading-none mr-4 mt-2 text-gray-800">
                {(page.content || '').charAt(0)}
              </span>
              {(page.content || '').split('\n\n')[0]?.slice(1)}
            </p>
            
            {/* Rest of content */}
            {(page.content || '').split('\n\n').slice(1).map((paragraph, index) => (
              <p key={index} className="mb-6 text-justify text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Premium Badge */}
        {page.type === 'premium' && (
          <div className="flex justify-end mt-6">
            <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
              <Crown className="h-4 w-4 mr-2" />
              Premium Content
            </div>
          </div>
        )}

        {/* Page Number */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-400 font-medium">{pageNumber}</span>
        </div>
      </div>
      
      {isBlurred && <PurchaseOverlay />}
    </div>
  );
};

// Purchase Overlay for blurred pages
const PurchaseOverlay = () => (
  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-2xl">
      <Lock className="h-12 w-12 text-white drop-shadow-lg" />
    </div>
  </div>
);

// Full Screen Purchase Modal - Matching GQ India style
const FullScreenPurchaseModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center"
      style={{ zIndex: 10001 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="bg-white rounded-3xl p-12 max-w-2xl mx-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Continue Your Journey
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Unlock unlimited access to premium content, exclusive insights, and the full magazine experience
          </p>
        </div>

        {/* Digital Plan - Featured */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border-2 border-amber-200">
          <div className="text-center">
            <div className="bg-black text-white text-lg font-bold px-6 py-2 rounded-full inline-block mb-6">
              DIGITAL PLAN - RECOMMENDED
            </div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-2xl text-gray-500 line-through">₹1500</span>
              <span className="text-5xl font-bold text-gray-900">₹499</span>
            </div>
            <p className="text-xl text-gray-600 mb-2">Annual Digital Subscription</p>
            <p className="text-lg text-green-600 font-semibold">Save 67% • Best Value</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-10 text-lg">
          {[
            'Unlimited digital magazine access',
            'Full-screen 3D reading experience', 
            'Exclusive premium articles & insights',
            'Ad-free reading experience',
            'Early access to new issues',
            'Download for offline reading'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Link
            to="/pricing?plan=digital"
            className="flex-1 bg-black hover:bg-gray-800 text-white font-bold text-center py-6 rounded-2xl transition-colors text-xl flex items-center justify-center space-x-3"
          >
            <Play className="h-6 w-6" />
            <span>Subscribe Now - ₹499</span>
          </Link>
          <button
            onClick={onClose}
            className="px-8 py-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors text-xl"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FullScreenMagazineReader;