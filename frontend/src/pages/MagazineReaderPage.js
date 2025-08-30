import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Lock body scroll completely
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
    
    return () => {
      // Restore when leaving page
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
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
    navigate('/issues');
  };

  if (!pages.length) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        Loading magazine...
      </div>
    );
  }

  const currentPageData = pages[currentPage];
  const isPageLocked = !canReadPremium && currentPage >= FREE_PREVIEW_PAGES;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 100000
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

      {/* Magazine Display Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '50px'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ 
              x: isFlipping ? (currentPage > 0 ? -30 : 30) : 0, 
              opacity: 0,
              scale: 0.98
            }}
            animate={{ 
              x: 0, 
              opacity: 1,
              scale: 1
            }}
            exit={{ 
              x: isFlipping ? (currentPage > 0 ? 30 : -30) : 0, 
              opacity: 0,
              scale: 0.98
            }}
            transition={{ 
              duration: 0.6, 
              ease: [0.4, 0, 0.2, 1]
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
            {/* Display Actual Magazine Page */}
            <div style={{
              position: 'relative',
              maxWidth: '95%',
              maxHeight: '90%',
              width: 'auto',
              height: 'auto',
              backgroundColor: 'white',
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <img
                src={currentPageData.pageImage}
                alt={`Page ${currentPage + 1} - ${currentPageData.title}`}
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  filter: isPageLocked ? 'blur(8px)' : 'none'
                }}
                onError={(e) => {
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
                      text-align: center;
                      padding: 20px;
                    ">
                      <div>
                        <h3>Page ${currentPage + 1}</h3>
                        <p>${currentPageData.title}</p>
                        <p style="font-size: 14px; color: #999; margin-top: 10px;">
                          Image loading error - Just Urbane Magazine
                        </p>
                      </div>
                    </div>
                  `;
                }}
              />
              
              {/* Premium Lock Overlay */}
              {isPageLocked && (
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
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '50%',
                    padding: '25px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}>
                    <Crown style={{ 
                      width: '50px', 
                      height: '50px', 
                      color: '#f59e0b' 
                    }} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0 || isFlipping}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: currentPage === 0 || isFlipping ? 'rgba(255,255,255,0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage === 0 || isFlipping ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextPage}
        disabled={currentPage >= totalPages - 1 || isFlipping}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: currentPage >= totalPages - 1 || isFlipping ? 'rgba(255,255,255,0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage >= totalPages - 1 || isFlipping ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronRight size={28} />
      </button>

      {/* Premium Subscription Modal */}
      {showSubscriptionModal && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200000
        }} onClick={() => setShowSubscriptionModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '50px',
              maxWidth: '500px',
              margin: '20px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
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
            
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#111'
            }}>
              Continue Your Journey
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666', 
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Unlock unlimited access to the complete Just Urbane magazine experience with premium content and exclusive insights
            </p>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold',
                color: '#111',
                marginBottom: '8px'
              }}>
                ₹499
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#666',
                marginBottom: '5px'
              }}>
                Annual Digital Subscription
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#10b981',
                fontWeight: '600'
              }}>
                Save 67% • Best Value
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link
                to="/pricing?plan=digital"
                style={{
                  flex: 1,
                  display: 'inline-block',
                  backgroundColor: '#000',
                  color: 'white',
                  padding: '15px 25px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                Subscribe Now
              </Link>
              
              <button
                onClick={() => setShowSubscriptionModal(false)}
                style={{
                  flex: 1,
                  padding: '15px 25px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
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