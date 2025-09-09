import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// Removed WorkoutCoolBodyDiagram import - using button-based muscle selection instead
import { useExerciseData } from '@/hooks/useExerciseDB';
import { FULL_EXERCISE_DATABASE, getFullExercisesByMuscleGroup, getEquipment } from '@/data/full-exercise-database';
import { EnhancedExerciseCard } from '@/components/EnhancedExerciseCard';
import { Loader2, Dumbbell, Target, Play, RotateCcw, CheckCircle } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  icon: string;
}

interface BodyPart {
  id: string;
  name: string;
  selected: boolean;
}

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl?: string;
  instructions?: string[];
  sets?: number;
  reps?: number;
}

const EQUIPMENT_OPTIONS: Equipment[] = [
  { id: 'bodyweight', name: 'Bodyweight', icon: '🏃' },
  { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️' },
  { id: 'barbell', name: 'Barbell', icon: '🏋️‍♂️' },
  { id: 'kettlebell', name: 'Kettlebell', icon: '⚡' },
  { id: 'resistance-bands', name: 'Resistance Bands', icon: '🎯' },
  { id: 'cables', name: 'Cable Machine', icon: '🔗' },
  { id: 'machines', name: 'Machines', icon: '🏭' },
  { id: 'cardio', name: 'Cardio', icon: '❤️' },
];

const BODY_PARTS: BodyPart[] = [
  { id: 'chest', name: 'Chest', selected: false },
  { id: 'shoulders', name: 'Shoulders', selected: false },
  { id: 'biceps', name: 'Biceps', selected: false },
  { id: 'triceps', name: 'Triceps', selected: false },
  { id: 'abs', name: 'Abs', selected: false },
  { id: 'back', name: 'Back', selected: false },
  { id: 'glutes', name: 'Glutes', selected: false },
  { id: 'legs', name: 'Legs', selected: false },
];

// Removed muscle group mapping - using simple body part selection

export function WorkoutCool() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>(BODY_PARTS);
  // Removed selectedMuscles state - using selectedBodyParts instead
  const [generatedExercises, setGeneratedExercises] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const { loadExercisesByTarget, exercises, loading, error } = useExerciseData();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleBodyPartToggle = (bodyPartId: string) => {
    setSelectedBodyParts(prev => 
      prev.map(part => 
        part.id === bodyPartId 
          ? { ...part, selected: !part.selected }
          : part
      )
    );
  };

  // Removed handleMuscleToggle - using handleBodyPartToggle instead

  const handleBodyPartClick = (bodyPartId: string) => {
    handleBodyPartToggle(bodyPartId);
  };

  const generateWorkout = async () => {
    setIsGenerating(true);
    
    try {
      const selectedParts = selectedBodyParts.filter(part => part.selected);
      const exercises: Exercise[] = [];

      // Generate exercises for each selected body part using enhanced database
      for (const bodyPart of selectedParts) {
        // Get exercises from full database
        const fullExercises = getFullExercisesByMuscleGroup(bodyPart.id);
        
        // Filter exercises by selected equipment
        const filteredExercises = fullExercises.filter(compExercise => {
          const equipment = compExercise.attributes
            .filter(attr => attr.attributeName === 'EQUIPMENT')
            .map(attr => attr.attributeValue.toLowerCase());
          
          return selectedEquipment.length === 0 || 
            selectedEquipment.some(eq => 
              equipment.some(e => e.includes(eq.toLowerCase())) ||
              eq === 'bodyweight' && equipment.some(e => e.includes('body'))
            );
        });

        // Add 2-3 exercises per body part
        const exercisesForPart = filteredExercises.slice(0, 3).map(compExercise => ({
          id: `${bodyPart.id}-${compExercise.id}`,
          name: compExercise.nameEn,
          bodyPart: bodyPart.name,
          equipment: compExercise.attributes
            .filter(attr => attr.attributeName === 'EQUIPMENT')
            .map(attr => attr.attributeValue)[0] || 'Bodyweight',
          gifUrl: compExercise.fullVideoImageUrl,
          instructions: compExercise.descriptionEn.replace(/<[^>]*>/g, '').split('.').filter(s => s.trim()),
          sets: 3,
          reps: 12
        }));
        
        exercises.push(...exercisesForPart);
      }

      setGeneratedExercises(exercises);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < generatedExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const resetWorkout = () => {
    setCurrentStep(1);
    setSelectedEquipment([]);
    setSelectedBodyParts(BODY_PARTS);
    setGeneratedExercises([]);
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedEquipment.length > 0;
      case 2:
        return selectedBodyParts.some(part => part.selected);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 2) {
      generateWorkout();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (workoutStarted) {
    const currentExercise = generatedExercises[currentExerciseIndex];
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Workout Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Play className="w-6 h-6 mr-2 text-green-500" />
                  Workout in Progress
                </CardTitle>
                <Badge variant="outline">
                  {currentExerciseIndex + 1} of {generatedExercises.length}
                </Badge>
              </div>
              <Progress value={((currentExerciseIndex + 1) / generatedExercises.length) * 100} className="mt-2" />
            </CardHeader>
          </Card>

          {/* Current Exercise */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{currentExercise?.name}</span>
                <Badge variant="secondary">{currentExercise?.bodyPart}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Exercise Image */}
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {currentExercise?.gifUrl ? (
                    <img 
                      src={currentExercise.gifUrl} 
                      alt={currentExercise.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Dumbbell className="w-24 h-24 text-gray-400" />
                  )}
                </div>

                {/* Exercise Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentExercise?.sets}</div>
                      <div className="text-sm text-blue-600">Sets</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{currentExercise?.reps}</div>
                      <div className="text-sm text-green-600">Reps</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Equipment:</h4>
                    <Badge variant="outline">{currentExercise?.equipment}</Badge>
                  </div>

                  {currentExercise?.instructions && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Instructions:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {currentExercise.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workout Controls */}
          <div className="flex justify-between">
            <Button
              onClick={previousExercise}
              disabled={currentExerciseIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button onClick={resetWorkout} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              {currentExerciseIndex === generatedExercises.length - 1 ? (
                <Button onClick={resetWorkout} className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Workout
                </Button>
              ) : (
                <Button onClick={nextExercise}>
                  Next Exercise
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-500" />
              Workout Cool - Build Your Perfect Workout
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            </div>
          </CardHeader>
        </Card>

        {/* Step 1: Equipment Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2" />
                Step 1: Choose Your Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {EQUIPMENT_OPTIONS.map((equipment) => (
                  <Button
                    key={equipment.id}
                    variant={selectedEquipment.includes(equipment.id) ? "default" : "outline"}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => handleEquipmentToggle(equipment.id)}
                  >
                    <span className="text-2xl">{equipment.icon}</span>
                    <span className="text-sm">{equipment.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Body Part Selection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Step 2: Select Body Parts to Target
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Choose the muscle groups you want to focus on in your workout. You can select multiple areas.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedBodyParts.map((bodyPart) => (
                  <Button
                    key={bodyPart.id}
                    variant={bodyPart.selected ? "default" : "outline"}
                    className="h-20 flex flex-col items-center justify-center space-y-2 relative"
                    onClick={() => handleBodyPartToggle(bodyPart.id)}
                  >
                    {bodyPart.selected && (
                      <CheckCircle className="w-5 h-5 absolute top-2 right-2 text-white" />
                    )}
                    <span className="text-lg font-semibold">{bodyPart.name}</span>
                    <span className="text-xs text-gray-500">
                      {bodyPart.id === 'chest' && 'Pectorals'}
                      {bodyPart.id === 'shoulders' && 'Deltoids'}
                      {bodyPart.id === 'biceps' && 'Brachialis'}
                      {bodyPart.id === 'triceps' && 'Triceps Brachii'}
                      {bodyPart.id === 'abs' && 'Abdominals'}
                      {bodyPart.id === 'back' && 'Latissimus Dorsi'}
                      {bodyPart.id === 'glutes' && 'Gluteus Maximus'}
                      {bodyPart.id === 'legs' && 'Quadriceps & Hamstrings'}
                    </span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBodyParts(prev => 
                      prev.map(p => ({ ...p, selected: false }))
                    );
                  }}
                >
                  Clear All Selections
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generated Workout */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Your Generated Workout
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mr-2" />
                  <span>Generating your workout...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center text-gray-600 mb-6">
                    Complete workout with detailed tutorials and explanations
                  </div>
                  {generatedExercises.map((exercise, index) => {
                    // Find the full exercise data
                    const fullExercise = FULL_EXERCISE_DATABASE.find(e => e.id === exercise.id.split('-')[1]);
                    if (!fullExercise) return null;
                    
                    return (
                      <div key={exercise.id} className="mb-8">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-semibold text-gray-700">
                            Exercise {index + 1} of {generatedExercises.length}
                          </h4>
                        </div>
                        <EnhancedExerciseCard 
                          exercise={fullExercise}
                          onPlayVideo={() => {
                            if (fullExercise.fullVideoUrl) {
                              window.open(fullExercise.fullVideoUrl, '_blank');
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed() || isGenerating}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : currentStep === 3 ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
