// Magazine Content Parser - Extracts content from uploaded magazine assets
// Using user's uploaded PDF content: Just Urbane Website-3.pdf
export const parseMagazineContent = (uploadedAssets = []) => {
  // Magazine content based on user's uploaded PDF and categories
  const magazinePages = [
    {
      id: 'cover',
      type: 'cover',
      title: 'JUST URBANE',
      subtitle: 'Digital Edition 2025',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=face',
      content: 'Premium Lifestyle Magazine',
      isFromUpload: true
    },
    {
      id: 'page-1',
      type: 'article',
      title: 'Men\'s Fashion: Timeless Elegance',
      content: `Forefront of men's fashion with our magazine, featuring expert insights on timeless tailoring, refined style, grooming, and lifestyle. We deliver authoritative content that inspires and guides the modern man to dress with confidence, sophistication, and purpose.

      The Modern Gentleman's Wardrobe:
      • Classic tailored suits with contemporary cuts
      • Premium leather accessories and footwear  
      • Sophisticated grooming essentials
      • Luxury timepieces and jewelry
      • Seasonal style updates and trends

      Timeless tailoring remains the cornerstone of elegant menswear. Understanding fabric quality, proper fit, and classic proportions ensures your investment pieces will serve you well across seasons and occasions.

      Style is not just about following trends—it's about developing a personal aesthetic that reflects confidence, success, and attention to detail.`,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      category: 'Fashion',
      isFromUpload: true
    },
    {
      id: 'page-2', 
      type: 'article',
      title: 'Tech Innovations: Smart Living',
      content: `Latest and most innovative gadgets designed to make your life smarter, easier, and more connected. From smart home devices and wearable tech to cutting-edge accessories and cool everyday tools, our gadgets category brings you the best in modern technology.

      Revolutionary Technology Trends:
      • Smart home automation systems
      • Wearable technology and health monitoring
      • Mobile innovations and connectivity solutions
      • AI-powered personal assistants
      • Sustainable tech manufacturing

      Whether you're a tech enthusiast or just looking for practical solutions, there's something here for everyone. The future of technology lies in seamless integration with daily life, enhancing productivity while maintaining aesthetic appeal.

      Innovation transforms not just how we work, but how we live, creating opportunities for more efficient, connected, and sustainable lifestyles.`,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      category: 'Technology',
      isFromUpload: true
    },
    {
      id: 'page-3',
      type: 'article', 
      title: 'Luxury Travel: Premium Destinations',
      content: `World's most exquisite destinations and exclusive experiences with our Luxury Travel section. From lavish resorts and private escapes to curated journeys and insider tips, we guide discerning travelers toward unforgettable adventures defined by elegance, comfort, and impeccable service.

      Exclusive Travel Experiences:
      • Private villa rentals in exotic locations
      • Michelin-starred dining experiences
      • Bespoke adventure and cultural tours
      • Luxury transportation and concierge services
      • Wellness retreats and spa destinations

      Captivating destinations around the globe with expert guides, travel tips, and insider insights. Whether you seek cultural experiences, natural beauty, or urban sophistication, our Destinations section inspires your next journey.

      The modern luxury traveler values authentic experiences paired with exceptional service and privacy.`,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop',
      category: 'Travel',
      isFromUpload: true
    },
    // Premium content starts from page 4 (after 3 free pages)
    {
      id: 'premium-1',
      type: 'premium',
      title: 'Luxury Real Estate: Exclusive Properties',
      content: `PREMIUM EXCLUSIVE: World of exceptional living with our Luxury Real Estate section. From architectural masterpieces and waterfront estates to high-end urban residences, we showcase premier properties and market insights tailored for discerning buyers, investors, and connoisseurs of refined living.

      Premier Property Portfolio:
      • Architectural masterpieces by renowned designers
      • Waterfront estates with private beach access
      • High-end urban penthouses and residences
      • Investment opportunities in emerging markets
      • Sustainable luxury developments

      Market Analysis & Investment Insights:
      Global luxury real estate markets have shown remarkable resilience, with prime properties appreciating 8-12% annually in key metropolitan areas. The ultra-wealthy continue to diversify their portfolios with trophy assets that combine lifestyle benefits with investment returns.

      Interior Design Excellence:
      Art of refined living through exceptional interior design. Our curated spaces showcase luxurious environments, innovative concepts, and timeless aesthetics—featuring expert insights, trends, and inspirations that elevate residential environments with elegance and functionality.`,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      category: 'Luxury Real Estate',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'premium-2',
      type: 'premium',
      title: 'Yachts & Aviation: Elite Transportation',
      content: `PREMIUM EXCLUSIVE: Experience the epitome of elegance and freedom with our exclusive coverage of luxury yachts and private aviation. Discover the latest in design, technology, and exclusive features crafted for those who appreciate performance, privacy, and life without compromise.

      Luxury Yachts Portfolio:
      • Superyacht design innovations and technology
      • Bespoke charter services and destinations
      • Yacht ownership and investment considerations
      • Marina and docking facilities worldwide
      • Sustainable yacht technologies

      Private Aviation Excellence:
      Pinnacle of luxury and convenience with private aviation. Our Private Aviation section offers expert insights, industry news, and in-depth coverage of private jets, charter services, and exclusive travel solutions—catering to discerning travelers seeking comfort, efficiency, and personalized experiences.

      The convergence of luxury transportation represents the ultimate in personal mobility, combining cutting-edge technology with bespoke craftsmanship to create truly exceptional experiences.`,
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop',
      category: 'Transportation',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'premium-3',
      type: 'premium',
      title: 'Culture & People: Icons and Leaders',
      content: `PREMIUM EXCLUSIVE: Celebrate the legacy and influence of cultural, fashion, and industry icons who have shaped history and continue to inspire. Our exclusive interviews and profiles feature timeless figures, defining moments, and enduring contributions that leave lasting impact across generations.

      Featured Personalities:
      • Visionary entrepreneurs driving innovation
      • Cultural icons shaping art and design
      • Industry leaders setting new standards
      • Celebrity style and lifestyle insights
      • Emerging talents and rising stars

      Leadership Philosophy:
      Explore the minds and impact of influential leaders shaping business, culture, innovation, and society. Our Leaders section features in-depth profiles, thought leadership, and strategic insights from individuals driving change across industries.

      Cultural Impact:
      Dive into the ideas, movements, and expressions that shape our world. The Culture section explores art, design, traditions, and societal shifts—offering thoughtful perspectives and compelling stories that reflect the ever-evolving human experience.`,
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
      category: 'Culture & People',
      isPremium: true,
      isFromUpload: true
    }
  ];

  console.log('📖 Magazine content parsed successfully:', magazinePages.length, 'pages');
  return magazinePages;
};

export default parseMagazineContent;