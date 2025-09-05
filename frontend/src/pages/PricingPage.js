import React, { useState } from 'react';
import { Check, Crown, Star, Zap, Sparkles, ChevronRight, Award, Users, TrendingUp, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SubscriptionModal from '../components/SubscriptionModal';
import { createRazorpayOrder, initializeRazorpayPayment, createCheckoutSession, formatPrice } from '../utils/payment';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async (packageId) => {
    setPaymentLoading(`razorpay-${packageId}`);
    try {
      const orderData = await createRazorpayOrder(packageId);
      const result = await initializeRazorpayPayment(orderData);
      
      if (result.status === 'success') {
        alert('Payment successful! Your subscription is now active.');
        // Redirect to success page or refresh user data
        window.location.reload();
      }
    } catch (error) {
      console.error('Razorpay payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(null);
    }
  };

  // Handle Stripe payment
  const handleStripePayment = async (packageId) => {
    setPaymentLoading(`stripe-${packageId}`);
    try {
      const checkoutData = await createCheckoutSession(packageId);
      
      if (checkoutData.checkout_url) {
        window.location.href = checkoutData.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
      setPaymentLoading(null);
    }
  };

  const plans = [
    {
      id: 'digital_annual',
      name: 'Digital Subscription',
      shortName: 'Digital',
      price: '₹499',
      originalPrice: '₹999',
      period: '1 Year',
      monthlyPrice: '₹42',
      description: 'Complete digital access to premium content',
      tagline: 'Digital Only',
      features: [
        'Unlimited premium articles access',
        'Ad-free reading experience',
        'Weekly exclusive newsletter',
        'Mobile app with offline reading',
        'Digital magazine archive',
        'Premium podcast episodes',
        'Early access to new content',
        'Cross-device synchronization'
      ],
      buttonText: 'Get Digital Access',
      buttonVariant: 'primary',
      popular: false,
      packageId: 'digital_annual',
      icon: Zap,
      gradient: 'from-blue-500 via-blue-600 to-indigo-700',
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      savings: '50% OFF'
    },
    {
      id: 'print_annual',
      name: 'Print Subscription',
      shortName: 'Print',
      price: '₹499',
      originalPrice: '₹999',
      period: '1 Year',
      monthlyPrice: '₹42',
      description: 'Physical magazine delivered to your door',
      tagline: 'Print Only',
      features: [
        'Monthly premium print magazine',
        'High-quality paper and printing',
        'Collector\'s edition covers',
        'Exclusive print-only content',
        'Free shipping across India',
        'Gift subscription options',
        'Premium packaging',
        'Vintage cover reprints access'
      ],
      buttonText: 'Get Print Edition',
      buttonVariant: 'secondary',
      popular: false,
      packageId: 'print_annual',
      icon: Award,
      gradient: 'from-gray-600 via-gray-700 to-slate-800',
      bgGradient: 'from-gray-50 to-slate-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      savings: '50% OFF'
    },
    {
      id: 'combined_annual',
      name: 'Print + Digital Subscription',
      shortName: 'Complete',
      price: '₹999',
      originalPrice: '₹1998',
      period: '1 Year',
      monthlyPrice: '₹83',
      description: 'Best value - Get both print and digital access',
      tagline: 'Best Value',
      features: [
        'Everything in Digital Subscription',
        'Everything in Print Subscription',
        'Monthly premium print delivery',
        'Complete digital library access',
        'Exclusive subscriber events',
        'Priority customer support',
        'Behind-the-scenes content',
        'Special edition magazines',
        'VIP community access',
        'Annual luxury gift box'
      ],
      buttonText: 'Get Complete Access',
      buttonVariant: 'premium',
      popular: true,
      packageId: 'combined_annual',
      icon: Crown,
      gradient: 'from-primary-500 via-primary-600 to-purple-700',
      bgGradient: 'from-primary-50 to-purple-50',
      textColor: 'text-primary-600',
      borderColor: 'border-primary-200',
      savings: 'Save ₹999'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-slate-100">
      {/* Premium Background Effects - Simplified and More Professional */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Container with Professional Spacing */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
        {/* Premium Header Section - Redesigned */}
        <div className="text-center mb-16 lg:mb-20">
          {/* Trust Indicators - Refined */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium">50,000+ Readers</span>
            </div>
            <div className="flex items-center text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm font-medium">98% Satisfaction</span>
            </div>
            <div className="flex items-center text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
              <Award className="h-4 w-4 mr-2 text-amber-500" />
              <span className="text-sm font-medium">Award Winning</span>
            </div>
          </motion.div>

          {/* Main Title - Professional Typography */}
          <motion.h1 
            className="text-4xl lg:text-6xl xl:text-7xl font-serif font-bold text-gray-900 mb-6 lg:mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Premium Subscription Plans
          </motion.h1>
          
          {/* Subtitle - Better Spacing */}
          <motion.p 
            className="text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Choose the perfect plan for your lifestyle. Premium content, exclusive insights, and unparalleled access to luxury.
          </motion.p>

          {/* Guarantee Badge - Enhanced */}
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-green-700 font-semibold text-sm">7-Day Money Back Guarantee • Cancel Anytime</span>
          </motion.div>
        </div>

        {/* Premium Pricing Cards - Professionally Aligned */}
        <div className="mb-16 lg:mb-24">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const isHovered = hoveredPlan === plan.id;
              const isPopular = plan.popular;
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`relative ${isPopular ? 'lg:scale-105 lg:-mt-4' : ''}`}
                  style={{ zIndex: isPopular ? 20 : 10 }}
                >
                  {/* Popular Badge - Refined */}
                  {isPopular && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white"
                      >
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 mr-2 text-yellow-300" />
                          <span>MOST POPULAR</span>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Card Container - Enhanced */}
                  <motion.div
                    className={`relative bg-white rounded-2xl lg:rounded-3xl transition-all duration-300 overflow-hidden h-full flex flex-col ${
                      isPopular 
                        ? 'shadow-xl border-2 border-blue-200 ring-1 ring-blue-100' 
                        : 'shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300'
                    }`}
                    animate={{
                      y: isHovered ? -8 : 0,
                      scale: isHovered ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Background Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Savings Badge - Better Positioned */}
                    <div className="absolute top-4 right-4 z-20">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md"
                      >
                        {plan.savings}
                      </motion.div>
                    </div>

                    {/* Card Content - Professional Spacing */}
                    <div className="relative z-10 p-6 lg:p-8 flex-1 flex flex-col">
                      {/* Plan Header - Refined */}
                      <div className="text-center mb-6 lg:mb-8">
                        <motion.div
                          className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
                          animate={{ 
                            rotate: isHovered ? [0, 3, -3, 0] : 0,
                            scale: isHovered ? 1.05 : 1
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <IconComponent className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                        </motion.div>
                        
                        <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 font-medium mb-2 text-sm lg:text-base">
                          {plan.description}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${plan.textColor} bg-gradient-to-r ${plan.bgGradient}`}>
                          {plan.tagline}
                        </span>
                      </div>

                      {/* Pricing Section - Better Typography */}
                      <div className="text-center mb-6 lg:mb-8">
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-base lg:text-lg text-gray-400 line-through mr-3">{plan.originalPrice}</span>
                          <motion.span 
                            className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900"
                            animate={{ 
                              scale: isHovered ? 1.05 : 1,
                              color: isHovered ? (plan.id === 'combined' ? '#2563eb' : '#111827') : '#111827'
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {plan.price}
                          </motion.span>
                        </div>
                        <p className="text-gray-600 text-base lg:text-lg font-medium">{plan.period}</p>
                        <p className="text-sm text-gray-500 mt-1">Just {plan.monthlyPrice}/month</p>
                      </div>

                      {/* Features List - Enhanced */}
                      <div className="mb-6 lg:mb-8 flex-1">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-sm lg:text-base">
                          <Star className={`h-4 w-4 mr-2 ${plan.textColor}`} />
                          What's Included:
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.slice(0, 8).map((feature, featureIndex) => (
                            <motion.li 
                              key={featureIndex} 
                              className="flex items-start"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 + featureIndex * 0.03 }}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                  <Check className="h-2.5 w-2.5 text-white" />
                                </div>
                              </div>
                              <span className="ml-3 text-gray-700 text-sm leading-relaxed">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button - Professional Design */}
                      <div className="mt-auto">
                        <motion.button
                          onClick={() => handlePlanSelect(plan)}
                          className={`relative w-full py-3 lg:py-4 px-6 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg transition-all duration-300 overflow-hidden ${
                            plan.buttonVariant === 'premium'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700'
                              : plan.buttonVariant === 'primary'
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800'
                              : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black'
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative flex items-center justify-center">
                            {plan.buttonText}
                            <ChevronRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                          </span>
                        </motion.button>

                        {/* Trust Elements */}
                        <div className="mt-3 lg:mt-4 text-center">
                          <p className="text-xs text-gray-500">
                            ✓ Secure Payment • ✓ Instant Access • ✓ Cancel Anytime
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Premium Trust Section - Simplified */}
        <motion.div 
          className="bg-white/70 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-200/50 max-w-5xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-gray-900 mb-4">
              Trusted by 50,000+ Readers
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join India's most discerning community of lifestyle enthusiasts and industry leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Star,
                title: "Premium Content",
                description: "Curated by industry experts, our content sets the gold standard for luxury lifestyle journalism.",
                stats: "500+ Articles"
              },
              {
                icon: Users,
                title: "Exclusive Community", 
                description: "Connect with like-minded individuals who appreciate the finer things in life.",
                stats: "50,000+ Members"
              },
              {
                icon: Award,
                title: "Award Winning",
                description: "Recognized globally for excellence in digital publishing and content curation.",
                stats: "15+ Awards"
              }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl lg:rounded-2xl flex items-center justify-center">
                    <FeatureIcon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg lg:text-xl font-serif font-semibold mb-2 lg:mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 leading-relaxed text-sm lg:text-base">
                    {feature.description}
                  </p>

                  <div className="inline-block px-3 py-1 lg:px-4 lg:py-2 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-full">
                    <span className="text-blue-700 font-semibold text-xs lg:text-sm">{feature.stats}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section - Simplified */}
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h3 className="text-xl lg:text-2xl font-serif font-semibold text-gray-900 mb-6">
            Questions? We're Here to Help
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
            >
              Contact Support
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
            <Link 
              to="/terms" 
              className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              Terms & FAQ
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Subscription Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default PricingPage;