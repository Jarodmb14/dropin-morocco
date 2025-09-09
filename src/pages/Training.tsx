import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Target, Play, Clock, Star, Zap, Heart, Activity, Shuffle, Info, ArrowRight } from 'lucide-react';
import { MUSCLE_GROUPS, getExercisesByMuscleGroup, getPrimaryMuscle, getSecondaryMuscles, getEquipment, getExerciseTypes, getMechanicsType } from '../data/exercises';

const Training = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState<string | null>(null);

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

  const getDifficultyColor = (exerciseTypes: string[]) => {
    if (exerciseTypes.includes('PLYOMETRICS') || exerciseTypes.includes('CROSSFIT')) {
      return 'bg-red-500';
    }
    if (exerciseTypes.includes('STRENGTH')) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  const getDifficultyText = (exerciseTypes: string[]) => {
    if (exerciseTypes.includes('PLYOMETRICS') || exerciseTypes.includes('CROSSFIT')) {
      return 'Advanced';
    }
    if (exerciseTypes.includes('STRENGTH')) {
      return 'Intermediate';
    }
    return 'Beginner';
  };

  const getEquipmentIcon = (equipment: string[]) => {
    if (equipment.includes('BARBELL') || equipment.includes('BAR')) {
      return <Dumbbell className="w-4 h-4" />;
    }
    if (equipment.includes('BODYWEIGHT')) {
      return <Target className="w-4 h-4" />;
    }
    if (equipment.includes('CABLE') || equipment.includes('ROPE')) {
      return <Zap className="w-4 h-4" />;
    }
    return <Dumbbell className="w-4 h-4" />;
  };

  const handlePlayVideo = (exerciseId: string) => {
    setShowVideo(exerciseId);
  };

  const selectedExercises = selectedMuscleGroup ? getExercisesByMuscleGroup(selectedMuscleGroup) : [];

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

        {/* Selected Exercises Preview */}
        {selectedMuscleGroup && selectedExercises.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {muscleGroups.find(g => g.id === selectedMuscleGroup)?.name} Exercises
              </h2>
              <Button
                onClick={handleStartWorkout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Workout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {selectedExercises.slice(0, 6).map((exercise) => {
                const primaryMuscle = getPrimaryMuscle(exercise);
                const secondaryMuscles = getSecondaryMuscles(exercise);
                const equipment = getEquipment(exercise);
                const exerciseTypes = getExerciseTypes(exercise);
                const mechanicsType = getMechanicsType(exercise);
                const difficulty = getDifficultyText(exerciseTypes);
                const difficultyColor = getDifficultyColor(exerciseTypes);

                return (
                  <Card
                    key={exercise.id}
                    className="group relative overflow-hidden bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <CardHeader className="relative p-0">
                      <div className="relative h-32 bg-gradient-to-br from-gray-700 to-gray-800">
                        {exercise.fullVideoImageUrl ? (
                          <>
                            <img
                              alt={exercise.name}
                              className="object-cover w-full h-full transition-transform group-hover:scale-105"
                              loading="lazy"
                              src={exercise.fullVideoImageUrl}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button 
                                className="bg-white/90 text-gray-900 hover:bg-white" 
                                onClick={() => handlePlayVideo(exercise.id)} 
                                size="sm"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Watch
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-gray-400">
                              <Target className="h-8 w-8" />
                            </div>
                          </div>
                        )}

                        <div className="absolute top-2 left-2">
                          <Badge className={`${difficultyColor} text-white text-xs`}>
                            {difficulty}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 mb-2">
                        {exercise.name}
                      </h3>

                      {equipment.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {equipment.slice(0, 2).map((eq, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 text-gray-300 border-gray-600">
                              {getEquipmentIcon([eq])}
                              <span className="ml-1">{eq.replace("_", " ")}</span>
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          className="flex-1 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                          onClick={() => handlePlayVideo(exercise.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                          onClick={handleStartWorkout} 
                          size="sm"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedExercises.length > 6 && (
              <div className="text-center mt-4">
                <Button
                  onClick={handleStartWorkout}
                  variant="outline"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  View All {selectedExercises.length} Exercises
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
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

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-4 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {selectedExercises.find(ex => ex.id === showVideo)?.name}
                </h3>
                <Button
                  onClick={() => setShowVideo(null)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={selectedExercises.find(ex => ex.id === showVideo)?.fullVideoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={selectedExercises.find(ex => ex.id === showVideo)?.name}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
