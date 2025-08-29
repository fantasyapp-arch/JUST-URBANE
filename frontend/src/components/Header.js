import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Crown, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownTimer, setDropdownTimer] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  // Main important categories for clean header
  const mainHeaderCategories = ['Fashion', 'Tech', 'Auto', 'Travel', 'People'];

  // Improved dropdown handlers with delay
  const handleDropdownEnter = (categoryName) => {
    if (dropdownTimer) {
      clearTimeout(dropdownTimer);
      setDropdownTimer(null);
    }
    setActiveDropdown(categoryName);
  };

  const handleDropdownLeave = () => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before closing
    setDropdownTimer(timer);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* CLEAN MAIN HEADER - NO BLUE STRIP */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 lg:h-32">{/* BIGGER NAVBAR FOR BIGGER LOGO */}
          
          {/* BIGGER HERO LOGO - MUCH MORE VISIBLE */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
              alt="JUST URBANE" 
              className="h-20 lg:h-28 w-auto max-w-[400px] object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div 
              className="font-serif text-3xl lg:text-4xl font-black text-primary-600 tracking-tight" 
              style={{ display: 'none' }}
            >
              JUST URBANE
            </div>
          </Link>

          {/* COMPACT DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainHeaderCategories.map((categoryName) => {
              const category = categories.find(cat => cat.name === categoryName);
              return (
                <div
                  key={categoryName}
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(categoryName)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm uppercase tracking-wide py-3 px-2"
                  >
                    {categoryName}
                    <ChevronDown className="h-3 w-3 ml-1 transform group-hover:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* IMPROVED DROPDOWN SUBMENU WITH BETTER HOVER ZONE */}
                  {activeDropdown === categoryName && (
                    <div 
                      className="absolute top-full left-0 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                      onMouseEnter={() => handleDropdownEnter(categoryName)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {/* Invisible bridge to prevent gap issues */}
                      <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                      
                      <div className="py-3">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            to={`/category/${category.slug}/${sub.toLowerCase()}`}
                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 font-medium"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center space-x-3">
            {/* PREMIUM SUBSCRIBE BUTTON - DESKTOP */}
            <Link
              to="/pricing"
              className="hidden md:inline-flex relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Crown icon */}
              <Crown className="h-4 w-4 mr-2 animate-pulse" />
              
              <span className="relative z-10">Subscribe</span>
              
              {/* Premium glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/50 to-primary-600/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </Link>

            {/* PREMIUM SUBSCRIBE BUTTON - MOBILE (FOCUS) */}
            <Link
              to="/pricing"
              className="md:hidden inline-flex relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg group overflow-hidden"
            >
              {/* Crown icon */}
              <Crown className="h-4 w-4 mr-1.5" />
              <span className="relative z-10">Subscribe</span>
            </Link>

            {/* Search - Desktop */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="h-4 w-4 text-gray-600" />
            </button>

            {/* User Menu - Desktop Only */}
            {isAuthenticated ? (
              <div className="hidden md:block relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="h-4 w-4 text-gray-600" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/account"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Crown className="h-3 w-3 mr-2 text-primary-500" />
                    Account
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-3 py-1"
              >
                Sign In
              </Link>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE SIDEBAR MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsMenuOpen(false)}>
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
                  onClick={() => setIsMenuOpen(false)}
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
                      onClick={() => setIsMenuOpen(false)}
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
                          onClick={() => setIsMenuOpen(false)}
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
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-primary-500" />
                          My Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
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
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-5 w-5 mr-3 text-primary-500" />
                        Sign In
                      </Link>
                    )}
                    
                    {/* Search for Mobile */}
                    <button
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsMenuOpen(false);
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
                      to="/subscription"
                      className="block p-3 text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Subscription
                    </Link>
                    <Link
                      to="/urbane-connect"
                      className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Urbane Connect
                    </Link>
                    <Link
                      to="/urbane-shows"
                      className="block p-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
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
                        onClick={() => setIsMenuOpen(false)}
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