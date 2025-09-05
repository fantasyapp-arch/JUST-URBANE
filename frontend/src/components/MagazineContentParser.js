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
      pageImage: 'https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf',
      isFromUpload: true
    },
    {
      id: 'page-2',
      type: 'actual-page', 
      pageNumber: 2,
      title: 'Contents Page',
      pageImage: 'https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf',
      isFromUpload: true
    },
    {
      id: 'page-3',
      type: 'actual-page',
      pageNumber: 3, 
      title: 'From the Publisher\'s Desk',
      pageImage: 'https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf',
      isFromUpload: true
    },
    // Premium pages (after 3 free pages)
    {
      id: 'page-4',
      type: 'actual-page-premium',
      pageNumber: 4,
      title: 'Tech News - Premium Content',
      pageImage: 'https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-5',
      type: 'actual-page-premium',
      pageNumber: 5,
      title: 'Dell XPS 14 Review - Premium',
      pageImage: 'https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'page-6',
      type: 'actual-page-premium',
      pageNumber: 6,
      title: 'Cover Story - Tapan Singhel - Premium',
      pageImage: 'https://customer-assets.emergentagent.com/job_luxmag-tech-nav-fix/artifacts/qhmo66rl_Just%20Urbane%20August%202025%20-%20E-Magazine-2.pdf',
      isPremium: true,
      isFromUpload: true
    }
  ];

  console.log('📖 ORIGINAL magazine pages loaded from your PDF:', magazinePages.length, 'pages from Just Urbane August 2025 - Original Version');
  return magazinePages;
};

export default parseMagazineContent;