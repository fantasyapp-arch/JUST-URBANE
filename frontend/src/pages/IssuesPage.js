import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const IssuesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="section-title">
            Magazine Issues
          </h1>
          <p className="text-gray-600 mb-12">
            Coming soon - Digital and print magazine issues
          </p>
          <LoadingSpinner text="Page under construction..." />
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;