import React from 'react';

export const BasicMapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🗺️ Gym Map - Basic Version
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Map Integration Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>React components working</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✅</span>
              <span>Routing working</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              <span>Leaflet map components need debugging</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Check browser console for errors</li>
              <li>Fix Leaflet component imports</li>
              <li>Test map rendering</li>
              <li>Add gym data integration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
