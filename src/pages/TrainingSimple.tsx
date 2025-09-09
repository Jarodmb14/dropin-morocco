import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/contexts/AuthContext';

const TrainingSimple = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Training Center</h1>
          <p className="text-gray-300 text-lg">
            Welcome back, {user?.email}! This is a test page.
          </p>
          <div className="mt-8">
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingSimple;
