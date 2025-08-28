import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Lock, ArrowRight, Star, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumContentGate = ({ article, showPreview = true }) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Content Preview (if enabled) */}
      {showPreview && (
        <div className="mb-8">
          <div className="prose prose-lg max-w-none">
            {article.body && (
              <div className="relative">
                {/* Show limited content */}
                <div className="text-gray-700 leading-relaxed text-lg">
                  {article.body.slice(0, 300)}...
                </div>
                
                {/* Fade overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Gate */}
      <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 border-2 border-primary-200 rounded-2xl p-8 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10">
          {/* Premium Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Crown className="h-5 w-5 mr-2" />
            Premium Article
            <Lock className="h-4 w-4 ml-2" />
          </div>

          <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Continue Reading with Premium Access
          </h3>
          
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get unlimited access to in-depth articles, expert insights, and exclusive content from India's leading lifestyle magazine.
          </p>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Articles</h4>
              <p className="text-sm text-gray-600">Access to all premium content and exclusive stories</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Ad-Free Experience</h4>
              <p className="text-sm text-gray-600">Enjoy uninterrupted reading without advertisements</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Exclusive Content</h4>
              <p className="text-sm text-gray-600">Premium interviews, behind-the-scenes, and digital magazine</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link 
              to="/pricing" 
              className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Crown className="h-5 w-5 mr-2" />
              Subscribe Now
            </Link>
            
            <Link 
              to="/login" 
              className="bg-white border-2 border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300 font-semibold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>

          {/* Pricing Preview */}
          <div className="mt-6 text-sm text-gray-600">
            <p>Starting at <span className="font-bold text-primary-600">₹499/year</span> • Cancel anytime</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumContentGate;