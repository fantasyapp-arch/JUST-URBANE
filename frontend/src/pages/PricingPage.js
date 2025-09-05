import React, { useState, useEffect } from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import { getPaymentPackages, formatPrice } from '../utils/payment';

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Choose Your Subscription Plan
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock exclusive content, premium articles, and luxury lifestyle insights with our subscription plans.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold text-white ${
                  plan.popular ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                    {plan.id === 'digital_annual' && <Zap className="w-6 h-6 text-blue-600" />}
                    {plan.id === 'print_annual' && <Star className="w-6 h-6 text-blue-600" />}
                    {plan.id === 'combined_annual' && <Crown className="w-6 h-6 text-blue-600" />}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-gray-400 line-through text-sm mr-2">₹{plan.originalPrice}</span>
                    <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.duration}</p>
                  <p className="text-xs text-gray-500">₹{plan.monthlyPrice}/month</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Select Plan
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Secure Payment • Cancel Anytime
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Have questions about our subscription plans?</p>
          <Link 
            to="/contact" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact Support →
          </Link>
        </div>
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