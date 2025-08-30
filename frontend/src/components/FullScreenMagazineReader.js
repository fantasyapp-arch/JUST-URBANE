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
      }, 300);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;
    
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
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
        zIndex: 999999,
        backgroundColor: '#f5f5f5',
        fontFamily: 'Georgia, serif'
      }}
    >
      {/* Top Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000000
      }}>
        <div style={{ color: 'white', fontSize: '16px' }}>
          {currentPage + 1} / {totalPages}
          {!canReadPremium && currentPage < FREE_PREVIEW_PAGES && (
            <span style={{ marginLeft: '10px', color: '#10b981' }}>(Free Preview)</span>
          )}
        </div>
        <button
          onClick={closeReader}
          style={{
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer'
          }}
        >
          <X style={{ width: '24px', height: '24px' }} />
        </button>
      </div>

      {/* Magazine Page Container */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ x: isFlipping ? (currentPage > 0 ? -100 : 100) : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isFlipping ? (currentPage > 0 ? 100 : -100) : 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              width: '90vw',
              height: '90vh',
              maxWidth: '1200px',
              maxHeight: '800px',
              backgroundColor: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <PremiumMagazinePage 
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
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: currentPage === 0 ? 'rgba(255,255,255,0.3)' : 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: currentPage === 0 || isFlipping ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000
        }}
      >
        <ChevronLeft size={24} />
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
          zIndex: 1000000
        }}
      >
        <ChevronRight size={24} />
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
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000000
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
            
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '15px' }}>
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
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>₹499</div>
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

