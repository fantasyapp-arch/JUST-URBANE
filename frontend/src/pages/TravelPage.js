import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const TravelPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="section-title">
            Travel Destinations
          </h1>
          <p className="text-gray-600 mb-12">
            Coming soon - Luxury travel guides and destinations
          </p>
          <LoadingSpinner text="Page under construction..." />
        </div>
      </div>
    </div>
  );
};

export default TravelPage;