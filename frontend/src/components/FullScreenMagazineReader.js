import React, { useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
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
  const FREE_PREVIEW_PAGES = 3; // Only first 3 pages are free

  // Your uploaded magazine content (simulated from video)
  const defaultMagazinePages = [
    {
      id: 'cover',
      type: 'cover',
      title: 'JUST URBANE',
      subtitle: 'August 2025 Issue',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=face',
      content: 'Premium Lifestyle Magazine'
    },
    {
      id: 'page-1',
      type: 'article',
      title: 'The Art of Modern Style',
      content: `In the ever-evolving landscape of men's fashion, the modern gentleman must navigate between timeless elegance and contemporary innovation. This comprehensive guide explores the essential elements that define sophisticated style in 2025.

      The foundation of impeccable style begins with understanding quality craftsmanship. From Italian leather goods to bespoke tailoring, investing in premium pieces creates a wardrobe that transcends seasonal trends.

      Key elements include:
      • Classic tailored suits with modern cuts
      • Premium leather accessories
      • Artisanal watches and jewelry
      • Seasonal color palettes
      • Sustainable luxury brands`,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      category: 'Fashion'
    },
    {
      id: 'page-2', 
      type: 'article',
      title: 'Luxury Travel Destinations',
      content: `Discover the world's most exclusive destinations that define luxury travel in 2025. From private island resorts to urban sanctuaries, these locations offer unparalleled experiences for the discerning traveler.

      Featured destinations include:
      • Amanzoe, Greece - Clifftop pavilions overlooking the Aegean
      • The Brando, French Polynesia - Eco-luxury on Marlon Brando's private island  
      • Aman Tokyo - Urban oasis in the heart of Japan's capital
      • Four Seasons Safari Lodge Serengeti - Wildlife luxury in Tanzania
      • Le Labo at Edition Hotels - Scent-focused luxury experiences`,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
      category: 'Travel'
    },
    {
      id: 'page-3',
      type: 'article', 
      title: 'Tech Innovations 2025',
      content: `The technology landscape continues to evolve at breakneck speed, with innovations that will reshape how we live, work, and connect. Here are the most significant tech trends defining 2025.

      Revolutionary developments:
      • AI-powered personal assistants with emotional intelligence
      • Sustainable tech manufacturing and circular economy principles  
      • Quantum computing applications for everyday users
      • Advanced AR/VR experiences in luxury retail
      • Blockchain integration in premium brand authentication`,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      category: 'Technology'
    },
    {
      id: 'premium-1',
      type: 'premium',
      title: 'Investment Strategies for the Elite',
      content: `PREMIUM CONTENT: Exclusive insights into wealth management strategies employed by ultra-high-net-worth individuals. This comprehensive analysis reveals portfolio diversification techniques, alternative investments, and emerging market opportunities.

      Advanced investment vehicles include:
      • Private equity and venture capital opportunities
      • Luxury collectibles as alternative assets
      • Cryptocurrency and digital asset strategies
      • Real estate investment trusts in emerging markets
      • Sustainable and ESG-focused investment portfolios

      Our exclusive research reveals how top-tier investors navigate market volatility while maintaining consistent returns through sophisticated risk management strategies.`,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
      category: 'Finance'
    },
    {
      id: 'premium-2',
      type: 'premium',
      title: 'Exclusive Watchmaking Mastery',
      content: `PREMIUM CONTENT: Go behind the scenes with master watchmakers at Patek Philippe, Audemars Piguet, and Vacheron Constantin. Discover the centuries-old techniques that create timepieces worth millions.

      Exclusive insights include:
      • Hand-engraving techniques passed down through generations
      • The art of complications: minute repeaters and perpetual calendars
      • Limited edition collections and their investment potential
      • Celebrity collections and auction house records
      • The future of mechanical watchmaking in the digital age

      We gained exclusive access to workshops where a single watch takes over 1,000 hours to complete, revealing why these timepieces command extraordinary prices.`,
      image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=400&fit=crop',
      category: 'Luxury'
    }
  ];

  const pages = (magazineContent && magazineContent.length > 0) ? magazineContent : defaultMagazinePages;

  useEffect(() => {
    if (pages && Array.isArray(pages)) {
      setTotalPages(pages.length);
    }
  }, [pages]);

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

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (!isOpen) {
    return null;
  }

  // Loading state
  if (!pages || !Array.isArray(pages) || pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading Magazine...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Magazine Container - True Full Screen */}
        <div className="w-full h-full flex items-center justify-center">
          <HTMLFlipBook
            ref={flipBookRef}
            width={Math.min(window.innerWidth * 0.4, 600)}
            height={Math.min(window.innerHeight * 0.85, 800)}
            size="stretch"
            minWidth={400}
            maxWidth={700}
            minHeight={600}
            maxHeight={900}
            maxShadowOpacity={0.8}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            className="magazine-flipbook"
            style={{
              boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8)',
            }}
            flippingTime={800}
            usePortrait={true}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
          >
            {(pages && Array.isArray(pages)) && pages.map((page, index) => {
              const isPageLocked = !canReadPremium && index >= FREE_PREVIEW_PAGES;
              
              return (
                <div key={page?.id || `page-${index}`} className="magazine-page bg-white relative overflow-hidden" 
                     style={{ width: '100%', height: '100%' }}>
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

        {/* Navigation Arrows - Minimal */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-4 text-white/70 hover:text-white transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-4 text-white/70 hover:text-white transition-colors disabled:opacity-30"
        >
          <ChevronRight className="h-12 w-12" />
        </button>

        {/* Small Purchase Modal - After 3 pages */}
        <AnimatePresence>
          {showSubscriptionModal && (
            <SmallPurchaseModal onClose={() => setShowSubscriptionModal(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

// Magazine Page Content Component
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
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${page.image})`
        }}
      >
        {/* Magazine Cover Design */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
          {/* Top - Magazine Logo */}
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-widest mb-2">{page.title}</h1>
            <div className="text-amber-300 text-lg tracking-widest uppercase">{page.content}</div>
          </div>

          {/* Center - Issue Info */}
          <div className="text-center">
            <div className="text-5xl font-light mb-4">{page.subtitle}</div>
            <div className="text-xl text-amber-200 tracking-wider">Premium Digital Edition</div>
          </div>

          {/* Bottom - Cover Features */}
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold">INSIDE THIS ISSUE</div>
            <div className="text-sm space-y-1 text-gray-200">
              <div>• Modern Gentleman's Style Guide</div>
              <div>• Luxury Travel Destinations 2025</div>
              <div>• Tech Innovations & Investment</div>
              <div>• Exclusive Premium Content</div>
            </div>
          </div>
        </div>
        
        {isBlurred && <PurchaseOverlay />}
      </div>
    );
  }

  // Article Page Design
  return (
    <div className={`h-full bg-white relative overflow-hidden ${isBlurred ? 'blur-sm' : ''}`}>
      {/* Magazine Page Layout */}
      <div className="h-full p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-200">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold tracking-wider text-gray-800">JUST URBANE</span>
          </div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">{page.category}</div>
        </div>

        {/* Article Title */}
        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight mb-6">
          {page.title}
        </h1>

        {/* Hero Image */}
        {page.image && (
          <div className="mb-6 rounded-lg overflow-hidden shadow-md">
            <img
              src={page.image}
              alt={page.title}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="flex-1">
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {/* Drop Cap */}
            <p className="text-justify mb-4">
              <span className="float-left text-6xl font-serif leading-none mr-2 mt-1 text-gray-800">
                {(page.content || '').charAt(0)}
              </span>
              {(page.content || '').split('\n\n')[0]?.slice(1)}
            </p>
            
            {/* Rest of content */}
            {(page.content || '').split('\n\n').slice(1).map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Premium Badge */}
        {page.type === 'premium' && (
          <div className="flex justify-end mt-4">
            <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-3 py-1 rounded-full">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </div>
          </div>
        )}

        {/* Page Number */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-400">{pageNumber}</span>
        </div>
      </div>
      
      {isBlurred && <PurchaseOverlay />}
    </div>
  );
};

// Purchase Overlay for blurred pages
const PurchaseOverlay = () => (
  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
    <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
      <Lock className="h-8 w-8 text-white" />
    </div>
  </div>
);

// Small Purchase Modal - Appears after 3 pages with blurred background
const SmallPurchaseModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 backdrop-blur-md z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Header */}
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

        {/* Digital Plan */}
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

        {/* Features */}
        <div className="space-y-2 mb-6 text-sm">
          {[
            'Unlimited digital magazine access',
            '3D flip-book reading experience', 
            'Exclusive premium content',
            'Ad-free reading experience'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link
          to="/pricing?plan=digital"
          className="block w-full bg-black hover:bg-gray-800 text-white font-bold text-center py-4 rounded-xl transition-colors text-lg"
        >
          Buy Digital Plan - ₹499
        </Link>
      </motion.div>
    </motion.div>
  );
};

// Premium Subscription Modal - Digital Plan Only
const PremiumSubscriptionModal = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-60 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="bg-white rounded-3xl p-10 max-w-lg w-full relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Crown className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Unlock Full Magazine Access
          </h2>
          <p className="text-gray-600 text-lg">
            Continue reading with unlimited digital magazine access.
          </p>
        </div>

        {/* Digital Plan Features */}
        <div className="space-y-4 mb-10">
          {[
            'Unlimited digital magazine access',
            '3D flip-book reading experience',
            'Exclusive premium content & insights',
            'Ad-free reading experience',
            'Download for offline reading'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-gray-700 text-lg">{feature}</span>
            </div>
          ))}
        </div>

        {/* Digital Plan Pricing */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200">
          <div className="text-center">
            <div className="bg-black text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
              DIGITAL PLAN ONLY
            </div>
            <div className="flex items-center justify-center space-x-4 mb-3">
              <span className="text-gray-500 line-through text-xl">₹1500</span>
              <span className="text-4xl font-bold text-gray-900">₹499</span>
            </div>
            <p className="text-gray-600">Annual Digital Subscription</p>
          </div>
        </div>

        {/* Action Buttons - Direct Buy */}
        <div className="space-y-4">
          <Link
            to="/pricing?plan=digital"
            className="block w-full bg-black hover:bg-gray-800 text-white font-bold text-center py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
          >
            Buy Digital Plan - ₹499
          </Link>
          <Link
            to="/login"
            className="block w-full text-center text-gray-600 hover:text-gray-800 font-medium py-3 transition-colors"
          >
            Already subscribed? Login
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Cancel anytime • Secure payment • 7-day money-back guarantee</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FullScreenMagazineReader;