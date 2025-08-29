import React, { useRef, useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Home, Bookmark, Share2, Settings, Maximize, 
  Minimize, RotateCw, Menu, Crown, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  ArticlePageLeft, 
  ArticlePageRight, 
  LockedArticlePage, 
  SubscriptionPromotionPage, 
  TableOfContentsModal 
} from './MagazinePages';

const MagazineReader = ({ articles, isOpen, onClose, initialPageIndex = 0 }) => {
  const flipBookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  const FREE_PREVIEW_PAGES = 3; // Number of pages to show as free preview (including cover)

  useEffect(() => {
    if (articles && articles.length > 0) {
      // Calculate total pages: cover + articles + back cover
      const articlePages = articles.length * 2; // 2 pages per article (spread)
      setTotalPages(articlePages + 2); // +2 for front and back covers
    }
  }, [articles]);

  useEffect(() => {
    if (flipBookRef.current && initialPageIndex > 0) {
      setTimeout(() => {
        flipBookRef.current.pageFlip().flip(initialPageIndex);
      }, 500);
    }
  }, [initialPageIndex]);

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

  const goToPage = (pageIndex) => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flip(pageIndex);
    }
    setShowTableOfContents(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 2));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.6));
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (!isOpen || !articles || articles.length === 0) {
    return null;
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
                    onClick={zoomOut}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <button
                    onClick={zoomIn}
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
              const isLocked = article?.is_premium && !canReadPremium;
              
              return (
                <React.Fragment key={article.id}>
                  {/* Left Page - Article Content */}
                  <div className="magazine-page bg-white">
                    {isLocked ? (
                      <LockedArticlePage article={article} />
                    ) : (
                      <ArticlePageLeft article={article} pageNumber={index * 2 + 2} />
                    )}
                  </div>
                  
                  {/* Right Page - Article Continued or Images */}
                  <div className="magazine-page bg-white">
                    {isLocked ? (
                      <SubscriptionPromotionPage />
                    ) : (
                      <ArticlePageRight article={article} pageNumber={index * 2 + 3} />
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

export default MagazineReader;