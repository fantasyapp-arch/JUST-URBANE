import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const FranceTravelPage = () => {
  const article = {
    title: "When In France",
    subtitle: "Summer in Paris! Sounds dreamy, right? Turns out that Eiffel Tower is not the only destination you can visit in the city of love. Keep reading to discover multiple tourist destinations in France.",
    category: "Travel",
    subcategory: "Adventure",
    author: "Amisha Shirgave",
    date: "June 2022",
    readTime: "6 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/asfm7icv_Paris%20%283%29.jpg",
    tags: ['France', 'Travel', 'Paris', 'Corsica', 'Provence', 'Mont Saint-Michel', 'Loire Valley', 'Strasbourg', 'Adventure', 'Europe', 'Destinations']
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
            <Link to="/category/travel" className="hover:text-gray-900 font-medium">Travel</Link>
            <span>/</span>
            <Link to="/category/travel/adventure" className="hover:text-gray-900 font-medium">Adventure</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">When In France Travel Guide</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="Paris, France - Iconic city view showcasing the beauty and elegance of French architecture"
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
            <strong>Mesmerised by the beauty of the land,</strong> France is one of the most popular tourist destinations in the world. A country with fine wine, delicious food, and some of the most beautiful destinations on earth, there is only so much one can take in.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            From the world-class art and architecture, beautiful beaches, medieval urban centres to the dynamic cities, Renaissance châteaux, incredible gastronomy, expansive vineyards, spectacular landscapes, and the Pyrenees and The Alps, there are innumerable breath-taking scenes in L'Hexagone.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            There is more than enough to keep interested travellers occupied, from rolling vineyards and tumbling valleys to towering sand dunes and magnificent villages. Choosing places to visit in France can be confusing because there is so much to see and do. You will definitely want to end up visiting every destination. So, to narrow down your options, here are our picks to add in your travel bucket list.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Island Of Corsica
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/flk6kpul_corsica.jpg"
              alt="Corsica, France - Spectacular coastal scenery with crystal blue waters, rugged cliffs, and picturesque Mediterranean landscape"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Corsica's spectacular coastal scenery with 1,000 kilometres of lovely blue shoreline perfect for snorkelling and scuba diving
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Corsica's spectacular coastal scenery, unspoiled woods, and snowy peaks all contribute to the island's rough and natural appeal. Beautiful beaches, calm bays, picturesque fishing towns, and busy seaside cities along the island's coastline, while the inland slopes are covered with old villages where time seems to have stopped.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            It has a gorgeous yet wild appeal, with stylish seaside cities, steep granite peaks, and unspoiled forests. It is also a destination for snorkelling and scuba diving, with 1,000 kilometres of lovely blue shoreline to uncover. You might come across much free-roaming wildlife such as pigs, cows, and goats. But there is nothing to worry about as there are no harmful snakes to disrupt your vacation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 sm:my-8 -mx-2 sm:-mx-4">
            <figure>
              <img 
                src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/bmn4zpsi_corsica%20%282%29.jpg"
                alt="Corsica coastal beauty - pristine beaches and dramatic cliffs meeting the Mediterranean Sea"
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg"
              />
              <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
                Corsica's pristine beaches and dramatic coastal formations
              </figcaption>
            </figure>
            <figure>
              <img 
                src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/o978n16c_Corsica%20%283%29.jpg"
                alt="Corsica wilderness and natural landscapes showcasing the island's untamed beauty"
                className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg"
              />
              <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
                The untamed wilderness and natural beauty of Corsica's interior
              </figcaption>
            </figure>
          </div>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Paris and Versailles
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            It is impossible to not visit Paris when in France. Paris is on top of the to-visit list among other destinations. A perfect kiss, the perfect picture before the Eiffel Tower is a dream. Paris is a major European centre known for its splendour and joie de vivre, with architectural wonders such as the Eiffel Tower and Notre-Dame Cathedral.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Paris' evocative medieval neighbourhoods and beautiful boulevards are among the city's other attractions. The UNESCO-listed Château de Versailles is a short rail trip from Paris. This lavish 17th-century palace, built for Louis XIV (the "Sun King"), is a testimony to the French monarch's greatness and ultimate power.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/wn9rzw2p_Paris.jpg"
              alt="Paris, France - Iconic Parisian architecture and city views showcasing the elegant urban landscape"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              The timeless elegance of Parisian architecture and urban sophistication
            </figcaption>
          </figure>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "A perfect kiss, the perfect picture before the Eiffel Tower is a dream. Paris is a major European centre known for its splendour and joie de vivre."
          </blockquote>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Land of Lavender: Provence
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Provence enjoys beautiful Mediterranean sunshine for most part of the year. This rural location has a raw, earthy look, as though it has been unaffected by the modern world. It is one of the most beautiful and aromatic destinations to visit in France every summer, thanks to the nearly unending waves of lavender fields.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            So basically, you get to visit, stand, or even run through fields that have a lavender scent. No wonder painters found inspiration for bright works of art in this dreamy environment. The monks of the abbey and the local honeybees tend to these lovely lavender fields. Visitors are welcome to stay with them for a peaceful spiritual retreat.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Mont Saint-Michel
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/3emjw578_St.%20Micheal.jpg"
              alt="Mont Saint-Michel, France - Magnificent medieval abbey and village rising from tidal waters, UNESCO World Heritage Site"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Mont Saint-Michel, the magnificent island village that inspired Disney's Tangled, now a UNESCO World Heritage Site
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The Normandy region's centrepiece, Mont Saint-Michel, is a peaceful environment of apple orchards, forests, and cow pastures. This must-see tourist site is at the top of a long list of Normandy travel attractions that includes spectacular views like medieval castles and picturesque towns.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The tiny, curving alleyways and charming wooden cottages that lead up to it add to the romance. In fact, the breathtaking landscape inspired Rapunzel's Tower and the Kingdom of Corona in Disney's Tangled. In the 8th century, the magnificent island village functioned as a major Christian pilgrimage centre. It is now a UNESCO World Heritage Site that receives over three million visitors each year.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Loire Valley
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/97rlqsxn_Loire%20valley%202.jpg"
              alt="Loire Valley, France - The Garden of France with magnificent châteaux, vineyards, and renaissance architecture"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Loire Valley - The "Garden of France" with its magnificent châteaux, vineyards, and Renaissance architecture
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The Loire Valley, also known as the "Garden of France," was formerly the refuge of French monarchy and nobility. Today, however, it is one of France's most iconic tourist destinations, available to all. The Loire Valley spans for 175 miles along the Loire River, winding its way past some of France's most attractive communities, including Amboise, where Leonardo da Vinci spent his final years.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The valley is also famous for its widely popular wines. In fact, several local winemakers invite tourists for a tour through their cellar and wine-tasting. Due to the obvious richness of flower gardens, fruit orchards, and vineyards, the Loire Valley is called the "Garden of France". The Cher, Loiret, Eure and Loire rivers replenish the valley, making it lush and fruitful.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Strasbourg
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_urbane-articles/artifacts/99v653zg_Strasbourg.jpg"
              alt="Strasbourg, France - Historic city center with Gothic cathedral, European Parliament seat at the meeting point of France and Germany"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Strasbourg - Meeting point between France and Germany, home to the European Parliament and stunning Gothic cathedral
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Strasbourg is the meeting point between France and Germany. Strasbourg, the capital city of the Alsace region, is located on the border between the two countries. It is home to the European Parliament as well as a slew of other important European institutions, including the European Court of Human Rights and the Council of Europe.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Grande Ile, the city's historic centre, is a must-see. The centre offers many museums and striking attractions, such as the stunning Gothic cathedral, which features pink sandstone, intricate carvings, and a 300-year-old working astrological clock.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Planning Your French Adventure
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            France offers an incredible diversity of experiences, from the romantic streets of Paris to the wild beauty of Corsica, from the lavender fields of Provence to the historic grandeur of Loire Valley châteaux. Each destination provides a unique glimpse into French culture, history, and natural beauty.
          </p>

          <blockquote className="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 italic text-xl text-blue-900 leading-relaxed">
            "From rolling vineyards and tumbling valleys to towering sand dunes and magnificent villages, France offers innumerable breath-taking scenes in L'Hexagone."
          </blockquote>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Whether you're seeking adventure in the rugged landscapes of Corsica, cultural immersion in the art-filled streets of Paris, spiritual renewal in the lavender fields of Provence, or historical exploration in the UNESCO sites of Mont Saint-Michel and Loire Valley, France delivers experiences that linger long after your return home.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The beauty of France lies not just in its famous landmarks, but in the way each region tells its own story through architecture, cuisine, landscape, and local traditions. Every corner of this remarkable country offers something special, making it truly one of the world's greatest travel destinations.
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

        {/* Back to Travel Adventures */}
        <motion.div 
          className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200 px-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            to="/category/travel/adventure"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Travel Adventures
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FranceTravelPage;