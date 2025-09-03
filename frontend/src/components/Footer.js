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
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to="/" className="inline-block mb-6">
                <img 
                  src="https://customer-assets.emergentagent.com/job_urbane-nexus/artifacts/w4pbaa92_Untitled%20design-10.png" 
                  alt="JUST URBANE" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="font-serif text-xl font-black text-white tracking-tight" 
                  style={{ display: 'none' }}
                >
                  JUST URBANE
                </div>
              </Link>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-lg">
                Your premier destination for luxury lifestyle, sophisticated culture, 
                and the finest in contemporary living. Experience the art of refined taste.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/justurbane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/justurbane"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Connect with us on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://www.x.com/justurbane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Follow us on X (Twitter)"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6 text-white">Categories</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
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
              <h4 className="font-serif text-lg font-semibold mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-6 text-white">Contact</h4>
              <div className="space-y-4">
                {/* Phone */}
                <div>
                  <p className="text-gray-300 font-medium mb-1">Phone</p>
                  <a 
                    href="tel:02029992989" 
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    020 2992989
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="text-gray-300 font-medium mb-1">Email</p>
                  <a 
                    href="mailto:contact@urbaneluxury.com" 
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    contact@urbaneluxury.com
                  </a>
                </div>

                {/* Address */}
                <div>
                  <p className="text-gray-300 font-medium mb-1">Address</p>
                  <a 
                    href="https://www.google.com/maps/place/Urbane+Jets/@18.4987751,73.8208324,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf49b8f7ac69:0x8c6a0211375cbaea!8m2!3d18.4987751!4d73.8208324!16s%2Fg%2F11h3jgylnr?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 transition-colors duration-200 leading-relaxed text-sm"
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