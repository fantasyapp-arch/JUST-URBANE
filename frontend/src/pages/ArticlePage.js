import React from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const ArticlePage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="section-title">
            Article: {slug}
          </h1>
          <p className="text-gray-600 mb-12">
            Coming soon - This page will show the full article content
          </p>
          <LoadingSpinner text="Page under construction..." />
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;