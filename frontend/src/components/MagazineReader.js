import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Simplified page navigation
  const nextPage = useCallback(() => {
    if (isTransitioning) return;
    
    console.log(`Trying to go to next page. Current: ${currentPage}`);
    
    // Always increment page number for testing
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(currentPage + 1);
      setIsTransitioning(false);
    }, 50);
  }, [currentPage, isTransitioning]);

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

  // Debug logging
  console.log(`Current page: ${currentPage}, Free pages: ${FREE_PREVIEW_PAGES}, Total pages: ${pages.length}, Can read premium: ${canReadPremium}, Show subscription gate: ${showSubscriptionGate}`);

  // Force subscription gate to show after 3 pages
  const showSubscriptionGate = !canReadPremium && currentPage >= 2; // Trigger after page 2 (0-indexed)
  const currentPageData = pages[Math.min(currentPage, pages.length - 1)] || pages[0];

  console.log(`🔍 DEBUG: currentPage=${currentPage}, showSubscriptionGate=${showSubscriptionGate}, canReadPremium=${canReadPremium}, pages.length=${pages.length}`);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Header with minimal controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-amber-400 rounded flex items-center justify-center">
              <span className="text-black font-bold text-sm">JU</span>
            </div>
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
              <div className={`w-2 h-2 rounded-full transition-colors ${
                currentPage >= FREE_PREVIEW_PAGES ? 'bg-amber-400' : 'bg-white/40'
              }`} />
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
      className="relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200"
      style={{
        aspectRatio: '2622/3236',
        maxHeight: '90vh'
      }}
    >
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Premium Content</h1>
          <p className="text-gray-300 text-sm">Continue reading with full access</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Just Urbane Digital Magazine
          </h2>
          
          {/* Subscription Plans */}
          <div className="space-y-4 mb-8">
            {/* Monthly Plan */}
            <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Monthly Access</h3>
                  <p className="text-sm text-gray-600">Full magazine library</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">₹99</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
              </div>
              <Link
                to="/pricing"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors duration-200"
              >
                Subscribe Monthly
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="border border-gray-300 rounded-xl p-6 bg-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  SAVE 20%
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Annual Access</h3>
                  <p className="text-sm text-gray-600">12 months full access</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">₹999</div>
                  <div className="text-sm text-gray-500">/year</div>
                  <div className="text-xs text-green-600">Save ₹189</div>
                </div>
              </div>
              <Link
                to="/pricing"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors duration-200"
              >
                Subscribe Annually
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Complete magazine archives</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Premium articles & insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Early access to new issues</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Ad-free reading experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Offline reading capability</span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-gray-500 text-xs">
            <p className="mb-2">Trusted by 10,000+ readers worldwide</p>
            <div className="flex justify-center items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-3 w-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2">4.8/5 rating</span>
            </div>
            <p>Cancel anytime • Secure payment • 30-day money back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineReader;