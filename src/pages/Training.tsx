import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, Play, Clock, Star, Zap, Heart, Activity } from 'lucide-react';
import { MUSCLE_GROUPS, getExercisesByMuscleGroup } from '../data/exercises';

const Training = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

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

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const muscleGroups = [
    { 
      id: MUSCLE_GROUPS.CHEST, 
      name: 'Chest', 
      icon: <Target className="w-8 h-8" />,
      description: 'Build powerful pecs',
      color: 'from-red-500 to-red-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.CHEST).length
    },
    { 
      id: MUSCLE_GROUPS.SHOULDERS, 
      name: 'Shoulders', 
      icon: <Zap className="w-8 h-8" />,
      description: 'Strong deltoids',
      color: 'from-blue-500 to-blue-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.SHOULDERS).length
    },
    { 
      id: MUSCLE_GROUPS.BICEPS, 
      name: 'Biceps', 
      icon: <Dumbbell className="w-8 h-8" />,
      description: 'Arm strength',
      color: 'from-green-500 to-green-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.BICEPS).length
    },
    { 
      id: MUSCLE_GROUPS.TRICEPS, 
      name: 'Triceps', 
      icon: <Activity className="w-8 h-8" />,
      description: 'Arm definition',
      color: 'from-purple-500 to-purple-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.TRICEPS).length
    },
    { 
      id: MUSCLE_GROUPS.ABS, 
      name: 'Core', 
      icon: <Heart className="w-8 h-8" />,
      description: 'Core stability',
      color: 'from-orange-500 to-orange-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.ABS).length
    },
    { 
      id: MUSCLE_GROUPS.BACK, 
      name: 'Back', 
      icon: <Target className="w-8 h-8" />,
      description: 'Posture & strength',
      color: 'from-teal-500 to-teal-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.BACK).length
    },
    { 
      id: MUSCLE_GROUPS.LEGS, 
      name: 'Legs', 
      icon: <Zap className="w-8 h-8" />,
      description: 'Lower body power',
      color: 'from-indigo-500 to-indigo-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.LEGS).length
    },
    { 
      id: MUSCLE_GROUPS.GLUTES, 
      name: 'Glutes', 
      icon: <Activity className="w-8 h-8" />,
      description: 'Hip strength',
      color: 'from-pink-500 to-pink-600',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.GLUTES).length
    }
  ];

  const handleMuscleGroupClick = (muscleGroup: typeof muscleGroups[0]) => {
    setSelectedMuscleGroup(muscleGroup.id);
  };

  const handleStartWorkout = () => {
    if (selectedMuscleGroup) {
      navigate(`/exercises/${selectedMuscleGroup}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Dumbbell className="w-10 h-10 text-blue-400" />
            Training Center
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome back, {user?.email}! Choose your training focus
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {muscleGroups.reduce((total, group) => total + group.exerciseCount, 0)}
              </div>
              <div className="text-gray-300">Total Exercises</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {muscleGroups.length}
              </div>
              <div className="text-gray-300">Muscle Groups</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {selectedMuscleGroup ? getExercisesByMuscleGroup(selectedMuscleGroup).length : 0}
              </div>
              <div className="text-gray-300">Selected Exercises</div>
            </CardContent>
          </Card>
        </div>

        {/* Muscle Groups Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Focus</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {muscleGroups.map((group) => (
              <Card
                key={group.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedMuscleGroup === group.id
                    ? 'ring-2 ring-blue-500 bg-blue-900/20'
                    : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                }`}
                onClick={() => handleMuscleGroupClick(group)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${group.color} flex items-center justify-center text-white`}>
                    {group.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{group.description}</p>
                  <p className="text-blue-400 text-sm font-medium">
                    {group.exerciseCount} exercises
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Workout Actions */}
        {selectedMuscleGroup && (
          <div className="text-center mb-8">
            <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  Ready to Train {muscleGroups.find(g => g.id === selectedMuscleGroup)?.name}?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  You've selected {getExercisesByMuscleGroup(selectedMuscleGroup).length} exercises for your {muscleGroups.find(g => g.id === selectedMuscleGroup)?.name.toLowerCase()} workout.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleStartWorkout}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Workout
                  </Button>
                  <Button
                    onClick={() => setSelectedMuscleGroup(null)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Change Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Training Tips */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-center">💡 Training Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-400">Warm-up</h4>
                  <p className="text-gray-300 text-sm">
                    Always start with 5-10 minutes of light cardio and dynamic stretching to prepare your muscles.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-400">Progression</h4>
                  <p className="text-gray-300 text-sm">
                    Gradually increase weight or reps over time to continue challenging your muscles.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-400">Rest</h4>
                  <p className="text-gray-300 text-sm">
                    Allow 48-72 hours between training the same muscle groups for optimal recovery.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-400">Form</h4>
                  <p className="text-gray-300 text-sm">
                    Focus on proper form over heavy weights to prevent injury and maximize results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Training;
