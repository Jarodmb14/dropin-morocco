import React from 'react';

const VenuesTest = () => {
  console.log('🎯 VenuesTest component loaded');
  
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🎯 Venues Test Page
      </h1>
      
      <div className="bg-green-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-bold text-green-800 mb-2">✅ Basic Test</h2>
        <p className="text-green-700">This page loads successfully!</p>
      </div>
      
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-bold text-blue-800 mb-2">🔍 Component Test</h2>
        <p className="text-blue-700">Testing individual components...</p>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">⚠️ Debug Info</h2>
        <p className="text-yellow-700">Check browser console for any errors</p>
      </div>
    </div>
  );
};

export default VenuesTest;
