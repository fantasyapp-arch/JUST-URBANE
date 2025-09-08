import React from 'react';
import { NextGenImage } from './OptimizedImage';
import { X } from 'lucide-react';

const OfferBanner = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          
          {/* Left: Magazine Preview */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden shadow-sm">
              <NextGenImage src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=1080&fit=crop&crop=faces,center&auto=format&q=90"
                alt="Latest Magazine Issue" 
                className="w-full h-full object-cover"
                enableWebP={true} />
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                Limited Time Offer
              </p>
              <p className="text-lg font-bold text-gray-900">
                Get 55% OFF Digital Subscription
              </p>
              <p className="text-sm text-gray-600">
                Access premium content for just ₹999/year
              </p>
            </div>
          </div>

          {/* Right: CTA and Close */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.href = '/pricing'}
              className="bg-red-600 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-colors duration-200"
            >
              SUBSCRIBE NOW
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
              aria-label="Close offer banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;