import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const ScottishLeaderReviewPage = () => {
  const article = {
    title: "Scottish Leader Original Whiskey",
    subtitle: "Scottish Leader Original whiskey is a blend of malt and grain whiskies, which has been recently introduced in India. But, does it have all that to fare against the existing great whiskeys in the market? We sipped a couple of drinks to help you know more about it",
    category: "Drinks",
    subcategory: "Whiskey Review",
    author: "Harshit Srinivas",
    date: "June 2022",
    readTime: "5 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_premium-articles/artifacts/yfjyheh0_Scottish%20Leader_2.jpg",
    tags: ['Scottish Whiskey', 'Whiskey Review', 'Scotch', 'Distell International', 'Aspri Spirits', 'Premium Spirits', 'Scottish Leader']
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
            <Link to="/category/drinks" className="hover:text-gray-900 font-medium">Drinks</Link>
            <span>/</span>
            <Link to="/category/drinks/whiskey-review" className="hover:text-gray-900 font-medium">Whiskey Review</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Scottish Leader Original Whiskey</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="Scottish Leader Original Whiskey - Premium Scotch whiskey bottle with elegant packaging"
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
            <span className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
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
              className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-amber-600 transition-colors">
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
            <strong>2022 couldn't have started better for whiskey lovers in India!</strong> After 45 years of splendid history, Distell International and Aspri Spirits joined hands to introduce the Scottish Leader Original whiskey in India.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Honestly, I have never fallen in the category of whiskey drinkers for an obvious reason – its taste. But, when the brand insisted on trying out its very first launch product, I thought to myself, why not give it a try? And here I am with a huge bar-kit box on my desk, specially crafted for reviewers to try out the Scottish Leader Original whiskey.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Unboxing Experience
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Unboxing the hamper, you find a bottle of whiskey in a red carton reminiscent of a famous brand, a pair of whiskey glasses, a peg measurer and a handy flask. The cap of the whiskey glass bottle is a tin cap that if not broken at appropriate points gets free on the rings and you tend to lose the ability of capping it back.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The alcohol percentage in the whiskey is 42.8 percent volume per volume, and besides that, on the nose the Scottish Leader Original hints us of a malt, sherry or oak, with a soft smokiness behind.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_premium-articles/artifacts/714p0anm_Scottish%20Leader_3.jpg"
              alt="Scottish Leader Original Whiskey bottle and glass setup showcasing the premium packaging and presentation"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Scottish Leader Original Whiskey bottle and glass setup showcasing the premium packaging and presentation
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Tasting Experience
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Enough of chitchat! It's time to make a drink now. The whiskey, when sipped with water and a few cubes of ice, tasted pleasant or rather sweet to me. You certainly get a taste of a whiskey with flavours of toffee and nuts, and bits of orange with caramel.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Also, on the taste buds, the whiskey struck a perfect balance of spice and sweetness, which rather appears to be complex while reading this review but trust me on this, was smooth in every slurp with the rich taste. And, not to miss out, it had a long finish with a touch of mild oak which can be rather felt even after a couple of minutes after the glass had left your lips.
          </p>

          <blockquote className="border-l-4 border-amber-500 bg-amber-50 p-6 my-8 italic text-xl text-amber-900 leading-relaxed">
            "The whiskey struck a perfect balance of spice and sweetness, smooth in every slurp with the rich taste, and had a long finish with a touch of mild oak."
          </blockquote>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Awards and Recognition
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            With so many awards under their hat such as:
          </p>

          <ul className="list-disc pl-6 mb-6 text-lg text-gray-800 leading-relaxed">
            <li><strong>2019 Scotch Whiskey Masters</strong> – Gold</li>
            <li><strong>2019 World Whiskey Awards</strong> – Silver</li>
            <li><strong>2020 International Wine and Spirits Competition</strong> – Silver</li>
            <li><strong>2021 Scotch Whiskey Masters</strong> – Silver</li>
          </ul>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            You know what to ask for when you go booze shopping for yourself the next time!
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Final Verdict and Pricing
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Overall, I, who reviewed the whiskey for business, for the first time, thought that the taste was remarkable, and if allowed, then you should hear my friends out who joined me for the evening tasting session. They not only enjoyed it but even crowned it as by far the most affordable and best tasting whiskey in the market today. I couldn't agree more with them!
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            For now, the Scottish Leader Original is available across India in states of Punjab, Maharashtra, Karnataka and Telangana and comes at the following prices:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing by State:</h4>
            <ul className="space-y-2 text-lg text-gray-800">
              <li><strong>Punjab:</strong> Rs 1,500</li>
              <li><strong>Maharashtra:</strong> Rs 2,750</li>
              <li><strong>Karnataka:</strong> Rs 2,449</li>
              <li><strong>Telangana:</strong> Rs 2,150</li>
            </ul>
          </div>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Scottish Leader Original whiskey presents an excellent entry point into premium Scottish whiskeys, offering remarkable value for money without compromising on taste and quality. Whether you're a seasoned whiskey connoisseur or someone looking to explore the world of fine spirits, this blend deserves a place on your shelf.
          </p>
        </motion.article>

        {/* Tags */}
        <motion.div 
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Back to Whiskey Reviews */}
        <motion.div 
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            to="/category/drinks/whiskey-review"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Whiskey Reviews
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ScottishLeaderReviewPage;