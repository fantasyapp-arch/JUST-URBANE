import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Eye, User, Tag, Crown, Share2, Heart, ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner, { SkeletonArticle } from '../components/LoadingSpinner';
import PremiumContentGate from '../components/PremiumContentGate';
import MagazineReader from '../components/MagazineReader';
import { useAuth } from '../context/AuthContext';
import { useArticle, useArticles } from '../hooks/useArticles';
import { formatDate, formatReadingTime } from '../utils/formatters';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: article, isLoading, error } = useArticle(slug);
  const { data: allArticles } = useArticles();
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <SkeletonArticle />
        </div>
      </div>
    );
  }

  // Fallback article data for Royal Atlantis Palm
  const atlantisArticle = {
    id: 'atlantis-the-palm-dubai',
    slug: 'atlantis-the-palm-dubai',
    title: 'Atlantis The Palm: A Mythical Journey to Dubai\'s Crown Jewel',
    subtitle: 'This month we head to Atlantis, the Palm in Dubai. And, trust me it isn\'t just a picturesque resort on world\'s largest man-made island, but instead is reminiscent of the castles from your yesteryears fairy tale',
    category: 'Travel',
    subcategory: 'Luxury Stays',
    author: { name: 'Chahat Dalal' },
    publishDate: '2022-07-01T00:00:00Z',
    readingTime: 8,
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isPremium: false,
    tags: ['Dubai', 'Luxury Travel', 'Atlantis', 'Palm Jumeirah', 'Resort', 'Aquaventure', 'Luxury Stays'],
    content: `
<p class="lead">Atlantis - the lost island, filled with myths and magic, it's a story that captures one's imagination, inspired by Plato who told the story of Atlantis around 360 B.C. He proclaimed the founders of Atlantis, were half-god and half-human. Well, Atlantis the Palm Dubai makes sure to treat you like God.</p>

<p>Lost cities, mystic ships and hidden treasures, are all part of the alluring marine world. Of all these, the lost city of Atlantis tops the list but trust Dubai to build its own sunken city and surround it with the magnificent royal structure that can put any palace to shame.</p>

<blockquote>Legend says that the Atlantis was built by Poseidon - the God of Sea, of storms and earthquakes when he fell in love with a mortal woman Cleito.</blockquote>

<p>Legend says that the Atlantis was built by Poseidon - the God of Sea, of storms and earthquakes when he fell in love with a mortal woman Cleito. He made this city on top of a hill, on an isolated island in the sea, to protect her and named it Atlantis. The legendary Atlantis Dubai was the first resort to be built on the world's largest man-made island and is themed on the myth of Atlantis.</p>

<p>This resort is a crown on the apex of Palm Jumeirah, it's a city in its own right only this place is not lost. Atlantis' towers of red bricks remind me of a castle set in a fairy tale, its iconic central arch opens a gateway to a magical kingdom.</p>

<img src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="The iconic Atlantis The Palm Dubai with its majestic architecture" class="article-image" />

<p>Either side of this arch looks like wings extended to embrace its grandeur with elaborate playgrounds, gardens filled with butterflies and birds, and water bodies to soothe the soul every few steps. The lobby is dominated by a ceiling-high, multicoloured glass sculpture that looks like Medusa's head filled with colourful snakes rising from a fountain.</p>

<h3>A Two-Day Journey of Luxury</h3>

<p>We decided that a stay at a resort of such exuberance deserves all our time. You know a resort is big when it has its own map. We embarked on our two-day journey of luxury and opulence. We were welcomed with goodie bags in the room with certain essentials required for our visit - like a cap, waterproof phone cover etc. The devil is in the details.</p>

<p>The resort's underwater theme is strictly adhered to with a palette of ocean blue and white and sea-inspired sculptures and furnishings all over. At times the hotel feels more like a mall, there are shops selling everything from luxury jewellery to toys, art, perfume, clothes, souvenirs and even property and homes!</p>

<blockquote>The hotel on finer scrutiny seems like a movie set that even has soundtracks as the music keeps playing through speakers hidden in hedges.</blockquote>

<h3>The Lost Chambers Aquarium</h3>

<p>As an imperial guest we had access to the exclusive Imperial Club Lounge and decided to begin with tea, whose spread was fit for kings and queens. The lounge overlooks a sunset terrace with a view of the tranquil Arabian Sea. With happy tummies, we strutted to The Lost Chambers aquarium.</p>

<p>The legend of Atlantis truly comes alive amidst the intriguing tunnels and passageways. There is adventure and education in equal measure here. Not only can you spend hours watching the magical sea creatures, but in the chambers, you'll learn about the history of Atlantis, which has been lost for thousands of years.</p>

<img src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="The Lost Chambers Aquarium brings the myth of Atlantis to life" class="article-image" />

<h3>Aquaventure Waterpark Adventures</h3>

<p>I woke up the next day even before the alarm rang out of sheer excitement for the adventurous day ahead. Our agenda for the day was to have fun at the AQUAVENTURE WATERPARK! The water park consists of impressive water rides and adventures fit for all ages.</p>

<p>Our favourite was the Poseidon Revenge which begins as you climb into one of the two launching capsules with your feet on a trapdoor. The ride pulls away the floor beneath your feet, plummeting you 31 metres down through the loops of the 116-metre water slide, as you freefall at a speed of 60 km/h.</p>

<blockquote>Atlantis is surrounded by a sandy beach which is only accessible to hotel guests. The water is very shallow and usually tepid which makes it a great place to practice some stand-up paddling or water sports.</blockquote>

<h3>Culinary Experiences</h3>

<p>You could stay at Atlantis for three weeks and dine at a different spot every day. Lunch was at the White. We loved the boho design of the WHITE and of course the amazing view from the infinity pool right at the beach. My favourite was the avocado & truffle pizza while sipping on margaritas.</p>

<p>Dinner was at our very own Hell's Kitchen, sorry I meant Bread Street Kitchen and Bar by Gordon Ramsay. The restaurant feels like an outpost of London in Dubai with the iconic red telephone booth adding sass to the vibe. The portions are generous, and each dish is heart-warming and made with the finest ingredients.</p>

<h3>Final Thoughts</h3>

<p>Atlantis The Palm is certainly more than just a resort in Dubai, this place feels like stepping into another world full of relaxation, enjoyment & pleasure for all kinds of travellers. Regardless of whether you are a solo traveller, family with kids, a couple or a bunch of friends who like to party this resort has got you covered!</p>

<p>We only stayed here for two nights which clearly wasn't enough to explore the whole hotel to the fullest but now we know that the Atlantis The Palm Dubai is the most famous and sought-after hotel in Dubai for good reason!</p>
    `
  };

  // Use fallback article if API fails and slug matches
  const displayArticle = article || (slug === 'atlantis-the-palm-dubai' ? atlantisArticle : null);

  if (error && slug !== 'atlantis-the-palm-dubai') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Category Labels like GQ India - moved here after loading check
  const categoryLabels = {
    fashion: "Look Good",
    technology: "Get Smart", 
    tech: "Get Smart",
    business: "Get Smart",
    finance: "Get Smart",
    travel: "Live Well",
    health: "Live Well",
    culture: "Entertainment",
    art: "Entertainment",
    entertainment: "Entertainment",
    auto: "Live Well",
    grooming: "Look Good",
    food: "Live Well",
    aviation: "Live Well", 
    people: "Entertainment",
    luxury: "Live Well"
  };

  const categoryLabel = categoryLabels[displayArticle?.category] || "Category";
  const canReadPremium = isAuthenticated && user?.is_premium && user?.subscription_status === 'active';
  const isLocked = displayArticle?.is_locked || (displayArticle?.is_premium && !canReadPremium);

  const openMagazineReader = () => {
    if (allArticles && allArticles.length > 0) {
      // Find current article's index and create a magazine starting from that article
      const currentIndex = allArticles.findIndex(a => a.slug === displayArticle.slug || a.id === displayArticle.id);
      const magazineArticles = currentIndex >= 0 ? 
        [...allArticles.slice(currentIndex), ...allArticles.slice(0, currentIndex)] : 
        allArticles;
      setIsReaderOpen(true);
    }
  };

  const closeMagazineReader = () => {
    setIsReaderOpen(false);
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.dek,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb - GQ Style */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900 font-medium">Home</Link>
            <span>/</span>
            <Link to={`/category/${article.category}`} className="hover:text-gray-900 font-medium capitalize">
              {article.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{article.title}</span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-16">
        {/* Article Header - Professional GQ Style */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category Label */}
          <div className="mb-6">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">
              {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Subtitle/Dek */}
          {article.dek && (
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-light">
              {article.dek}
            </p>
          )}

          {/* Article Meta - Clean Style */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-gray-200 text-sm text-gray-500">
            {/* Author */}
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="font-medium">By {article.author_name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time>{formatDate(article.published_at)}</time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatReadingTime(article.reading_time)}</span>
            </div>

            {/* Views */}
            {article.view_count > 0 && (
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{article.view_count.toLocaleString()} views</span>
              </div>
            )}

            {/* Share */}
            <button
              onClick={shareArticle}
              className="flex items-center hover:text-gray-700 transition-colors ml-auto"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>

          {/* Magazine Reader Button - Show for all users */}
          {allArticles && allArticles.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={openMagazineReader}
                className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Read in Magazine Mode
                <Crown className="h-4 w-4 ml-2" />
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Experience this article in our interactive flip-book magazine
                {!canReadPremium && (
                  <span className="text-amber-600 font-medium"> • Free preview available</span>
                )}
              </p>
            </div>
          )}
        </motion.div>

        {/* Hero Image */}
        {article.hero_image && (
          <motion.div 
            className="mb-12 max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={article.hero_image}
                alt={article.title}
                className="w-full h-96 md:h-[600px] object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-article.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Article Content - GQ India Hybrid Model */}
          <motion.div 
            className="prose prose-lg lg:prose-xl max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Show content based on access */}
            {article.is_premium && isLocked ? (
              // Premium content gate for locked articles
              <PremiumContentGate article={article} showPreview={true} />
            ) : (
              // Full content for free articles or subscribed users
              <div>
                {article.body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && !isLocked && (
            <motion.div 
              className="mt-12 pt-8 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/search?q=${encodeURIComponent(tag)}`}
                    className="bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back to Category */}
          <motion.div 
            className="mt-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link
              to={`/category/${article.category}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {article.category} Articles
            </Link>
          </motion.div>
        </div>
      </article>

      {/* Magazine Reader */}
      <MagazineReader
        articles={allArticles}
        isOpen={isReaderOpen}
        onClose={closeMagazineReader}
        initialPageIndex={allArticles ? allArticles.findIndex(a => a.slug === article.slug || a.id === article.id) * 2 + 1 : 0}
      />
    </div>
  );
};

export default ArticlePage;