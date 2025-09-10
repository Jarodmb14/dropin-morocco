import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// Removed WorkoutCoolBodyDiagram import - using button-based muscle selection instead
import { useExerciseData } from '@/hooks/useExerciseDB';
import { FULL_EXERCISE_DATABASE, getFullExercisesByMuscleGroup, getEquipment } from '@/data/full-exercise-database';
import { EnhancedExerciseCard } from '@/components/EnhancedExerciseCard';
import { TrainingPrograms } from '@/components/TrainingPrograms';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { ProgressTracker, WorkoutSession, WorkoutExercise } from '@/data/progress-tracking';
import { getProgramExerciseDetails } from '@/data/training-programs';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Dumbbell, Target, Play, RotateCcw, CheckCircle, BookOpen, BarChart3, Timer } from 'lucide-react';

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
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>(BODY_PARTS);
  const [generatedExercises, setGeneratedExercises] = useState<Exercise[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'custom' | 'programs' | 'progress'>('custom');
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const { loadExercisesByTarget, exercises, loading, error } = useExerciseData();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleBodyPartToggle = (bodyPartId: string) => {
    setSelectedBodyParts(prev => 
      prev.map(part => 
        part.id === bodyPartId 
          ? { ...part, selected: !part.selected }
          : part
      )
    );
  };

  const handleBodyPartClick = (bodyPartId: string) => {
    handleBodyPartToggle(bodyPartId);
  };

  const generateWorkout = async () => {
    setIsGenerating(true);
    
    try {
      const selectedParts = selectedBodyParts.filter(part => part.selected);
      const exercises: Exercise[] = [];

      // Generate exercises for each selected body part using full database
      for (const bodyPart of selectedParts) {
        // Get exercises from full database (no equipment filtering)
        const fullExercises = getFullExercisesByMuscleGroup(bodyPart.id);

        // Add 2-3 exercises per body part (mix of different equipment types)
        const exercisesForPart = fullExercises.slice(0, 3).map(compExercise => ({
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
      setCurrentStep(2);
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startWorkout = () => {
    startWorkoutSession();
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
    setSelectedBodyParts(BODY_PARTS);
    setGeneratedExercises([]);
    setWorkoutStarted(false);
    setCurrentExerciseIndex(0);
    setWorkoutSession(null);
    if (restInterval) {
      clearInterval(restInterval);
      setRestInterval(null);
    }
    setRestTimer(null);
  };

  // Start rest timer
  const startRestTimer = (seconds: number) => {
    if (restInterval) {
      clearInterval(restInterval);
    }
    
    setRestTimer(seconds);
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setRestInterval(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    
    setRestInterval(interval);
  };

  // Save workout session
  const saveWorkoutSession = async () => {
    if (!user || !workoutSession) return;

    try {
      const exercises: WorkoutExercise[] = generatedExercises.map(exercise => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: Array(exercise.sets || 3).fill(0).map((_, index) => ({
          setNumber: index + 1,
          reps: exercise.reps || 12,
          weight: 0, // TODO: Add weight input
          completed: true,
          notes: ''
        })),
        notes: ''
      }));

      const sessionData = {
        ...workoutSession,
        exercises,
        duration: Math.round((Date.now() - Number(workoutSession.createdAt)) / 60000) // Calculate duration
      };

      await ProgressTracker.saveWorkoutSession(sessionData);
      await ProgressTracker.updatePersonalRecords(user.id, exercises, workoutSession.id);
      
      console.log('Workout session saved successfully');
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  };

  // Start workout session
  const startWorkoutSession = () => {
    if (!user) return;
    
    const session: WorkoutSession = {
      id: `workout-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      exercises: [],
      createdAt: Date.now().toString()
    };
    
    setWorkoutSession(session);
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
  };

  // Start program workout
  const startProgramWorkout = (workout: any, program?: any) => {
    if (!user) return;
    
    // Convert program workout to our exercise format
    const exercises: Exercise[] = workout.exercises.map((programExercise: any) => {
      const exerciseDetails = getProgramExerciseDetails(programExercise.exerciseId);
      return {
        id: `${workout.id}-${programExercise.exerciseId}`,
        name: exerciseDetails?.nameEn || 'Unknown Exercise',
        bodyPart: workout.focus,
        equipment: exerciseDetails?.attributes?.find((attr: any) => attr.attributeName === 'EQUIPMENT')?.attributeValue || 'Bodyweight',
        gifUrl: exerciseDetails?.fullVideoImageUrl,
        instructions: exerciseDetails?.descriptionEn ? 
          exerciseDetails.descriptionEn.replace(/<[^>]*>/g, '').split('.').filter((s: string) => s.trim()) : 
          [],
        sets: programExercise.sets,
        reps: programExercise.reps,
        restTime: programExercise.restTime
      };
    });

    // Set the generated exercises and start the workout
    setGeneratedExercises(exercises);
    
    // Create workout session
    const session: WorkoutSession = {
      id: `program-workout-${Date.now()}`,
      userId: user.id,
      programId: program?.id,
      workoutId: workout.id,
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      exercises: [],
      createdAt: Date.now().toString()
    };
    
    setWorkoutSession(session);
    setWorkoutStarted(true);
    setCurrentExerciseIndex(0);
    
    // Switch back to custom view to show the workout
    setCurrentView('custom');
  };

  // Generate a quick full-body workout for new users
  const generateQuickWorkout = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    
    try {
      // Create a balanced full-body workout with 6 exercises
      const bodyParts = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps'];
      const exercises: Exercise[] = [];
      
      for (const bodyPart of bodyParts) {
        const fullExercises = getFullExercisesByMuscleGroup(bodyPart);
        if (fullExercises.length > 0) {
          const exercise = fullExercises[0]; // Take the first exercise for each body part
          exercises.push({
            id: `quick-${bodyPart}-${exercise.id}`,
            name: exercise.nameEn,
            bodyPart: bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1),
            equipment: exercise.attributes
              .filter(attr => attr.attributeName === 'EQUIPMENT')
              .map(attr => attr.attributeValue)[0] || 'Bodyweight',
            gifUrl: exercise.fullVideoImageUrl,
            instructions: exercise.descriptionEn.replace(/<[^>]*>/g, '').split('.').filter(s => s.trim()),
            sets: 3,
            reps: 12
          });
        }
      }
      
      setGeneratedExercises(exercises);
      
      // Create workout session
      const session: WorkoutSession = {
        id: `quick-workout-${Date.now()}`,
        userId: user.id,
        date: new Date().toISOString().split('T')[0],
        duration: 0,
        exercises: [],
        createdAt: Date.now().toString()
      };
      
      setWorkoutSession(session);
      setWorkoutStarted(true);
      setCurrentExerciseIndex(0);
      
      // Switch to custom view to show the workout
      setCurrentView('custom');
      
    } catch (error) {
      console.error('Error generating quick workout:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedBodyParts.some(part => part.selected);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
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

                  {/* Rest Timer */}
                  {restTimer !== null && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center justify-center">
                          <Timer className="w-4 h-4 mr-2" />
                          Rest Timer
                        </h4>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
                        </div>
                        <p className="text-sm text-blue-600">Take a break before your next set</p>
                      </div>
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
              
              {/* Rest Timer Buttons */}
              <div className="flex gap-1">
                <Button 
                  onClick={() => startRestTimer(60)} 
                  variant="outline" 
                  size="sm"
                  disabled={restTimer !== null}
                >
                  1m
                </Button>
                <Button 
                  onClick={() => startRestTimer(90)} 
                  variant="outline" 
                  size="sm"
                  disabled={restTimer !== null}
                >
                  1.5m
                </Button>
                <Button 
                  onClick={() => startRestTimer(120)} 
                  variant="outline" 
                  size="sm"
                  disabled={restTimer !== null}
                >
                  2m
                </Button>
              </div>
              
              {currentExerciseIndex === generatedExercises.length - 1 ? (
                <Button 
                  onClick={() => {
                    saveWorkoutSession();
                    resetWorkout();
                  }} 
                  className="bg-green-500 hover:bg-green-600"
                >
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

  // Render different views
  if (currentView === 'programs') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Training Programs
            </h1>
            <Button variant="outline" onClick={() => setCurrentView('custom')}>
              ← Back to Custom Workout
            </Button>
          </div>
          <TrainingPrograms 
            onSelectProgram={(program) => {
              console.log('Selected program:', program);
              // Start the first workout of the first week
              if (program.weeks.length > 0 && program.weeks[0].workouts.length > 0) {
                const firstWorkout = program.weeks[0].workouts[0];
                startProgramWorkout(firstWorkout, program);
              }
            }}
            onStartWorkout={(workout) => {
              console.log('Starting workout:', workout);
              startProgramWorkout(workout);
            }}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'progress') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Progress Dashboard
            </h1>
            <Button variant="outline" onClick={() => setCurrentView('custom')}>
              ← Back to Custom Workout
            </Button>
          </div>
          <ProgressDashboard 
            onViewHistory={() => {
              // TODO: Implement history view
            }}
            onViewRecords={() => {
              // TODO: Implement records view
            }}
            onStartWorkout={() => {
              // Generate a quick full-body workout for new users
              generateQuickWorkout();
            }}
          />
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
            
            {/* Navigation Tabs */}
            <div className="flex justify-center mt-4 space-x-4">
              <Button 
                variant={currentView === 'custom' ? 'default' : 'outline'}
                onClick={() => setCurrentView('custom')}
                className="flex items-center"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Custom Workout
              </Button>
              <Button 
                variant={currentView === 'programs' ? 'default' : 'outline'}
                onClick={() => setCurrentView('programs')}
                className="flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Programs
              </Button>
              <Button 
                variant={currentView === 'progress' ? 'default' : 'outline'}
                onClick={() => setCurrentView('progress')}
                className="flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Progress
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Step 1: Body Part Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Step 1: Select Body Parts to Target
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Choose the muscle groups you want to focus on in your workout. You can select multiple areas.
              </p>
              {!selectedBodyParts.some(part => part.selected) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Select one or more body parts above, then click "Generate Workout" to create your personalized workout!
                  </p>
                </div>
              )}
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

        {/* Step 2: Generated Workout */}
        {currentStep === 2 && (
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
            ) : currentStep === 2 ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </>
            ) : (
              'Generate Workout'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
