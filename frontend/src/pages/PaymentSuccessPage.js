import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Crown, ArrowRight, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const checkPaymentStatus = async () => {
    const maxAttempts = 5;
    const pollInterval = 2000; // 2 seconds

    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      setError('Payment verification timed out. Please check your account or contact support.');
      return;
    }

    try {
      const response = await api.get(`/payments/status/${sessionId}`);
      const data = response.data;
      
      setPaymentData(data);
      
      if (data.payment_status === 'paid') {
        setPaymentStatus('success');
        return;
      } else if (data.status === 'expired') {
        setPaymentStatus('expired');
        setError('Payment session expired. Please try again.');
        return;
      } else if (data.payment_status === 'failed') {
        setPaymentStatus('failed');
        setError('Payment failed. Your card was not charged.');
        return;
      }

      // If payment is still pending, continue polling
      setAttempts(prev => prev + 1);
      setTimeout(() => checkPaymentStatus(), pollInterval);
      
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
      setError('Unable to verify payment status. Please contact support if you were charged.');
    }
  };

  useEffect(() => {
    if (!sessionId) {
      navigate('/pricing');
      return;
    }
    
    checkPaymentStatus();
  }, [sessionId, navigate]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'failed':
      case 'expired':
      case 'error':
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      case 'timeout':
        return <RefreshCw className="h-16 w-16 text-orange-500" />;
      default:
        return <Loader className="h-16 w-16 text-blue-500 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'expired':
        return 'Session Expired';
      case 'error':
        return 'Verification Error';
      case 'timeout':
        return 'Verification Timeout';
      default:
        return 'Verifying Payment...';
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Welcome to Urbane Premium! Your subscription is now active and you have full access to all premium content.';
      case 'failed':
        return 'Your payment could not be processed. No charges were made to your card.';
      case 'expired':
        return 'Your payment session has expired. Please return to pricing page to try again.';
      case 'error':
        return 'We encountered an error while verifying your payment. If you were charged, please contact support.';
      case 'timeout':
        return 'Payment verification is taking longer than expected. Your payment may still be processing.';
      default:
        return 'Please wait while we verify your payment with our secure payment processor.';
    }
  };

  const formatAmount = (amount, currency) => {
    if (currency === 'inr') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount / 100); // Stripe amounts are in paise
    }
    return amount;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Status Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {getStatusIcon()}
          </motion.div>

          {/* Status Title */}
          <motion.h1
            className="text-4xl font-serif font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getStatusTitle()}
          </motion.h1>

          {/* Status Message */}
          <motion.p
            className="text-lg text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {getStatusMessage()}
          </motion.p>

          {/* Payment Details */}
          {paymentData && paymentStatus === 'success' && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-lg font-semibold text-green-800">
                  Premium Subscription Activated
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p className="text-green-700">
                    <strong>Package:</strong> {paymentData.metadata?.package_name || 'Premium'}
                  </p>
                  {paymentData.amount && (
                    <p className="text-green-700">
                      <strong>Amount:</strong> {formatAmount(paymentData.amount, paymentData.currency)}
                    </p>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-green-700">
                    <strong>Session ID:</strong> {sessionId.substring(0, 20)}...
                  </p>
                  <p className="text-green-700">
                    <strong>Status:</strong> {paymentData.payment_status}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Details */}
          {error && paymentStatus !== 'success' && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-red-700 font-medium">
                {error}
              </p>
              {sessionId && (
                <p className="text-red-600 text-sm mt-2">
                  Session ID: {sessionId}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {paymentStatus === 'success' && (
              <>
                <Link
                  to="/account"
                  className="btn-primary flex items-center justify-center"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Link>
                <Link
                  to="/"
                  className="btn-secondary flex items-center justify-center"
                >
                  Start Reading
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </>
            )}

            {paymentStatus === 'checking' && (
              <div className="flex items-center justify-center text-gray-600">
                <Loader className="h-5 w-5 animate-spin mr-2" />
                <span>Verifying payment... (Attempt {attempts + 1}/5)</span>
              </div>
            )}

            {(paymentStatus === 'failed' || paymentStatus === 'expired' || paymentStatus === 'error') && (
              <>
                <Link
                  to="/pricing"
                  className="btn-primary"
                >
                  Try Again
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary"
                >
                  Contact Support
                </Link>
              </>
            )}

            {paymentStatus === 'timeout' && (
              <>
                <button
                  onClick={() => {
                    setAttempts(0);
                    setPaymentStatus('checking');
                    checkPaymentStatus();
                  }}
                  className="btn-primary flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Again
                </button>
                <Link
                  to="/account"
                  className="btn-secondary"
                >
                  Check Account
                </Link>
              </>
            )}
          </motion.div>

          {/* Additional Help */}
          {paymentStatus === 'success' && (
            <motion.div
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What's Next?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Read Premium Articles</p>
                  <p className="text-gray-600">Access unlimited premium content</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📧</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Weekly Newsletter</p>
                  <p className="text-gray-600">Receive curated content weekly</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-1">Ad-Free Experience</p>
                  <p className="text-gray-600">Enjoy uninterrupted reading</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-gray-500">
              Questions? <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact our support team</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;