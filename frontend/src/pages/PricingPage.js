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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Access premium lifestyle content, exclusive articles, and luxury insights
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-gold-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                    <Crown className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              {plan.savings && (
                <div className="absolute -top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  {plan.description}
                </p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2 text-lg">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full block text-center py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    plan.buttonVariant === 'premium'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                      : plan.buttonVariant === 'primary'
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 bg-white rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="section-title">
              Why Choose Just Urbane Premium?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-gold-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Premium Content</h3>
              <p className="text-gray-600">
                Access to exclusive articles, in-depth reviews, and luxury lifestyle insights from industry experts.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Ad-Free Experience</h3>
              <p className="text-gray-600">
                Enjoy uninterrupted reading with zero advertisements and faster page loading times.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Magazine Access</h3>
              <p className="text-gray-600">
                Complete access to our digital magazine archive and exclusive subscriber-only issues.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Have questions? Check out our{' '}
            <Link to="/faq" className="text-gold-600 hover:text-gold-700 font-medium">
              FAQ
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="text-gold-600 hover:text-gold-700 font-medium">
              contact us
            </Link>
            .
          </p>
          <p className="text-sm text-gray-500">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
        </div>
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