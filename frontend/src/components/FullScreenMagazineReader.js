import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import HTMLFlipBook from 'react-pageflip';
import { 
  X, ChevronLeft, ChevronRight, Crown, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FullScreenMagazineReader = ({ isOpen, onClose, magazineContent = [] }) => {
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  const FREE_PREVIEW_PAGES = 3; // First 3 pages are free

  const pages = magazineContent && magazineContent.length > 0 ? magazineContent : [];

  useEffect(() => {
    if (pages && Array.isArray(pages)) {
      setTotalPages(pages.length);
      setIsLoading(false);
    }
  }, [pages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePageFlip = (e) => {
    const newPage = e.data;
    setCurrentPage(newPage);
    
    if (!canReadPremium && newPage >= FREE_PREVIEW_PAGES) {
      setTimeout(() => {
        setShowSubscriptionModal(true);
      }, 500);
    }
  };

  const nextPage = () => {
    if (flipBookRef.current) {
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

  // Calculate optimal magazine size based on device
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Magazine aspect ratio: 3:4 (typical magazine proportions)
  const aspectRatio = 3 / 4;
  let pageWidth, pageHeight;
  
  // Device-specific calculations for truly full-screen experience
  if (screenWidth <= 768) {
    // Mobile: Use full width, calculate height
    pageWidth = Math.min(screenWidth * 0.9, 350);
    pageHeight = pageWidth / aspectRatio;
    // Adjust if height exceeds screen
    if (pageHeight > screenHeight * 0.85) {
      pageHeight = screenHeight * 0.85;
      pageWidth = pageHeight * aspectRatio;
    }
  } else if (screenWidth <= 1024) {
    // Tablet: Balanced approach
    pageWidth = Math.min(screenWidth * 0.4, 400);
    pageHeight = Math.min(screenHeight * 0.85, pageWidth / aspectRatio);
  } else {
    // Desktop: Larger, more immersive
    pageWidth = Math.min(screenWidth * 0.35, 500);
    pageHeight = Math.min(screenHeight * 0.9, 700);
  }

  // Full-screen magazine reader component
  const magazineReader = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: '#000000',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Close Button */}
      <button
        onClick={closeReader}
        className="absolute top-4 right-4 p-3 bg-black/90 hover:bg-black text-white rounded-full transition-all duration-200 shadow-xl border border-white/20"
        style={{ zIndex: 100000 }}
        aria-label="Close Magazine"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Page Counter */}
      <div 
        className="absolute top-4 left-4 bg-black/90 text-white px-4 py-2 rounded-full text-sm border border-white/20"
        style={{ zIndex: 100000 }}
      >
        {currentPage + 1} / {totalPages}
        {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
          <span className="ml-2 text-green-400">(Free Preview)</span>
        )}
      </div>

      {/* Magazine Container */}
      <div className="w-full h-full flex items-center justify-center relative">
        {!isLoading && pages && pages.length > 0 ? (
          <HTMLFlipBook
            ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            size="stretch"
            minWidth={280}
            maxWidth={600}
            minHeight={350}
            maxHeight={800}
            maxShadowOpacity={1.0}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            className="magazine-flipbook shadow-2xl"
            style={{
              boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 30px 60px -30px rgba(0, 0, 0, 0.6)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}
            flippingTime={800}
            usePortrait={true}
            startZIndex={1000}
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
                    borderRadius: '12px'
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
        ) : (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-amber-400 mx-auto mb-6"></div>
            <p className="text-2xl font-light">Loading Your Magazine...</p>
            <p className="text-lg text-gray-300 mt-2">Just Urbane August 2025</p>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 text-white/90 hover:text-white hover:scale-110 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ zIndex: 100000 }}
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-20 w-20 drop-shadow-2xl" />
      </button>

      <button
        onClick={nextPage}
        disabled={(!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) || currentPage >= totalPages - 1}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 text-white/90 hover:text-white hover:scale-110 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ zIndex: 100000 }}
        aria-label="Next Page"
      >
        <ChevronRight className="h-20 w-20 drop-shadow-2xl" />
      </button>

      {/* Premium Subscription Modal */}
      {showSubscriptionModal && (
        <div
          className="absolute inset-0 bg-black/95 flex items-center justify-center"
          style={{ zIndex: 100001 }}
          onClick={() => setShowSubscriptionModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-10 max-w-lg mx-6 shadow-2xl relative border-2 border-amber-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Continue Your Journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Unlock unlimited access to premium content, exclusive insights, and the complete magazine experience
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200">
              <div className="text-center">
                <div className="bg-black text-white text-lg font-bold px-6 py-3 rounded-full inline-block mb-6">
                  DIGITAL PREMIUM ACCESS
                </div>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl text-gray-500 line-through">₹1500</span>
                  <span className="text-4xl font-bold text-gray-900">₹499</span>
                </div>
                <p className="text-lg text-gray-600 mb-2">Annual Digital Subscription</p>
                <p className="text-lg text-green-600 font-semibold">Save 67% • Best Value</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 text-base">
              {[
                '✓ Unlimited magazine access',
                '✓ Full-screen 3D reading', 
                '✓ Exclusive premium content',
                '✓ Ad-free experience',
                '✓ Early access to new issues',
                '✓ Offline reading capability'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-green-600 font-semibold">{feature.split(' ')[0]}</span>
                  <span className="text-gray-700">{feature.substring(2)}</span>
                </div>
              ))}
            </div>

            <Link
              to="/pricing?plan=digital"
              className="block w-full bg-black hover:bg-gray-800 text-white font-bold text-center py-5 rounded-2xl transition-colors text-xl shadow-lg"
            >
              Subscribe Now - ₹499
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Magazine Page Content Component
const MagazinePageContent = ({ page, pageNumber, isBlurred = false }) => {
  if (!page) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading page...</p>
      </div>
    );
  }

  if (page.type === 'cover') {
    return (
      <div 
        className={`h-full relative overflow-hidden bg-cover bg-center ${isBlurred ? 'blur-sm' : ''}`}
        style={{
          backgroundImage: page.image ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${page.image})` : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
          {/* Magazine Header */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-widest mb-3 drop-shadow-2xl">{page.title}</h1>
            <div className="text-amber-300 text-lg md:text-xl tracking-widest uppercase font-light">{page.content}</div>
          </div>

          {/* Issue Info */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-light mb-4 drop-shadow-lg">{page.subtitle}</div>
            <div className="text-lg md:text-xl text-amber-200 tracking-wider">Premium Digital Edition</div>
          </div>

          {/* Cover Features */}
          <div className="text-center space-y-3">
            <div className="text-xl md:text-2xl font-semibold">INSIDE THIS ISSUE</div>
            <div className="text-sm md:text-base space-y-1 text-gray-200 leading-relaxed">
              {page.coverFeatures?.map((feature, index) => (
                <div key={index}>• {feature}</div>
              )) || [
                '• Premium Technology Reviews',
                '• Luxury Lifestyle Features', 
                '• Exclusive Interviews',
                '• Fashion & Style Trends'
              ].map((feature, index) => (
                <div key={index}>{feature}</div>
              ))}
            </div>
          </div>
        </div>
        
        {isBlurred && <PurchaseOverlay />}
      </div>
    );
  }

  // Contents Page
  if (page.type === 'contents') {
    return (
      <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
        <div className="h-full p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="text-lg font-bold tracking-wider text-gray-800">JUST URBANE</span>
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">August 2025</div>
          </div>

          {/* Contents Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 text-center mb-8">
            {page.title}
          </h1>

          {/* Contents List */}
          <div className="space-y-4 text-sm md:text-base">
            {page.content.split('\n\n').map((section, index) => (
              <div key={index} className="mb-6">
                {section.split('\n').map((line, lineIndex) => {
                  if (line.match(/^[A-Z\s&]+$/)) {
                    // Section headers
                    return (
                      <h3 key={lineIndex} className="text-lg font-bold text-amber-600 mb-2 tracking-wider">
                        {line}
                      </h3>
                    );
                  } else if (line.includes(' - ')) {
                    // Content items
                    const [number, content] = line.split(' - ');
                    return (
                      <div key={lineIndex} className="flex justify-between items-start py-1 border-b border-gray-100">
                        <span className="font-semibold text-amber-600 mr-3">{number}</span>
                        <span className="flex-1 text-gray-700">{content}</span>
                      </div>
                    );
                  } else if (line.trim()) {
                    return (
                      <p key={lineIndex} className="text-gray-600 leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>

          {/* Page Number */}
          <div className="absolute bottom-4 right-4">
            <span className="text-xs text-gray-400 font-medium">{pageNumber}</span>
          </div>
        </div>
        
        {isBlurred && <PurchaseOverlay />}
      </div>
    );
  }

  // Regular Article Pages
  return (
    <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
      <div className="h-full p-6 md:p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="text-base font-bold tracking-wider text-gray-800">JUST URBANE</span>
          </div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{page.category}</div>
        </div>

        {/* Article Title */}
        <h1 className="text-2xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-4 md:mb-6">
          {page.title}
        </h1>

        {/* Subtitle if exists */}
        {page.subtitle && (
          <h2 className="text-lg md:text-xl font-light text-gray-600 mb-4 md:mb-6 italic">
            {page.subtitle}
          </h2>
        )}

        {/* Hero Image */}
        {page.image && (
          <div className="mb-4 md:mb-6 rounded-lg overflow-hidden shadow-lg">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-32 md:h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex-1 overflow-hidden">
          <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed">
            {(page.content || '').split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().match(/^[A-Z\s:]+$/)) {
                // All caps sections (headers)
                return (
                  <h3 key={index} className="text-base md:text-lg font-bold text-amber-600 mt-4 mb-2 tracking-wider">
                    {paragraph.trim()}
                  </h3>
                );
              } else if (paragraph.startsWith('•')) {
                // Bullet points
                return (
                  <ul key={index} className="list-none space-y-1 mb-4 ml-4">
                    {paragraph.split('\n').filter(line => line.trim()).map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm md:text-base flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>{item.replace(/^•\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              } else if (index === 0) {
                // First paragraph with drop cap
                return (
                  <p key={index} className="text-justify mb-3 md:mb-4">
                    <span className="float-left text-4xl md:text-6xl font-serif leading-none mr-2 mt-1 text-gray-800">
                      {paragraph.charAt(0)}
                    </span>
                    <span className="text-sm md:text-base">{paragraph.slice(1)}</span>
                  </p>
                );
              } else {
                // Regular paragraphs
                return (
                  <p key={index} className="mb-3 md:mb-4 text-justify text-sm md:text-base leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </div>

        {/* Premium Badge */}
        {page.type === 'premium' && (
          <div className="flex justify-end mt-4">
            <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </div>
          </div>
        )}

        {/* Page Number */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-400 font-medium">{pageNumber}</span>
        </div>
      </div>
      
      {isBlurred && <PurchaseOverlay />}
    </div>
  );
};

// Purchase Overlay for premium content
const PurchaseOverlay = () => (
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-white/30 backdrop-blur-sm rounded-full p-8 shadow-2xl border-2 border-white/50">
      <Lock className="h-16 w-16 text-white drop-shadow-2xl" />
    </div>
  </div>
);

export default FullScreenMagazineReader;