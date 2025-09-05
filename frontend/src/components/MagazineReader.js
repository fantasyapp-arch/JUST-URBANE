import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, Download, Maximize, Minimize,
  RotateCw, BookOpen, Printer
} from 'lucide-react';

const MagazineReader = ({ articles, isOpen, onClose, initialPageIndex = 0 }) => {
  const containerRef = useRef();
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);

  // Real magazine PDF URL
  const magazinePdfUrl = "https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf";
  
  // A4 dimensions for proper display
  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;
  const DISPLAY_WIDTH = 800;
  const DISPLAY_HEIGHT = Math.round((A4_HEIGHT / A4_WIDTH) * DISPLAY_WIDTH);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = magazinePdfUrl;
    link.download = 'Just Urbane August 2025 - Digital Magazine.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black z-50 overflow-hidden ${
          isFullscreen ? 'z-[100]' : ''
        }`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Top Controls Bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-6"
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-amber-400" />
                    <h1 className="text-xl font-bold">JUST URBANE</h1>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowTableOfContents(true)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Magazine Container */}
        <div 
          className="flex items-center justify-center h-full p-4 pt-20 pb-20"
          onClick={toggleControls}
          style={{ transform: `scale(${zoom})` }}
        >
          <HTMLFlipBook
            ref={flipBookRef}
            width={400}
            height={600}
            size="fixed"
            minWidth={300}
            maxWidth={800}
            minHeight={450}
            maxHeight={1200}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            className="magazine-flipbook"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Cover Page */}
            <div className="magazine-page bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
              <MagazineCover />
            </div>

            {/* Article Pages */}
            {articles.map((article, index) => {
              const pageIndex = index * 2 + 1; // Starting from page 1 (after cover)
              const isPageLocked = !canReadPremium && pageIndex >= FREE_PREVIEW_PAGES;
              
              return (
                <React.Fragment key={article.id}>
                  {/* Left Page - Article Content */}
                  <div className="magazine-page bg-white">
                    {isPageLocked ? (
                      <SubscriptionGatePage 
                        onSubscribe={() => setShowSubscriptionModal(true)}
                        pageNumber={pageIndex + 1}
                      />
                    ) : (
                      <ArticlePageLeft article={article} pageNumber={pageIndex + 1} />
                    )}
                  </div>
                  
                  {/* Right Page - Article Continued or Images */}
                  <div className="magazine-page bg-white">
                    {isPageLocked ? (
                      <SubscriptionPromotionPage />
                    ) : (
                      <ArticlePageRight article={article} pageNumber={pageIndex + 2} />
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Back Cover */}
            <div className="magazine-page bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white">
              <BackCover />
            </div>
          </HTMLFlipBook>
        </div>

        {/* Navigation Controls */}
        <AnimatePresence>
          {showControls && (
            <>
              {/* Left Navigation */}
              <motion.button
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                onClick={prevPage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              {/* Right Navigation */}
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                onClick={nextPage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 backdrop-blur-sm"
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Controls Bar */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6"
            >
              <div className="flex items-center justify-center text-white">
                <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-sm px-6 py-3 rounded-full">
                  <span className="text-sm">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Subscription Modal */}
        <AnimatePresence>
          {showSubscriptionModal && (
            <PremiumSubscriptionModal
              onClose={() => setShowSubscriptionModal(false)}
            />
          )}
        </AnimatePresence>

        {/* Table of Contents Modal */}
        <TableOfContentsModal
          isOpen={showTableOfContents}
          onClose={() => setShowTableOfContents(false)}
          articles={articles}
          onPageSelect={goToPage}
          currentPage={currentPage}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Magazine Cover Component
const MagazineCover = () => {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="h-8 w-8 text-amber-400" />
            <h1 className="text-4xl font-bold tracking-wider">JUST URBANE</h1>
          </div>
          <p className="text-amber-200 text-sm tracking-widest uppercase">Premium Digital Magazine</p>
        </div>

        {/* Issue Info */}
        <div className="text-center mb-12">
          <p className="text-2xl font-light">{monthYear} Issue</p>
          <p className="text-amber-300 text-sm mt-2">The Modern Gentleman's Guide</p>
        </div>
      </div>

      <div className="relative z-10">
        {/* Featured Headlines */}
        <div className="space-y-2 mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Inside This Issue</h2>
            <div className="space-y-1 text-sm text-gray-300">
              <p>• Style Essentials for the Modern Man</p>
              <p>• Tech Innovations Changing Everything</p>
              <p>• Investment Strategies That Work</p>
              <p>• Luxury Travel Destinations</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400">
          <p>Premium Subscription Required</p>
        </div>
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