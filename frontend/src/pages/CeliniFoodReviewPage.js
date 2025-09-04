import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const CeliniFoodReviewPage = () => {
  const article = {
    title: "A bit of Italiano at the newly re-launched Celini",
    subtitle: "Celini feels like Mumbai's answer to the marvelous chef Franco's welcome note that is one which punches well above its weight. It's all things Italian at Celini! Here's what we saw at the restaurant in a quick visit.",
    category: "Food",
    subcategory: "Food Review",
    author: "Team Urbane",
    date: "June 2022",
    readTime: "6 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/oaskh2yo_Celini.JPG",
    tags: ['Italian Cuisine', 'Mumbai Restaurants', 'Grand Hyatt', 'Fine Dining', 'Chef Gianfranco', 'Restaurant Review', 'Celini']
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
            <Link to="/category/food" className="hover:text-gray-900 font-medium">Food</Link>
            <span>/</span>
            <Link to="/category/food/food-review" className="hover:text-gray-900 font-medium">Food Review</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Celini Restaurant Review</span>
          </nav>
        </div>
      </div>

      {/* Hero Image Only */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="Celini Restaurant - Elegant fine dining Italian restaurant at Grand Hyatt Mumbai"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Article Title Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
              {article.category} • {article.subcategory}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight text-gray-900">
            {article.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            {article.subtitle}
          </p>
        </motion.div>

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
              className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-orange-600 transition-colors">
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
          <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium drop-cap">
            "Nowness in a little over a dozen dishes". Somewhere I had read these words, describing a new restaurant entrant in some part of the world, for its menu. And I could co-relate it to this restaurant's menu when I skimmed through it.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Menus can do it. Capture a moment in time. Celini, Mumbai's classic fine dining Italian relaunched in time when the economy resurrects and ups its pace. It's all very 2022! Smart, keenly priced, ingredient led, it's a menu that understands our palate before even serving it to us at the table.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            It's an amalgamation of food and a crisp conceptual proposition. Helmed by Chef Gianfranco Tuttolani, hailing from the provincial capital of Chieti, flavours of the Abruzzi province is brought to the fore through his masterful culinary expertise. With accolades from the Italian Chef Federation, A.C.V.S. (Villa Santa Maria Chef Association) and ambassadorship across various fronts, his culinary prowess extended multifield when he represented Italian cuisine at the 5th Italian Cuisine in the World Forum in Greece.
          </p>

          <blockquote className="border-l-4 border-orange-500 bg-orange-50 p-6 my-8 italic text-xl text-orange-900 leading-relaxed">
            "It is a great pleasure to take up my new role as head Chef of Celini at Grand Hyatt Mumbai Hotel and Residences. It will be exciting to implement my skills and knowledge, and bring to the people of Mumbai, authentic and traditional flavours from my home country-Italy." - Chef Gianfranco Tuttolani
          </blockquote>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            As Chef Gianfranco takes on his next assignment as Head Chef of Grand Hyatt Mumbai's Italian Signature restaurant Celini, he states the above with enthusiasm and passion that's infectious.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            And it's not just the food; it's also the befitting setting we are ambiently marked with. There's the pared-back art inspired décor, slate grey ceiling and white walls adorned by masterpieces of installations. And of course, the end to end open kitchen. Not to miss are its artefacts, one such being Yogadakshinamurti, an installation that symbolises the movements within our bodies, the sun and the constellations, thus personifying immeasurable celestial bodies!
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Signature Italian Dishes
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            All these also resonate with the Italian fare that conjured before our eyes at the table with a melange of flavours. Let's dive into the culinary journey that awaited us at Celini.
          </p>

          <figure className="my-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/atuk7005_Spaghetti%20Aglio%2C%20Olio%20e%20Peperoncino.jpg"
              alt="Spaghetti Aglio, Olio e Peperoncino - Classic Italian pasta with garlic, olive oil, and chili perfectly prepared at Celini"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
              Spaghetti Aglio, Olio e Peperoncino - Classic Italian pasta with garlic, olive oil, and chili perfectly prepared at Celini
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The Spaghetti Aglio, Olio e Peperoncino stood out as a masterpiece of simplicity. This classic Roman dish, prepared with just garlic, olive oil, and chili, showcased Chef Gianfranco's ability to elevate the most basic ingredients into something extraordinary. The pasta was cooked to perfect al dente, and each strand was beautifully coated with the aromatic oil, creating a harmonious balance of flavors that danced on the palate.
          </p>

          <figure className="my-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_just-urbane-revamp/artifacts/n51l3mul_Caprese%20and%20Prosciutto.jpg"
              alt="Caprese and Prosciutto - Fresh mozzarella, cherry tomatoes, basil, and premium prosciutto representing the finest Italian antipasti"
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic">
              Caprese and Prosciutto - Fresh mozzarella, cherry tomatoes, basil, and premium prosciutto representing the finest Italian antipasti
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The Caprese and Prosciutto plate was a visual and culinary delight. The fresh mozzarella, sourced to perfection, paired beautifully with the vibrant cherry tomatoes and aromatic basil leaves. The premium prosciutto added a sophisticated saltiness that complemented the freshness of the other ingredients, creating a symphony of authentic Italian flavors that transported us straight to the Italian countryside.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Complete Italian Experience
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Other notable mentions from our dining experience included the delicate Millefeuille with its perfectly layered pastry, the rich and creamy Mushroom Ravioli that melted in the mouth, the tender Ossobuco that fell off the bone, the fresh and flavorful Seabass Livornese, and the classic Panna Cotta that provided the perfect sweet ending to our meal.
          </p>

          <blockquote className="border-l-4 border-orange-500 bg-orange-50 p-6 my-8 italic text-xl text-orange-900 leading-relaxed">
            "It's also the house for Celini's all-time favourite wood-fired pizzas, pastas and risotto, paired with an exhaustive list of distinctively refreshing Italian red and white wines."
          </blockquote>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The restaurant maintains its reputation for authentic wood-fired pizzas, perfectly crafted pastas, and creamy risottos. The wine selection, carefully curated to complement the Italian cuisine, features both robust reds and crisp whites that enhance the dining experience and transport guests on a true Italian culinary journey.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Ambiance and Design Excellence
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The restaurant's design philosophy embraces contemporary Italian aesthetics while maintaining warmth and sophistication. The open kitchen concept allows diners to witness the culinary artistry in action, while the carefully chosen artworks and installations create an atmosphere that's both elegant and inviting. The slate grey ceiling and pristine white walls provide the perfect backdrop for the vibrant colors and aromas emanating from the kitchen.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Final Verdict
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Celini feels like Mumbai's answer to the marvelous chef Franco's welcome note that is one which punches well above its weight. With it being a definite must-visit, we endorse it for its authenticity and all things Italian! The restaurant successfully bridges the gap between traditional Italian cooking and contemporary dining expectations, making it a standout destination in Mumbai's competitive culinary landscape.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Whether you're a connoisseur of Italian cuisine or someone looking to explore authentic flavors, Celini offers an experience that goes beyond just dining – it's a journey through Italy's rich culinary heritage, expertly guided by Chef Gianfranco's passionate cooking and the restaurant's commitment to excellence.
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

        {/* Back to Food Reviews */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            to="/category/food/food-review"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Food Reviews
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CeliniFoodReviewPage;