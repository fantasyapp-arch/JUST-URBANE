import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import parseMagazineContent from './MagazineContentParser';

const MagazineReader = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  // Load magazine pages immediately
  useEffect(() => {
    const magazinePages = parseMagazineContent();
    setPages(magazinePages);
    
    // Preload all images for instant page turns
    magazinePages.forEach((page, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => new Set([...prev, index]));
      };
      img.src = page.pageImage;
    });
  }, []);

  // Keyboard navigation for instant response
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextPage();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentPage]);

  // Instant page navigation
  const nextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, pages.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextPage(); // Swipe left = next page
      } else {
        prevPage(); // Swipe right = prev page
      }
    }
    setTouchStart(null);
  };

  if (!isOpen || pages.length === 0) return null;

  const currentPageData = pages[currentPage];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Header with minimal controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="text-lg font-bold">JUST URBANE</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main magazine display - optimized for speed */}
      <div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous page click area */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-w-resize"
          onClick={prevPage}
        />
        
        {/* Next page click area */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-e-resize"
          onClick={nextPage}
        />

        {/* Magazine page - instant display */}
        <div className="relative max-w-4xl max-h-full mx-4 my-16">
          <img
            src={currentPageData.pageImage}
            alt={currentPageData.title}
            className="w-full h-auto shadow-2xl rounded-lg"
            style={{
              aspectRatio: '2622/3236', // Your custom dimensions
              objectFit: 'contain',
              maxHeight: '90vh'
            }}
            loading="eager" // Force immediate loading
            decoding="sync" // Synchronous decoding for instant display
          />
          
          {/* Page loading indicator only for unloaded images */}
          {!imagesLoaded.has(currentPage) && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Loading page {currentPage + 1}...</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows - always visible for instant access */}
      {currentPage > 0 && (
        <button
          onClick={prevPage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      
      {currentPage < pages.length - 1 && (
        <button
          onClick={nextPage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Bottom page indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10">
        Page {currentPage + 1} of {pages.length}
      </div>

      {/* Page dots indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentPage ? 'bg-amber-400' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MagazineReader;