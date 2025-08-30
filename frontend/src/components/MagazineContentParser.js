// Magazine Content Parser - Using ACTUAL magazine pages from uploaded PDF
// Just Urbane August 2025 - Extracted PDF pages
export const parseMagazineContent = () => {
  // ACTUAL magazine pages from the uploaded PDF - converted to PNG images
  const magazinePages = [
    {
      id: 'page-1',
      type: 'actual-page',
      pageNumber: 1,
      title: 'JUST URBANE - August 2025 Cover',
      pageImage: '/magazine-pages/page-1.png', // Local extracted image
      isFromUpload: true
    },
    {
      id: 'page-2',
      type: 'actual-page', 
      pageNumber: 2,
      title: 'Contents Page',
      pageImage: '/magazine-pages/page-2.png', // Local extracted image
      isFromUpload: true
    },
    {
      id: 'page-3',
      type: 'actual-page',
      pageNumber: 3, 
      title: 'From the Publisher\'s Desk',
      pageImage: '/magazine-pages/page-3.png', // Local extracted image
      isFromUpload: true
    },
    // Premium pages (after 3 free pages)
    {
      id: 'page-4',
      type: 'actual-page-premium',
      pageNumber: 4,
      title: 'Tech News - Premium Content',
      pageImage: '/magazine-pages/page-4.png', // Local extracted image
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-5',
      type: 'actual-page-premium',
      pageNumber: 5,
      title: 'Dell XPS 14 Review - Premium',
      pageImage: '/magazine-pages/page-5.png', // Local extracted image
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-6',
      type: 'actual-page-premium',
      pageNumber: 6,
      title: 'Cover Story - Tapan Singhel - Premium',
      pageImage: '/magazine-pages/page-6.png', // Local extracted image
      isPremium: true,
      isFromUpload: true
    }
  ];

  console.log('📖 ACTUAL magazine pages loaded from uploaded PDF:', magazinePages.length, 'pages from Just Urbane August 2025');
  return magazinePages;
};

export default parseMagazineContent;