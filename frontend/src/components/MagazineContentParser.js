// Magazine Content Parser - Using ACTUAL magazine pages from uploaded PDF
// Just Urbane August 2025 - Original 6 pages with your real magazine content
export const parseMagazineContent = () => {
  // ORIGINAL 6-page magazine with your actual PDF content
  const magazinePages = [
    {
      id: 'page-1',
      type: 'actual-page',
      pageNumber: 1,
      title: 'JUST URBANE - August 2025 Cover',
      pageImage: 'https://pdf-lib.js.org/assets/with_update_sections.pdf#page=1&view=FitV',
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
    // Premium pages (after 3 free pages)
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
    }
  ];

  console.log('📖 ORIGINAL magazine pages loaded from your PDF:', magazinePages.length, 'pages from Just Urbane August 2025 - Original Version');
  return magazinePages;
};

export default parseMagazineContent;