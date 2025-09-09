import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Target, Play, Clock, Star, Zap, Heart, Activity, Shuffle, Info, ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_TYPES, getExercisesByMuscleGroup, getPrimaryMuscle, getSecondaryMuscles, getEquipment, getExerciseTypes, getMechanicsType } from '../data/exercises';

const Training = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Training flow state
  const [currentStep, setCurrentStep] = useState(1); // 1: Equipment, 2: Muscles, 3: Exercises
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<any[]>([]);
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

  // Equipment options
  const equipmentOptions = [
    { 
      id: EQUIPMENT_TYPES.BODYWEIGHT, 
      name: 'Bodyweight', 
      icon: <Target className="w-8 h-8" />,
      description: 'No equipment needed',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: EQUIPMENT_TYPES.DUMBBELL, 
      name: 'Dumbbells', 
      icon: <Dumbbell className="w-8 h-8" />,
      description: 'Free weights',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: EQUIPMENT_TYPES.BARBELL, 
      name: 'Barbell', 
      icon: <Activity className="w-8 h-8" />,
      description: 'Heavy lifting',
      color: 'from-red-500 to-red-600'
    },
    { 
      id: EQUIPMENT_TYPES.CABLE, 
      name: 'Cable Machine', 
      icon: <Zap className="w-8 h-8" />,
      description: 'Cable exercises',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: EQUIPMENT_TYPES.MACHINE, 
      name: 'Machines', 
      icon: <Target className="w-8 h-8" />,
      description: 'Gym machines',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: EQUIPMENT_TYPES.BAND, 
      name: 'Resistance Bands', 
      icon: <Heart className="w-8 h-8" />,
      description: 'Portable resistance',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  // Muscle groups
  const muscleGroups = [
    { 
      id: MUSCLE_GROUPS.CHEST, 
      name: 'Chest', 
      icon: <Target className="w-8 h-8" />,
      description: 'Build powerful pecs',
      color: 'from-red-500 to-red-600'
    },
    { 
      id: MUSCLE_GROUPS.SHOULDERS, 
      name: 'Shoulders', 
      icon: <Zap className="w-8 h-8" />,
      description: 'Strong deltoids',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: MUSCLE_GROUPS.BICEPS, 
      name: 'Biceps', 
      icon: <Dumbbell className="w-8 h-8" />,
      description: 'Arm strength',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: MUSCLE_GROUPS.TRICEPS, 
      name: 'Triceps', 
      icon: <Activity className="w-8 h-8" />,
      description: 'Arm definition',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: MUSCLE_GROUPS.ABS, 
      name: 'Core', 
      icon: <Heart className="w-8 h-8" />,
      description: 'Core stability',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: MUSCLE_GROUPS.BACK, 
      name: 'Back', 
      icon: <Target className="w-8 h-8" />,
      description: 'Posture & strength',
      color: 'from-teal-500 to-teal-600'
    },
    { 
      id: MUSCLE_GROUPS.LEGS, 
      name: 'Legs', 
      icon: <Zap className="w-8 h-8" />,
      description: 'Lower body power',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      id: MUSCLE_GROUPS.GLUTES, 
      name: 'Glutes', 
      icon: <Activity className="w-8 h-8" />,
      description: 'Hip strength',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  // Handle equipment selection
  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  // Handle muscle selection
  const handleMuscleToggle = (muscleId: string) => {
    setSelectedMuscles(prev => 
      prev.includes(muscleId) 
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
  };

  // Generate exercise recommendations based on equipment and muscles
  const generateRecommendations = () => {
    const allExercises = [];
    
    // Get exercises for each selected muscle group
    selectedMuscles.forEach(muscle => {
      const muscleExercises = getExercisesByMuscleGroup(muscle);
      allExercises.push(...muscleExercises);
    });

    // Filter by selected equipment
    const filteredExercises = allExercises.filter(exercise => {
      const exerciseEquipment = getEquipment(exercise);
      return selectedEquipment.some(equip => exerciseEquipment.includes(equip));
    });

    // Remove duplicates and shuffle
    const uniqueExercises = filteredExercises.filter((exercise, index, self) => 
      index === self.findIndex(e => e.id === exercise.id)
    );

    // Shuffle and take first 8
    const shuffled = uniqueExercises.sort(() => 0.5 - Math.random());
    setRecommendedExercises(shuffled.slice(0, 8));
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep === 1 && selectedEquipment.length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedMuscles.length > 0) {
      generateRecommendations();
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartWorkout = () => {
    if (selectedMuscles.length > 0) {
      // Navigate to the first selected muscle group's exercise page
      navigate(`/exercises/${selectedMuscles[0]}`);
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
            Welcome back, {user?.email}! Let's build your perfect workout
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Equipment Selection */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Step 1: Choose Your Equipment</h2>
              <p className="text-gray-300 text-lg">
                Select the equipment you have available for your workout
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {equipmentOptions.map((equipment) => (
                <Card
                  key={equipment.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedEquipment.includes(equipment.id)
                      ? 'ring-2 ring-blue-500 bg-blue-900/20'
                      : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  }`}
                  onClick={() => handleEquipmentToggle(equipment.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${equipment.color} flex items-center justify-center text-white`}>
                      {equipment.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{equipment.name}</h3>
                    <p className="text-gray-400 text-sm">{equipment.description}</p>
                    {selectedEquipment.includes(equipment.id) && (
                      <div className="mt-2">
                        <Badge className="bg-blue-600 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={handleNextStep}
                disabled={selectedEquipment.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Choose Muscles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Muscle Selection */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Step 2: Select Target Muscles</h2>
              <p className="text-gray-300 text-lg">
                Choose which muscle groups you want to train
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {muscleGroups.map((muscle) => (
                <Card
                  key={muscle.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedMuscles.includes(muscle.id)
                      ? 'ring-2 ring-blue-500 bg-blue-900/20'
                      : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  }`}
                  onClick={() => handleMuscleToggle(muscle.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${muscle.color} flex items-center justify-center text-white`}>
                      {muscle.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{muscle.name}</h3>
                    <p className="text-gray-400 text-sm">{muscle.description}</p>
                    {selectedMuscles.includes(muscle.id) && (
                      <div className="mt-2">
                        <Badge className="bg-blue-600 text-white">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="text-gray-400 border-gray-600 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={selectedMuscles.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Workout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Exercise Recommendations */}
        {currentStep === 3 && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Your Personalized Workout</h2>
              <p className="text-gray-300 text-lg">
                Based on your equipment and muscle selection
              </p>
            </div>

            {/* Selected Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Selected Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedEquipment.map(equip => (
                      <Badge key={equip} className="bg-blue-600 text-white">
                        {equipmentOptions.find(e => e.id === equip)?.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Target Muscles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedMuscles.map(muscle => (
                      <Badge key={muscle} className="bg-green-600 text-white">
                        {muscleGroups.find(m => m.id === muscle)?.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exercise Recommendations */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Recommended Exercises</h3>
                <Button
                  onClick={handleStartWorkout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Workout
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedExercises.map((exercise) => {
                  const primaryMuscle = getPrimaryMuscle(exercise);
                  const equipment = getEquipment(exercise);
                  const exerciseTypes = getExerciseTypes(exercise);
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
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="text-gray-400 border-gray-600 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Muscles
              </Button>
              <Button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedEquipment([]);
                  setSelectedMuscles([]);
                  setRecommendedExercises([]);
                }}
                variant="outline"
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-4 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {recommendedExercises.find(ex => ex.id === showVideo)?.name}
                </h3>
                <Button
                  onClick={() => setShowVideo(null)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={recommendedExercises.find(ex => ex.id === showVideo)?.fullVideoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={recommendedExercises.find(ex => ex.id === showVideo)?.name}
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
