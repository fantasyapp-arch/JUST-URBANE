import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ZoomIn, ZoomOut, RotateCw, Download, Maximize, Minimize,
  Share2, Printer, BookOpen
} from 'lucide-react';

const DigitalMagazineViewer = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef();

  // Real magazine PDF URL provided by user
  const magazinePdfUrl = "https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf";
  
  // A4 dimensions in pixels (at 300 DPI for high quality display)
  const A4_WIDTH = 595; // A4 width in points (approximately 8.27 inches)
  const A4_HEIGHT = 842; // A4 height in points (approximately 11.69 inches)
  
  // Calculate display dimensions (scaled for web display)
  const DISPLAY_WIDTH = 600;
  const DISPLAY_HEIGHT = Math.round((A4_HEIGHT / A4_WIDTH) * DISPLAY_WIDTH); // ~849px

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
    link.download = 'Just Urbane August 2025 - E-Magazine.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/95 z-50 overflow-hidden ${
          isFullscreen ? 'z-[100]' : ''
        }`}
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
                    onClick={onClose}
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

        {/* Magazine Display Area */}
        <div 
          ref={containerRef}
          className="flex items-center justify-center h-full p-4 pt-20 pb-16"
          onClick={toggleControls}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white shadow-2xl"
            style={{
              width: DISPLAY_WIDTH * zoom,
              height: DISPLAY_HEIGHT * zoom,
              transform: `rotate(${rotation}deg)`,
              maxWidth: '95vw',
              maxHeight: '95vh'
            }}
          >
            {/* PDF Embed with A4 Proportions */}
            <iframe
              src={`${magazinePdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="w-full h-full border-0 rounded-lg"
              title="Just Urbane August 2025 Digital Magazine"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))'
              }}
            />
            
            {/* Magazine Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <span>A4 • {DISPLAY_WIDTH}×{DISPLAY_HEIGHT}px • PDF</span>
              </div>
            </div>

            {/* Resolution Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
              High Resolution
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
                    <span>Premium Content</span>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Print"
                    >
                      <Print className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300" id="pdf-loading">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center text-white">
            <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading Digital Magazine...</p>
            <p className="text-sm text-gray-300 mt-2">Preparing A4 resolution display</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DigitalMagazineViewer;