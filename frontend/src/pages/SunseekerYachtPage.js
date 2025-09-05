import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft, Anchor } from 'lucide-react';

const SunseekerYachtPage = () => {
  const article = {
    title: "Sunseeker 65 Sport: The Ultimate Luxury Yacht Experience",
    subtitle: "Discover the Sunseeker 65 Sport yacht - where British craftsmanship meets cutting-edge technology. With bespoke bronze finish, dedicated Beach Club, and speeds up to 35 knots, this is luxury yachting redefined.",
    category: "Luxury",
    subcategory: "Yachts",
    author: "Harshit Srinivas",
    date: "September 2025",
    readTime: "5 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/3kbp8opy_credit-sun-country-yachts-6-.jpg",
    galleryImages: [
      "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/hwmm4dx3_credit-sun-country-yachts-4-.jpg"
    ],
    tags: ['Sunseeker', 'Luxury Yacht', '65 Sport', 'Yacht Review', 'Marine Luxury', 'Beach Club', 'Yacht Charter', 'Luxury Lifestyle', 'Bespoke Yacht', 'Luxury Marine']
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
            <Link to="/category/luxury" className="hover:text-gray-900 font-medium">Luxury</Link>
            <span>/</span>
            <Link to="/category/luxury/yachts" className="hover:text-gray-900 font-medium">Yachts</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Sunseeker 65 Sport</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="Sunseeker 65 Sport luxury yacht aerial view with bronze finish"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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
          <div className="mb-4 flex items-center justify-center">
            <Anchor className="h-5 w-5 mr-2 text-blue-600" />
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
            <strong>Say hello to the Sunseeker 65 Sport yacht.</strong> Finished in bespoke bronze, the yacht prioritises its unique emphasis on delivering yachts to the sailor in you with personal and bespoke finishes. The yacht for now is home at a California-based dealer – Sunseekers Southern.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Design Excellence
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The 65 Sport yacht is the epitome of luxury marine engineering, combining performance with unparalleled sophistication. Its bespoke bronze finish sets it apart from conventional yachts, creating a distinctive presence on the water that commands attention and respect.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Innovative Features
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Featuring a modular layout, the 65 Sport yacht is complimented with a SkyHelm, an IPS docking joystick, bespoke helm seats with carbon fibre backrests and an integrated centre console. These cutting-edge features ensure that every journey is not just a voyage, but an experience in luxury and precision.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src={article.galleryImages[0]}
              alt="Sunseeker 65 Sport yacht showcasing luxurious interior and sophisticated design elements"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              The Sunseeker 65 Sport yacht showcasing its distinctive bespoke bronze finish and elegant design
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Accommodation & Comfort
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The yacht can accommodate a total of six guests along with the fully appointed crew, ensuring that every passenger enjoys the highest levels of comfort and service. The thoughtfully designed interiors provide a perfect balance of luxury and functionality.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Beach Club Experience
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The 65 Sport features a dedicated Beach Club, allowing you to have direct access to the sea, complete with a bar, fridge and barbeque. Just what you need while cruising in luxury in your private yacht. This innovative design brings the ocean closer to you, creating an immersive water experience.
          </p>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "With speeds going up to 35 knots, this is a yacht delivering you a mixed rush of adrenaline just as you get while driving a high-performance convertible sports car."
          </blockquote>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Performance & Speed
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            For now, further details are scarce but with speeds going up to 35 knots, this is a yacht delivering you a mixed rush of adrenaline just as you get while driving a high-performance convertible sports car. The Sunseeker 65 Sport doesn't just cruise the waters – it conquers them.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Sunseeker Legacy
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Sunseeker has built its reputation on creating yachts that perfectly blend British craftsmanship with cutting-edge technology. The 65 Sport continues this tradition, offering yacht enthusiasts a vessel that is as much about the journey as it is about the destination.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Whether you're planning an intimate gathering with friends or a luxurious family getaway, the Sunseeker 65 Sport yacht promises an unforgettable experience on the water, where every detail has been carefully considered to provide the ultimate in luxury marine living.
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
            to="/category/luxury/yachts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Luxury Yachts
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SunseekerYachtPage;