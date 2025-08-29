import React, { useState } from 'react';
import { X, CreditCard, MapPin, Phone, Mail, Loader, User, Crown, CheckCircle } from 'lucide-react';
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
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
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
          {/* Premium Header with Gradient and Animation */}
          <motion.div 
            className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-blue-600 text-white p-8 overflow-hidden"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"
                animate={{
                  x: [0, -50, 0],
                  y: [0, -30, 0],
                  scale: [1, 0.8, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Crown className="h-10 w-10 text-yellow-300 mr-4 drop-shadow-lg" />
                </motion.div>
                <div>
                  <motion.h2 
                    className="text-4xl font-serif font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Subscribe to {selectedPlan.name}
                  </motion.h2>
                  <motion.p 
                    className="text-primary-100 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {selectedPlan.description}
                  </motion.p>
                </div>
              </motion.div>
              
              <motion.button
                onClick={onClose}
                className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <X className="h-6 w-6 text-white group-hover:text-gray-200" />
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-10">
              
              {/* Left Side - Plan Details */}
              <div>
                {/* Plan Summary */}
                <div className="bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-serif font-bold">{selectedPlan.name}</h3>
                      <p className="text-primary-100 mt-2">{selectedPlan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black">{selectedPlan.price}</div>
                      <div className="text-primary-200">{selectedPlan.period}</div>
                    </div>
                  </div>
                  
                  {selectedPlan.savings && (
                    <div className="bg-green-500 bg-opacity-20 border border-green-300 rounded-lg p-3 mb-6">
                      <p className="text-green-100 font-bold text-center">{selectedPlan.savings}</p>
                    </div>
                  )}

                  {/* Features */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 text-primary-100">What's included:</h4>
                    <ul className="space-y-3">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" />
                          <span className="text-primary-50">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Delivery Notice */}
                {requiresAddress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center">
                      <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                      <div>
                        <p className="font-bold text-blue-900 text-lg">Print Magazine Delivery</p>
                        <p className="text-blue-700">We'll deliver your magazine to the address provided below.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - User Details Form */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center">
                  <User className="h-6 w-6 mr-3 text-primary-600" />
                  Your Details
                </h3>

                {/* Account Information */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={userDetails.full_name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={userDetails.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Address Information (for print subscriptions) */}
                {requiresAddress && (
                  <div className="space-y-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                    <h4 className="text-xl font-bold text-gray-900 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary-600" />
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscribe Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-6 w-6 animate-spin mr-3" />
                      Processing Subscription...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-6 w-6 mr-3" />
                      Subscribe & Pay {selectedPlan.price}
                    </>
                  )}
                </button>

                {/* Auto Account Notice */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium">
                      Your account will be automatically created with these details
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <p className="text-center text-sm text-gray-500 mt-4">
                  Secure payment powered by Stripe. Your data is encrypted and protected.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;