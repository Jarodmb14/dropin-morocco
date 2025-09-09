import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { ArrowLeft, Play, Clock, Target } from 'lucide-react';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  duration?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
}

const ExercisesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bodyPart, exercises } = location.state || { 
    bodyPart: 'Chest', 
    exercises: ['Push-ups', 'Bench Press', 'Chest Fly', 'Dumbbell Press'] 
  };

  // Exercise database with detailed information
  const exerciseDatabase: Record<string, Exercise[]> = {
    chest: [
      { name: 'Push-ups', sets: '3-4', reps: '8-15', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Bench Press', sets: '3-4', reps: '6-12', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Chest Fly', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Dumbbell Press', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Dumbbells' },
      { name: 'Incline Press', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Decline Push-ups', sets: '3-4', reps: '8-15', difficulty: 'Advanced', equipment: 'Bodyweight' }
    ],
    shoulders: [
      { name: 'Shoulder Press', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Dumbbells' },
      { name: 'Lateral Raises', sets: '3-4', reps: '12-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Front Raises', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Rear Delt Fly', sets: '3-4', reps: '12-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Overhead Press', sets: '3-4', reps: '6-10', difficulty: 'Advanced', equipment: 'Barbell' }
    ],
    biceps: [
      { name: 'Bicep Curls', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Hammer Curls', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Concentration Curls', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Dumbbells' },
      { name: 'Preacher Curls', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Cable Curls', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Cable Machine' }
    ],
    triceps: [
      { name: 'Tricep Dips', sets: '3-4', reps: '8-15', difficulty: 'Intermediate', equipment: 'Bodyweight' },
      { name: 'Close-Grip Press', sets: '3-4', reps: '6-12', difficulty: 'Advanced', equipment: 'Barbell' },
      { name: 'Overhead Extension', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Dumbbells' },
      { name: 'Tricep Pushdowns', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Cable Machine' },
      { name: 'Diamond Push-ups', sets: '3-4', reps: '8-12', difficulty: 'Advanced', equipment: 'Bodyweight' }
    ],
    abs: [
      { name: 'Crunches', sets: '3-4', reps: '15-25', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Plank', sets: '3-4', duration: '30-60s', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Russian Twists', sets: '3-4', reps: '20-30', difficulty: 'Intermediate', equipment: 'Bodyweight' },
      { name: 'Mountain Climbers', sets: '3-4', duration: '30-45s', difficulty: 'Intermediate', equipment: 'Bodyweight' },
      { name: 'Leg Raises', sets: '3-4', reps: '10-15', difficulty: 'Intermediate', equipment: 'Bodyweight' },
      { name: 'Bicycle Crunches', sets: '3-4', reps: '20-30', difficulty: 'Beginner', equipment: 'Bodyweight' }
    ],
    back: [
      { name: 'Pull-ups', sets: '3-4', reps: '5-12', difficulty: 'Advanced', equipment: 'Pull-up Bar' },
      { name: 'Rows', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Deadlifts', sets: '3-4', reps: '5-8', difficulty: 'Advanced', equipment: 'Barbell' },
      { name: 'Lat Pulldowns', sets: '3-4', reps: '8-12', difficulty: 'Beginner', equipment: 'Cable Machine' },
      { name: 'Face Pulls', sets: '3-4', reps: '12-15', difficulty: 'Beginner', equipment: 'Cable Machine' }
    ],
    legs: [
      { name: 'Squats', sets: '3-4', reps: '8-15', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Lunges', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Leg Press', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Leg Press Machine' },
      { name: 'Calf Raises', sets: '3-4', reps: '15-20', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Bulgarian Split Squats', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Bodyweight' },
      { name: 'Romanian Deadlifts', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Barbell' }
    ],
    glutes: [
      { name: 'Hip Thrusts', sets: '3-4', reps: '10-15', difficulty: 'Beginner', equipment: 'Barbell' },
      { name: 'Glute Bridges', sets: '3-4', reps: '12-20', difficulty: 'Beginner', equipment: 'Bodyweight' },
      { name: 'Bulgarian Split Squats', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Bodyweight' },
      { name: 'Romanian Deadlifts', sets: '3-4', reps: '8-12', difficulty: 'Intermediate', equipment: 'Barbell' },
      { name: 'Clamshells', sets: '3-4', reps: '15-20', difficulty: 'Beginner', equipment: 'Bodyweight' }
    ]
  };

  const currentExercises = exerciseDatabase[bodyPart.toLowerCase()] || exerciseDatabase.chest;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/body-parts')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Body Parts
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            {bodyPart} Exercises
          </h1>
          <p className="text-gray-300 text-lg">
            {currentExercises.length} exercises to strengthen your {bodyPart.toLowerCase()}
          </p>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {currentExercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">{exercise.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Play className="w-4 h-4" />
                  <span>Sets: {exercise.sets}</span>
                </div>
                
                {exercise.reps ? (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Target className="w-4 h-4" />
                    <span>Reps: {exercise.reps}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {exercise.duration}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-sm">Equipment: {exercise.equipment}</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                Start Exercise
              </button>
            </div>
          ))}
        </div>

        {/* Workout Summary */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Workout Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{currentExercises.length}</div>
              <div className="text-gray-300">Total Exercises</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {currentExercises.reduce((acc, ex) => acc + parseInt(ex.sets.split('-')[0]), 0)}
              </div>
              <div className="text-gray-300">Total Sets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {currentExercises.filter(ex => ex.difficulty === 'Beginner').length}
              </div>
              <div className="text-gray-300">Beginner Friendly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisesList;
