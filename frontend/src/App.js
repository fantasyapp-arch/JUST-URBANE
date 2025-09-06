import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import OfferBanner from './components/OfferBanner';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import AuthorPage from './pages/AuthorPage';
import IssuesPage from './pages/IssuesPage';
import MagazineReaderPage from './pages/MagazineReaderPage';
import ReviewsPage from './pages/ReviewsPage';
import TravelPage from './pages/TravelPage';
import PricingPage from './pages/PricingPage';
import AccountPage from './pages/AccountPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProfilePage from './pages/ProfilePage';
import SubcategoryPage from './pages/SubcategoryPage';
import RoyalAtlantisPage from './pages/RoyalAtlantisPage';
import CeliniFoodReviewPage from './pages/CeliniFoodReviewPage';
import ScottishLeaderReviewPage from './pages/ScottishLeaderReviewPage';
import FranceTravelPage from './pages/FranceTravelPage';
import SustainableTravelPage from './pages/SustainableTravelPage';
import MensFashionSuitGuidePage from './pages/MensFashionSuitGuidePage';
import OscarsFashionPage from './pages/OscarsFashionPage';
import SunseekerYachtPage from './pages/SunseekerYachtPage';
import DualWristingPage from './pages/DualWristingPage';
import AasthaGillPage from './pages/AasthaGillPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminArticlesPage from './pages/AdminArticlesPage';
import AdminMagazinesPage from './pages/AdminMagazinesPage';
import AdminHomepagePage from './pages/AdminHomepagePage';

// Suppress React Router v7 future flag warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
    return;
  }
  originalWarn.apply(console, args);
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Layout component
function Layout() {
  return (
    <div className="App min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

// Create router with scroll restoration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:slug", element: <CategoryPage /> },
      { path: "category/:category/:subcategory", element: <SubcategoryPage /> },
      { path: "article/:slug", element: <ArticlePage /> },
      { path: "atlantis-the-palm-dubai", element: <RoyalAtlantisPage /> },
      { path: "celini-food-review-mumbai", element: <CeliniFoodReviewPage /> },
      { path: "scottish-leader-whiskey-review", element: <ScottishLeaderReviewPage /> },
      { path: "when-in-france-travel-destinations", element: <FranceTravelPage /> },
      { path: "sustainable-travel-conscious-guide", element: <SustainableTravelPage /> },
      { path: "perfect-suit-guide-men-corporate-dressing", element: <MensFashionSuitGuidePage /> },
      { path: "oscars-2022-best-dressed-fashion-red-carpet", element: <OscarsFashionPage /> },
      { path: "sunseeker-65-sport-luxury-yacht-review", element: <SunseekerYachtPage /> },
      { path: "double-wristing-smartwatch-traditional-watch-trend", element: <DualWristingPage /> },
      { path: "aastha-gill-buzz-queen-bollywood-singer-interview", element: <AasthaGillPage /> },
      { path: "author/:slug", element: <AuthorPage /> },
      { path: "issues", element: <IssuesPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "travel", element: <TravelPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "payment-success", element: <PaymentSuccessPage /> },
      { path: "subscription-success", element: <PaymentSuccessPage /> },
      { path: "profile", element: <ProfilePage /> },
    ]
  },
  // Full-screen magazine reader - separate from Layout (no header/footer)
  {
    path: "/magazine-reader",
    element: <MagazineReaderPage />
  },
  // Admin routes - separate from main layout
  {
    path: "/admin/login",
    element: <AdminLoginPage />
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboardPage />
  },
  {
    path: "/admin/articles",
    element: <AdminArticlesPage />
  },
  {
    path: "/admin/magazines",
    element: <AdminMagazinesPage />
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;