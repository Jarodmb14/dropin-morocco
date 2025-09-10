import React from 'react';

export default function TestDebug() {
  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Test Debug Page
        </h1>
        <p className="text-lg text-blue-600">
          If you can see this page, the routing is working!
        </p>
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Debug Info:</h2>
          <p>Current time: {new Date().toLocaleString()}</p>
          <p>Page loaded successfully!</p>
        </div>
      </div>
    </div>
  );
}