// Premium Magazine Page Layout - Like real magazines
const PremiumMagazinePage = ({ page, pageNumber, isBlurred = false }) => {
  if (!page) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Magazine Cover Layout
  if (page.type === 'cover') {
    return (
      <div style={{
        height: '100%',
        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${page.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 40px',
        color: 'white',
        textAlign: 'center',
        filter: isBlurred ? 'blur(3px)' : 'none'
      }}>
        <div>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            letterSpacing: '8px',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            {page.title}
          </h1>
          <div style={{
            fontSize: '1.2rem',
            color: '#fbbf24',
            letterSpacing: '4px',
            textTransform: 'uppercase'
          }}>
            {page.content}
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '300',
            marginBottom: '30px'
          }}>
            {page.subtitle}
          </h2>
          <div style={{
            fontSize: '1.1rem',
            color: '#e5e7eb'
          }}>
            Premium Digital Edition
          </div>
        </div>

        <div>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            INSIDE THIS ISSUE
          </h3>
          <div style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {page.coverFeatures?.map((feature, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>• {feature}</div>
            )) || [
              '• Premium Technology Reviews & Latest Innovations',
              '• Luxury Lifestyle Features & Exclusive Interviews',
              '• High-End Fashion & Designer Collections',
              '• Elite Automotive & Travel Experiences'
            ].map((feature, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>{feature}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Contents Page Layout
  if (page.type === 'contents') {
    return (
      <div style={{
        height: '100%',
        padding: '40px 60px',
        backgroundColor: 'white',
        filter: isBlurred ? 'blur(3px)' : 'none'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crown size={24} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>
              JUST URBANE
            </span>
          </div>
          <div style={{ fontSize: '1rem', color: '#6b7280', letterSpacing: '1px' }}>
            AUGUST 2025
          </div>
        </div>

        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '50px',
          color: '#111827'
        }}>
          CONTENTS
        </h1>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          height: 'calc(100% - 200px)'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '25px',
              letterSpacing: '2px'
            }}>
              TECH LIFE
            </h3>
            <div style={{ lineHeight: '2', fontSize: '1rem' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>12</strong> TECH NEWS - Foldables, gaming beasts, audio gear
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>18</strong> LENOVO TECH WORLD - AI innovation, transparent displays
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>22</strong> APPLE EVERYWHERE - iOS 19, macOS Sequoia, CarPlay Ultra
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>24</strong> DELL XPS 14 REVIEW - AI-ready performance meets design
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>26</strong> LEGION TAB 2 REVIEW - 8.8-inch portable gaming display
              </div>
            </div>

            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '25px',
              marginTop: '40px',
              letterSpacing: '2px'
            }}>
              COVER STORY
            </h3>
            <div style={{ lineHeight: '2', fontSize: '1rem' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>41</strong> TAPAN SINGHEL - The Insurance Man of India
              </div>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '25px',
              letterSpacing: '2px'
            }}>
              FASHION & LIFESTYLE
            </h3>
            <div style={{ lineHeight: '2', fontSize: '1rem' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>58</strong> TIMELESS TAILORING - Dior blends elegance
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>63</strong> FEMININE FUTURE - Modern femininity with bold elegance
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>67</strong> SPEED STYLE - Dua Lipa celebrates racing legacy
              </div>
            </div>

            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: '25px',
              marginTop: '40px',
              letterSpacing: '2px'
            }}>
              AUTOMOTIVE
            </h3>
            <div style={{ lineHeight: '2', fontSize: '1rem' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong>70</strong> BENTLEY BENTAYGA - Luxury and performance redefined
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>76</strong> BMW X7 - Bold luxury drives forward
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>84</strong> ROYAL ENFIELD - Rugged royalty reimagined
              </div>
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '30px',
          right: '60px',
          fontSize: '1rem',
          color: '#9ca3af'
        }}>
          {pageNumber}
        </div>
      </div>
    );
  }

  // Article Page Layout - Two Column Magazine Style
  return (
    <div style={{
      height: '100%',
      padding: '40px 60px',
      backgroundColor: 'white',
      filter: isBlurred ? 'blur(3px)' : 'none'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Crown size={20} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '2px' }}>
            JUST URBANE
          </span>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280', letterSpacing: '1px' }}>
          {page.category?.toUpperCase() || 'FEATURE'}
        </div>
      </div>

      {/* Article Title */}
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        lineHeight: '1.2',
        marginBottom: '20px',
        color: '#111827'
      }}>
        {page.title}
      </h1>

      {page.subtitle && (
        <h2 style={{
          fontSize: '1.3rem',
          fontWeight: '300',
          color: '#6b7280',
          marginBottom: '30px',
          fontStyle: 'italic'
        }}>
          {page.subtitle}
        </h2>
      )}

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        height: 'calc(100% - 200px)'
      }}>
        {/* Left Column */}
        <div>
          {page.image && (
            <img
              src={page.image}
              alt={page.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '25px'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          <div style={{
            fontSize: '1rem',
            lineHeight: '1.7',
            color: '#374151'
          }}>
            {/* Drop Cap */}
            <p style={{ marginBottom: '20px' }}>
              <span style={{
                float: 'left',
                fontSize: '4rem',
                lineHeight: '3rem',
                marginRight: '8px',
                marginTop: '8px',
                fontWeight: 'bold',
                color: '#111827'
              }}>
                {(page.content || '').charAt(0)}
              </span>
              {(page.content || '').split('\n\n')[0]?.slice(1) || ''}
            </p>

            {/* Additional paragraphs */}
            {(page.content || '').split('\n\n').slice(1, 3).map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '20px', textAlign: 'justify' }}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{
          fontSize: '1rem',
          lineHeight: '1.7',
          color: '#374151'
        }}>
          {(page.content || '').split('\n\n').slice(3).map((paragraph, index) => {
            if (paragraph.startsWith('•')) {
              return (
                <ul key={index} style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  marginBottom: '25px' 
                }}>
                  {paragraph.split('\n').filter(line => line.trim()).map((item, itemIndex) => (
                    <li key={itemIndex} style={{
                      marginBottom: '8px',
                      paddingLeft: '20px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#f59e0b'
                      }}>•</span>
                      {item.replace(/^•\s*/, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            
            return (
              <p key={index} style={{ marginBottom: '20px', textAlign: 'justify' }}>
                {paragraph}
              </p>
            );
          })}

          {page.type === 'premium' && (
            <div style={{
              backgroundColor: '#fbbf24',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              marginTop: '30px'
            }}>
              <Crown size={16} />
              PREMIUM CONTENT
            </div>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '60px',
        fontSize: '1rem',
        color: '#9ca3af'
      }}>
        {pageNumber}
      </div>
    </div>
  );
};

export default FullScreenMagazineReader;