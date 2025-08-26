import api from './api';

// Payment API functions
const paymentApi = {
  async getSubscriptionPackages() {
    try {
      const response = await api.get('/payments/packages');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription packages:', error);
      throw error;
    }
  }
};

// Initiate payment function
export const initiatePayment = async (packageId) => {
  try {
    const response = await api.post('/payments/create-session', {
      package_id: packageId
    });
    
    if (response.data.checkout_url) {
      window.location.href = response.data.checkout_url;
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
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