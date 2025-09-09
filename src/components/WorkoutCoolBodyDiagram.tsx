import React, { useState } from 'react';
import { BODY_PART_MAP } from '@/lib/bodypart-map';

// Import the realistic body images
import bodyFrontImage from '@/assets/body-front.png';
import bodyBackImage from '@/assets/body-back.png';

type WorkoutCoolBodyDiagramProps = {
  variant: "front" | "back";
  selectedPart?: string | null;
  onBodyPartClick?: (id: string) => void;
  onMouseEnter?: (id: string | null) => void;
  onMouseLeave?: () => void;
  debugMode?: boolean;
};

export function WorkoutCoolBodyDiagram({
  variant,
  selectedPart,
  onBodyPartClick,
  onMouseEnter,
  onMouseLeave,
  debugMode = false
}: WorkoutCoolBodyDiagramProps) {
  const [imageError, setImageError] = useState(false);
  
  // Handle body part click
  const handleBodyPartClick = (bodyPartId: string) => {
    if (onBodyPartClick) {
      onBodyPartClick(bodyPartId);
    }
  };

  // Handle mouse enter
  const handleMouseEnter = (bodyPartId: string) => {
    if (onMouseEnter) {
      onMouseEnter(bodyPartId);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  // Get the fill color for a body part based on selection
  const getBodyPartFill = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return 'rgba(59, 130, 246, 0.4)'; // Semi-transparent blue when selected
    }
    return 'transparent'; // Transparent when not selected
  };

  // Get the stroke color for a body part
  const getBodyPartStroke = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return '#1d4ed8'; // Darker blue stroke when selected
    }
    return 'transparent'; // No stroke when not selected
  };

  // Get the stroke width for a body part
  const getBodyPartStrokeWidth = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return '3'; // Thicker stroke when selected
    }
    return '0'; // No stroke when not selected
  };

  if (imageError) {
    return (
      <div className="text-center p-8 bg-gray-100 rounded-lg">
        <p className="text-gray-600 mb-4">
          Unable to load realistic body diagram
        </p>
        <p className="text-sm text-gray-500">
          Please check if the body images are available
        </p>
      </div>
    );
  }

  const imageSrc = variant === 'front' ? bodyFrontImage : bodyBackImage;

  return (
    <div className="relative">
      {/* Realistic body image as background */}
      <img
        src={imageSrc}
        alt={`Human body ${variant} view`}
        className="w-full h-auto max-w-sm mx-auto"
        onError={() => setImageError(true)}
        style={{ maxWidth: '300px', maxHeight: '500px' }}
      />
      
      {/* SVG overlay with clickable muscle areas */}
      <svg
        width="300"
        height="500"
        viewBox="0 0 300 500"
        className="absolute inset-0 w-full h-full"
        style={{ maxWidth: '300px', maxHeight: '500px' }}
      >
        {variant === 'front' ? (
          <>
            {/* Shoulders */}
            <path
              d="M 60 80 Q 150 65 240 80 L 240 100 Q 150 85 60 100 Z"
              fill={getBodyPartFill('shoulders')}
              stroke={getBodyPartStroke('shoulders')}
              strokeWidth={getBodyPartStrokeWidth('shoulders')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('shoulders')}
              onMouseEnter={() => handleMouseEnter('shoulders')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Chest */}
            <path
              d="M 90 100 Q 150 95 210 100 L 210 160 Q 150 155 90 160 Z"
              fill={getBodyPartFill('chest')}
              stroke={getBodyPartStroke('chest')}
              strokeWidth={getBodyPartStrokeWidth('chest')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('chest')}
              onMouseEnter={() => handleMouseEnter('chest')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Left Arm (Biceps) */}
            <path
              d="M 30 100 Q 20 130 30 160 L 50 180 Q 60 150 50 120 Z"
              fill={getBodyPartFill('biceps')}
              stroke={getBodyPartStroke('biceps')}
              strokeWidth={getBodyPartStrokeWidth('biceps')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('biceps')}
              onMouseEnter={() => handleMouseEnter('biceps')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Right Arm (Triceps) */}
            <path
              d="M 270 100 Q 280 130 270 160 L 250 180 Q 240 150 250 120 Z"
              fill={getBodyPartFill('triceps')}
              stroke={getBodyPartStroke('triceps')}
              strokeWidth={getBodyPartStrokeWidth('triceps')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('triceps')}
              onMouseEnter={() => handleMouseEnter('triceps')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Abs */}
            <path
              d="M 100 160 Q 150 158 200 160 L 200 200 Q 150 198 100 200 Z"
              fill={getBodyPartFill('abs')}
              stroke={getBodyPartStroke('abs')}
              strokeWidth={getBodyPartStrokeWidth('abs')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('abs')}
              onMouseEnter={() => handleMouseEnter('abs')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Glutes */}
            <path
              d="M 90 200 Q 150 198 210 200 L 210 240 Q 150 238 90 240 Z"
              fill={getBodyPartFill('glutes')}
              stroke={getBodyPartStroke('glutes')}
              strokeWidth={getBodyPartStrokeWidth('glutes')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('glutes')}
              onMouseEnter={() => handleMouseEnter('glutes')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Legs */}
            <path
              d="M 110 240 Q 150 238 190 240 L 190 380 Q 150 378 110 380 Z"
              fill={getBodyPartFill('legs')}
              stroke={getBodyPartStroke('legs')}
              strokeWidth={getBodyPartStrokeWidth('legs')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('legs')}
              onMouseEnter={() => handleMouseEnter('legs')}
              onMouseLeave={handleMouseLeave}
            />
          </>
        ) : (
          <>
            {/* Shoulders */}
            <path
              d="M 60 80 Q 150 65 240 80 L 240 100 Q 150 85 60 100 Z"
              fill={getBodyPartFill('shoulders')}
              stroke={getBodyPartStroke('shoulders')}
              strokeWidth={getBodyPartStrokeWidth('shoulders')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('shoulders')}
              onMouseEnter={() => handleMouseEnter('shoulders')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Back */}
            <path
              d="M 90 100 Q 150 95 210 100 L 210 160 Q 150 155 90 160 Z"
              fill={getBodyPartFill('back')}
              stroke={getBodyPartStroke('back')}
              strokeWidth={getBodyPartStrokeWidth('back')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('back')}
              onMouseEnter={() => handleMouseEnter('back')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Left Arm (Triceps) */}
            <path
              d="M 30 100 Q 20 130 30 160 L 50 180 Q 60 150 50 120 Z"
              fill={getBodyPartFill('triceps')}
              stroke={getBodyPartStroke('triceps')}
              strokeWidth={getBodyPartStrokeWidth('triceps')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('triceps')}
              onMouseEnter={() => handleMouseEnter('triceps')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Right Arm (Triceps) */}
            <path
              d="M 270 100 Q 280 130 270 160 L 250 180 Q 240 150 250 120 Z"
              fill={getBodyPartFill('triceps')}
              stroke={getBodyPartStroke('triceps')}
              strokeWidth={getBodyPartStrokeWidth('triceps')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('triceps')}
              onMouseEnter={() => handleMouseEnter('triceps')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Lower Back */}
            <path
              d="M 100 160 Q 150 158 200 160 L 200 200 Q 150 198 100 200 Z"
              fill={getBodyPartFill('back')}
              stroke={getBodyPartStroke('back')}
              strokeWidth={getBodyPartStrokeWidth('back')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('back')}
              onMouseEnter={() => handleMouseEnter('back')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Glutes */}
            <path
              d="M 90 200 Q 150 198 210 200 L 210 240 Q 150 238 90 240 Z"
              fill={getBodyPartFill('glutes')}
              stroke={getBodyPartStroke('glutes')}
              strokeWidth={getBodyPartStrokeWidth('glutes')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('glutes')}
              onMouseEnter={() => handleMouseEnter('glutes')}
              onMouseLeave={handleMouseLeave}
            />
            
            {/* Legs */}
            <path
              d="M 110 240 Q 150 238 190 240 L 190 380 Q 150 378 110 380 Z"
              fill={getBodyPartFill('legs')}
              stroke={getBodyPartStroke('legs')}
              strokeWidth={getBodyPartStrokeWidth('legs')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleBodyPartClick('legs')}
              onMouseEnter={() => handleMouseEnter('legs')}
              onMouseLeave={handleMouseLeave}
            />
          </>
        )}
        
        {/* Debug overlay to show clickable areas */}
        {debugMode && (
          <>
            {variant === 'front' ? (
              <>
                {/* Debug labels for front view */}
                <text x="150" y="90" textAnchor="middle" className="text-xs fill-red-600 font-bold">Shoulders</text>
                <text x="150" y="130" textAnchor="middle" className="text-xs fill-green-600 font-bold">Chest</text>
                <text x="40" y="130" textAnchor="middle" className="text-xs fill-blue-600 font-bold">Biceps</text>
                <text x="260" y="130" textAnchor="middle" className="text-xs fill-yellow-600 font-bold">Triceps</text>
                <text x="150" y="180" textAnchor="middle" className="text-xs fill-purple-600 font-bold">Abs</text>
                <text x="150" y="220" textAnchor="middle" className="text-xs fill-cyan-600 font-bold">Glutes</text>
                <text x="150" y="310" textAnchor="middle" className="text-xs fill-orange-600 font-bold">Legs</text>
              </>
            ) : (
              <>
                {/* Debug labels for back view */}
                <text x="150" y="90" textAnchor="middle" className="text-xs fill-red-600 font-bold">Shoulders</text>
                <text x="150" y="130" textAnchor="middle" className="text-xs fill-green-600 font-bold">Back</text>
                <text x="40" y="130" textAnchor="middle" className="text-xs fill-blue-600 font-bold">Triceps</text>
                <text x="260" y="130" textAnchor="middle" className="text-xs fill-yellow-600 font-bold">Triceps</text>
                <text x="150" y="180" textAnchor="middle" className="text-xs fill-purple-600 font-bold">Lower Back</text>
                <text x="150" y="220" textAnchor="middle" className="text-xs fill-cyan-600 font-bold">Glutes</text>
                <text x="150" y="310" textAnchor="middle" className="text-xs fill-orange-600 font-bold">Legs</text>
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
