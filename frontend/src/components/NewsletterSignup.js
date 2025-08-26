import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSignup = ({ variant = 'default', className = '' }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for newsletter subscription
      // In real implementation, this would call your newsletter API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
      
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (variant === 'inline') {
    return (
      <div className={`bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <h3 className="font-serif text-xl font-semibold text-primary-900 mb-2">
            Stay in the loop
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Get our best stories delivered to your inbox
          </p>
          
          {isSubscribed ? (
            <div className="flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">You're subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !email}
                className="bg-gold-500 hover:bg-gold-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-primary-900 text-white py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
            Never Miss a Story
          </h2>
          <p className="text-primary-200 mb-8 text-lg">
            Join thousands of readers who trust Just Urbane for the latest in luxury lifestyle, 
            fashion trends, and exclusive insights.
          </p>

          {isSubscribed ? (
            <div className="bg-green-600 bg-opacity-20 border border-green-400 rounded-lg p-6">
              <div className="flex items-center justify-center text-green-300 mb-2">
                <CheckCircle className="h-8 w-8 mr-3" />
                <span className="text-xl font-semibold">Welcome aboard!</span>
              </div>
              <p className="text-green-200">
                You'll receive our next newsletter within the week.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 border border-primary-600 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none text-lg"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="bg-gold-500 hover:bg-gold-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Mail className="h-5 w-5" />
                      Subscribe Free
                    </>
                  )}
                </button>
              </div>
              <p className="text-primary-300 text-sm mt-4">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </form>
          )}

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center text-primary-300">
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full border-2 border-primary-900"
                />
              ))}
            </div>
            <span className="text-sm">
              Join 10,000+ readers who love our newsletter
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;