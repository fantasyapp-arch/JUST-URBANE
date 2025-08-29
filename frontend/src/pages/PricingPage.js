import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Loader, Zap, Shield, Sparkles } from 'lucide-react';
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

  const handlePlanSelect = (plan) => {
    // SMART SYSTEM - NO LOGIN REQUIRED, DIRECT SUBSCRIPTION
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  const plans = [
    {
      id: 'digital',
      name: 'Digital Subscription',
      price: '₹499',
      period: 'per year',
      description: 'Complete digital access to premium content',
      features: [
        'Unlimited premium articles',
        'Ad-free reading experience',
        'Weekly premium newsletter',
        'Mobile app access',
        'Exclusive digital content',
        'Early access to new features'
      ],
      buttonText: 'Get Digital Access',
      buttonVariant: 'primary',
      popular: false,
      packageId: 'digital_annual',
      icon: Zap,
      gradient: 'from-blue-500 to-primary-600',
      accentColor: 'blue'
    },
    {
      id: 'print',
      name: 'Print Subscription',
      price: '₹499',
      period: 'per year',
      description: 'Physical magazine delivered to your door',
      features: [
        'Monthly print magazine delivery',
        'Premium paper quality',
        'Collector\'s edition covers',
        'Exclusive print content',
        'Free shipping across India',
        'Gift subscription options'
      ],
      buttonText: 'Get Print Edition',
      buttonVariant: 'secondary',
      popular: false,
      packageId: 'print_annual',
      icon: Shield,
      gradient: 'from-gray-600 to-gray-800',
      accentColor: 'gray'
    },
    {
      id: 'combined',
      name: 'Print + Digital',
      price: '₹999',
      period: 'per year',
      description: 'Complete premium experience with best value',
      features: [
        'Everything in Digital',
        'Everything in Print',
        'Exclusive subscriber events',
        'Priority customer support',
        'Behind-the-scenes content',
        'Special edition magazines'
      ],
      buttonText: 'Best Value',
      buttonVariant: 'premium',
      popular: true,
      packageId: 'combined_annual',
      savings: 'Save ₹499',
      icon: Crown,
      gradient: 'from-primary-500 to-primary-700',
      accentColor: 'primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-400 to-primary-500 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header with Motion */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose Your Plan
          </motion.h1>
          
          <motion.p 
            className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Access premium lifestyle content, exclusive articles, and luxury insights
          </motion.p>
          
          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Premium Pricing Cards with GQ-Style Motion Effects */}
        <div className="mt-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isHovered = hoveredPlan === plan.id;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative group cursor-pointer ${plan.popular ? 'md:scale-105 pt-8' : 'pt-4'}`}
              >
                {/* Premium Glow Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                
                {/* Main Card */}
                <motion.div
                  className={`relative bg-white rounded-3xl shadow-lg transition-all duration-500 overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary-500/30' : ''
                  }`}
                  animate={{
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.02 : 1,
                    boxShadow: isHovered 
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 transition-opacity duration-500`}
                    animate={{ opacity: isHovered ? 0.05 : 0 }}
                  />
                  
                  {/* Sparkle Effect */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-4 right-4"
                      >
                        <Sparkles className="h-6 w-6 text-primary-500 animate-pulse" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Popular Badge */}
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                    >
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg whitespace-nowrap">
                        <motion.div
                          animate={{ 
                            rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                            scale: isHovered ? [1, 1.1, 1] : 1 
                          }}
                          transition={{ 
                            duration: 0.6,
                            repeat: isHovered ? Infinity : 0,
                            repeatDelay: 1
                          }}
                        >
                          <Crown className="h-3 w-3 mr-1" />
                        </motion.div>
                        Most Popular
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Savings Badge */}
                  {plan.savings && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="absolute -top-6 right-2 z-20"
                    >
                      <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                        {plan.savings}
                      </span>
                    </motion.div>
                  )}

                  <div className="p-8 relative z-10">
                    {/* Plan Header with Icon */}
                    <motion.div
                      className="flex items-center mb-4"
                      animate={{ 
                        scale: isHovered ? 1.05 : 1,
                        x: isHovered ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`p-3 rounded-full bg-gradient-to-r ${plan.gradient} mr-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-gray-900">
                          {plan.name}
                        </h3>
                      </div>
                    </motion.div>

                    <motion.p 
                      className="text-gray-700 mb-6 text-lg"
                      animate={{ opacity: isHovered ? 1 : 0.8 }}
                    >
                      {plan.description}
                    </motion.p>

                    {/* Pricing with Motion */}
                    <motion.div 
                      className="mb-8"
                      animate={{ 
                        scale: isHovered ? 1.1 : 1,
                        color: isHovered ? '#3b82f6' : '#111827'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-4xl font-bold">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2 text-lg">
                        {plan.period}
                      </span>
                    </motion.div>

                    {/* Features List */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className="flex items-center"
                        >
                          <Check className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          <span className="text-gray-800 font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Premium CTA Button */}
                    <motion.button
                      onClick={() => handlePlanSelect(plan)}
                      className={`relative w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden ${
                        plan.buttonVariant === 'premium'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                          : plan.buttonVariant === 'primary'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        background: isHovered && plan.buttonVariant === 'premium'
                          ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                          : undefined
                      }}
                    >
                      {/* Shimmer Effect on Button */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: isHovered ? ['-100%', '100%'] : '-100%'
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                          repeat: isHovered ? Infinity : 0,
                          repeatDelay: 1
                        }}
                      />
                      
                      <span className="relative z-10">{plan.buttonText}</span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            );
            })}
          </div>
        </div>

        {/* Premium Features Section with Motion */}
        <motion.div 
          className="mt-20 bg-white rounded-3xl p-12 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="section-title">
              Why Choose Just Urbane Premium?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Premium Content",
                description: "Access to exclusive articles, in-depth reviews, and luxury lifestyle insights from industry experts.",
                gradient: "from-primary-500 to-primary-600",
                bgColor: "bg-primary-100"
              },
              {
                icon: Crown,
                title: "Ad-Free Experience", 
                description: "Enjoy uninterrupted reading with zero advertisements and faster page loading times.",
                gradient: "from-primary-500 to-primary-600",
                bgColor: "bg-primary-100"
              },
              {
                icon: Check,
                title: "Magazine Access",
                description: "Complete access to our digital magazine archive and exclusive subscriber-only issues.",
                gradient: "from-green-500 to-green-600",
                bgColor: "bg-green-100"
              }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300`}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FeatureIcon className={`h-8 w-8 ${feature.icon === Check ? 'text-green-600' : 'text-primary-600'}`} />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h3 
                    className="font-serif text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Premium FAQ Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.p 
            className="text-gray-600 mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            Have questions? Check out our{' '}
            <Link to="/faq" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline">
              FAQ
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline">
              contact us
            </Link>
            .
          </motion.p>
          
          <motion.p 
            className="text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            All plans include a 7-day free trial. Cancel anytime.
          </motion.p>
        </motion.div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default PricingPage;