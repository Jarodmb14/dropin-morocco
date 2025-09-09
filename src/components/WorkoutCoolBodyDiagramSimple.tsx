import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Import the body images
import bodyFrontImage from '@/assets/body-front.png';
import bodyBackImage from '@/assets/body-front.png';

// Muscle groups enum matching workout-cool
export enum MuscleGroup {
  CHEST = 'CHEST',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  SHOULDERS = 'SHOULDERS',
  BACK = 'BACK',
  ABDOMINALS = 'ABDOMINALS',
  OBLIQUES = 'OBLIQUES',
  FOREARMS = 'FOREARMS',
  QUADRICEPS = 'QUADRICEPS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  TRAPS = 'TRAPS',
}

interface WorkoutCoolBodyDiagramProps {
  selectedMuscles?: MuscleGroup[];
  onMuscleToggle?: (muscle: MuscleGroup) => void;
  variant?: 'front' | 'back';
  debugMode?: boolean;
}

export const WorkoutCoolBodyDiagramSimple: React.FC<WorkoutCoolBodyDiagramProps> = ({
  selectedMuscles = [],
  onMuscleToggle,
  variant = 'front',
  debugMode = false,
}) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroup | null>(null);

  const getMuscleClasses = (muscle: MuscleGroup) => {
    const isSelected = selectedMuscles.includes(muscle);
    const isHovered = hoveredMuscle === muscle;
    
    return cn(
      "transition-all duration-100 ease-out",
      isSelected ? "fill-blue-500" : "fill-slate-400",
      isHovered && !isSelected ? "fill-blue-400" : "",
    );
  };

  const handleMuscleClick = (muscle: MuscleGroup) => {
    console.log('Muscle clicked:', muscle);
    onMuscleToggle?.(muscle);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background Image */}
      <div className="relative">
        <img
          src={variant === 'front' ? bodyFrontImage : bodyBackImage}
          alt={`Human body ${variant} view`}
          className="w-full h-auto"
        />
        
        {/* SVG Overlay for Muscle Selection */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 535 462"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simple clickable rectangles for testing */}
          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.CHEST)}>
            <rect
              x="100"
              y="100"
              width="100"
              height="80"
              className={getMuscleClasses(MuscleGroup.CHEST)}
              stroke="black"
              strokeWidth="2"
              fill="rgba(59, 130, 246, 0.3)"
            />
            <text x="150" y="140" textAnchor="middle" className="text-sm font-bold">CHEST</text>
          </g>

          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.BICEPS)}>
            <rect
              x="50"
              y="150"
              width="60"
              height="100"
              className={getMuscleClasses(MuscleGroup.BICEPS)}
              stroke="black"
              strokeWidth="2"
              fill="rgba(34, 197, 94, 0.3)"
            />
            <text x="80" y="200" textAnchor="middle" className="text-sm font-bold">BICEPS</text>
          </g>

          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.SHOULDERS)}>
            <rect
              x="200"
              y="80"
              width="80"
              height="60"
              className={getMuscleClasses(MuscleGroup.SHOULDERS)}
              stroke="black"
              strokeWidth="2"
              fill="rgba(168, 85, 247, 0.3)"
            />
            <text x="240" y="110" textAnchor="middle" className="text-sm font-bold">SHOULDERS</text>
          </g>

          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.ABDOMINALS)}>
            <rect
              x="120"
              y="200"
              width="60"
              height="80"
              className={getMuscleClasses(MuscleGroup.ABDOMINALS)}
              stroke="black"
              strokeWidth="2"
              fill="rgba(245, 158, 11, 0.3)"
            />
            <text x="150" y="240" textAnchor="middle" className="text-sm font-bold">ABS</text>
          </g>

          <g className="group cursor-pointer" onClick={() => handleMuscleClick(MuscleGroup.QUADRICEPS)}>
            <rect
              x="130"
              y="300"
              width="50"
              height="100"
              className={getMuscleClasses(MuscleGroup.QUADRICEPS)}
              stroke="black"
              strokeWidth="2"
              fill="rgba(236, 72, 153, 0.3)"
            />
            <text x="155" y="350" textAnchor="middle" className="text-sm font-bold">QUADS</text>
          </g>
        </svg>
      </div>
      
      {/* Selected muscles display */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Selected: {selectedMuscles.length > 0 ? selectedMuscles.join(', ') : 'None'}
        </p>
      </div>
    </div>
  );
};

export default WorkoutCoolBodyDiagramSimple;
