import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { MUSCLE_GROUPS, getExercisesByMuscleGroup } from '../data/exercises';
import { Dumbbell, Target, Zap, Heart, Activity } from 'lucide-react';

interface BodyPart {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  exerciseCount: number;
}

const BodyPartsSelection = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const bodyParts: BodyPart[] = [
    { 
      id: MUSCLE_GROUPS.CHEST, 
      name: 'Chest', 
      icon: <Target className="w-6 h-6" />,
      description: 'Build powerful pecs',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.CHEST).length
    },
    { 
      id: MUSCLE_GROUPS.SHOULDERS, 
      name: 'Shoulders', 
      icon: <Zap className="w-6 h-6" />,
      description: 'Strong deltoids',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.SHOULDERS).length
    },
    { 
      id: MUSCLE_GROUPS.BICEPS, 
      name: 'Biceps', 
      icon: <Dumbbell className="w-6 h-6" />,
      description: 'Arm strength',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.BICEPS).length
    },
    { 
      id: MUSCLE_GROUPS.TRICEPS, 
      name: 'Triceps', 
      icon: <Activity className="w-6 h-6" />,
      description: 'Arm definition',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.TRICEPS).length
    },
    { 
      id: MUSCLE_GROUPS.ABS, 
      name: 'Core', 
      icon: <Heart className="w-6 h-6" />,
      description: 'Core stability',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.ABS).length
    },
    { 
      id: MUSCLE_GROUPS.BACK, 
      name: 'Back', 
      icon: <Target className="w-6 h-6" />,
      description: 'Posture & strength',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.BACK).length
    },
    { 
      id: MUSCLE_GROUPS.LEGS, 
      name: 'Legs', 
      icon: <Zap className="w-6 h-6" />,
      description: 'Lower body power',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.LEGS).length
    },
    { 
      id: MUSCLE_GROUPS.GLUTES, 
      name: 'Glutes', 
      icon: <Activity className="w-6 h-6" />,
      description: 'Hip strength',
      exerciseCount: getExercisesByMuscleGroup(MUSCLE_GROUPS.GLUTES).length
    }
  ];

  const handleBodyPartClick = (bodyPart: BodyPart) => {
    navigate(`/exercises/${bodyPart.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Select Your Target Area</h1>
          <p className="text-gray-300 text-lg">Click on any body part to see exercises for that area</p>
        </div>

        {/* Interactive Body Diagram */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <svg
              width="600"
              height="800"
              viewBox="0 0 600 800"
              className="cursor-pointer"
            >
              {/* Front View Body */}
              <g>
                {/* Head */}
                <circle
                  cx="300"
                  cy="80"
                  r="40"
                  fill="#374151"
                  stroke="#6b7280"
                  strokeWidth="3"
                />
                
                {/* Neck */}
                <rect
                  x="280"
                  y="120"
                  width="40"
                  height="25"
                  fill="#374151"
                  stroke="#6b7280"
                  strokeWidth="2"
                />

                {/* Chest */}
                <path
                  d="M 220 145 Q 300 125 380 145 L 380 250 Q 300 240 220 250 Z"
                  fill={selectedPart === MUSCLE_GROUPS.CHEST ? "#f87171" : "#ef4444"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[0])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.CHEST)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Shoulders */}
                <path
                  d="M 180 150 Q 300 130 420 150 L 420 200 Q 300 190 180 200 Z"
                  fill={selectedPart === MUSCLE_GROUPS.SHOULDERS ? "#60a5fa" : "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[1])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.SHOULDERS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Biceps */}
                <path
                  d="M 180 200 L 220 200 L 220 350 L 180 350 Z"
                  fill={selectedPart === MUSCLE_GROUPS.BICEPS ? "#34d399" : "#10b981"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[2])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.BICEPS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Triceps */}
                <path
                  d="M 380 200 L 420 200 L 420 350 L 380 350 Z"
                  fill={selectedPart === MUSCLE_GROUPS.TRICEPS ? "#a78bfa" : "#8b5cf6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[3])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.TRICEPS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Abs */}
                <path
                  d="M 220 250 L 380 250 L 380 350 L 220 350 Z"
                  fill={selectedPart === MUSCLE_GROUPS.ABS ? "#fb923c" : "#f97316"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[4])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.ABS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Glutes */}
                <path
                  d="M 220 350 L 380 350 L 380 400 L 220 400 Z"
                  fill={selectedPart === MUSCLE_GROUPS.GLUTES ? "#f472b6" : "#ec4899"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[7])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.GLUTES)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Legs */}
                <path
                  d="M 240 400 L 360 400 L 360 650 L 240 650 Z"
                  fill={selectedPart === MUSCLE_GROUPS.LEGS ? "#818cf8" : "#6366f1"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[6])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.LEGS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
              </g>

              {/* Back View Body */}
              <g transform="translate(0, 0)">
                {/* Back */}
                <path
                  d="M 220 145 Q 300 125 380 145 L 380 250 Q 300 240 220 250 Z"
                  fill={selectedPart === MUSCLE_GROUPS.BACK ? "#5eead4" : "#14b8a6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[5])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.BACK)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Shoulders */}
                <path
                  d="M 180 150 Q 300 130 420 150 L 420 200 Q 300 190 180 200 Z"
                  fill={selectedPart === MUSCLE_GROUPS.SHOULDERS ? "#60a5fa" : "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[1])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.SHOULDERS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Arms */}
                <path
                  d="M 180 200 L 220 200 L 220 350 L 180 350 Z"
                  fill={selectedPart === MUSCLE_GROUPS.TRICEPS ? "#a78bfa" : "#8b5cf6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[3])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.TRICEPS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                <path
                  d="M 380 200 L 420 200 L 420 350 L 380 350 Z"
                  fill={selectedPart === MUSCLE_GROUPS.BICEPS ? "#34d399" : "#10b981"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[2])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.BICEPS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Glutes */}
                <path
                  d="M 220 350 L 380 350 L 380 400 L 220 400 Z"
                  fill={selectedPart === MUSCLE_GROUPS.GLUTES ? "#f472b6" : "#ec4899"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[7])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.GLUTES)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Legs */}
                <path
                  d="M 240 400 L 360 400 L 360 650 L 240 650 Z"
                  fill={selectedPart === MUSCLE_GROUPS.LEGS ? "#818cf8" : "#6366f1"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts[6])}
                  onMouseEnter={() => setSelectedPart(MUSCLE_GROUPS.LEGS)}
                  onMouseLeave={() => setSelectedPart(null)}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Hover Info */}
        {selectedPart && (
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-800 rounded-lg p-4 border border-gray-600">
              <h3 className="text-xl font-semibold text-white">
                {bodyParts.find(part => part.id === selectedPart)?.name}
              </h3>
              <p className="text-gray-300">
                {bodyParts.find(part => part.id === selectedPart)?.exerciseCount} exercises available
              </p>
            </div>
          </div>
        )}

        {/* Body Parts List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {bodyParts.map((part) => (
            <div
              key={part.id}
              className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 border border-gray-600 hover:border-blue-500 hover:shadow-lg"
              onClick={() => handleBodyPartClick(part)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-blue-400 mb-3">
                  {part.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{part.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{part.description}</p>
                <p className="text-blue-400 text-sm font-medium">
                  {part.exerciseCount} exercises
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate('/training')}
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Training Center →
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            💡 Click on any body part above or in the diagram to see exercises
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyPartsSelection;
