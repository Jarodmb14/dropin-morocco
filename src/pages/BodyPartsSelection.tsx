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
          <div className="relative w-96 h-[600px] bg-gray-800 rounded-lg p-8">
            {/* Human Body Silhouette */}
            <div className="relative w-full h-full">
              {/* Head */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-600 rounded-full"></div>
              
              {/* Chest */}
              <div 
                className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-32 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPart === 'chest' ? 'bg-blue-500' : 'bg-blue-400 hover:bg-blue-500'
                }`}
                onClick={() => handleBodyPartClick(bodyParts[0])}
                title="Chest"
              ></div>
              
              {/* Shoulders */}
              <div 
                className={`absolute top-24 left-8 w-12 h-16 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[1])}
                title="Left Shoulder"
              ></div>
              <div 
                className={`absolute top-24 right-8 w-12 h-16 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[1])}
                title="Right Shoulder"
              ></div>
              
              {/* Arms */}
              <div 
                className={`absolute top-32 left-4 w-8 h-24 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[2])}
                title="Left Bicep"
              ></div>
              <div 
                className={`absolute top-32 right-4 w-8 h-24 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[2])}
                title="Right Bicep"
              ></div>
              
              {/* Triceps */}
              <div 
                className={`absolute top-40 left-2 w-6 h-20 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[3])}
                title="Left Tricep"
              ></div>
              <div 
                className={`absolute top-40 right-2 w-6 h-20 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[3])}
                title="Right Tricep"
              ></div>
              
              {/* Abs */}
              <div 
                className={`absolute top-52 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[4])}
                title="Abs"
              ></div>
              
              {/* Back */}
              <div 
                className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg opacity-50`}
                onClick={() => handleBodyPartClick(bodyParts[5])}
                title="Back"
              ></div>
              
              {/* Legs */}
              <div 
                className={`absolute top-72 left-1/2 transform -translate-x-1/2 w-16 h-32 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[6])}
                title="Legs"
              ></div>
              
              {/* Glutes */}
              <div 
                className={`absolute top-64 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-blue-400 hover:bg-blue-500 cursor-pointer transition-all duration-200 rounded-lg`}
                onClick={() => handleBodyPartClick(bodyParts[7])}
                title="Glutes"
              ></div>
            </div>
          </div>
        </div>

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

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            💡 Click on any body part above or in the diagram to see exercises
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyPartsSelection;
