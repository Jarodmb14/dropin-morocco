import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';

interface BodyPart {
  id: string;
  name: string;
  exercises: string[];
}

const BodyPartsSelection = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const bodyParts: BodyPart[] = [
    { id: 'chest', name: 'Chest', exercises: ['Push-ups', 'Bench Press', 'Chest Fly', 'Dumbbell Press'] },
    { id: 'shoulders', name: 'Shoulders', exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly'] },
    { id: 'biceps', name: 'Biceps', exercises: ['Bicep Curls', 'Hammer Curls', 'Concentration Curls', 'Preacher Curls'] },
    { id: 'triceps', name: 'Triceps', exercises: ['Tricep Dips', 'Close-Grip Press', 'Overhead Extension', 'Tricep Pushdowns'] },
    { id: 'abs', name: 'Abs', exercises: ['Crunches', 'Plank', 'Russian Twists', 'Mountain Climbers'] },
    { id: 'back', name: 'Back', exercises: ['Pull-ups', 'Rows', 'Deadlifts', 'Lat Pulldowns'] },
    { id: 'legs', name: 'Legs', exercises: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises'] },
    { id: 'glutes', name: 'Glutes', exercises: ['Hip Thrusts', 'Glute Bridges', 'Bulgarian Split Squats', 'Romanian Deadlifts'] }
  ];

  const handleBodyPartClick = (bodyPart: BodyPart) => {
    navigate(`/exercises/${bodyPart.id}`, { 
      state: { 
        bodyPart: bodyPart.name, 
        exercises: bodyPart.exercises 
      } 
    });
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
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 border border-gray-600"
              onClick={() => handleBodyPartClick(part)}
            >
              <h3 className="text-lg font-semibold text-center">{part.name}</h3>
              <p className="text-gray-400 text-sm text-center mt-2">
                {part.exercises.length} exercises
              </p>
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
