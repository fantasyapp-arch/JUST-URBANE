import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Award, Calendar } from 'lucide-react';

// Components
import HeroSection from '../components/HeroSection';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import NewsletterSignup from '../components/NewsletterSignup';

// Hooks
import { useFeaturedArticles, useTrendingArticles, useCategoryArticles } from '../hooks/useArticles';

const HomePage = () => {
  const { data: featuredArticles = [], isLoading: loadingFeatured } = useFeaturedArticles();
  const { data: trendingArticles = [], isLoading: loadingTrending } = useTrendingArticles();
  
  // Load articles from different categories for homepage sections
  const { data: styleArticles = [] } = useCategoryArticles('style', { limit: 4 });
  const { data: cultureArticles = [] } = useCategoryArticles('culture', { limit: 4 });
  const { data: techArticles = [] } = useCategoryArticles('tech', { limit: 3 });
  const { data: travelArticles = [] } = useCategoryArticles('travel', { limit: 3 });

  const categories = [
    {
      name: 'Style',
      slug: 'style',
      description: 'Fashion, trends, and timeless elegance',
      icon: '👔',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Grooming',
      slug: 'grooming',
      description: 'Personal care and grooming essentials',
      icon: '💅',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Culture',
      slug: 'culture',
      description: 'Arts, music, and cultural insights',
      icon: '🎭',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Watches',
      slug: 'watches',
      description: 'Timepieces and horological excellence',
      icon: '⌚',
      color: 'from-amber-500 to-orange-500'
    },
    {
      name: 'Tech',
      slug: 'tech',
      description: 'Latest gadgets and innovations',
      icon: '📱',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'Fitness',
      slug: 'fitness',
      description: 'Health, wellness, and active living',
      icon: '💪',
      color: 'from-red-500 to-rose-500'
    },
    {
      name: 'Travel',
      slug: 'travel',
      description: 'Destinations and luxury experiences',
      icon: '✈️',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Movies, shows, and celebrity news',
      icon: '🎬',
      color: 'from-violet-500 to-fuchsia-500'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        featuredArticle={featuredArticles[0]} 
        trendingArticles={trendingArticles}
      />

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover stories across our premium lifestyle categories, from fashion and grooming to technology and travel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-serif text-lg font-semibold text-primary-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center text-gold-600 group-hover:text-gold-700">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title flex items-center">
                  <Award className="h-8 w-8 text-gold-500 mr-3" />
                  Editor's Picks
                </h2>
                <p className="text-gray-600">
                  Handpicked stories that define luxury lifestyle
                </p>
              </div>
              <Link
                to="/category/featured"
                className="hidden md:flex items-center text-gold-600 hover:text-gold-700 font-medium group"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.slice(1, 7).map((article, index) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    size={index === 0 ? 'large' : 'medium'} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trending Section */}
      {trendingArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title flex items-center">
                  <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                  Trending Now
                </h2>
                <p className="text-gray-600">
                  Stories everyone's talking about
                </p>
              </div>
            </div>

            {loadingTrending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingArticles.slice(0, 4).map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    size="small" 
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Style & Culture Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Style */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold text-primary-900">
                  Style
                </h2>
                <Link
                  to="/category/style"
                  className="flex items-center text-gold-600 hover:text-gold-700 font-medium group"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-6">
                {styleArticles.slice(0, 4).map((article, index) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    size={index === 0 ? "medium" : "small"}
                  />
                ))}
              </div>
            </div>

            {/* Culture */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold text-primary-900">
                  Culture
                </h2>
                <Link
                  to="/category/culture"
                  className="flex items-center text-gold-600 hover:text-gold-700 font-medium group"
                >
                  View All
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="space-y-6">
                {cultureArticles.slice(0, 4).map((article, index) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    size={index === 0 ? "medium" : "small"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSignup />

      {/* Latest Updates */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title flex items-center justify-center">
              <Calendar className="h-8 w-8 text-primary-600 mr-3" />
              Latest Updates
            </h2>
            <p className="text-gray-600">
              Fresh content across all categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mix articles from tech and travel */}
            {[...techArticles.slice(0, 2), ...travelArticles.slice(0, 4)].map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                size="medium" 
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/category/all"
              className="btn-primary"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">1M+</div>
              <div className="text-primary-200">Monthly Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">500+</div>
              <div className="text-primary-200">Premium Articles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">50+</div>
              <div className="text-primary-200">Expert Authors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">10K+</div>
              <div className="text-primary-200">Newsletter Subscribers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;