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
      }, 300);
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
                objectFit: 'cover',
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

      {/* Enhanced Navigation Controls - Large Click Areas */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999999
      }}>
        {/* Left Half - Previous Page */}
        <div
          onClick={prevPage}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            height: '100%',
            cursor: currentPage === 0 || isFlipping ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '40px',
            transition: 'all 0.3s ease',
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!(currentPage === 0 || isFlipping)) {
              e.target.style.background = 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 70%)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          {!(currentPage === 0 || isFlipping) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.4, x: 0 }}
              whileHover={{ opacity: 0.8, scale: 1.05 }}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              <ChevronLeft size={24} />
            </motion.div>
          )}
        </div>

        {/* Right Half - Next Page */}
        <div
          onClick={nextPage}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '50%',
            height: '100%',
            cursor: currentPage >= totalPages - 1 || isFlipping ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '40px',
            transition: 'all 0.3s ease',
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!(currentPage >= totalPages - 1 || isFlipping)) {
              e.target.style.background = 'linear-gradient(270deg, rgba(0,0,0,0.05) 0%, transparent 70%)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          {!(currentPage >= totalPages - 1 || isFlipping) && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.4, x: 0 }}
              whileHover={{ opacity: 0.8, scale: 1.05 }}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}
            >
              <ChevronRight size={24} />
            </motion.div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default MagazineReaderPage;