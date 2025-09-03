import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Culture', slug: 'culture' },
    { name: 'Videos', slug: 'videos' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }, 
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const serviceLinks = [
    { name: 'Magazine', href: '/issues' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Travel', href: '/travel' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Account', href: '/account' },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {/* Brand */}
            <div className="md:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block mb-8">
                <img 
                  src="https://customer-assets.emergentagent.com/job_gq-style-mag/artifacts/zuxg2ei2_Untitled%20design-15.png" 
                  alt="JUST URBANE" 
                  className="h-16 md:h-20 lg:h-24 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="font-serif text-2xl md:text-3xl font-black text-white tracking-tight" 
                  style={{ display: 'none' }}
                >
                  JUST URBANE
                </div>
              </Link>
              <p className="text-gray-300 mb-8 text-base md:text-lg leading-relaxed max-w-sm">
                Your premier destination for luxury lifestyle, sophisticated culture, 
                and the finest in contemporary living. Experience the art of refined taste.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/justurbane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/justurbane"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Connect with us on LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://www.x.com/justurbane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Follow us on X (Twitter)"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-serif text-xl font-bold mb-8 text-white">Categories</h4>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-base hover:translate-x-1 inline-block transform"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-serif text-xl font-bold mb-8 text-white">Services</h4>
              <ul className="space-y-4">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-base hover:translate-x-1 inline-block transform"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-serif text-xl font-bold mb-8 text-white">Contact</h4>
              <div className="space-y-6">
                {/* Phone */}
                <div>
                  <p className="text-gray-400 font-semibold mb-2 text-sm uppercase tracking-wide">Phone</p>
                  <a 
                    href="tel:02029992989" 
                    className="text-white hover:text-gray-300 transition-colors duration-200 text-base font-medium"
                  >
                    020 2992989
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="text-gray-400 font-semibold mb-2 text-sm uppercase tracking-wide">Email</p>
                  <a 
                    href="mailto:contact@urbaneluxury.com" 
                    className="text-white hover:text-gray-300 transition-colors duration-200 text-base font-medium break-all"
                  >
                    contact@urbaneluxury.com
                  </a>
                </div>

                {/* Address */}
                <div>
                  <p className="text-gray-400 font-semibold mb-2 text-sm uppercase tracking-wide">Address</p>
                  <a 
                    href="https://www.google.com/maps/place/Urbane+Jets/@18.4987751,73.8208324,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf49b8f7ac69:0x8c6a0211375cbaea!8m2!3d18.4987751!4d73.8208324!16s%2Fg%2F11h3jgylnr?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200 leading-relaxed text-base block font-medium"
                  >
                    10th floor, Gokhale Business Bay,<br />
                    A-1001, opp. City Pride,<br />
                    Paschimanagri, Kothrud,<br />
                    Pune, Maharashtra 411038
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links - Desktop */}
          <div className="hidden lg:block mt-16 pt-12 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-xl font-bold mb-6 text-white">Company</h4>
                <div className="flex space-x-8">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-base hover:translate-y-[-2px] inline-block transform"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-2">Subscribe to our newsletter</p>
                <div className="flex">
                  <input 
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors text-sm"
                  />
                  <button className="bg-white text-black px-6 py-2 font-semibold hover:bg-gray-200 transition-colors text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links - Mobile Only */}
          <div className="mt-12 pt-8 border-t border-gray-800 lg:hidden">
            <h4 className="font-serif text-lg font-bold mb-6 text-white">Company</h4>
            <div className="grid grid-cols-2 gap-4">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-base"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {currentYear} Just Urbane. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-xs md:text-sm">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white transition-colors duration-200 text-center sm:text-left"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white transition-colors duration-200 text-center sm:text-left"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;