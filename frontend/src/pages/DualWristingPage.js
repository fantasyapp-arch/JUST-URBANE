import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DualWristingPage = () => {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Navigation Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/category/technology" className="hover:text-black transition-colors">Technology</Link>
            <span className="mx-2">/</span>
            <Link to="/category/technology/gadgets" className="hover:text-black transition-colors">Gadgets</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Double Wristing</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Image */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <img 
            src="https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/moyhrk7b_shutterstock_2167685257.jpg"
            alt="Double Wristing - Wearing smartwatch and traditional watch together"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Article Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Technology</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Gadgets</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The Art of Double Wristing: Why Two Watches Are Better Than One
          </h1>
          
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center gap-6">
              <span className="font-medium">By Krishna Mohod</span>
              <span>4 min read</span>
              <span>Technology</span>
            </div>
          </div>
        </motion.header>

        {/* Article Body */}
        <motion.div 
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            In today's digital era, the practice of double wristing—wearing both a smartwatch and traditional timepiece—is becoming the new normal among fashion-forward individuals.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            In the world where men are embracing gender fluidity and exhibiting crazy clothes, being spotted sporting a watch in both hands might not seem so weird. Double wristing is more than a style and status statement. In today's digital era, when one single smartwatch provides you all the features, you might wonder what's the use of sporting two watches. Well let me help you understand the relevance of double wristing.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            This practice is trending and many icons and celebrities seem to love it. However, it has been observed that many watch sailors were practicing it for decades.
          </p>

          {/* Section: Perfect Tech-Art Combination */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Perfect Tech-Art Combination</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Drilling this trend may grab people's attention towards you. They might question you for doing the same. But trust me! It will make a lot of sense. Because the smartwatches digital technology will lend you digital access and help you to keep updating yourselves with all latest technology. Traditional watches will give you a perfect vintage look holding up their finest craftsmanship and artisanal creations. This duo of tech-art will make you stand out from the crowd.
            </p>
          </motion.section>

          {/* Section: Celebrity Endorsement */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Celebrity Endorsement</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a person who keeps an eye on traditional watches or spends time scrolling through the latest updates of watch-selling companies, double wristing might not be so rare for you. It has already been raised as a highlighted topic. Hodinkee was the first company to publish a story on wearing an Apple watch and vintage watch together in 2019.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Double-downing horological masterpieces simultaneously were already normalized in the world of celebrities. Chris Pratt, Billie Eilish, and even the late Princess Diana have already been highlighted in the headlines practicing this trend. Actor Bill Murray was also spotted wearing a double-wristing at the Cannes Film Festival 2022.
            </p>
          </motion.section>

          {/* Section: Future of Wearable Tech */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Future of Wearable Tech</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              One has to agree with the fact that double wristing has been popular with the advent of smartwatches. Many watch enthusiasts have found a way to combine their luxury timepieces with smartwatches. The digital features of the smartwatches and the spacious artisanship of vintage timepieces are a perfect combo to sport with any outfit.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The moment when you start practising this method of watch wearing, you will realize that smartwatches and traditional watches both are different devices that gives you different experiences. Not all watches are created similarly. Some are really horological pieces that can show the time, but others are technically forward, having a lot of features.
            </p>
          </motion.section>

          {/* Quote Section */}
          <motion.blockquote 
            className="bg-gray-50 border-l-4 border-blue-600 pl-6 pr-6 py-4 mb-10 italic text-lg text-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            "We all were born with two wrists for a good reason. Here is the new trend called 'Double Wristing' - combining smartwatch functionality with conventional watch elegance."
          </motion.blockquote>

          {/* Final Section */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Settle When You Can Make It Double?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              I believe this trend is here to stay. The fact that we are in a time where timeless beauty and craftsmanship can be combined with the latest technology is simply mind-boggling. I can't wait for the time when sporting two watches becomes the new normal. Who knows what will happen next? Honestly, it's all just a game of time.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              We all were born with two wrists for a good reason. Here is the new trend called 'Double Wristing' - combining smartwatch functionality with conventional watch elegance to enhance your personality in any outfit.
            </p>
          </motion.section>
        </motion.div>

        {/* Tags Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['Technology', 'Gadgets', 'Smartwatch', 'Wearable Tech', 'Fashion Tech', 'Watches', 'Style', 'Trends'].map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link 
            to="/category/technology/gadgets"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            ← Back to Technology Gadgets
          </Link>
        </motion.div>
      </article>
    </motion.div>
  );
};

export default DualWristingPage;