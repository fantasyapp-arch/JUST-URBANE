import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FullScreenMagazineReader = ({ isOpen, onClose, magazineContent = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
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
      // Completely lock the body scroll and position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
    } else {
      // Restore normal scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
    };
  }, [isOpen]);

  const nextPage = () => {
    if (isFlipping) return;
    
    if (!canReadPremium && currentPage >= FREE_PREVIEW_PAGES - 1) {
      setShowSubscriptionModal(true);
      return;
    }
    
    if (currentPage < totalPages - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 400);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;
    
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 400);
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
        width: '100vw',
        height: '100vh',
        zIndex: 999999999,
        backgroundColor: '#1a1a1a', // Dark background like GQ
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0
      }}
    >
      {/* Top Navigation Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000000000
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>Just Urbane - August 2025</span>
          <span style={{ color: '#666' }}>|</span>
          <span>{currentPage + 1} of {totalPages}</span>
          {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
            <>
              <span style={{ color: '#666' }}>|</span>
              <span style={{ color: '#10b981', fontSize: '12px' }}>FREE PREVIEW</span>
            </>
          )}
        </div>
        
        <button
          onClick={closeReader}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Full Page Magazine Display - Like GQ */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '50px' // Account for top bar
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ 
              x: isFlipping ? (currentPage > 0 ? -50 : 50) : 0, 
              opacity: 0,
              scale: 0.98
            }}
            animate={{ 
              x: 0, 
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              x: isFlipping ? (currentPage > 0 ? 50 : -50) : 0, 
              opacity: 0,
              scale: 0.98
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1] // Custom easing for smooth magazine flip
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Actual Magazine Page */}
            <ActualMagazinePage 
              page={currentPageData} 
              pageNumber={currentPage + 1} 
              isBlurred={isPageLocked}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0 || isFlipping}
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: currentPage === 0 || isFlipping ? 'rgba(255,255,255,0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage === 0 || isFlipping ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000000,
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextPage}
        disabled={currentPage >= totalPages - 1 || isFlipping}
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: currentPage >= totalPages - 1 || isFlipping ? 'rgba(255,255,255,0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage >= totalPages - 1 || isFlipping ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000000,
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Premium Subscription Modal */}
      {showSubscriptionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000000000
          }}
          onClick={() => setShowSubscriptionModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '450px',
              margin: '20px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 25px'
            }}>
              <Crown style={{ width: '35px', height: '35px', color: 'white' }} />
            </div>
            
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '12px',
              color: '#111'
            }}>
              Continue Reading
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: '#666', 
              marginBottom: '25px',
              lineHeight: '1.5'
            }}>
              Unlock unlimited access to the complete Just Urbane magazine experience
            </p>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold',
                color: '#111',
                marginBottom: '5px'
              }}>
                ₹499
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#666' 
              }}>
                Annual Digital Subscription
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#10b981',
                marginTop: '5px',
                fontWeight: '600'
              }}>
                Save 67% • Best Value
              </div>
            </div>
            
            <Link
              to="/pricing?plan=digital"
              style={{
                display: 'inline-block',
                backgroundColor: '#000',
                color: 'white',
                padding: '12px 35px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Subscribe Now
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Component to display actual magazine pages at full size
const ActualMagazinePage = ({ page, pageNumber, isBlurred = false }) => {
  if (!page) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: '#999'
      }}>
        Loading page...
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* ACTUAL Magazine Page Image - Full Size Display */}
      <div style={{
        position: 'relative',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        backgroundColor: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <img
          src={page.pageImage}
          alt={`Page ${pageNumber} - ${page.title}`}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: 'calc(100vh - 100px)', // Account for navigation bars
            objectFit: 'contain', // Maintain aspect ratio
            objectPosition: 'center',
            display: 'block',
            filter: isBlurred ? 'blur(8px)' : 'none'
          }}
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div style="
                width: 600px; 
                height: 800px; 
                background: #f5f5f5; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                color: #666;
                font-size: 18px;
              ">
                Page ${pageNumber}<br/>
                ${page.title}
              </div>
            `;
          }}
        />
        
        {/* Premium Lock Overlay */}
        {isBlurred && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <Crown style={{ 
                width: '40px', 
                height: '40px', 
                color: '#f59e0b' 
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenMagazineReader;