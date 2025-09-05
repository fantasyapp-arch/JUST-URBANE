import React, { useState } from 'react';
import { X, CreditCard, MapPin, User, Mail, Phone, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRazorpayOrder, initializeRazorpayPayment } from '../utils/payment';

const CustomerDetailsModal = ({ isOpen, onClose, selectedPlan, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const { updateTokenAndUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
    confirm_password: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const requiresAddress = selectedPlan && ['print_annual', 'combined_annual'].includes(selectedPlan.id);

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation for all plans
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.confirm_password.trim()) newErrors.confirm_password = 'Please confirm your password';
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    // Address validation for print subscriptions
    if (requiresAddress) {
      if (!formData.address_line_1.trim()) newErrors.address_line_1 = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Creating Razorpay order with data:', {
        packageId: selectedPlan.id,
        customerDetails: {
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          password: '***hidden***', // Don't log password
          ...formData
        }
      });
      
      // Create Razorpay order
      const orderData = await createRazorpayOrder(selectedPlan.id, formData);
      console.log('Order created successfully:', orderData);
      
      // Initialize Razorpay payment
      console.log('Initializing Razorpay payment...');
      const result = await initializeRazorpayPayment(orderData, formData);
      
      if (result.status === 'success') {
        console.log('🎉 Payment successful, result:', result);
        
        // Handle auto-login after payment
        if (result.access_token) {
          console.log('🔑 Updating token and user data...');
          
          // Update token and refresh user data
          await updateTokenAndUser(result.access_token);
          
          console.log('✅ User authenticated and updated');
        }
        
        onPaymentSuccess(result);
        onClose();
        
        // Show success message
        alert('Payment successful! Your subscription is now active.');
        
        // Redirect to magazine page if user has digital access
        if (result.has_digital_access) {
          console.log('📖 Redirecting to magazine page...');
          setTimeout(() => {
            navigate('/issues');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Payment error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Please login first to complete the payment.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complete Your Subscription</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedPlan.name} - ₹{selectedPlan.price}/year
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.full_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Create a password"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information - Only for print subscriptions */}
                {requiresAddress && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Delivery Address
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          name="address_line_1"
                          value={formData.address_line_1}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.address_line_1 ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Street address, apartment, suite, etc."
                        />
                        {errors.address_line_1 && (
                          <p className="text-red-500 text-sm mt-1">{errors.address_line_1}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="address_line_2"
                          value={formData.address_line_2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Landmark, building name (optional)"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter city"
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.state ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter state"
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.postal_code ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter postal code"
                          />
                          {errors.postal_code && (
                            <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-3" />
                        Pay Now ₹{selectedPlan.price}
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Secure payment powered by Razorpay
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomerDetailsModal;