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

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-gold-600" />
                <h3 className="text-xl font-semibold text-primary-900">
                  Office Hours
                </h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> For urgent matters outside business hours, 
                  please send an email and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </motion.div>
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
                a: "We welcome high-quality submissions from experienced writers. Please send your pitch to editorial@justurbane.com with your credentials and article outline."
              },
              {
                q: "Do you accept guest posts or sponsored content?",
                a: "Yes, we work with select brands and writers for sponsored content that aligns with our editorial standards. Contact advertising@justurbane.com for partnership opportunities."
              },
              {
                q: "How can I advertise on Just Urbane?",
                a: "We offer various advertising solutions including display ads, sponsored articles, and newsletter placements. Contact our advertising team for a media kit and pricing."
              },
              {
                q: "Can I request a review of my luxury product?",
                a: "We review select luxury products that align with our audience interests. Submit product information and samples to our editorial team for consideration."
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