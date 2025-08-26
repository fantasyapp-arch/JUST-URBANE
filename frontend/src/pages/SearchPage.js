import React from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="section-title">
            Search Results
          </h1>
          <p className="text-gray-600 mb-4">
            Results for: "<span className="font-semibold">{query}</span>"
          </p>
          <p className="text-gray-600 mb-12">
            Coming soon - Advanced search functionality
          </p>
          <LoadingSpinner text="Page under construction..." />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;