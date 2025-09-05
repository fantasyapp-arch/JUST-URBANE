import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Zap, Sparkles, ChevronRight, Award, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import { getPaymentPackages, formatPrice } from '../utils/payment';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getPaymentPackages();
      setPackages(data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (result) => {
    // Handle successful payment
    console.log('Payment successful:', result);
    // You can redirect to success page or refresh user data here
  };

  const plans = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    originalPrice: pkg.price + 500, // Show discount
    duration: "1 Year",
    monthlyPrice: Math.round(pkg.price / 12),
    features: pkg.features,
    popular: pkg.popular,
    color: pkg.id === 'print_annual' ? 'emerald' : pkg.popular ? 'blue' : 'indigo',
    description: getPackageDescription(pkg.id),
    badge: pkg.popular ? 'Most Popular' : pkg.id === 'combined_annual' ? 'Best Value' : null
  }));

  function getPackageDescription(packageId) {
    switch (packageId) {
      case 'digital_annual':
        return 'Complete digital access to premium content';
      case 'print_annual':
        return 'Monthly premium print magazine delivery';
      case 'combined_annual':
        return 'Everything in Digital & Print Subscription';
      default:
        return 'Premium subscription package';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 z-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Subscription</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Unlock exclusive content, premium articles, and luxury lifestyle insights with our carefully curated subscription plans.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center items-center gap-8 mb-16 lg:mb-24"
            >
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-6 py-3">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-800 font-medium">50,000+ Subscribers</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-6 py-3">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-800 font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-6 py-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-800 font-medium">Weekly Updates</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="relative -mt-16 lg:-mt-24 max-w-7xl mx-auto px-6 lg:px-8 pb-16 lg:pb-24 z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-blue-500 lg:scale-105' : ''
              } z-40`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold text-white ${
                  plan.popular ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center ${
                    plan.id === 'digital_annual' ? 'from-blue-500 to-blue-600' :
                    plan.id === 'print_annual' ? 'from-emerald-500 to-emerald-600' :
                    'from-indigo-500 to-indigo-600'
                  }`}>
                    {plan.id === 'digital_annual' && <Zap className="w-8 h-8 text-white" />}
                    {plan.id === 'print_annual' && <Star className="w-8 h-8 text-white" />}
                    {plan.id === 'combined_annual' && <Crown className="w-8 h-8 text-white" />}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-gray-400 line-through text-lg mr-2">₹{plan.originalPrice}</span>
                    <span className="text-4xl lg:text-5xl font-bold text-gray-900">₹{plan.price}</span>
                  </div>
                  <p className="text-gray-600">{plan.duration}</p>
                  <p className="text-sm text-gray-500">Just ₹{plan.monthlyPrice}/month</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    What's Included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.slice(0, 8).map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center group ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl' 
                      : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700'
                  }`}
                >
                  Select Plan
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    ✓ Secure Payment • ✓ Instant Access • ✓ Cancel Anytime
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 lg:mt-24 text-center z-30 relative"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Why Choose Just Urbane?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Award-Winning Content</h3>
              <p className="text-gray-600">Curated by industry experts and recognized professionals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Exclusive Access</h3>
              <p className="text-gray-600">Premium interviews, behind-the-scenes content, and VIP events</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Fresh</h3>
              <p className="text-gray-600">Weekly updates with the latest trends and lifestyle insights</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center z-30 relative"
        >
          <p className="text-gray-600 mb-4">Have questions about our subscription plans?</p>
          <Link 
            to="/contact" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            Contact Support
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>
      </div>

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PricingPage;