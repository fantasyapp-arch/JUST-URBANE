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
    heroImage: "https://customer-assets.emergentagent.com/job_premium-urbane-1/artifacts/7cp5zt1z_shutterstock_516918613.jpg",
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
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/fashion/men" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Men's Fashion
            </Link>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        <img 
          src="https://customer-assets.emergentagent.com/job_premium-urbane-1/artifacts/7cp5zt1z_shutterstock_516918613.jpg"
          alt="Perfect suit combinations for the modern professional man"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-white">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Men's Fashion
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                Style Guide
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Perfect Suit Guide for Men
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed">
              Master the art of corporate dressing with this comprehensive guide to building the perfect suit wardrobe. Learn from style icon Steve Harvey's insights.
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-12 pb-6 border-b border-gray-200">
          <div className="flex items-center text-gray-600">
            <User className="h-5 w-5 mr-2" />
            <span className="font-medium">Harshit Srinivas</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Fashion Guide</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span>5 min read</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BookOpen className="h-5 w-5 mr-2" />
            <span>Style Guide</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="text-lg leading-relaxed text-gray-800 mb-8">
            <div className="float-left text-6xl font-serif font-bold text-blue-600 leading-none mr-4 mt-2">A</div>
            <p className="mb-6">
              s said, we are starting a new segment – the #man. This page has a lot to address the concerns of an evolving man, while at the same time will double up as a guide for you to be the man amongst the men. And, this month we prioritize addressing the primary concern on our list which is mastering the art of corporate dressing.
            </p>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-8">
            {/* Section 1: The Philosophy */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                The Sigma Rule of Corporate Dressing
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Now, we at Just Urbane have always followed the sigma rule of dressing in formals. Whether it be our workplace, events or our regular meetups, you will always find the team in corporate attire. This may look as a boring rule to a few, but for those who agree with us, realise its importance. And, just to help out those who agree with us, and who are willing to upgrade their wardrobe, here's a guide. This will not only help you to have plenty of options with a minimalist wardrobe, but also save you from drilling holes in your pockets.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                And, fret not! This isn't coming from our personal experience either, but from someone whom most of us idolize as the most well dressed man across the globe. And, by that we mean, the favourite American host – Steve Harvey. Steve in one of his trending videos across various social media platforms shared his insights on which shades of suits a man should have.
              </p>
            </section>

            {/* Highlight Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 my-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Steve Harvey's Essential Suit Colors
              </h3>
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

            {/* Section 2: The Guide */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                Building Your Corporate Wardrobe
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Now, a lot of you might be taking your initial steps into the corporate world. And, if you are unaware about what to look for, you might end up picking some not so good choices, even after paying a heavy premium. Well, that's not your fault at all but the pressure of making you look presentable, many times put you in these tough times. And, you end up wearing a purple or a maroon suit at meetings.
              </p>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                But, to save you from these situations here is what Steve suggests. A man should always have these five common colors of suit in his wardrobe, which include <strong>Black, Navy, Grey, Brown and Tan</strong>. Along with these, you should have a pair of <strong>white, cream and powder blue shirts</strong>.
              </p>
            </section>

            {/* Section 3: The Mathematics */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                The Mathematics of Style
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  75 Unique Combinations
                </h3>
                <div className="text-center text-3xl font-bold text-blue-600 mb-4">
                  5 Suits × 5 Pants × 3 Shirts = 75 Looks
                </div>
                <p className="text-gray-600 text-center">
                  Every shade of blazer goes with every shade of pant, and every combination works with any of the three shirt colors.
                </p>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                Now, what he wants you to do then is to make random combinations using all of these. Mind you, these will not only make you look class and elegant but also let you have access to a total of 75 combinations. How? Because every shade of the blazer will go up with every shade of the pant and every shade of the pant and the blazer will go with any of the aforementioned shades of the shirts.
              </p>
            </section>

            {/* Section 4: Versatility */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                Beyond the Boardroom
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                And, as you read it to be this simple, similar is the way to picking these shades. Also apart from meeting you still can carry them elegantly at different occasions as well, whether it's a birthday, or a wedding, or an interview. You have a list to choose from.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                That said, now looking for the perfect suit for you or someone else could not have been simplified so well. And, if you appreciate this segment of ours, you can definitely write to us with suggestions and topics to help you in our next, and trust us we will get the best from the world to address your concerns and topics.
              </p>
            </section>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-8 mt-12">
            <h3 className="text-2xl font-bold mb-4">Join the #Man Movement</h3>
            <p className="text-lg mb-6">
              This is just the beginning of our journey to help you become the best version of yourself. Have suggestions for our next topic?
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Share Your Ideas
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">More Men's Fashion</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/fashion/men" className="group">
              <div className="bg-gray-100 rounded-lg p-6 group-hover:bg-gray-200 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Explore Men's Fashion</h3>
                <p className="text-gray-600">Discover more style guides and fashion insights for the modern man.</p>
              </div>
            </Link>
            <Link to="/fashion" className="group">
              <div className="bg-blue-50 rounded-lg p-6 group-hover:bg-blue-100 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Fashion Articles</h3>
                <p className="text-gray-600">Browse our complete collection of fashion and style content.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensFashionSuitGuidePage;