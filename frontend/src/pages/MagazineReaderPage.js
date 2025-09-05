import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import parseMagazineContent from '../components/MagazineContentParser';

const MagazineReaderPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  console.log('📖 Can read premium?', canReadPremium);
  
  const FREE_PREVIEW_PAGES = 3;

  const pages = parseMagazineContent();

  useEffect(() => {
    if (pages && Array.isArray(pages)) {
      setTotalPages(pages.length);
    }
  }, [pages]);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Escape') {
        closeReader();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, canReadPremium]);

  const nextPage = () => {
    if (isFlipping) return;
    
    if (!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) {
      setShowSubscriptionModal(true);
      return;
    }
    
    if (currentPage < totalPages - 1) {
      setIsFlipping(true);
      setCurrentPage(currentPage + 1);
      
      setTimeout(() => {
        setIsFlipping(false);
      }, 250);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;
    
    if (currentPage > 0) {
      setIsFlipping(true);
      setCurrentPage(currentPage - 1);
      
      setTimeout(() => {
        setIsFlipping(false);
      }, 250);
    }
  };

  useEffect(() => {
    // COMPLETE full-screen experience - lock body scroll and remove all browser elements
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Restore when leaving page
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.overflow = '';
    };
  }, []);



  const closeReader = () => {
    navigate('/');
  };

  if (!pages.length) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading magazine...
      </div>
    );
  }

  const currentPageData = pages[currentPage];
  const isPageLocked = !canReadPremium && currentPage >= FREE_PREVIEW_PAGES;



  return (
    <>
      <style>{`
        .hover-visible {
          opacity: 0 !important;
          transition: opacity 0.3s ease;
        }
        
        .magazine-container:hover .hover-visible {
          opacity: 1 !important;
        }
        
        .magazine-container {
          width: 100vw;
          height: 100vh;
        }
      `}</style>
      
      <div className="magazine-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 999999
      }}>
        {/* Close Button */}
      <button
        onClick={closeReader}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '12px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          opacity: 0,
          transition: 'all 0.3s ease',
          zIndex: 1000000
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.9)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(0,0,0,0.7)';
          e.target.style.transform = 'scale(1)';
        }}
        className="hover-visible"
      >
        <X size={24} />
      </button>

      {/* Magazine Display Area - Full Screen Page Turn */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: '#fff'
            }}
          >
            <iframe
              src={currentPageData?.pageImage}
              alt={`${currentPageData?.title} - Page ${currentPage + 1}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                filter: isPageLocked ? 'blur(15px)' : 'none'
              }}
              title={`Page ${currentPage + 1}`}
            />
            
            {/* Premium Lock Overlay */}
            {isPageLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(15px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                    borderRadius: '50%',
                    padding: '50px',
                    boxShadow: '0 25px 50px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2)'
                  }}
                >
                  <Crown style={{ 
                    width: '80px', 
                    height: '80px', 
                    color: '#b8860b' 
                  }} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Magazine Display Area */}
      <div 
        ref={containerRef}
        className="flex items-center justify-center h-full p-4 pt-20 pb-16"
        onClick={toggleControls}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{
            width: DISPLAY_WIDTH * zoom,
            height: DISPLAY_HEIGHT * zoom,
            transform: `rotate(${rotation}deg)`,
            maxWidth: '95vw',
            maxHeight: '95vh'
          }}
        >
          {/* PDF Display with A4 Proportions */}
          <iframe
            src={`${magazinePdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
            className="w-full h-full border-0"
            title="Just Urbane August 2025 Digital Magazine"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
            }}
          />
          
          {/* A4 Size Info Badge */}
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>A4 Format • {DISPLAY_WIDTH}×{DISPLAY_HEIGHT}px</span>
            </div>
          </div>

          {/* Resolution Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
            High Resolution PDF
          </div>
        </motion.div>
      </div>

      {/* Bottom Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4"
          >
            <div className="flex items-center justify-center text-white">
              <div className="flex items-center space-x-6 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-sm font-medium">Just Urbane • August 2025</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex items-center space-x-2 text-sm">
                  <span>Digital Magazine</span>
                  <span className="text-amber-400">•</span>
                  <span>A4 Format</span>
                  <span className="text-amber-400">•</span>
                  <span>High Resolution PDF</span>
                </div>
                <div className="w-px h-6 bg-white/20"></div>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleDownload}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={handleRotate}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Rotate"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Subscription Modal */}
      {showSubscriptionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000000
        }} onClick={() => setShowSubscriptionModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '60px',
              maxWidth: '550px',
              margin: '20px',
              textAlign: 'center',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 40px',
                boxShadow: '0 15px 30px rgba(255, 215, 0, 0.3)'
              }}
            >
              <Crown style={{ width: '50px', height: '50px', color: '#b8860b' }} />
            </motion.div>
            
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#111'
            }}>
              Unlock Your Journey
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#666', 
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Continue reading the complete Just Urbane magazine with unlimited access to premium content, exclusive insights, and luxury lifestyle stories.
            </p>
            
            <div style={{
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '20px',
              padding: '35px',
              marginBottom: '40px'
            }}>
              <div style={{ 
                fontSize: '42px', 
                fontWeight: 'bold',
                color: '#111',
                marginBottom: '10px'
              }}>
                ₹499
              </div>
              <div style={{ 
                fontSize: '18px', 
                color: '#666',
                marginBottom: '8px'
              }}>
                Annual Digital Subscription
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#10b981',
                fontWeight: '700'
              }}>
                Save 67% • Best Value
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link
                to="/pricing?plan=digital"
                style={{
                  flex: 1,
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                  color: 'white',
                  padding: '18px 30px',
                  borderRadius: '15px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Subscribe Now
              </Link>
              
              <button
                onClick={() => setShowSubscriptionModal(false)}
                style={{
                  flex: 1,
                  padding: '18px 30px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e5e5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MagazineReaderPage;