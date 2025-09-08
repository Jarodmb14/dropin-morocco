import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MapTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Map Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a test page to check if routing is working.</p>
            <p>If you can see this, the routing is working correctly.</p>
            <p>Next step: Check if Leaflet components are working.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
