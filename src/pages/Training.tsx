import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkoutCool } from '@/components/WorkoutCool';
import { ArrowLeft } from 'lucide-react';

const Training = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Please log in to access the training center.
              </p>
              <Button onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Training Center, {user?.user_metadata?.full_name || 'Athlete'}!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Build your perfect workout with Workout Cool - select equipment, target muscle groups, and get personalized exercise recommendations.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Workout Cool Component */}
        <WorkoutCool />
      </div>
    </div>
  );
};

export default Training;