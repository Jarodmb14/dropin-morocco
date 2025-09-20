import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WorkoutCool } from '@/components/WorkoutCool';
import { ArrowLeft } from 'lucide-react';

const Training = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isInitialized, user: persistentUser, isAuthenticated } = useAuthPersistence();

  // Use persistent user if available, fallback to AuthContext user
  const currentUser = persistentUser || user;
  const isUserAuthenticated = isAuthenticated || !!user;

  // Show loading while checking authentication
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isUserAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-sky-50">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm border border-rose-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Please log in to access the training center.
              </p>
              <Button onClick={() => navigate('/login')} className="bg-rose-400 hover:bg-rose-500 text-white">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-sky-50 relative overflow-hidden">
      <SimpleHeader />
      
      {/* Subtle Pastel Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-lavender-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-sky-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-rose-200 rounded-full blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Welcome to Training Center, {user?.user_metadata?.full_name || 'Athlete'}!
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Build your perfect workout with Workout Cool - select equipment, target muscle groups, and get personalized exercise recommendations.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center bg-white/70 backdrop-blur-sm border-rose-300 text-gray-700 hover:bg-rose-50 hover:border-rose-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Workout Cool Component */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <WorkoutCool />
        </div>
      </div>
    </div>
  );
};

export default Training;