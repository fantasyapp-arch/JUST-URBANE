import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Loader, Zap, Shield, Sparkles, ChevronRight, Award, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import SubscriptionModal from '../components/SubscriptionModal';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('yearly');

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const plans = [
    {
      id: 'digital',
      name: 'Digital Elite',
      shortName: 'Digital',
      price: '₹499',
      originalPrice: '₹999',
      period: 'per year',
      monthlyPrice: '₹42',
      description: 'Perfect for digital natives who love premium content',
      tagline: 'Most Flexible',
      features: [
        'Unlimited premium articles & insights',
        'Ad-free reading experience',
        'Weekly exclusive newsletter',
        'Mobile app with offline reading',
        'Exclusive digital content library',
        'Early access to new features',
        'Premium podcast episodes',
        'Digital magazine archive'
      ],
      buttonText: 'Start Digital Journey',
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
      id: 'combined',
      name: 'Premium Complete',
      shortName: 'Complete',
      price: '₹999',
      originalPrice: '₹1999',
      period: 'per year',
      monthlyPrice: '₹83',
      description: 'The ultimate luxury magazine experience',
      tagline: 'Best Value',
      features: [
        'Everything in Digital Elite',
        'Monthly premium print magazine',
        'Collector\'s edition covers',
        'Exclusive subscriber events access',
        'Priority customer support',
        'Behind-the-scenes content',
        'Special edition magazines',
        'Complimentary gift subscriptions',
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
      savings: 'Save ₹1000'
    },
    {
      id: 'print',
      name: 'Print Luxury',
      shortName: 'Print',
      price: '₹699',
      originalPrice: '₹1299',
      period: 'per year',
      monthlyPrice: '₹58',
      description: 'Classic elegance for print enthusiasts',
      tagline: 'Classic Choice',
      features: [
        'Monthly premium print delivery',
        'Museum-quality paper printing',
        'Collector\'s edition covers',
        'Exclusive print-only content',
        'Free shipping across India',
        'Gift subscription options',
        'Archive access privileges',
        'Vintage cover reprints'
      ],
      buttonText: 'Order Print Edition',
      buttonVariant: 'secondary',
      popular: false,
      packageId: 'print_annual',
      icon: Award,
      gradient: 'from-gray-600 via-gray-700 to-slate-800',
      bgGradient: 'from-gray-50 to-slate-50',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      savings: '46% OFF'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-purple-400/20 to-primary-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Luxury Header Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Trust Indicators */}
          <motion.div 
            className="flex justify-center items-center space-x-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2 text-primary-500" />
              <span className="text-sm font-medium">50,000+ Happy Readers</span>
            </div>
            <div className="flex items-center text-gray-600">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm font-medium">98% Satisfaction Rate</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              <span className="text-sm font-medium">Award Winning Content</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-6xl lg:text-7xl font-serif font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Choose Your Experience
          </motion.h1>
          
          <motion.p 
            className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Join India's most exclusive lifestyle community. Premium content, luxury insights, and unparalleled access to the world of sophistication.
          </motion.p>

          {/* Premium Guarantee Badge */}
          <motion.div
            className="inline-flex items-center mt-8 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-green-700 font-semibold text-sm">7-Day Money Back Guarantee • Cancel Anytime</span>
          </motion.div>
        </motion.div>

        {/* PREMIUM Pricing Cards Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              const isHovered = hoveredPlan === plan.id;
              const isPopular = plan.popular;
              
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  className={`relative group ${isPopular ? 'lg:scale-110 lg:-mt-8' : ''}`}
                  style={{ zIndex: isPopular ? 20 : 10 }}
                >
                  {/* Popular Badge - Redesigned */}
                  {isPopular && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 400 }}
                        className="relative"
                      >
                        <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl border-4 border-white">
                          <div className="flex items-center">
                            <Crown className="h-4 w-4 mr-2 text-yellow-300" />
                            <span>MOST POPULAR</span>
                            <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
                          </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full blur-xl opacity-30 -z-10"></div>
                      </motion.div>
                    </div>
                  )}

                  {/* Card Container */}
                  <motion.div
                    className={`relative bg-white rounded-3xl transition-all duration-500 overflow-hidden h-full flex flex-col ${
                      isPopular ? 'shadow-2xl border-2 border-primary-200' : 'shadow-lg border border-gray-200'
                    }`}
                    animate={{
                      y: isHovered ? -12 : 0,
                      scale: isHovered ? 1.03 : 1,
                      boxShadow: isHovered 
                        ? '0 32px 64px -12px rgba(0, 0, 0, 0.15)' 
                        : isPopular 
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.12)'
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.08)'
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Premium Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Savings Badge */}
                    <div className="absolute top-6 right-6 z-20">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
                      >
                        {plan.savings}
                      </motion.div>
                    </div>

                    <div className="relative z-10 p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <motion.div
                          className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}
                          animate={{ 
                            rotate: isHovered ? [0, 5, -5, 0] : 0,
                            scale: isHovered ? 1.1 : 1
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="h-10 w-10 text-white" />
                        </motion.div>
                        
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 font-medium mb-1">
                          {plan.description}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${plan.textColor} bg-gradient-to-r ${plan.bgGradient}`}>
                          {plan.tagline}
                        </span>
                      </div>

                      {/* Pricing Section */}
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-lg text-gray-500 line-through mr-3">{plan.originalPrice}</span>
                          <motion.span 
                            className="text-5xl font-black text-gray-900"
                            animate={{ 
                              scale: isHovered ? 1.1 : 1,
                              color: isHovered ? plan.textColor.replace('text-', '#') : '#111827'
                            }}
                          >
                            {plan.price}
                          </motion.span>
                        </div>
                        <p className="text-gray-600 text-lg">{plan.period}</p>
                        <p className="text-sm text-gray-500 mt-1">Just {plan.monthlyPrice}/month</p>
                      </div>

                      {/* Features List */}
                      <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Star className={`h-4 w-4 mr-2 ${plan.textColor}`} />
                          What's Included:
                        </h4>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <motion.li 
                              key={featureIndex} 
                              className="flex items-start group/item"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 + featureIndex * 0.05 }}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              </div>
                              <span className="ml-3 text-gray-700 text-sm leading-relaxed group-hover/item:text-gray-900 transition-colors">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={() => handlePlanSelect(plan)}
                        className={`relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden group/btn ${
                          plan.buttonVariant === 'premium'
                            ? 'bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 text-white shadow-lg hover:shadow-2xl'
                            : plan.buttonVariant === 'primary'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl'
                        }`}
                        whileHover={{ 
                          scale: 1.02,
                          y: -2
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Button Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        
                        <span className="relative flex items-center justify-center">
                          {plan.buttonText}
                          <ChevronRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      </motion.button>

                      {/* Trust Elements */}
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          ✓ Secure Payment • ✓ Instant Access • ✓ Cancel Anytime
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Premium Trust Section */}
        <motion.div 
          className="bg-white rounded-3xl p-12 shadow-xl max-w-6xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Why 50,000+ Readers Trust Just Urbane
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join India's most discerning community of lifestyle enthusiasts and industry leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Premium Content",
                description: "Curated by industry experts, our content sets the gold standard for luxury lifestyle journalism.",
                stats: "500+ Premium Articles"
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
                stats: "15+ Industry Awards"
              }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    <FeatureIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-full">
                    <span className="text-primary-700 font-semibold text-sm">{feature.stats}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-6">
            Questions? We're Here to Help
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/faq" className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium transition-colors">
              View FAQ
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
            <Link to="/contact" className="inline-flex items-center px-6 py-3 bg-primary-100 hover:bg-primary-200 rounded-full text-primary-700 font-medium transition-colors">
              Contact Support
              <ChevronRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
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