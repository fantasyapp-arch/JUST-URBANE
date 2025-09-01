import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Users, Award, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'contact@urbaneluxury.com',
      description: 'For all inquiries and general questions',
      color: 'text-blue-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '020 2992989',
      description: 'Monday to Friday, 9 AM - 6 PM IST',
      color: 'text-green-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Pune, Maharashtra, India',
      description: 'By appointment only',
      color: 'text-red-500'
    },
    {
      icon: Clock,
      title: 'Response Time',
      details: '24-48 hours',
      description: 'We respond to all inquiries promptly',
      color: 'text-purple-500'
    }
  ];

  const departments = [
    {
      title: 'General Inquiries',
      email: 'contact@urbaneluxury.com',
      description: 'All general questions, support, and information requests'
    },
    {
      title: 'Editorial Team',
      email: 'contact@urbaneluxury.com',
      description: 'Story submissions, press releases, editorial partnerships'
    },
    {
      title: 'Advertising & Partnerships',
      email: 'contact@urbaneluxury.com',
      description: 'Brand collaborations, sponsored content, advertising opportunities'
    },
    {
      title: 'Technical Support',
      email: 'contact@urbaneluxury.com',
      description: 'Website issues, subscription problems, account management'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'editorial', label: 'Editorial Submission' },
    { value: 'advertising', label: 'Advertising & Partnerships' },
    { value: 'subscription', label: 'Subscription Support' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'press', label: 'Press & Media' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl font-black mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Whether you have a story to share, a partnership proposal, 
              or just want to say hello, we're here to listen.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="h-8 w-8 text-gold-500" />
              <h2 className="text-3xl font-serif font-bold text-primary-900">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Type
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-colors"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <info.icon className={`h-8 w-8 ${info.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="font-medium text-gray-900 mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-gray-600">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Department Contacts */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-6">
                Direct Contacts
              </h3>
              <div className="space-y-6">
                {departments.map((dept, index) => (
                  <div key={index} className="border-l-4 border-gold-500 pl-6">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {dept.title}
                    </h4>
                    <a 
                      href={`mailto:${dept.email}`}
                      className="text-gold-600 hover:text-gold-700 font-medium transition-colors mb-2 block"
                    >
                      {dept.email}
                    </a>
                    <p className="text-sm text-gray-600">
                      {dept.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps Integration */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-8 w-8 text-gold-500" />
                <h3 className="text-2xl font-serif font-bold text-primary-900">Interactive Map</h3>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.7947285934947!2d73.8208324!3d18.4987751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf49b8f7ac69%3A0x8c6a0211375cbaea!2sUrbane%20Jets!5e0!3m2!1sen!2sin!4v1693478534567!5m2!1sen!2sin"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                  title="Just Urbane Office Location"
                ></iframe>
              </div>
              
              <div className="mt-6 text-center">
                <a
                  href="https://www.google.com/maps/place/Urbane+Jets/@18.4987751,73.8208324,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf49b8f7ac69:0x8c6a0211375cbaea!8m2!3d18.4987751!4d73.8208324!16s%2Fg%2F11h3jgylnr?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <MapPin className="h-5 w-5" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="section-title">Visit Our Office</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Located in the heart of Pune, our office is easily accessible and designed for professional meetings.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Address Details */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-8 w-8 text-gold-500" />
                <h3 className="text-2xl font-serif font-bold text-primary-900">Office Address</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Just Urbane Office</h4>
                  <p className="text-gray-700 leading-relaxed">
                    10th floor, Gokhale Business Bay,<br />
                    A-1001, opp. City Pride,<br />
                    Paschimanagri, Kothrud,<br />
                    Pune, Maharashtra 411038<br />
                    India
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href="tel:02029992989" className="font-medium text-blue-600 hover:text-blue-700">
                        020 2992989
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href="mailto:contact@urbaneluxury.com" className="font-medium text-green-600 hover:text-green-700">
                        contact@urbaneluxury.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="https://www.google.com/maps/place/Urbane+Jets/@18.4987751,73.8208324,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2bf49b8f7ac69:0x8c6a0211375cbaea!8m2!3d18.4987751!4d73.8208324!16s%2Fg%2F11h3jgylnr?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <MapPin className="h-5 w-5" />
                    View on Google Maps
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Transportation & Directions */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-6">Getting Here</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    By Metro
                  </h4>
                  <p className="text-gray-700 pl-5">
                    Nearest Metro Station: Vanaz Metro Station (2.5 km away)<br />
                    Take a taxi or bus from the metro station to reach our office.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    By Car
                  </h4>
                  <p className="text-gray-700 pl-5">
                    Ample parking available in the building.<br />
                    Located opposite City Pride complex for easy identification.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    By Bus
                  </h4>
                  <p className="text-gray-700 pl-5">
                    Multiple bus routes serve the Kothrud area.<br />
                    Nearest bus stop: Paschimanagri (500m walking distance).
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                  <h4 className="font-semibold text-amber-800 mb-2">💡 Visiting Tips</h4>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Please schedule appointments in advance</li>
                    <li>• Visitor parking available on basement levels</li>
                    <li>• Building has elevator access to 10th floor</li>
                    <li>• Reception will guide you to our office</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              {
                q: "How can I contribute an article to Just Urbane?",
                a: "We welcome high-quality submissions from experienced writers. Please send your pitch to contact@urbaneluxury.com with your credentials and article outline."
              },
              {
                q: "Do you accept guest posts or sponsored content?",
                a: "Yes, we work with select brands and writers for sponsored content that aligns with our editorial standards. Contact us at contact@urbaneluxury.com for partnership opportunities."
              },
              {
                q: "What are your office hours?",
                a: "We're open Monday to Friday from 9:00 AM to 6:00 PM IST, and Saturday from 10:00 AM to 4:00 PM IST. We're closed on Sundays."
              },
              {
                q: "How can I schedule a meeting at your office?",
                a: "Please call us at 020 2992989 or email contact@urbaneluxury.com to schedule an appointment. We recommend booking in advance to ensure availability."
              },
              {
                q: "Can I request a review of my luxury product?",
                a: "We review select luxury products that align with our audience interests. Submit product information to our team at contact@urbaneluxury.com for consideration."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                <h4 className="font-semibold text-primary-900 mb-3">
                  {faq.q}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h3 className="text-3xl font-serif font-bold mb-4">
              Join Our Community
            </h3>
            <p className="text-primary-200 mb-8 text-lg">
              Stay connected with Just Urbane for the latest in luxury lifestyle, 
              exclusive content, and premium experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:contact@urbaneluxury.com"
                className="btn-primary bg-gold-500 hover:bg-gold-600"
              >
                Email Us
              </a>
              <a 
                href="tel:02029992989"
                className="btn-secondary"
              >
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;