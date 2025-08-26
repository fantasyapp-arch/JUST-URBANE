import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { initiatePayment, paymentApi, formatINR } from '../utils/payment';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const { isAuthenticated } = useAuth();
  const [loadingPackage, setLoadingPackage] = useState(null);
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    // Load subscription packages from API
    const loadPackages = async () => {
      try {
        const packagesData = await paymentApi.getSubscriptionPackages();
        setPackages(packagesData);
      } catch (error) {
        console.error('Error loading packages:', error);
      }
    };
    
    loadPackages();
  }, []);

  const handleSubscribe = async (packageId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoadingPackage(packageId);
    
    try {
      await initiatePayment(packageId);
    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
      setLoadingPackage(null);
    }
  };
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'Forever',
      description: 'Basic access to our content',
      features: [
        '3 premium articles per month',
        'Basic newsletter',
        'Limited magazine access',
        'Standard support'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'secondary',
      popular: false,
      packageId: null
    },
    {
      id: 'premium_monthly',
      name: 'Premium',
      price: packages?.premium_monthly ? formatINR(packages.premium_monthly.amount) : '₹499',
      period: 'per month',
      description: 'Full access to premium lifestyle content',
      features: packages?.premium_monthly?.features || [
        'Unlimited premium articles',
        'Weekly premium newsletter',
        'Full magazine archive',
        'Priority support',
        'Exclusive events access',
        'No advertisements'
      ],
      buttonText: 'Start Premium',
      buttonVariant: 'primary',
      popular: true,
      packageId: 'premium_monthly'
    },
    {
      id: 'premium_annual',
      name: 'Annual',
      price: packages?.premium_annual ? formatINR(packages.premium_annual.amount) : '₹4,999',
      period: 'per year',
      description: 'Best value for committed readers',
      features: packages?.premium_annual?.features || [
        'Everything in Premium',
        '2 months free',
        'Print magazine delivery',
        'Exclusive member gifts',
        'VIP customer support',
        'Early access to new features'
      ],
      buttonText: 'Save 17%',
      buttonVariant: 'primary',
      popular: false,
      savings: 'Save ₹988',
      packageId: 'premium_annual'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="hero-title mb-6">
            Choose Your Plan
          </h1>
          <p className="hero-subtitle">
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
                <h3 className="font-serif text-2xl font-bold text-primary-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.packageId ? handleSubscribe(plan.packageId) : null}
                  disabled={loadingPackage === plan.packageId || (!plan.packageId && plan.id !== 'free')}
                  className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-gold-500 hover:bg-gold-600 text-white transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } ${loadingPackage === plan.packageId ? 'cursor-not-allowed' : ''}`}
                >
                  {loadingPackage === plan.packageId ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : plan.id === 'free' ? (
                    <Link to="/register" className="block">
                      {plan.buttonText}
                    </Link>
                  ) : (
                    plan.buttonText
                  )}
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
    </div>
  );
};

export default PricingPage;