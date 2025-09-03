import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const RoyalAtlantisPage = () => {
  const article = {
    title: "Atlantis The Palm: A Mythical Journey to Dubai's Crown Jewel",
    subtitle: "This month we head to Atlantis, the Palm in Dubai. And, trust me it isn't just a picturesque resort on world's largest man-made island, but instead is reminiscent of the castles from your yesteryears fairy tale",
    category: "Travel",
    subcategory: "Luxury Stays",
    author: "Chahat Dalal",
    date: "July 2022",
    readTime: "8 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_slick-page-turner/artifacts/jcqtiy5s_phy2015.rst.ath.atlantiswithpalm-angle-colour-hr.jpg",
    tags: ['Dubai', 'Luxury Travel', 'Atlantis', 'Palm Jumeirah', 'Resort', 'Aquaventure', 'Luxury Stays']
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
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to="/category/travel" className="hover:text-gray-900 font-medium">Travel</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Atlantis The Palm Dubai</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                  {article.category} • {article.subcategory}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
                {article.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Meta */}
        <motion.div 
          className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200"
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
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
            Atlantis - the lost island, filled with myths and magic, it's a story that captures one's imagination, inspired by Plato who told the story of Atlantis around 360 B.C. He proclaimed the founders of Atlantis, were half-god and half-human. Well, Atlantis the Palm Dubai makes sure to treat you like God.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Lost cities, mystic ships and hidden treasures, are all part of the alluring marine world. Of all these, the lost city of Atlantis tops the list but trust Dubai to build its own sunken city and surround it with the magnificent royal structure that can put any palace to shame.
          </p>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "Legend says that the Atlantis was built by Poseidon - the God of Sea, of storms and earthquakes when he fell in love with a mortal woman Cleito."
          </blockquote>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Legend says that the Atlantis was built by Poseidon - the God of Sea, of storms and earthquakes when he fell in love with a mortal woman Cleito. He made this city on top of a hill, on an isolated island in the sea, to protect her and named it Atlantis. The legendary Atlantis Dubai was the first resort to be built on the world's largest man-made island and is themed on the myth of Atlantis.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            This resort is a crown on the apex of Palm Jumeirah, it's a city in its own right only this place is not lost. Atlantis' towers of red bricks remind me of a castle set in a fairy tale, its iconic central arch opens a gateway to a magical kingdom.
          </p>

          <figure className="my-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_slick-page-turner/artifacts/4j4cxvva_phy2018.rst.ath.atpdayshot-landscape-hr-2.jpg"
              alt="Atlantis The Palm Dubai - A magnificent view during daytime showcasing the resort's grandeur"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
              Atlantis The Palm Dubai - A magnificent view during daytime showcasing the resort's grandeur
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Either side of this arch looks like wings extended to embrace its grandeur with elaborate playgrounds, gardens filled with butterflies and birds, and water bodies to soothe the soul every few steps. The lobby is dominated by a ceiling-high, multicoloured glass sculpture that looks like Medusa's head filled with colourful snakes rising from a fountain.
          </p>

          <figure className="my-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_slick-page-turner/artifacts/cfuimrxd_atlantisthepalm-interior-dalechihulyglasssculpture.jpg"
              alt="Dale Chihuly's magnificent glass sculpture in the Atlantis lobby - a colorful masterpiece resembling Medusa's head"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
              Dale Chihuly's magnificent glass sculpture in the Atlantis lobby - a colorful masterpiece resembling Medusa's head
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            A Two-Day Journey of Luxury
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            We decided that a stay at a resort of such exuberance deserves all our time. You know a resort is big when it has its own map. We embarked on our two-day journey of luxury and opulence. We were welcomed with goodie bags in the room with certain essentials required for our visit - like a cap, waterproof phone cover etc. The devil is in the details.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The resort's underwater theme is strictly adhered to with a palette of ocean blue and white and sea-inspired sculptures and furnishings all over. At times the hotel feels more like a mall, there are shops selling everything from luxury jewellery to toys, art, perfume, clothes, souvenirs and even property and homes!
          </p>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "The hotel on finer scrutiny seems like a movie set that even has soundtracks as the music keeps playing through speakers hidden in hedges."
          </blockquote>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Lost Chambers Aquarium
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            As an imperial guest we had access to the exclusive Imperial Club Lounge and decided to begin with tea, whose spread was fit for kings and queens. The lounge overlooks a sunset terrace with a view of the tranquil Arabian Sea. With happy tummies, we strutted to The Lost Chambers aquarium.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The legend of Atlantis truly comes alive amidst the intriguing tunnels and passageways. There is adventure and education in equal measure here. Not only can you spend hours watching the magical sea creatures, but in the chambers, you'll learn about the history of Atlantis, which has been lost for thousands of years.
          </p>

          <figure className="my-8">
            <img 
              src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="The Lost Chambers Aquarium brings the myth of Atlantis to life"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
              The Lost Chambers Aquarium brings the myth of Atlantis to life
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Aquaventure Waterpark Adventures
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            I woke up the next day even before the alarm rang out of sheer excitement for the adventurous day ahead. Our agenda for the day was to have fun at the AQUAVENTURE WATERPARK! The water park consists of impressive water rides and adventures fit for all ages.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Our favourite was the Poseidon Revenge which begins as you climb into one of the two launching capsules with your feet on a trapdoor. The ride pulls away the floor beneath your feet, plummeting you 31 metres down through the loops of the 116-metre water slide, as you freefall at a speed of 60 km/h.
          </p>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "Atlantis is surrounded by a sandy beach which is only accessible to hotel guests. The water is very shallow and usually tepid which makes it a great place to practice some stand-up paddling or water sports."
          </blockquote>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Culinary Experiences
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            You could stay at Atlantis for three weeks and dine at a different spot every day. Lunch was at the White. We loved the boho design of the WHITE and of course the amazing view from the infinity pool right at the beach. My favourite was the avocado & truffle pizza while sipping on margaritas.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Dinner was at our very own Hell's Kitchen, sorry I meant Bread Street Kitchen and Bar by Gordon Ramsay. The restaurant feels like an outpost of London in Dubai with the iconic red telephone booth adding sass to the vibe. The portions are generous, and each dish is heart-warming and made with the finest ingredients.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Final Thoughts
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Atlantis The Palm is certainly more than just a resort in Dubai, this place feels like stepping into another world full of relaxation, enjoyment & pleasure for all kinds of travellers. Regardless of whether you are a solo traveller, family with kids, a couple or a bunch of friends who like to party this resort has got you covered!
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            We only stayed here for two nights which clearly wasn't enough to explore the whole hotel to the fullest but now we know that the Atlantis The Palm Dubai is the most famous and sought-after hotel in Dubai for good reason!
          </p>
        </motion.article>

        {/* Tags */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200"
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

        {/* Back to Travel */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            to="/category/travel"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Travel Articles
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default RoyalAtlantisPage;