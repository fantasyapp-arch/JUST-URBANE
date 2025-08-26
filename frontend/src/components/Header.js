import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import SearchModal from './SearchModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { data: categories = [] } = useCategories();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  const mainCategories = [
    'Fashion', 'Business', 'Technology', 'Finance', 
    'Travel', 'Health', 'Culture', 'Art', 'Entertainment'
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <span>Premium Lifestyle Magazine</span>
              <span className="hidden sm:block">|</span>
              <span className="hidden sm:block">Latest Issue Available</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Crown className="h-3 w-3" />
                  <span>Premium Member</span>
                </div>
              ) : (
                <Link to="/pricing" className="hover:text-gold-300 transition-colors">
                  Subscribe
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - MUCH BIGGER */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/tv33qoqr_JUST%20URBANE%20BG%20REMOVED.png" 
              alt="JUST URBANE" 
              className="h-12 w-auto max-w-[200px] object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div 
              className="font-serif text-3xl font-black text-primary-700 tracking-tight" 
              style={{ display: 'none' }}
            >
              JUST URBANE
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mainCategories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
              >
                {category}
              </Link>
            ))}
            <Link
              to="/issues"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
            >
              Magazine
            </Link>
            <Link
              to="/reviews"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-sm uppercase tracking-wide"
            >
              Reviews
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-3 hover:bg-primary-50 rounded-lg transition-colors">
                  <User className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/account"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-primary-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 hover:bg-primary-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {mainCategories.map((category) => (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
              <Link
                to="/issues"
                className="py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Magazine
              </Link>
              <Link
                to="/reviews"
                className="py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;