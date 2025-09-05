import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, Download, Maximize, Minimize,
  RotateCw, BookOpen, Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MagazineReaderPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef();
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Real magazine PDF URL - your uploaded PDF
  const magazinePdfUrl = "https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf";
  
  // A4 dimensions for proper display
  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;
  const DISPLAY_WIDTH = 900;
  const DISPLAY_HEIGHT = Math.round((A4_HEIGHT / A4_WIDTH) * DISPLAY_WIDTH);

  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  console.log('📖 Can read premium?', canReadPremium);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        closeReader();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
    navigate('/issues');
  };



  return (
    <div
      className={`fixed inset-0 bg-black/95 z-50 overflow-hidden ${
        isFullscreen ? 'z-[100]' : ''
      }`}
      style={{ margin: 0, padding: 0 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/70 to-transparent p-4"
          >
            <div className="flex items-center justify-between text-white max-w-7xl mx-auto">
              <div className="flex items-center space-x-4">
                <button
                  onClick={closeReader}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors"
                  title="Close"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-6 w-6 text-amber-400" />
                  <div>
                    <h1 className="text-xl font-bold">JUST URBANE</h1>
                    <p className="text-sm text-gray-300">August 2025 • Digital Magazine</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <span className="text-sm px-2 py-1 bg-white/10 rounded">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <div className="w-px h-6 bg-white/20 mx-2"></div>
                <button
                  onClick={handleRotate}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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