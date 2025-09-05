import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AasthaGillPage = () => {
  const images = [
    {
      src: "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/dsluk0el_DSC04677.jpg",
      alt: "Aastha Gill - Professional Portrait 1"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/tbyel69s_DSC04682.jpg", 
      alt: "Aastha Gill - Professional Portrait 2"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/mfwqytuc_DSC04702%20-%20Copy%20%282%29.jpg",
      alt: "Aastha Gill - Professional Portrait 3"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_style-luxury-mag/artifacts/sesnkybp_DSC04716.jpg",
      alt: "Aastha Gill - Professional Portrait 4"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Navigation Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/category/people" className="hover:text-black transition-colors">People</Link>
            <span className="mx-2">/</span>
            <Link to="/category/people/celebrities" className="hover:text-black transition-colors">Celebrities</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Aastha Gill</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Image - Full Resolution */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <img 
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-auto rounded-lg shadow-lg"
            style={{ maxHeight: 'none' }} // Allow full resolution
          />
        </motion.div>

        {/* Article Header */}
        <motion.header 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">People</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Celebrities</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The 'Buzz' Queen: An Exclusive Interview with Aastha Gill
          </h1>
          
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <div className="flex items-center gap-6">
              <span className="font-medium">By Amisha Shirgave</span>
              <span>6 min read</span>
              <span>Celebrity Interview</span>
            </div>
          </div>
        </motion.header>

        {/* Article Body */}
        <motion.div 
          className="prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Debuting her music career with Fugly, Aastha Gill sure has come a long way. In conversation with Just Urbane, she talks about her childhood, working with Badshah, Khatron ke Khiladi season 11, and much more.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            From Dolce and Gabbana's gem studded Spring Summer'22 collection to the 'Buzz' queen of the industry, Aastha Gill has made her mark in Bollywood music. Debuting her music career with Fugly, she sure has come a long way. In this exclusive conversation with Just Urbane, she opens up about her journey, collaborations, and aspirations.
          </p>

          {/* Section: Musical Foundation */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Musical Foundation</h2>
            <div className="bg-gray-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-6">
              <p className="font-semibold text-gray-800 mb-2">What was your childhood like? How were you as a student and did you always aspire to become a singer?</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              I grew up in a very happy household sharing a very close bond with my family and especially my sister. I had a normal upbringing just like every other child in Delhi. I was always inclined towards music and dance from a very young age. Being a music director, my dad would practice music in the house and always insisted that I learn music and taught me a lot along the way.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              I was always passionate about dancing, singing, and performing. Basically, taking over the stage. I would always participate in school and college fests. Having graduated in mass communication, I was working in an ad agency where I got my first break from a college fest and that's how my journey towards career in music started.
            </p>
          </motion.section>

          {/* Image 2 - Full Resolution */}
          <motion.figure 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img 
              src={images[1].src}
              alt={images[1].alt}
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: 'none' }} // Allow full resolution
            />
            <figcaption className="text-center text-sm text-gray-600 mt-4 italic">
              Aastha Gill showcasing her distinctive style and personality
            </figcaption>
          </motion.figure>

          {/* Section: Bollywood Debut */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Bollywood Debut</h2>
            <div className="bg-gray-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-6">
              <p className="font-semibold text-gray-800 mb-2">As we all know that your Bollywood singing debut was through Fugly, how would you like to share that experience and the efforts behind it?</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-8">
              When I got my first break for Fugly, I was actually still working with an Ad Agency, and I was super excited to get such a great opportunity. I loved the thrill of recording for the first time for a movie and the whole experience was so new and fresh for me.
            </p>
          </motion.section>

          {/* Quote Section */}
          <motion.blockquote 
            className="bg-purple-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-10 italic text-lg text-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            "As a child, I was passionate about dancing, singing, and performing. Basically, taking over the stage. I never gave up on that."
          </motion.blockquote>

          {/* Section: Fashion and Style */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fashion and Style Philosophy</h2>
            <div className="bg-gray-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-6">
              <p className="font-semibold text-gray-800 mb-2">What's your definition of fashion and how do you prefer making statements just through your style?</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              I love making statements through my style and that's how I would define my style. I'm a digger for sneakers, shades, bags, and caps. Recently, I have discovered my love for Indian attires and totally enjoying it this wedding season.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              I believe everyone has their unique style and one should nurture it and bring forward what suits them most, irrespective of time and age. But honestly, I haven't completely explored this road of fashion but totally looking forward to it in the upcoming years.
            </p>
          </motion.section>

          {/* Image 3 - Full Resolution */}
          <motion.figure 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img 
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: 'none' }} // Allow full resolution
            />
            <figcaption className="text-center text-sm text-gray-600 mt-4 italic">
              The confident artist expressing her unique personality through fashion
            </figcaption>
          </motion.figure>

          {/* Section: The Badshah Connection */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Badshah Connection</h2>
            <div className="bg-gray-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-6">
              <p className="font-semibold text-gray-800 mb-2">You've had major hit songs with Badshah and the audience just can't stop grooving to your music. What would you like to tell us about working with Badshah?</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              My experience with Badshah bhai has always been incredibly great. He is family to me and when we work on a project it is more like a family working together. He is a big brother, who has always guided me towards the best and has been very kind to me since the beginning.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              It is such a homely and chill vibe working with him and the space he creates for two artists to collaborate is incredible. Whoever has worked with Badshah would say he is the most easiest to work with. Yes, you'll be hearing a lot more from us.
            </p>
          </motion.section>

          {/* Section: Khatron Ke Khiladi */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Khatron Ke Khiladi Experience</h2>
            <div className="bg-gray-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-6">
              <p className="font-semibold text-gray-800 mb-2">You've been in the buzz for your actions in KKK11. Would you say that your journey there has been a bit life changing?</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yes, indeed it has been. When you try something for the first time, the experience is always life-changing and a memorable one. When I got a call for KKK, I was a little unsure initially but then I was like bring it on as I have not done any reality show in the past and this will be my debut on television.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              I always wanted to be a part of a reality tv show that showcases my inner personality which is not completely possible through a song or a social media post for the audience/fans to see who Aastha Gill really is. Secondly, it was time to face my fears and through this show, I was able to overcome a lot of them.
            </p>
          </motion.section>

          {/* Image 4 - Full Resolution */}
          <motion.figure 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img 
              src={images[3].src}
              alt={images[3].alt}
              className="w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: 'none' }} // Allow full resolution
            />
            <figcaption className="text-center text-sm text-gray-600 mt-4 italic">
              Aastha Gill's journey from playback singer to celebrated artist
            </figcaption>
          </motion.figure>

          {/* Final Quote Section */}
          <motion.blockquote 
            className="bg-purple-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-10 italic text-lg text-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            "I believe everyone has their unique style and one should nurture it and bring forward what suits them most, irrespective of time and age."
          </motion.blockquote>

          {/* Section: Words of Inspiration */}
          <motion.section 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Words of Inspiration</h2>
            <div className="bg-gray-50 border-l-4 border-purple-600 pl-6 pr-6 py-4 mb-6">
              <p className="font-semibold text-gray-800 mb-2">What inspiration would you like to give our readers?</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-8">
              I would like to tell all the readers to always follow their passion and never leave the path under any pressure or situation. Have trust in the process. And lastly, always love what you do and do what you love.
            </p>
          </motion.section>
        </motion.div>

        {/* Tags Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['Aastha Gill', 'Bollywood', 'Singer', 'Badshah', 'Buzz', 'Paani Paani', 'Khatron Ke Khiladi', 'Celebrities', 'Music Industry', 'Interview'].map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Back Navigation */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link 
            to="/category/people/celebrities"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium"
          >
            ← Back to Celebrities
          </Link>
        </motion.div>
      </article>
    </motion.div>
  );
};

export default AasthaGillPage;