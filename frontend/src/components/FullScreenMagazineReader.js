import React, { useRef, useEffect, useState } from 'react';
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
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
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

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const pageWidth = Math.min(screenWidth * 0.45, 500);
  const pageHeight = Math.min(screenHeight * 0.9, 700);

  return (
    <div
      className="fixed inset-0 bg-black"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#000000'
      }}
    >
      <button
        onClick={closeReader}
        className="absolute top-4 right-4 p-3 bg-black/80 hover:bg-black text-white rounded-full transition-all duration-200 shadow-lg"
        style={{ zIndex: 10000 }}
      >
        <X className="h-6 w-6" />
      </button>

      <div 
        className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm"
        style={{ zIndex: 10000 }}
      >
        {currentPage + 1} / {totalPages}
        {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
          <span className="ml-2 text-green-400">(Free Preview)</span>
        )}
      </div>

      <div className="w-full h-full flex items-center justify-center">
        {pages && pages.length > 0 ? (
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
        ) : (
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-xl">Loading Magazine...</p>
          </div>
        )}
      </div>

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

      {showSubscriptionModal && (
        <div
          className="absolute inset-0 bg-black/90 flex items-center justify-center"
          style={{ zIndex: 10001 }}
          onClick={() => setShowSubscriptionModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Continue Reading
              </h2>
              <p className="text-gray-600">
                Unlock unlimited digital magazine access
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3">
                  DIGITAL PLAN
                </div>
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-gray-500 line-through">₹1500</span>
                  <span className="text-3xl font-bold text-gray-900">₹499</span>
                </div>
                <p className="text-sm text-gray-600">Annual Digital Subscription</p>
              </div>
            </div>

            <Link
              to="/pricing?plan=digital"
              className="block w-full bg-black hover:bg-gray-800 text-white font-bold text-center py-4 rounded-xl transition-colors text-lg"
            >
              Buy Digital Plan - ₹499
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

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
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="text-center">
            <h1 className="text-7xl font-bold tracking-widest mb-4 drop-shadow-lg">{page.title}</h1>
            <div className="text-amber-300 text-2xl tracking-widest uppercase font-light">{page.content}</div>
          </div>

          <div className="text-center">
            <div className="text-6xl font-light mb-6 drop-shadow-lg">{page.subtitle}</div>
            <div className="text-2xl text-amber-200 tracking-wider">Premium Digital Edition</div>
          </div>

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

  return (
    <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
      <div className="h-full p-10 flex flex-col">
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center space-x-3">
            <Crown className="h-5 w-5 text-amber-600" />
            <span className="text-lg font-bold tracking-wider text-gray-800">JUST URBANE</span>
          </div>
          <div className="text-lg text-gray-500 uppercase tracking-wider font-medium">{page.category}</div>
        </div>

        <h1 className="text-5xl font-serif font-bold text-gray-900 leading-tight mb-8">
          {page.title}
        </h1>

        {page.image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-60 object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-justify mb-6">
              <span className="float-left text-8xl font-serif leading-none mr-4 mt-2 text-gray-800">
                {(page.content || '').charAt(0)}
              </span>
              {(page.content || '').split('\n\n')[0]?.slice(1)}
            </p>
            
            {(page.content || '').split('\n\n').slice(1).map((paragraph, index) => (
              <p key={index} className="mb-6 text-justify text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {page.type === 'premium' && (
          <div className="flex justify-end mt-6">
            <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
              <Crown className="h-4 w-4 mr-2" />
              Premium Content
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <span className="text-sm text-gray-400 font-medium">{pageNumber}</span>
        </div>
      </div>
      
      {isBlurred && <PurchaseOverlay />}
    </div>
  );
};

const PurchaseOverlay = () => (
  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-2xl">
      <Lock className="h-12 w-12 text-white drop-shadow-lg" />
    </div>
  </div>
);

export default FullScreenMagazineReader;