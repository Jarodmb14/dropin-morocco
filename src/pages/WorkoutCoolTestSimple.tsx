import React from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { WorkoutCool } from '@/components/WorkoutCool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkoutCoolTestSimple = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Workout Cool - Complete Functionality Test
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Testing all workout-cool functionality without the interactive body diagram.
            All features should work: equipment selection, muscle group selection, and workout generation.
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

export default WorkoutCoolTestSimple;
