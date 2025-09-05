import { api } from './api';

// Razorpay Payment Functions
export const createRazorpayOrder = async (packageId, customerDetails) => {
  const response = await api.post('/payments/razorpay/create-order', {
    package_id: packageId,
    customer_details: customerDetails,
    payment_method: 'razorpay'
  });
  return response.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post('/payments/razorpay/verify', paymentData);
  return response.data;
};

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (orderData, customerDetails) => {
  const isScriptLoaded = await loadRazorpayScript();
  
  if (!isScriptLoaded) {
    throw new Error('Failed to load Razorpay script');
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Just Urbane',
      description: orderData.package_name,
      order_id: orderData.order_id,
      prefill: {
        name: customerDetails.full_name,
        email: customerDetails.email,
        contact: customerDetails.phone
      },
      theme: {
        color: '#1f2937'
      },
      handler: async (response) => {
        try {
          const verification = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            package_id: orderData.package_id,
            customer_details: customerDetails
          });
          resolve(verification);
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled'));
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  });
};

// Get payment packages
export const getPaymentPackages = async () => {
  const response = await api.get('/payments/packages');
  return response.data;
};

const paymentApi = {
  // Razorpay methods
  createRazorpayOrder,
  verifyRazorpayPayment,
  loadRazorpayScript,
  initializeRazorpayPayment,
  getPaymentPackages
};

export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default paymentApi;