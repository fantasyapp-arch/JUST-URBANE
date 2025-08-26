import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Users, Globe, Heart, Mail, Phone, MapPin, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Ananya Krishnan',
      role: 'Travel & Lifestyle Editor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Luxury travel expert with 8 years covering premium destinations worldwide.',
      social: { twitter: '@ananyak_travel', instagram: '@ananyatravels' }
    },
    {
      name: 'Vikram Singh',
      role: 'Technology Journalist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'Tech reviewer specializing in luxury gadgets and innovative technology.',
      social: { twitter: '@vikramsingh_tech', instagram: '@vikramtech' }
    },
    {
      name: 'Rahul Sharma',
      role: 'Fashion & Style Editor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Fashion consultant and style expert with decade of luxury lifestyle journalism.',
      social: { twitter: '@rahulstyle', instagram: '@rahulsharma_style' }
    },
    {
      name: 'Priya Nair',
      role: 'Culture Correspondent',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=300',
      bio: 'Arts and culture journalist covering contemporary Indian art, music, and literature.',
      social: { twitter: '@priyanair', instagram: '@priyanair_culture' }
    }
  ];

  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest editorial standards, delivering only premium quality content that matches luxury lifestyle expectations.',
      color: 'text-gold-500'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a discerning community of luxury lifestyle enthusiasts who appreciate quality, craftsmanship, and authentic experiences.',
      color: 'text-blue-500'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'Our international outlook brings you the finest from around the world, with deep local insights and cultural understanding.',
      color: 'text-green-500'
    },
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'Every story is crafted with genuine passion, honest reviews, and authentic experiences that our readers can trust.',
      color: 'text-red-500'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Monthly Readers' },
    { number: '500+', label: 'Premium Articles' },
    { number: '50+', label: 'Expert Contributors' },
    { number: '25+', label: 'Countries Covered' }
  ];

  return (
    <div className="min-h-screen bg-white">
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
              About Just Urbane
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto leading-relaxed">
              India's premier luxury lifestyle magazine, redefining premium content through authentic storytelling, 
              expert insights, and unparalleled access to the world of luxury.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Quote className="h-12 w-12 text-gold-500 mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              To curate and create the finest luxury lifestyle content that inspires, educates, and connects 
              discerning individuals with authentic premium experiences across fashion, culture, travel, 
              technology, and fine living.
            </p>
            <div className="border-l-4 border-gold-500 pl-6 text-left max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 italic">
                "We believe that true luxury lies not in excess, but in the perfect balance of quality, 
                craftsmanship, and meaningful experiences that enrich our readers' lives."
              </p>
              <p className="text-sm text-gray-500 mt-4 font-medium">
                — Editorial Team, Just Urbane
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="section-title">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our editorial vision and content creation
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <value.icon className={`h-12 w-12 ${value.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h2 className="section-title">Meet Our Editorial Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate experts behind Just Urbane's premium content
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gold-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <a href="#" className="hover:text-gold-600 transition-colors">
                    {member.social.twitter}
                  </a>
                  <a href="#" className="hover:text-gold-600 transition-colors">
                    {member.social.instagram}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* History Section */}
      <div className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-12">
              Our Story
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-primary-200 leading-relaxed mb-6">
                  Just Urbane was born from a vision to create India's most sophisticated lifestyle publication. 
                  Founded by a team of passionate journalists and luxury enthusiasts, we recognized the need for 
                  authentic, high-quality content that truly understands the modern luxury consumer.
                </p>
                <p className="text-lg text-primary-200 leading-relaxed mb-6">
                  Since our inception, we've built relationships with the finest brands, interviewed industry leaders, 
                  and traveled to extraordinary destinations to bring our readers exclusive insights into the world of luxury.
                </p>
                <p className="text-lg text-primary-200 leading-relaxed">
                  Today, Just Urbane stands as India's trusted voice in luxury lifestyle, read by discerning 
                  individuals who appreciate quality, authenticity, and the finer things in life.
                </p>
              </div>
              <div className="space-y-6">
                <div className="bg-primary-800 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-gold-400 mb-2">2024</h4>
                  <p className="text-primary-200">Launched premium digital platform with exclusive content and membership tiers</p>
                </div>
                <div className="bg-primary-800 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-gold-400 mb-2">2023</h4>
                  <p className="text-primary-200">Expanded international coverage and partnerships with luxury brands</p>
                </div>
                <div className="bg-primary-800 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-gold-400 mb-2">2022</h4>
                  <p className="text-primary-200">Founded Just Urbane with a mission to redefine luxury lifestyle journalism</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-gold-50 to-gold-100">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <h3 className="text-3xl font-serif font-bold text-primary-900 mb-6">
              Join Our Community
            </h3>
            <p className="text-gray-700 mb-8 text-lg">
              Experience the world of luxury lifestyle through our exclusive content, expert insights, 
              and premium community of discerning readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="btn-primary">
                Become a Member
              </Link>
              <Link to="/contact" className="btn-secondary">
                Partner With Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;