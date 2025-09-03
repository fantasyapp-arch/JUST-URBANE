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
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Link to="/" className="inline-block mb-6">
                <img 
                  src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
                  alt="JUST URBANE" 
                  className="h-8 md:h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="font-serif text-lg md:text-xl font-black text-white tracking-tight" 
                  style={{ display: 'none' }}
                >
                  JUST URBANE
                </div>
              </Link>
              <p className="text-gray-300 mb-6 md:mb-8 text-sm md:text-lg leading-relaxed">
                Your premier destination for luxury lifestyle, sophisticated culture, 
                and the finest in contemporary living.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <a
                  href="https://www.instagram.com/justurbane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a
                  href="https://www.facebook.com/justurbane"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Connect with us on LinkedIn"
                >
                  <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                </a>
                <a
                  href="https://www.x.com/justurbane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 md:w-10 md:h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on X (Twitter)"
                >
                  <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-serif text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">Categories</h4>
              <ul className="space-y-2 md:space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-serif text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">Services</h4>
              <ul className="space-y-2 md:space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-serif text-base md:text-lg font-semibold mb-4 md:mb-6 text-white">Contact</h4>
              <div className="space-y-3 md:space-y-4">
                {/* Phone */}
                <div>
                  <p className="text-gray-400 font-medium mb-1 text-xs md:text-sm">Phone</p>
                  <a 
                    href="tel:02029992989" 
                    className="text-white hover:text-gray-300 transition-colors duration-200 text-sm md:text-base"
                  >
                    020 2992989
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="text-gray-400 font-medium mb-1 text-xs md:text-sm">Email</p>
                  <a 
                    href="mailto:contact@urbaneluxury.com" 
                    className="text-white hover:text-gray-300 transition-colors duration-200 text-sm md:text-base break-all"
                  >
                    contact@urbaneluxury.com
                  </a>
                </div>

                {/* Address */}
                <div>
                  <p className="text-gray-400 font-medium mb-1 text-xs md:text-sm">Address</p>
                  <a 
                    href="https://www.google.com/maps/place/Urbane+Jets/@18.4987751,73.8208324,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf49b8f7ac69:0x8c6a0211375cbaea!8m2!3d18.4987751!4d73.8208324!16s%2Fg%2F11h3jgylnr?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200 leading-relaxed text-xs md:text-sm block"
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

          {/* Company Links - Mobile Only */}
          <div className="mt-8 pt-8 border-t border-gray-800 lg:hidden">
            <h4 className="font-serif text-base font-semibold mb-4 text-white">Company</h4>
            <div className="grid grid-cols-2 gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Just Urbane. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
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