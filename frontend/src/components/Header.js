import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Crown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();

  // Main categories with subcategories as per PDF
  const categories = [
    {
      name: 'Fashion',
      slug: 'fashion',
      subcategories: ['Men', 'Women', 'Luxury', 'Accessories', 'Trends']
    },
    {
      name: 'Tech', 
      slug: 'tech',
      subcategories: ['Gadgets', 'Mobile', 'Smart', 'Future', 'Reviews']
    },
    {
      name: 'Grooming',
      slug: 'grooming', 
      subcategories: ['Skin', 'Hair', 'Fragrance', 'Fitness', 'Wellness']
    },
    {
      name: 'Auto',
      slug: 'auto',
      subcategories: ['Cars', 'Bikes', 'EVs', 'Concept', 'Classics']
    },
    {
      name: 'Travel',
      slug: 'travel',
      subcategories: ['Luxury', 'Destinations', 'Guides', 'Resorts', 'Adventure']
    },
    {
      name: 'Food',
      slug: 'food',
      subcategories: ['Dining', 'Chefs', 'Drinks', 'Trends', 'Recipes']
    },
    {
      name: 'Aviation',
      slug: 'aviation',
      subcategories: ['Private', 'Commercial', 'Lounges', 'Tech', 'Stories']
    },
    {
      name: 'People',
      slug: 'people',
      subcategories: ['Celebrities', 'Entrepreneurs', 'Icons', 'Leaders', 'Culture']
    },
    {
      name: 'Luxury',
      slug: 'luxury',
      subcategories: ['RealEstate', 'Yachts', 'Interiors', 'Collectibles', 'Events']
    }
  ];



  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* PERFECT STRAIGHT HEADER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO - LEFT SIDE */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
              alt="JUST URBANE" 
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div 
              className="font-serif text-3xl font-black text-gray-900" 
              style={{ display: 'none' }}
            >
              JUST URBANE
            </div>
          </Link>

          {/* CENTER NAVIGATION - EXACT GQ STYLE */}
          <nav className="hidden md:flex items-center space-x-12 flex-1 justify-center">
            {['FASHION', 'LIFESTYLE', 'WATCHES', 'CULTURE', 'VIDEOS'].map((categoryName) => (
              <Link
                key={categoryName}
                to={`/category/${categoryName.toLowerCase()}`}
                className="text-gray-900 hover:text-black font-medium text-sm uppercase tracking-wide transition-colors duration-200"
              >
                {categoryName}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE - SUBSCRIBE & MENU */}
          <div className="flex items-center space-x-4">
            {/* Subscribe Button */}
            <Link
              to="/pricing"
              className="hidden md:inline-block bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors duration-200"
            >
              SUBSCRIBE
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-black transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE SIDEBAR MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-80 lg:w-96 bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <img 
                  src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
                  alt="JUST URBANE" 
                  className="h-16 w-auto object-contain"
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* CATEGORIES WITH SUBCATEGORIES */}
            <div className="p-4">
              <nav className="space-y-2">
                {categories.map((category) => (
                  <div key={category.slug} className="border-b border-gray-100 pb-4 mb-4">
                    {/* Main Category */}
                    <Link
                      to={`/category/${category.slug}`}
                      className="flex items-center justify-between p-3 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-semibold transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{category.name}</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                    
                    {/* Subcategories */}
                    <div className="ml-4 mt-2 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/category/${category.slug}/${sub.toLowerCase()}`}
                          className="block p-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-25 rounded transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* ACCOUNT & AUTH SECTION */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="space-y-3">
                    {/* Authentication */}
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/account" 
                          className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-primary-500" />
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                        >
                          <X className="h-5 w-5 mr-3 text-gray-500" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3 text-primary-500" />
                        Sign In
                      </Link>
                    )}
                    
                    {/* Search for Mobile */}
                    <button
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                    >
                      <Search className="h-5 w-5 mr-3 text-gray-500" />
                      Search
                    </button>
                  </div>
                </div>

                {/* SPECIAL SECTIONS */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="space-y-2">
                    <Link
                      to="/issues"
                      className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border border-amber-200 hover:from-amber-100 hover:to-amber-200 rounded-lg font-semibold transition-all duration-200 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Crown className="h-5 w-5 mr-3 text-amber-600 group-hover:rotate-12 transition-transform" />
                      <span>Digital Magazine</span>
                      <span className="ml-auto text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    </Link>
                    <Link
                      to="/subscription"
                      className="block p-3 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Subscription
                    </Link>
                    <Link
                      to="/urbane-connect"
                      className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Urbane Connect
                    </Link>
                    <Link
                      to="/urbane-shows"
                      className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Urbane Shows
                    </Link>
                  </div>
                </div>

                {/* PREMIUM SUBSCRIBE CTA IN SIDEBAR */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-2xl text-white relative overflow-hidden">
                    {/* Premium background pattern */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10"></div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/20 rounded-full blur-xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-3">
                        <Crown className="h-5 w-5 text-primary-400 mr-2" />
                        <h3 className="font-bold text-lg">Premium Access</h3>
                      </div>
                      <p className="text-sm text-gray-300 mb-5 leading-relaxed">Unlock exclusive content, expert insights, and luxury experiences</p>
                      <Link
                        to="/pricing"
                        className="block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="flex items-center justify-center">
                          <Crown className="h-4 w-4 mr-2" />
                          Subscribe Now
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;