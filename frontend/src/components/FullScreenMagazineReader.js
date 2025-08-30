import React, { useRef, useEffect, useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Crown, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FullScreenMagazineReader = ({ isOpen, onClose, magazineContent = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  const FREE_PREVIEW_PAGES = 3;

  const pages = magazineContent && magazineContent.length > 0 ? magazineContent : [];

  useEffect(() => {
    if (pages && Array.isArray(pages)) {
      setTotalPages(pages.length);
    }
  }, [pages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const nextPage = () => {
    if (!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) {
      setShowSubscriptionModal(true);
      return;
    }
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const closeReader = () => {
    setShowSubscriptionModal(false);
    onClose();
  };

  if (!isOpen || !pages.length) {
    return null;
  }

  const currentPageData = pages[currentPage];
  const isPageLocked = !canReadPremium && currentPage >= FREE_PREVIEW_PAGES;

  return (
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Close Button */}
      <button
        onClick={closeReader}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000000,
          padding: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <X style={{ width: '24px', height: '24px' }} />
      </button>

      {/* Page Counter */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000000,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '25px',
          fontSize: '16px'
        }}
      >
        {currentPage + 1} / {totalPages}
        {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
          <span style={{ marginLeft: '10px', color: '#10b981' }}>(Free Preview)</span>
        )}
      </div>

      {/* Magazine Page - LARGE and IMMERSIVE */}
      <div
        style={{
          width: '90vw',
          height: '95vh',
          maxWidth: '900px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          position: 'relative',
          border: '3px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <MagazinePageContent 
          page={currentPageData} 
          pageNumber={currentPage + 1} 
          isBlurred={isPageLocked} 
        />
      </div>

      {/* Navigation Arrows - Large and Visible */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0}
        style={{
          position: 'fixed',
          left: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000000,
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: currentPage === 0 ? 'rgba(255, 255, 255, 0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <ChevronLeft style={{ width: '40px', height: '40px' }} />
      </button>

      <button
        onClick={nextPage}
        disabled={currentPage >= totalPages - 1}
        style={{
          position: 'fixed',
          right: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000000,
          padding: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: currentPage >= totalPages - 1 ? 'rgba(255, 255, 255, 0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <ChevronRight style={{ width: '40px', height: '40px' }} />
      </button>

      {/* Premium Modal */}
      {showSubscriptionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '500px',
              margin: '20px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px'
            }}>
              <Crown style={{ width: '40px', height: '40px', color: 'white' }} />
            </div>
            
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', color: '#111' }}>
              Continue Reading
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
              Unlock unlimited access to premium magazine content
            </p>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#111' }}>₹499</div>
              <div style={{ fontSize: '16px', color: '#666' }}>Annual Digital Subscription</div>
            </div>
            
            <Link
              to="/pricing?plan=digital"
              style={{
                display: 'inline-block',
                backgroundColor: '#000',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
};

// Magazine Page Content Component - Premium, large-scale design
const MagazinePageContent = ({ page, pageNumber, isBlurred = false }) => {
  if (!page) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-xl">Loading page...</p>
      </div>
    );
  }

  if (page.type === 'cover') {
    return (
      <div 
        className={`h-full relative overflow-hidden bg-cover bg-center ${isBlurred ? 'blur-sm' : ''}`}
        style={{
          backgroundImage: page.image ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${page.image})` : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-12 md:p-16 text-white">
          {/* Magazine Header */}
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest mb-6 drop-shadow-2xl">{page.title}</h1>
            <div className="text-amber-300 text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase font-light">{page.content}</div>
          </div>

          {/* Issue Info */}
          <div className="text-center">
            <div className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 drop-shadow-lg">{page.subtitle}</div>
            <div className="text-2xl md:text-3xl lg:text-4xl text-amber-200 tracking-wider">Premium Digital Edition</div>
          </div>

          {/* Cover Features */}
          <div className="text-center space-y-6">
            <div className="text-3xl md:text-4xl lg:text-5xl font-semibold">INSIDE THIS ISSUE</div>
            <div className="text-lg md:text-xl lg:text-2xl space-y-3 text-gray-200 leading-relaxed max-w-4xl mx-auto">
              {page.coverFeatures?.map((feature, index) => (
                <div key={index}>• {feature}</div>
              )) || [
                '• Premium Technology Reviews & Latest Innovations',
                '• Luxury Lifestyle Features & Exclusive Interviews', 
                '• High-End Fashion & Designer Collections',
                '• Elite Automotive & Travel Experiences'
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

  // Contents Page - Enhanced for large display
  if (page.type === 'contents') {
    return (
      <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
        <div className="h-full p-10 md:p-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-12 pb-6 border-b-4 border-gray-200">
            <div className="flex items-center space-x-4">
              <Crown className="h-8 w-8 text-amber-600" />
              <span className="text-2xl md:text-3xl font-bold tracking-wider text-gray-800">JUST URBANE</span>
            </div>
            <div className="text-lg md:text-xl text-gray-500 uppercase tracking-wider">August 2025</div>
          </div>

          {/* Contents Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-gray-900 text-center mb-16">
            {page.title}
          </h1>

          {/* Contents List - Improved layout for large pages */}
          <div className="space-y-8 text-lg md:text-xl">
            {page.content.split('\n\n').map((section, index) => (
              <div key={index} className="mb-10">
                {section.split('\n').map((line, lineIndex) => {
                  if (line.match(/^[A-Z\s&]+$/)) {
                    // Section headers
                    return (
                      <h3 key={lineIndex} className="text-2xl md:text-3xl font-bold text-amber-600 mb-6 tracking-wider">
                        {line}
                      </h3>
                    );
                  } else if (line.includes(' - ')) {
                    // Content items
                    const [number, content] = line.split(' - ');
                    return (
                      <div key={lineIndex} className="flex justify-between items-start py-3 border-b border-gray-200">
                        <span className="font-bold text-amber-600 mr-6 text-xl">{number}</span>
                        <span className="flex-1 text-gray-700 text-lg leading-relaxed">{content}</span>
                      </div>
                    );
                  } else if (line.trim()) {
                    return (
                      <p key={lineIndex} className="text-gray-600 leading-relaxed text-lg">
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
          <div className="absolute bottom-8 right-8">
            <span className="text-lg text-gray-400 font-medium">{pageNumber}</span>
          </div>
        </div>
        
        {isBlurred && <PurchaseOverlay />}
      </div>
    );
  }

  // Regular Article Pages - Enhanced for premium large display
  return (
    <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
      <div className="h-full p-10 md:p-16 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b-4 border-gray-200">
          <div className="flex items-center space-x-4">
            <Crown className="h-6 w-6 md:h-8 w-8 text-amber-600" />
            <span className="text-xl md:text-2xl font-bold tracking-wider text-gray-800">JUST URBANE</span>
          </div>
          <div className="text-lg md:text-xl text-gray-500 uppercase tracking-wider">{page.category}</div>
        </div>

        {/* Article Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-8 md:mb-12">
          {page.title}
        </h1>

        {/* Subtitle if exists */}
        {page.subtitle && (
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-600 mb-8 md:mb-12 italic">
            {page.subtitle}
          </h2>
        )}

        {/* Hero Image */}
        {page.image && (
          <div className="mb-8 md:mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-48 md:h-72 lg:h-96 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex-1 overflow-hidden">
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed">
            {(page.content || '').split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().match(/^[A-Z\s:]+$/)) {
                // All caps sections (headers)
                return (
                  <h3 key={index} className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-600 mt-8 mb-4 tracking-wider">
                    {paragraph.trim()}
                  </h3>
                );
              } else if (paragraph.startsWith('•')) {
                // Bullet points
                return (
                  <ul key={index} className="list-none space-y-3 mb-8 ml-6">
                    {paragraph.split('\n').filter(line => line.trim()).map((item, itemIndex) => (
                      <li key={itemIndex} className="text-lg md:text-xl flex items-start">
                        <span className="text-amber-600 mr-4 text-xl">•</span>
                        <span>{item.replace(/^•\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              } else if (index === 0) {
                // First paragraph with large drop cap
                return (
                  <p key={index} className="text-justify mb-6 md:mb-8">
                    <span className="float-left text-6xl md:text-8xl lg:text-9xl font-serif leading-none mr-4 mt-2 text-gray-800">
                      {paragraph.charAt(0)}
                    </span>
                    <span className="text-lg md:text-xl leading-relaxed">{paragraph.slice(1)}</span>
                  </p>
                );
              } else {
                // Regular paragraphs
                return (
                  <p key={index} className="mb-6 md:mb-8 text-justify text-lg md:text-xl leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </div>

        {/* Premium Badge */}
        {page.type === 'premium' && (
          <div className="flex justify-end mt-8">
            <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm md:text-base px-6 py-3 rounded-full shadow-lg">
              <Crown className="h-5 w-5 mr-2" />
              Premium Content
            </div>
          </div>
        )}

        {/* Page Number */}
        <div className="text-center mt-8">
          <span className="text-lg text-gray-400 font-medium">{pageNumber}</span>
        </div>
      </div>
      
      {isBlurred && <PurchaseOverlay />}
    </div>
  );
};

// Purchase Overlay for premium content - Enhanced for large display
const PurchaseOverlay = () => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
    <div className="bg-white/40 backdrop-blur-md rounded-full p-12 md:p-16 shadow-2xl border-4 border-white/60">
      <Lock className="h-20 w-20 md:h-28 md:w-28 text-white drop-shadow-2xl" />
    </div>
  </div>
);

export default FullScreenMagazineReader;