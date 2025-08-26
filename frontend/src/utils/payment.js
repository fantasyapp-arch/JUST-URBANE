import { api } from './api';

// Payment utility functions
export const paymentApi = {
  createCheckout: async (packageId) => {
    try {
      const originUrl = window.location.origin;
      
      const response = await api.post('/payments/create-checkout', {
        package_id: packageId,
        origin_url: originUrl
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create payment session');
    }
  },

  getPaymentStatus: async (sessionId) => {
    try {
      const response = await api.get(`/payments/status/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get payment status');
    }
  },

  getSubscriptionPackages: async () => {
    try {
      const response = await api.get('/payments/packages');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get subscription packages');
    }
  }
};

// Helper function to initiate payment
export const initiatePayment = async (packageId) => {
  try {
    const checkoutData = await paymentApi.createCheckout(packageId);
    
    if (checkoutData.checkout_url) {
      // Redirect to Stripe checkout
      window.location.href = checkoutData.checkout_url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

// Format Indian currency
export const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default paymentApi;