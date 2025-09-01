import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const OfferBanner = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <motion.div 
      className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 relative overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="flex space-x-8 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-1 h-full bg-white transform rotate-12"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center justify-between">
          
          {/* Magazine Images */}
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=200&q=80"
                alt="Magazine 1" 
                className="w-12 h-16 object-cover rounded shadow-lg border-2 border-white"
              />
              <img 
                src="https://images.unsplash.com/photo-1595827508351-ea1686636546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=200&q=80"
                alt="Magazine 2" 
                className="w-12 h-16 object-cover rounded shadow-lg border-2 border-white"
              />
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=200&q=80"
                alt="Magazine 3" 
                className="w-12 h-16 object-cover rounded shadow-lg border-2 border-white"
              />
            </div>
          </div>

          {/* Offer Text */}
          <div className="flex-1 mx-6">
            <div className="text-center">
              <span className="text-yellow-300 font-bold text-sm uppercase tracking-wider">
                Limited Time Offer! 
              </span>
              <span className="text-white font-semibold text-sm ml-2">
                Flat 55% OFF on Premium Digital Magazine Subscription. Save ₹2,500!
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-black text-white px-6 py-2 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors duration-200 shadow-lg"
            >
              BUY NOW!
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-300 transition-colors duration-200 p-1"
              aria-label="Close offer banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OfferBanner;