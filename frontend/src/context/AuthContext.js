import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Fetch user data from /me endpoint
  const fetchUserData = async () => {
    if (!token) return null;
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // Update token and refresh user data (for payment success)
  const updateTokenAndUser = async (newToken) => {
    console.log('🔑 Updating token and user data...');
    
    // Store new token
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    // Fetch fresh user data with new token
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      console.log('✅ Fresh user data loaded:', userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('❌ Failed to fetch fresh user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch full user data
        const userData = await fetchUserData();
        if (userData) {
          setUser(userData);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      const { access_token, user: userData } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Set user with full data from login response
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      const { access_token, user: newUser } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Set user with full data from registration response
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};