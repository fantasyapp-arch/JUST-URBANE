import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Style', slug: 'style' },
    { name: 'Grooming', slug: 'grooming' },
    { name: 'Culture', slug: 'culture' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Tech', slug: 'tech' },
    { name: 'Fitness', slug: 'fitness' },
    { name: 'Travel', slug: 'travel' },
    { name: 'Entertainment', slug: 'entertainment' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Editorial Policy', href: '/editorial-policy' },
    { name: 'Advertise', href: '/advertise' },
    { name: 'Careers', href: '/careers' },
  ];

  const serviceLinks = [
    { name: 'Magazine', href: '/issues' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Travel', href: '/travel' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Account', href: '/account' },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl font-bold mb-4">
              Stay Updated with Just Urbane
            </h3>
            <p className="text-primary-200 mb-6">
              Get the latest in luxury lifestyle, fashion trends, and exclusive content delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 border border-primary-600 focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-block mb-6">
                <img 
                  src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
                  alt="JUST URBANE" 
                  className="h-16 w-auto max-w-[300px] object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="font-serif text-2xl font-black tracking-tight text-white" 
                  style={{ display: 'none' }}
                >
                  JUST URBANE
                </div>
              </Link>
              <p className="text-primary-200 mb-6 leading-relaxed">
                India's premier luxury lifestyle magazine, featuring the finest in fashion, culture, travel, and modern living.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary-800 hover:bg-gold-500 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6">Categories</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-primary-200 hover:text-gold-300 transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6">Services</h4>
              <ul className="space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-primary-200 hover:text-gold-300 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-primary-200 hover:text-gold-300 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-primary-200">
            <div className="mb-4 sm:mb-0">
              © {currentYear} Just Urbane. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="hover:text-gold-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gold-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-gold-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;