import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const AccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="section-title">
            My Account
          </h1>
          <p className="text-gray-600 mb-12">
            Coming soon - Manage your subscription and preferences
          </p>
          <LoadingSpinner text="Page under construction..." />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;