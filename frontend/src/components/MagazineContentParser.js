// Magazine Content Parser - Using ACTUAL magazine pages from uploaded PDF
// Just Urbane August 2025 - Actual PDF pages as they are
export const parseMagazineContent = () => {
  // ACTUAL magazine pages from your uploaded PDF - using real page images
  const magazinePages = [
    {
      id: 'cover',
      type: 'actual-page',
      pageNumber: 1,
      title: 'JUST URBANE - August 2025 Cover',
      // Using actual magazine cover image from your uploads
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/75f5e3b75132abfd3bf52f115bb3baa295761809d8e0864108e5a4a5e8aeac13.jpg',
      isFromUpload: true
    },
    {
      id: 'contents',
      type: 'actual-page', 
      pageNumber: 2,
      title: 'Contents Page',
      // Using actual contents page layout
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/a69f5b92d3e1bf5aa576c8746301b5b45e47d0d07ed3ccab1dd60ab3ad171704.jpg',
      isFromUpload: true
    },
    {
      id: 'publisher-desk',
      type: 'actual-page',
      pageNumber: 3, 
      title: 'From the Publisher\'s Desk',
      // Using actual publisher page
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/08679d95c09076112194d367dcd9dfc93f53ac7153c4ec747d99c186ec35df06.jpg',
      isFromUpload: true
    },
    // Premium pages (after 3 free pages)
    {
      id: 'tech-news',
      type: 'actual-page-premium',
      pageNumber: 4,
      title: 'Tech News',
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/e94c2bbcf3f7e9549909da917b29ea0b69b037f50aec606b520a1deeaa9234b9.jpg',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'dell-xps',
      type: 'actual-page-premium',
      pageNumber: 5,
      title: 'Dell XPS 14 Review',
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/e45f3a6036c9c3061966e50081c0cb6f0c3716e4b95e9e45eb6d220a9b528ad0.jpg',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'tapan-singhel',
      type: 'actual-page-premium',
      pageNumber: 6,
      title: 'Cover Story - Tapan Singhel',
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/75f5e3b75132abfd3bf52f115bb3baa295761809d8e0864108e5a4a5e8aeac13.jpg',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'bentley',
      type: 'actual-page-premium',
      pageNumber: 7,
      title: 'Bentley Bentayga Speed',
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/f76547d98f36f1c3154d507693e69d2050750250d4ab8dffb9523a003fdb383d.jpg',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'fashion',
      type: 'actual-page-premium',
      pageNumber: 8,
      title: 'Fashion - Timeless Tailoring',
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/eefd6d647a68464652bed192b790f642a92ebea190d2a89a259cd73935bafda4.jpg',
      isPremium: true,
      isFromUpload: true
    },
    {
      id: 'travel',
      type: 'actual-page-premium',
      pageNumber: 9,
      title: 'Travel & Luxury',
      pageImage: 'https://customer-assets.emergentagent.com/job_urbane-reader/artifacts/images/ebb77e6110d934df410cc11e487f0ec90471590b991163bc85c4b34698b6376a.jpg',
      isPremium: true,
      isFromUpload: true
    }
  ];

  console.log('📖 ACTUAL magazine pages loaded:', magazinePages.length, 'pages from Just Urbane PDF');
  return magazinePages;
};

export default parseMagazineContent;