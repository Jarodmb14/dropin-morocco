import React from 'react';

const SimpleBodyTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Simple Body Test</h1>
      
      <div className="max-w-md mx-auto">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Click Areas</h2>
          
          <div className="space-y-4">
            <button 
              className="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => console.log('Chest clicked!')}
            >
              CHEST
            </button>
            
            <button 
              className="w-full p-4 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => console.log('Biceps clicked!')}
            >
              BICEPS
            </button>
            
            <button 
              className="w-full p-4 bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={() => console.log('Shoulders clicked!')}
            >
              SHOULDERS
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Click the buttons above and check the browser console for logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleBodyTest;
