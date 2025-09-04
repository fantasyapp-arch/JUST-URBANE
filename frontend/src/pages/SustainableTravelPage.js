import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const SustainableTravelPage = () => {
  const article = {
    title: "Travel With A Clear Conscious",
    subtitle: "You have been there and done that how about doing it a different way this time? I am not talking about making a bucket list, I am talking about travelling with a consciousness. Travelling sustainably so that your future generations can see the places you love.",
    category: "Travel",
    subcategory: "Guides",
    author: "Komal Bhandekar",
    date: "August 2022",
    readTime: "5 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/uzjm9ne7_shutterstock_1982804408-_Converted_.jpg",
    tags: ['Sustainable Travel', 'Eco-Tourism', 'Responsible Travel', 'Environment', 'Green Travel', 'Carbon Footprint', 'Conservation', 'Prince Harry', 'Travalyst', 'Eco-Conscious']
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
            <Link to="/category/travel/guides" className="hover:text-gray-900 font-medium">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Sustainable Travel Guide</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="Sustainable Travel - Environmental consciousness and eco-friendly tourism practices for responsible travelers"
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
            <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
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
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
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
            <strong>Over the last few years</strong> there has been tremendous growth in the tourism sector. Overtourism is a term that best describes this scenario in which one tourist destination is being visited by a large number of tourists.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            A popular example of this is how the love lock bridge in Paris had to be taken down due to the over weight of the locks being put up by tourists visiting the monument. Many such instances have made the public adapt a more conscious way of traveling.
          </p>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Sustainable travel focuses on reducing the negative impact of traveling by cutting down carbon footprints. Introducing sustainability into travel can make a lot of difference in the conservation of our natural habitat. But do you think traveling while being sustainable can be possible? Well, the answer to it, doubles up as a question in itself. And the question is, are you ready to take a sustainable trip?
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/4oo2ga6h_shutterstock_1352447456.jpg"
              alt="Eco-friendly travel practices - Sustainable tourism and environmental conservation"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Sustainable travel practices help preserve natural destinations for future generations
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-8">
            Prince Harry, the Duke of Sussex recently launched an eco-travel campaign in New Zealand that was inspired by Maori Practices. Under his leadership, a non-profitable organisation, Travalyst that aims to promote sustainable travel. This website basically encourages travelers to choose sustainability for their upcoming travel journey.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Keep It Clean & Keep It Green
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Remember your responsibility towards nature and become a responsible guest. Do not litter and damage the properties. Try your best to recycle, conserve electricity and water, and engage in activities that don't significantly harm the environment and help in preserving the flora and fauna of the place you're visiting.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Take A Sustainable Transport
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/j394uw8l_shutterstock_2093043016.jpg"
              alt="Sustainable transportation - Eco-friendly travel options and green transport choices"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Choose sustainable transport options like trains and buses to reduce your carbon footprint
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The next step comes to your plan is the method of transportation. How to get there is a crucial step to consider. Always try to opt for a bus or a train journey as they are responsible for less carbon emission. The invention of e-buses have contributed a lot into the preservation of our planet so you must go for an e-lift whenever you are traveling.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Where To Stay?
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Searching for a sustainable stay is a task. Look for stays and hotels that recycle, have efficient waste management systems, and use renewable energy sources (solar, hydroelectric, etc). Extra points if the homestay boosts the local economy, especially if it's part of an eco-tour.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            A Return Gift
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/gvn3ryam_shutterstock_644325913.jpg"
              alt="Sustainable souvenirs - Local handicrafts and traditional products supporting local economy"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Support local economies by purchasing traditional handicrafts and sustainable souvenirs
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Who doesn't love souvenirs? But buying something that is illegal or harmful such as animal hides, ivory or intoxicants isn't a great way of gifting. You wouldn't want to risk the biodiversity of the place by carrying anything that harms the environment in any way. Instead buy gifts that support the local economy such as traditional weaves, handicrafts and local delicacies.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Where Are You Going?
          </h3>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/va4trn0r_shutterstock_572611777.jpg"
              alt="Eco-tourism destinations - Choosing sustainable travel locations and environmentally conscious tourism"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Choose eco-tourism destinations that prioritize sustainability and environmental conservation
            </figcaption>
          </figure>

          <p className="text-lg text-gray-800 leading-relaxed mb-8">
            Deciding your destination is the most important step. A considerable point to keep in mind while selecting a destination is how far the place is and what mode of transportation you would require to reach there. To travel in a more environmentally friendly manner, consider participating in eco-tourism. These kinds of businesses provide vacations to locations all over the world, giving each one a high priority for sustainability.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_magazine-ui-update/artifacts/9edzgrib_shutterstock_1611400012.jpg"
              alt="Sustainable travel destinations mapping - Exploring eco-friendly locations and responsible tourism planning"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Map out your sustainable travel destinations and plan eco-conscious journeys that benefit local communities
            </figcaption>
          </figure>

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
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer"
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
            to="/category/travel/guides"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Travel Guides
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SustainableTravelPage;