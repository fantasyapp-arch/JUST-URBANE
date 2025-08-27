import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Crown, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* CLEAN MAIN HEADER - NO BLUE STRIP */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          
          {/* HERO LOGO - BIGGER AND PROMINENT */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
              alt="JUST URBANE" 
              className="h-12 lg:h-16 w-auto max-w-[280px] object-contain"
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

          {/* CLEAN DESKTOP NAVIGATION - MAIN CATEGORIES ONLY */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mainHeaderCategories.map((categoryName) => {
              const category = categories.find(cat => cat.name === categoryName);
              return (
                <div
                  key={categoryName}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(categoryName)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm uppercase tracking-wide py-2"
                  >
                    {categoryName}
                    <ChevronDown className="h-4 w-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200" />
                  </Link>

                  {/* DROPDOWN SUBMENU */}
                  {activeDropdown === categoryName && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                      <div className="py-2">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            to={`/category/${category.slug}/${sub.toLowerCase()}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
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
          <div className="flex items-center space-x-4">
            {/* SMART SUBSCRIBE BUTTON */}
            <Link
              to="/pricing"
              className="hidden md:inline-flex bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Subscribe
            </Link>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/account"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Crown className="h-4 w-4 mr-2 text-gold-500" />
                    My Account
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-4 py-2"
              >
                Sign In
              </Link>
            )}

            {/* SIDEBAR MENU TOGGLE */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
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
                  className="h-10 w-auto object-contain"
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

                {/* SUBSCRIBE CTA IN SIDEBAR */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 rounded-xl text-white">
                    <h3 className="font-bold mb-2">Get Premium Access</h3>
                    <p className="text-sm text-primary-100 mb-4">Unlimited articles, exclusive content, and more</p>
                    <Link
                      to="/pricing"
                      className="block bg-white text-primary-600 font-bold py-2 px-4 rounded-lg text-center hover:bg-gray-100 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Subscribe Now
                    </Link>
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