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

  // Touch/Swipe Gesture Support
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Only respond to horizontal swipes (not vertical scrolling)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next page
          nextPage();
        } else {
          // Swipe right - previous page
          prevPage();
        }
      }
    };

    const container = document.querySelector('.magazine-container');
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentPage, totalPages, canReadPremium]);

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

  const nextPage = () => {
    if (isFlipping) return;
    
    if (!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) {
      setShowSubscriptionModal(true);
      return;
    }
    
    if (currentPage < totalPages - 1) {
      setIsFlipping(true);
      // Instant page change with smooth transition
      setCurrentPage(currentPage + 1);
      
      // Quick reset for next interaction
      setTimeout(() => {
        setIsFlipping(false);
      }, 250);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;
    
    if (currentPage > 0) {
      setIsFlipping(true);
      // Instant page change with smooth transition
      setCurrentPage(currentPage - 1);
      
      // Quick reset for next interaction
      setTimeout(() => {
        setIsFlipping(false);
      }, 250);
    }
  };

  const closeReader = () => {
    navigate('/issues');
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
        {/* Hidden Close Button - Appears on hover */}
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

      {/* Magazine Display Area - Full Screen Smooth Page Turn */}
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
            <img
              src={pages[currentPage]?.pageImage}
              alt={`${pages[currentPage]?.title} - Page ${currentPage + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                filter: isPageLocked ? 'blur(15px)' : 'none'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `
                  <div style="
                    width: 100%; 
                    height: 100%; 
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center;
                    color: #666;
                    font-size: 48px;
                    font-weight: 600;
                    text-align: center;
                    padding: 60px;
                  ">
                    <div style="font-size: 120px; margin-bottom: 40px;">📖</div>
                    <div>Page ${currentPage + 1}</div>
                    <div style="font-size: 32px; color: #999; margin-top: 30px; font-weight: 400;">
                      ${pages[currentPage]?.title}
                    </div>
                    <div style="font-size: 24px; color: #bbb; margin-top: 40px; font-weight: 300;">
                      Just Urbane Magazine - August 2025
                    </div>
                  </div>
                `;
              }}
            />
            
            {/* Premium Lock Overlay with Enhanced Crown */}
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

        {/* Navigation Areas */}
        {currentPage > 0 && (
          <div className="navigation-area left" onClick={prevPage}>
            <motion.button
              className="nav-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isFlipping}
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>
        )}

        {currentPage < totalPages - 1 && !(!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) && (
          <div className="navigation-area right" onClick={nextPage}>
            <motion.button
              className="nav-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={isFlipping}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        )}

        {/* Page Indicator */}
        <div className="page-indicator">
          Page {currentPage + 1} of {totalPages}
          {!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1 && (
            <span style={{ marginLeft: '12px', color: '#ffd700' }}>
              • Premium Required
            </span>
          )}
        </div>

        {/* Premium Subscription Modal */}
        {showSubscriptionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000000,
              padding: '20px'
            }}
            onClick={() => setShowSubscriptionModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                borderRadius: '32px',
                padding: 'clamp(40px, 6vw, 60px)',
                maxWidth: '600px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 50px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.08, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: 'clamp(80px, 15vw, 120px)',
                  height: 'clamp(80px, 15vw, 120px)',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 40px',
                  boxShadow: '0 20px 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.2)',
                  border: '3px solid rgba(255, 255, 255, 0.5)'
                }}
              >
                <Crown style={{ 
                  width: 'clamp(40px, 8vw, 60px)', 
                  height: 'clamp(40px, 8vw, 60px)', 
                  color: '#b8860b' 
                }} />
              </motion.div>
              
              <h2 style={{ 
                fontSize: 'clamp(24px, 5vw, 36px)', 
                fontWeight: '700', 
                marginBottom: '20px',
                color: '#111',
                background: 'linear-gradient(135deg, #333 0%, #000 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Unlock Premium Content
              </h2>
              
              <p style={{ 
                fontSize: 'clamp(16px, 3vw, 18px)', 
                color: '#666', 
                marginBottom: '40px',
                lineHeight: '1.6',
                maxWidth: '400px',
                margin: '0 auto 40px'
              }}>
                Continue reading the complete Just Urbane magazine with unlimited access to premium content, exclusive insights, and luxury lifestyle stories.
              </p>
              
              <div style={{
                background: 'linear-gradient(135deg, #f1f3f4 0%, #e8eaed 100%)',
                borderRadius: '24px',
                padding: 'clamp(20px, 4vw, 35px)',
                marginBottom: '40px',
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  fontSize: 'clamp(32px, 6vw, 48px)', 
                  fontWeight: '800',
                  color: '#111',
                  marginBottom: '12px'
                }}>
                  ₹499
                </div>
                <div style={{ 
                  fontSize: 'clamp(16px, 3vw, 18px)', 
                  color: '#666',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Annual Digital Subscription
                </div>
                <div style={{ 
                  fontSize: 'clamp(14px, 2.5vw, 16px)', 
                  color: '#10b981',
                  fontWeight: '700'
                }}>
                  Save 67% • Best Value
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: 'clamp(12px, 3vw, 20px)',
                flexDirection: window.innerWidth < 480 ? 'column' : 'row'
              }}>
                <Link
                  to="/pricing?plan=digital"
                  style={{
                    flex: 1,
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #000 0%, #333 100%)',
                    color: 'white',
                    padding: 'clamp(14px, 3vw, 18px) clamp(20px, 4vw, 30px)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  Subscribe Now
                </Link>
                
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  style={{
                    flex: 1,
                    padding: 'clamp(14px, 3vw, 18px) clamp(20px, 4vw, 30px)',
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    borderRadius: '16px',
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e5e5';
                    e.target.style.borderColor = '#d0d0d0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f5f5f5';
                    e.target.style.borderColor = '#e0e0e0';
                  }}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MagazineReaderPage;