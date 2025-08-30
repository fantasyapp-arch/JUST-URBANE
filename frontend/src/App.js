import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

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

// Create router with minimal configuration to avoid warnings
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:slug", element: <CategoryPage /> },
      { path: "category/:category/:subcategory", element: <SubcategoryPage /> },
      { path: "article/:slug", element: <ArticlePage /> },
      { path: "author/:slug", element: <AuthorPage /> },
      { path: "issues", element: <IssuesPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "travel", element: <TravelPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "search", element: <SearchPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
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