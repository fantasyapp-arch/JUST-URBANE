import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Download, Calendar, FileText, Maximize } from 'lucide-react';

const MagazineThumbnail = ({ onReadClick, className = "" }) => {
  // Real magazine data
  const magazineData = {
    title: "Just Urbane",
    issue: "August 2025",
    subtitle: "E-Magazine",
    pdfUrl: "https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf",
    pageCount: "Multiple Pages",
    fileSize: "High Resolution PDF",
    format: "A4 Digital Format"
  };

  // A4 aspect ratio for thumbnail (A4 is 1:1.414 ratio)
  const A4_ASPECT_RATIO = 1.414;

  return (
    <div className={`max-w-sm mx-auto ${className}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group cursor-pointer"
        onClick={onReadClick}
      >
        {/* Magazine Cover with A4 Proportions */}
        <div className="relative mb-6">
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500"
            style={{
              aspectRatio: `1 / ${A4_ASPECT_RATIO}`,
              minHeight: '400px'
            }}
          >
            {/* Magazine Cover Design */}
            <div className="absolute inset-0 p-8 text-white flex flex-col justify-between">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <BookOpen className="h-8 w-8 text-amber-400" />
                  <h1 className="text-3xl font-bold tracking-wider">JUST URBANE</h1>
                </div>
                <p className="text-amber-300 text-sm tracking-widest uppercase">Premium Digital Magazine</p>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-light">{magazineData.issue}</p>
                  <p className="text-amber-300 text-sm mt-1">{magazineData.subtitle}</p>
                </div>
              </div>

              {/* Center Content */}
              <div className="text-center space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <h2 className="text-lg font-semibold mb-2">Featured Content</h2>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>• Premium Lifestyle Articles</p>
                    <p>• Fashion & Style Guides</p>
                    <p>• Technology Reviews</p>
                    <p>• Travel Destinations</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-amber-400" />
                      <span>A4 Format</span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-amber-400" />
                      <span>HD Quality</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Click to view digital magazine</p>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 transform group-hover:scale-110 transition-transform duration-300">
                <Maximize className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Quality Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                PDF • A4
              </div>
            </div>

            {/* Resolution Info */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                High Resolution
              </div>
            </div>
          </motion.div>

          {/* 3D Shadow Effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/40 rounded-2xl -z-10 transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300"
            style={{ aspectRatio: `1 / ${A4_ASPECT_RATIO}` }}
          ></div>
        </div>

        {/* Magazine Details */}
        <div className="text-center space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {magazineData.title} • {magazineData.issue}
            </h3>
            <p className="text-gray-600">
              Digital Magazine in A4 format with premium content and high-resolution display
            </p>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Format</span>
              </div>
              <p className="text-gray-600">{magazineData.format}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-900">Issue</span>
              </div>
              <p className="text-gray-600">{magazineData.issue}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReadClick}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              <BookOpen className="inline h-5 w-5 mr-2" />
              Read Magazine
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = magazineData.pdfUrl;
                link.download = 'Just Urbane August 2025 - E-Magazine.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-300"
            >
              <Download className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Technical Specs */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-left">
            <h4 className="font-semibold text-gray-900 mb-3 text-center">Technical Specifications</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium text-gray-900">A4 (210 × 297 mm)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aspect Ratio:</span>
                <span className="font-medium text-gray-900">1:1.414 (A4 Standard)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolution:</span>
                <span className="font-medium text-gray-900">High Definition PDF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium text-gray-900">Digital PDF Magazine</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MagazineThumbnail;