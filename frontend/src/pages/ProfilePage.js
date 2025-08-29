import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Setting up your account...');

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          setStatus('error');
          setMessage('No session ID found. Please try signing in again.');
          return;
        }

        const response = await api.post('/auth/google-callback', null, {
          params: { session_id: sessionId }
        });

        if (response.data.success) {
          setStatus('success');
          setMessage('Account setup complete!');
          setUser(response.data.user);
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
        }

      } catch (error) {
        console.error('Google auth error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
      }
    };

    handleGoogleAuth();
  }, [navigate, setUser]);

  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <User className="h-16 w-16 text-red-500" />;
      default:
        return <Loader className="h-16 w-16 text-primary-500 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <img 
            src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
            alt="JUST URBANE" 
            className="h-20 w-auto object-contain mx-auto"
          />
        </div>

        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {getIcon()}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            {status === 'success' ? 'Welcome to Just Urbane!' : 
             status === 'error' ? 'Authentication Error' : 
             'Setting Up Your Account'}
          </h1>
          <p className="text-gray-600 mb-8">{message}</p>

          {status === 'error' && (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Try Again
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;