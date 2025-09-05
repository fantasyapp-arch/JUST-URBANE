import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const MensFashionSuitGuidePage = () => {
  const article = {
    title: "Perfect Suit Guide for Men",
    subtitle: "Master the art of corporate dressing with this comprehensive guide to building the perfect suit wardrobe. Learn from style icon Steve Harvey's insights on creating 75 unique combinations with just the essentials.",
    category: "Fashion",
    subcategory: "Men",
    author: "Harshit Srinivas",
    date: "September 2025",
    readTime: "5 min read",
    heroImage: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtZW4lMjBmYXNoaW9ufGVufDB8fHx8MTc1NjM4NjA4Mnww&ixlib=rb-4.1.0&q=85",
    tags: ['Men\'s Fashion', 'Corporate Dressing', 'Suit Guide', 'Steve Harvey', 'Professional Style', 'Wardrobe Essentials', 'Business Attire', 'Style Tips', 'Fashion Guide', 'Corporate Fashion']
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to="/category/fashion" className="hover:text-gray-900 font-medium">Fashion</Link>
            <span>/</span>
            <Link to="/category/fashion/men" className="hover:text-gray-900 font-medium">Men</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Perfect Suit Guide</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="Perfect suit combinations for the modern professional man"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Article Title Section */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
              {article.category} • {article.subcategory}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight text-gray-900 px-2">
            {article.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed px-2">
            {article.subtitle}
          </p>
        </motion.div>

        {/* Article Meta */}
        <motion.div 
          className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={shareArticle}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Article Body */}
        <motion.article 
          className="prose prose-lg max-w-none px-2 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium drop-cap">
            <strong>As said, we are starting a new segment</strong> – the #man. This page has a lot to address the concerns of an evolving man, while at the same time will double up as a guide for you to be the man amongst the men. And, this month we prioritize addressing the primary concern on our list which is mastering the art of corporate dressing.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Now, we at Just Urbane have always followed the sigma rule of dressing in formals. Whether it be our workplace, events or our regular meetups, you will always find the team in corporate attire. This may look as a boring rule to a few, but for those who agree with us, realise its importance.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_justurbane-luxury/artifacts/t9lw0ha9_mohamad-khosravi-YGJ9vfuwyUg-unsplash.jpg"
              alt="Professional businessman in a perfectly tailored suit demonstrating corporate excellence and modern fashion"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              The perfect example of corporate dressing excellence - confidence meets style in professional attire
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Steve Harvey Formula
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            And, just to help out those who agree with us, and who are willing to upgrade their wardrobe, here's a guide. This will not only help you to have plenty of options with a minimalist wardrobe, but also save you from drilling holes in your pockets.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            And, fret not! This isn't coming from our personal experience either, but from someone whom most of us idolize as the most well dressed man across the globe. And, by that we mean, the favourite American host – Steve Harvey. Steve in one of his trending videos across various social media platforms shared his insights on which shades of suits a man should have.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_justurbane-luxury/artifacts/8g715xvh_mohamad-khosravi-vS0Kya7E5V4-unsplash.jpg"
              alt="Elegant businessman in formal attire showcasing the refined style and sophisticated fashion choices for corporate professionals"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Sophisticated styling and attention to detail - the hallmarks of a well-dressed professional
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Essential Five Colors
          </h3>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 my-8">
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Steve Harvey's Essential Suit Colors
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Black', 'Navy', 'Grey', 'Brown', 'Tan'].map((color) => (
                <div key={color} className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 ${
                    color === 'Black' ? 'bg-black' :
                    color === 'Navy' ? 'bg-blue-900' :
                    color === 'Grey' ? 'bg-gray-500' :
                    color === 'Brown' ? 'bg-amber-800' :
                    'bg-yellow-600'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Now, a lot of you might be taking your initial steps into the corporate world. And, if you are unaware about what to look for, you might end up picking some not so good choices, even after paying a heavy premium. Well, that's not your fault at all but the pressure of making you look presentable, many times put you in these tough times. And, you end up wearing a purple or a maroon suit at meetings.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            But, to save you from these situations here is what Steve suggests. A man should always have these five common colors of suit in his wardrobe, which include <strong>Black, Navy, Grey, Brown and Tan</strong>. Along with these, you should have a pair of <strong>white, cream and powder blue shirts</strong>.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Mathematics of Style
          </h3>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              75 Unique Combinations
            </h4>
            <div className="text-center text-3xl font-bold text-blue-600 mb-4">
              5 Suits × 5 Pants × 3 Shirts = 75 Looks
            </div>
            <p className="text-gray-600 text-center">
              Every shade of blazer goes with every shade of pant, and every combination works with any of the three shirt colors.
            </p>
          </div>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Now, what he wants you to do then is to make random combinations using all of these. Mind you, these will not only make you look class and elegant but also let you have access to a total of 75 combinations. How? Because every shade of the blazer will go up with every shade of the pant and every shade of the pant and the blazer will go with any of the aforementioned shades of the shirts.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_justurbane-luxury/artifacts/qx8ns45s_mohamad-khosravi--eb0moHDPBI-unsplash.jpg"
              alt="Modern professional man in a navy blue suit demonstrating the perfect balance of style and sophistication in corporate fashion"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Navy blue sophistication - one of the essential colors every professional wardrobe needs
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Beyond the Boardroom
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            And, as you read it to be this simple, similar is the way to picking these shades. Also apart from meeting you still can carry them elegantly at different occasions as well, whether it's a birthday, or a wedding, or an interview. You have a list to choose from.
          </p>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "A man should always have these five common colors of suit in his wardrobe: Black, Navy, Grey, Brown and Tan." - Steve Harvey
          </blockquote>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            That said, now looking for the perfect suit for you or someone else could not have been simplified so well. And, if you appreciate this segment of ours, you can definitely write to us with suggestions and topics to help you in our next, and trust us we will get the best from the world to address your concerns and topics.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Building Your Perfect Wardrobe
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The beauty of Steve Harvey's formula lies in its simplicity and versatility. By investing in quality pieces in these essential colors, you're not just buying clothes - you're building a foundation for professional success. Each piece works harmoniously with the others, ensuring you always look polished and put-together.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Remember, the key to mastering corporate dressing isn't about having the most expensive suits - it's about understanding how to create sophisticated combinations that project confidence, competence, and style. With these five suit colors and three shirt shades, you'll never run out of ways to make a powerful impression.
          </p>
        </motion.article>

        {/* Tags */}
        <motion.div 
          className="flex flex-wrap gap-2 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Tags:</h3>
          {article.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
            >
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </motion.div>

        {/* Navigation */}
        <motion.div 
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link 
            to="/category/fashion/men"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Men's Fashion
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default MensFashionSuitGuidePage;