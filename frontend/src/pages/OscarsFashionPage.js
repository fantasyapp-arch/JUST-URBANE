import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, Bookmark, ArrowLeft } from 'lucide-react';

const OscarsFashionPage = () => {
  const article = {
    title: "All Glam at the 94th Academy Awards: Best Dressed Celebrities",
    subtitle: "From Zendaya's ethereal elegance to Billie Eilish's dramatic Gucci gown, discover the most stunning fashion moments from the 94th Academy Awards red carpet.",
    category: "Fashion",
    subcategory: "Women",
    author: "Rugved Marathe",
    date: "September 2025",
    readTime: "7 min read",
    heroImage: "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/ld7p0j41_94_AR_0795%20-%20Copy.jpg",
    galleryImages: [
      "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/566l18wf_94_AR_0526.jpg",
      "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/c0dpwc9i_94_AR_0377.jpg", 
      "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/w3vk01ug_94_AR_0903.jpg",
      "https://customer-assets.emergentagent.com/job_luxmag-platform/artifacts/psfl1dmc_94_AR_0615.jpg"
    ],
    tags: ['Oscars', 'Red Carpet', 'Fashion', 'Celebrity Style', 'Academy Awards', 'Designer Gowns', 'Hollywood Fashion', 'Best Dressed', '2022 Oscars']
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
            <Link to="/category/fashion/women" className="hover:text-gray-900 font-medium">Women</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Oscars Best Dressed</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src={article.heroImage}
          alt="94th Academy Awards red carpet fashion and celebrity style"
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
            <span className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
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
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
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
            <strong>The 94th Academy Awards</strong> showcased some of the most spectacular fashion moments in recent Oscar history. From stunning gowns to bold fashion statements, celebrities brought their A-game to Hollywood's biggest night. Here's our curated selection of the best dressed stars who commanded attention on the red carpet.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src={article.galleryImages[0]}
              alt="Celebrity red carpet fashion and designer gowns at the Academy Awards"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Red carpet glamour and designer fashion at the 94th Academy Awards
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Blue Hues - Megan Thee Stallion
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The famed American rapper and "Sweetest Pie" singer Megan Thee Stallion walked the red carpet in a metallic blue strapless gown that was sculpted for her. The plunging neckline number hugged her hourglass figure and featured a single waist cut-out with an asymmetrical hem. The outfit bore a ruffled pattern from her hips that gave it a substantial touch and opened into a floor-sweeping train.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Ethereal Beauty - Zendaya
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Rising star Zendaya owned the red carpet giving an ode to Sharon Stone's 1998 Oscar get-up. The Euphoria actor drew glances with her micro Valentino haute couture button-up and silver sequined skirt, designed by her storyteller stylist Law Roach. The look was a masterclass in modern elegance with a nostalgic twist.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src={article.galleryImages[1]}
              alt="Stunning Oscar gowns and sophisticated styling from Hollywood's biggest night"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Stunning gowns and sophisticated styling from Hollywood's biggest night
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Darkness Reimagined - Billie Eilish
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Haunting, black and unmissable, Billie Eilish dramatized the event with designer Alessandro Michele's off-shoulder black ruffle Gucci gown which came with a floor-sweeping long train. Moreover, she matched her hair with the outfit, styling it into bangs curling outwards. The dramatic silhouette perfectly captured her unique aesthetic.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Punk Princess - Kristen Stewart
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The best actor nominee for her role in "Spencer" about Princess Diana wore a custom Chanel black satin shorts suit that gave two manicured fingers to every traditional tulle dress at Hollywood's big night. Stewart paired her suit with Chanel Fine Jewelry ganse noir spinel necklace for its unique and sparkly spin on the tie.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src={article.galleryImages[2]}
              alt="Designer fashion and couture gowns at the Academy Awards ceremony"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Designer fashion and couture gowns at the Academy Awards ceremony
            </figcaption>
          </figure>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            Suave Manliness - Timothée Chalamet
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Timothée's risqué fit proved that fashion and timeless design shouldn't be bound by gender. Chalamet's sequined black suit by Louis Vuitton felt particularly fresh given it was plucked from Nicolas Ghesquière's spring 2022 womenswear collection. The two-piece was accentuated by Cartier's layered necklaces and white gold rings.
          </p>

          <h3 className="text-2xl font-serif font-bold text-gray-900 mt-10 mb-6">
            The Showstopper - Jason Momoa
          </h3>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            The well-adored and hulking Dune actor Jason Momoa walked the red carpet wearing a chic upcycled tuxedo from Savile Row, teamed with a bowtie. He styled his look with statement rings, wayfarer glasses and a blue and yellow pocket square in support of Ukraine. He also styled his hair into a French braid, binding it up with a pink scrunchie.
          </p>

          <figure className="my-6 sm:my-8 -mx-2 sm:-mx-4">
            <img 
              src={article.galleryImages[3]}
              alt="Elite fashion moments and designer collaborations at the Academy Awards"
              className="w-full h-48 sm:h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <figcaption className="text-sm text-gray-600 mt-3 text-center italic px-2">
              Elite fashion moments and designer collaborations at the Oscars
            </figcaption>
          </figure>

          <blockquote className="border-l-4 border-pink-500 bg-pink-50 p-6 my-8 italic text-xl text-pink-900 leading-relaxed">
            "The 94th Academy Awards proved once again that the red carpet is not just about fashion—it's about making statements, celebrating individuality, and showcasing the artistry that extends beyond the films themselves."
          </blockquote>

          <p className="text-lg text-gray-800 leading-relaxed mb-6">
            Each look told a story, reflecting the personality and creative vision of both the wearer and their styling team. From Zendaya's nostalgic elegance to Billie Eilish's gothic drama, the 2022 Oscars red carpet proved that fashion remains one of the most powerful forms of self-expression in Hollywood.
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
              className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-pink-100 hover:text-pink-700 transition-colors cursor-pointer"
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
            to="/category/fashion/women"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Women's Fashion
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OscarsFashionPage;