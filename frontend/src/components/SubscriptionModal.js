import React, { useState } from 'react';
import { X, CreditCard, MapPin, Phone, Mail, Loader, User, Crown, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const SubscriptionModal = ({ isOpen, onClose, selectedPlan }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    // Account details
    full_name: '',
    email: '',
    phone_number: '',
    
    // Address details (for print subscriptions)
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  const requiresAddress = selectedPlan?.id === 'print' || selectedPlan?.id === 'combined';

  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Basic validation
    const requiredFields = ['full_name', 'email', 'phone_number'];
    
    // Add address fields for print subscriptions
    if (requiresAddress) {
      requiredFields.push('address_line_1', 'city', 'state', 'postal_code');
    }

    for (let field of requiredFields) {
      if (!userDetails[field].trim()) {
        toast.error(`${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubscribe = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Create subscription with user details and automatic account creation
      const subscriptionData = {
        package_id: selectedPlan.packageId,
        user_details: userDetails,
        create_account: true  // Flag for automatic account creation
      };

      const response = await api.post('/payments/create-smart-subscription', subscriptionData);
      
      if (response.data.checkout_url) {
        // Store user details for post-payment account creation
        localStorage.setItem('subscription_user_details', JSON.stringify(userDetails));
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to process subscription');
      setIsLoading(false);
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          transition={{ 
            duration: 0.5, 
            type: "spring", 
            stiffness: 300,
            damping: 25
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* PREMIUM Header with Elegant Design */}
          <motion.div 
            className="relative bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 text-white p-8 overflow-hidden"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            {/* Elegant Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-3xl"
                animate={{
                  x: [0, 80, 0],
                  y: [0, 40, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-rose-400 to-pink-500 rounded-full blur-3xl"
                animate={{
                  x: [0, -60, 0],
                  y: [0, -30, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            {/* Floating Luxury Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * 400,
                    y: Math.random() * 200,
                    opacity: 0
                  }}
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3
                  }}
                >
                  <Sparkles className="h-3 w-3 text-amber-300" />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  className="relative"
                  animate={{ 
                    rotate: [0, 8, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg mr-4">
                    <Crown className="h-7 w-7 text-slate-800" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full animate-pulse"></div>
                </motion.div>
                <div>
                  <motion.h2 
                    className="text-4xl font-serif font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Complete Your Subscription
                  </motion.h2>
                  <motion.p 
                    className="text-gray-300 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {selectedPlan.name} - {selectedPlan.price} / {selectedPlan.period}
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <X className="h-6 w-6 text-gray-300 group-hover:text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* Content with Premium Design */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-slate-50">
            <div className="grid lg:grid-cols-2 gap-10">
              
              {/* Left Side - Plan Summary */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Elegant Plan Card */}
                <motion.div 
                  className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-lg relative overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-400 to-yellow-500 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 15, 0],
                        y: [0, 10, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <motion.h3 
                          className="text-2xl font-serif font-bold text-gray-900 mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {selectedPlan.name}
                        </motion.h3>
                        <motion.p 
                          className="text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {selectedPlan.description}
                        </motion.p>
                      </div>
                      <motion.div 
                        className="text-right"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                      >
                        <div className="text-4xl font-black text-gray-900">{selectedPlan.price}</div>
                        <div className="text-gray-600">{selectedPlan.period}</div>
                      </motion.div>
                    </div>
                    
                    {selectedPlan.savings && (
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-emerald-700 font-bold text-center flex items-center justify-center">
                          <Sparkles className="h-4 w-4 mr-2 text-emerald-600" />
                          {selectedPlan.savings}
                        </p>
                      </motion.div>
                    )}

                    {/* Features */}
                    <div>
                      <motion.h4 
                        className="font-bold text-lg mb-4 text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        What's included:
                      </motion.h4>
                      <motion.ul className="space-y-3">
                        {selectedPlan.features.map((feature, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-center"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                            </motion.div>
                            <span className="text-gray-700">{feature}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Notice */}
                {requiresAddress && (
                  <motion.div 
                    className="bg-amber-50 border border-amber-200 rounded-xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{ 
                          rotate: [0, 8, -8, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <MapPin className="h-6 w-6 text-amber-600 mr-3" />
                      </motion.div>
                      <div>
                        <p className="font-bold text-amber-900 text-lg">Print Magazine Delivery</p>
                        <p className="text-amber-700">We'll deliver your magazine to the address provided below.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Right Side - User Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.h3 
                  className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <User className="h-6 w-6 mr-3 text-gray-600" />
                  Your Details
                </motion.h3>

                {/* Account Information */}
                <motion.div 
                  className="space-y-6 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Mail className="h-4 w-4 inline mr-2 text-gray-600" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                      placeholder="your@email.com"
                      required
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <User className="h-4 w-4 inline mr-2 text-gray-600" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={userDetails.full_name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                      placeholder="Enter your full name"
                      required
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Phone className="h-4 w-4 inline mr-2 text-gray-600" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={userDetails.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </motion.div>
                </motion.div>

                {/* Address Information */}
                {requiresAddress && (
                  <motion.div 
                    className="space-y-6 mb-8 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <h4 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                      <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                      Delivery Address
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 1 *</label>
                        <input
                          type="text"
                          name="address_line_1"
                          value={userDetails.address_line_1}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                          placeholder="House/Flat number, Street name"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 2</label>
                        <input
                          type="text"
                          name="address_line_2"
                          value={userDetails.address_line_2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={userDetails.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                          placeholder="Enter city"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={userDetails.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                          placeholder="Enter state"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code *</label>
                        <input
                          type="text"
                          name="postal_code"
                          value={userDetails.postal_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Premium Subscribe Button */}
                <motion.button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-gray-800 via-slate-800 to-gray-900 hover:from-gray-900 hover:via-slate-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 transform shadow-xl relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  {/* Button Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full"
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  
                  <div className="flex items-center justify-center relative z-10">
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="h-6 w-6 mr-3" />
                        </motion.div>
                        Processing Subscription...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-6 w-6 mr-3" />
                        Subscribe & Pay {selectedPlan.price}
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Trust Notice */}
                <motion.div 
                  className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                    </motion.div>
                    <p className="text-emerald-800 font-medium">
                      Your account will be automatically created with these details
                    </p>
                  </div>
                </motion.div>

                {/* Security Notice */}
                <motion.p 
                  className="text-center text-sm text-gray-500 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  🔒 Secure payment powered by Stripe. Your data is encrypted and protected.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;