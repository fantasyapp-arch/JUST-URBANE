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

  // Calculate LARGE magazine size for truly immersive full-screen experience
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Make magazine pages MUCH larger to fill most of the screen
  let pageWidth, pageHeight;
  
  if (screenWidth <= 768) {
    // Mobile: Fill most of the screen
    pageWidth = screenWidth * 0.95;
    pageHeight = screenHeight * 0.9;
  } else if (screenWidth <= 1024) {
    // Tablet: Large, immersive size
    pageWidth = screenWidth * 0.7;
    pageHeight = screenHeight * 0.95;
  } else {
    // Desktop: Truly immersive, large magazine experience
    pageWidth = Math.min(screenWidth * 0.6, 800);  // Much larger max width
    pageHeight = Math.min(screenHeight * 0.95, 1000); // Much larger max height
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
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000000,
          padding: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        aria-label="Close Magazine"
      >
        <X style={{ width: '24px', height: '24px' }} />
      </button>

      {/* Page Counter */}
      <div 
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000000,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {currentPage + 1} / {totalPages}
        {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
          <span style={{ marginLeft: '8px', color: '#10b981' }}>(Free Preview)</span>
        )}
      </div>

      {/* Magazine Container */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {!isLoading && pages && pages.length > 0 ? (
          <HTMLFlipBook
            ref={flipBookRef}
            width={pageWidth}
            height={pageHeight}
            size="stretch"
            minWidth={400}          // Increased minimum size
            maxWidth={900}          // Increased maximum size  
            minHeight={500}         // Increased minimum size
            maxHeight={1200}        // Increased maximum size
            maxShadowOpacity={1.0}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            style={{
              boxShadow: '0 60px 120px -25px rgba(0, 0, 0, 0.9), 0 35px 75px -35px rgba(0, 0, 0, 0.7)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.15)'
            }}
            flippingTime={600}
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
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    position: 'relative',
                    overflow: 'hidden'
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
          <div style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '18px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              border: '4px solid transparent',
              borderTop: '4px solid #f59e0b',
              borderRadius: '50%',
              margin: '0 auto 24px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ fontSize: '24px', fontWeight: '300', marginBottom: '8px' }}>Loading Your Magazine...</p>
            <p style={{ fontSize: '18px', color: '#d1d5db' }}>Just Urbane August 2025</p>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000000,
          padding: '16px',
          backgroundColor: 'transparent',
          color: currentPage === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        aria-label="Previous Page"
      >
        <ChevronLeft style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }} />
      </button>

      <button
        onClick={nextPage}
        disabled={(!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) || currentPage >= totalPages - 1}
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000000,
          padding: '16px',
          backgroundColor: 'transparent',
          color: ((!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) || currentPage >= totalPages - 1) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          cursor: ((!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) || currentPage >= totalPages - 1) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
        aria-label="Next Page"
      >
        <ChevronRight style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }} />
      </button>

      {/* Premium Subscription Modal */}
      {showSubscriptionModal && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000001
          }}
          onClick={() => setShowSubscriptionModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '500px',
              margin: '0 24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              border: '2px solid #fbbf24'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubscriptionModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '50%'
              }}
            >
              <X style={{ width: '24px', height: '24px', color: '#6b7280' }} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
              }}>
                <Crown style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                Continue Your Journey
              </h2>
              <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.6' }}>
                Unlock unlimited access to premium content, exclusive insights, and the complete magazine experience
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  backgroundColor: '#000000',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  padding: '12px 24px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  marginBottom: '24px'
                }}>
                  DIGITAL PREMIUM ACCESS
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '24px', color: '#6b7280', textDecoration: 'line-through', marginRight: '16px' }}>₹1500</span>
                  <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>₹499</span>
                </div>
                <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '8px' }}>Annual Digital Subscription</p>
                <p style={{ fontSize: '18px', color: '#059669', fontWeight: '600' }}>Save 67% • Best Value</p>
              </div>
            </div>

            <Link
              to="/pricing?plan=digital"
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#000000',
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '20px',
                borderRadius: '16px',
                fontSize: '20px',
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s'
              }}
            >
              Subscribe Now - ₹499
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  // Use React Portal to render outside parent container
  return createPortal(magazineReader, document.body);
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