import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Crown, Lock, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import parseMagazineContent from './MagazineContentParser';

const MagazineReader = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [imageCache, setImageCache] = useState(new Map());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Premium access control
  const canReadPremium = false; // This should come from user context
  const FREE_PREVIEW_PAGES = 3;

  // Load magazine pages and preload ALL images immediately
  useEffect(() => {
    const magazinePages = parseMagazineContent();
    setPages(magazinePages);
    
    // Aggressive preloading - load all images immediately to prevent white pages
    const loadPromises = magazinePages.map((page, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded(prev => new Set([...prev, index]));
          setImageCache(prev => new Map([...prev, [index, img.src]]));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image for page ${index}`);
          resolve();
        };
        img.src = page.pageImage;
      });
    });

    // Wait for all images to load
    Promise.all(loadPromises).then(() => {
      console.log('All magazine images preloaded successfully');
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen || isTransitioning) return;
      
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
  }, [isOpen, currentPage, isTransitioning]);

  // Smooth page navigation with preloading check
  const nextPage = useCallback(() => {
    if (isTransitioning) return;
    
    // If we're on the last free page and user doesn't have premium access
    if (!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) {
      // Go directly to subscription gate (we'll use a special index)
      setCurrentPage(FREE_PREVIEW_PAGES);
      return;
    }
    
    // Normal navigation for premium users or within free pages
    if (currentPage < pages.length - 1) {
      const nextPageIndex = currentPage + 1;
      if (imagesLoaded.has(nextPageIndex) || !canReadPremium) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentPage(nextPageIndex);
          setIsTransitioning(false);
        }, 50);
      }
    }
  }, [currentPage, pages.length, imagesLoaded, canReadPremium, isTransitioning]);

  const prevPage = useCallback(() => {
    if (isTransitioning || currentPage <= 0) return;
    
    const prevPageIndex = currentPage - 1;
    if (imagesLoaded.has(prevPageIndex) || prevPageIndex < FREE_PREVIEW_PAGES) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(prevPageIndex);
        setIsTransitioning(false);
      }, 50);
    }
  }, [currentPage, imagesLoaded]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || isTransitioning) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
    setTouchStart(null);
  };

  if (!isOpen || pages.length === 0) return null;

  // Show subscription gate for premium pages
  const showSubscriptionGate = !canReadPremium && currentPage >= FREE_PREVIEW_PAGES;
  const currentPageData = pages[Math.min(currentPage, pages.length - 1)] || pages[0];

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

      {/* Main magazine display */}
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation click areas */}
        {!showSubscriptionGate && (
          <>
            <div 
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-w-resize"
              onClick={prevPage}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-e-resize"
              onClick={nextPage}
            />
          </>
        )}

        {/* Magazine content */}
        <div className="relative max-w-4xl max-h-full mx-4 my-16">
          {showSubscriptionGate ? (
            <PremiumSubscriptionGate />
          ) : (
            <div className="relative">
              {/* Main image - always show cached version to prevent white flash */}
              <img
                src={currentPageData.pageImage}
                alt={currentPageData.title}
                className={`w-full h-auto shadow-2xl rounded-lg transition-opacity duration-100 ${
                  isTransitioning ? 'opacity-50' : 'opacity-100'
                }`}
                style={{
                  aspectRatio: '2622/3236',
                  objectFit: 'contain',
                  maxHeight: '90vh'
                }}
                loading="eager"
                decoding="sync"
              />
              
              {/* Loading overlay only for unloaded images */}
              {!imagesLoaded.has(currentPage) && (
                <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <div className="text-sm">Loading page {currentPage + 1}...</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {!showSubscriptionGate && (
        <>
          {currentPage > 0 && (
            <button
              onClick={prevPage}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20 disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          
          {(canReadPremium && currentPage < pages.length - 1) || (!canReadPremium && currentPage < FREE_PREVIEW_PAGES - 1) && (
            <button
              onClick={nextPage}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20 disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </>
      )}

      {/* Bottom indicators */}
      {!showSubscriptionGate && (
        <>
          {/* Page counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10">
            Page {currentPage + 1} of {canReadPremium ? pages.length : FREE_PREVIEW_PAGES}
          </div>

          {/* Page dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {(canReadPremium ? pages : pages.slice(0, FREE_PREVIEW_PAGES)).map((_, index) => (
              <button
                key={index}
                onClick={() => !isTransitioning && setCurrentPage(index)}
                disabled={isTransitioning}
                className={`w-2 h-2 rounded-full transition-colors disabled:opacity-50 ${
                  index === currentPage ? 'bg-amber-400' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
            {!canReadPremium && (
              <button
                onClick={() => setCurrentPage(FREE_PREVIEW_PAGES)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentPage >= FREE_PREVIEW_PAGES ? 'bg-amber-400' : 'bg-white/40 hover:bg-white/60'
                }`}
              >
                <Lock className="h-1 w-1" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Professional Premium Subscription Gate
const PremiumSubscriptionGate = () => {
  return (
    <div 
      className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white rounded-lg shadow-2xl overflow-hidden"
      style={{
        aspectRatio: '2622/3236',
        maxHeight: '90vh'
      }}
    >
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 50m-20 0a20,20 0 1,1 40,0a20,20 0 1,1 -40,0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8 lg:p-12">
        {/* Premium Crown Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-amber-600/30 blur-2xl rounded-full"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Premium Content Awaits
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-md leading-relaxed">
            Continue reading with full access to our premium digital magazine
          </p>
        </div>

        {/* Subscription Box */}
        <div className="bg-black/40 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 max-w-sm w-full mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">₹99</div>
            <div className="text-amber-400 text-sm uppercase tracking-wide">Per Month</div>
          </div>
          
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300">Full magazine access</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300">Premium articles & insights</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300">Early access to new issues</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-gray-300">Ad-free reading experience</span>
            </div>
          </div>
          
          <Link
            to="/pricing"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 px-6 rounded-xl font-semibold text-center block transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Subscribe Now
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center text-gray-400 text-sm">
          <p className="mb-2">Join thousands of premium readers</p>
          <div className="flex items-center justify-center gap-2">
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <span className="ml-2">4.9/5 reader rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineReader;