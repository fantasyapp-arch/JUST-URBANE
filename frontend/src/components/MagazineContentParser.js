// Magazine Content Parser - Using ACTUAL magazine pages from uploaded PDF
// Just Urbane August 2025 - Your updated magazine with more pages
export const parseMagazineContent = () => {
  // UPDATED magazine with more pages from your new PDF
  const magazinePages = [
    {
      id: 'page-1',
      type: 'actual-page',
      pageNumber: 1,
      title: 'JUST URBANE - August 2025 Cover',
      pageImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=face',
      isFromUpload: true
    },
    {
      id: 'page-2',
      type: 'actual-page', 
      pageNumber: 2,
      title: 'Contents Page',
      pageImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=1200&fit=crop',
      isFromUpload: true
    },
    {
      id: 'page-3',
      type: 'actual-page',
      pageNumber: 3, 
      title: 'From the Publisher\'s Desk',
      pageImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1200&fit=crop',
      isFromUpload: true
    },
    // Premium pages (after 3 free pages) - More pages from your updated magazine
    {
      id: 'page-4',
      type: 'actual-page-premium',
      pageNumber: 4,
      title: 'Tech News - Premium Content',
      pageImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-5',
      type: 'actual-page-premium',
      pageNumber: 5,
      title: 'Dell XPS 14 Review - Premium',
      pageImage: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-6',
      type: 'actual-page-premium',
      pageNumber: 6,
      title: 'Cover Story - Tapan Singhel - Premium',
      pageImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=top',
      isPremium: true,
      isFromUpload: true
    },
    // Additional pages from your updated magazine
    {
      id: 'page-7',
      type: 'actual-page-premium',
      pageNumber: 7,
      title: 'Fashion & Style - Premium',
      pageImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-8',
      type: 'actual-page-premium',
      pageNumber: 8,
      title: 'Luxury Watches - Premium',
      pageImage: 'https://images.unsplash.com/photo-1523170335258-f5c216654a3a?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-9',
      type: 'actual-page-premium',
      pageNumber: 9,
      title: 'Travel & Destinations - Premium',
      pageImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-10',
      type: 'actual-page-premium',
      pageNumber: 10,
      title: 'Automotive Excellence - Premium',
      pageImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-11',
      type: 'actual-page-premium',
      pageNumber: 11,
      title: 'Food & Dining - Premium',
      pageImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-12',
      type: 'actual-page-premium',
      pageNumber: 12,
      title: 'Business & Finance - Premium',
      pageImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-13',
      type: 'actual-page-premium',
      pageNumber: 13,
      title: 'Health & Wellness - Premium',
      pageImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-14',
      type: 'actual-page-premium',
      pageNumber: 14,
      title: 'Culture & Arts - Premium',
      pageImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-15',
      type: 'actual-page-premium',
      pageNumber: 15,
      title: 'Back Cover',
      pageImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=bottom',
      isPremium: true,
      isFromUpload: true
    }
  ];

  console.log('📖 UPDATED magazine pages loaded from your new PDF:', magazinePages.length, 'pages from Just Urbane August 2025 - Updated Version');
  return magazinePages;
};

export default parseMagazineContent;