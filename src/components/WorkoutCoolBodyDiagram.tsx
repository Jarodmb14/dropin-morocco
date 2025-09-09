import React, { useState } from 'react';
import { BODY_PART_MAP } from '@/lib/bodypart-map';

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
      return '#3b82f6'; // Blue when selected
    }
    return 'transparent'; // Transparent when not selected
  };

  // Get the stroke color for a body part
  const getBodyPartStroke = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return '#1d4ed8'; // Darker blue stroke when selected
    }
    return '#e5e7eb'; // Light gray stroke when not selected
  };

  // Get the stroke width for a body part
  const getBodyPartStrokeWidth = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return '2'; // Thicker stroke when selected
    }
    return '1'; // Normal stroke when not selected
  };

  return (
    <div className="relative">
      <svg
        width="300"
        height="500"
        viewBox="0 0 300 500"
        className="w-full h-auto max-w-sm mx-auto"
        style={{ maxWidth: '300px', maxHeight: '500px' }}
      >
        {variant === 'front' ? (
          <>
            {/* Head - not clickable */}
            <ellipse
              cx="150"
              cy="50"
              rx="40"
              ry="30"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
            />
            
            {/* Shoulders */}
            <path
              d="M 80 80 Q 150 60 220 80 L 220 100 Q 150 80 80 100 Z"
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
              d="M 100 100 Q 150 90 200 100 L 200 160 Q 150 150 100 160 Z"
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
              d="M 80 100 Q 70 120 80 140 L 90 160 Q 100 140 90 120 Z"
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
              d="M 220 100 Q 230 120 220 140 L 210 160 Q 200 140 210 120 Z"
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
              d="M 110 160 Q 150 155 190 160 L 190 200 Q 150 195 110 200 Z"
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
              d="M 100 200 Q 150 195 200 200 L 200 230 Q 150 225 100 230 Z"
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
              d="M 120 230 Q 150 225 180 230 L 180 350 Q 150 345 120 350 Z"
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
            {/* Head - not clickable */}
            <ellipse
              cx="150"
              cy="50"
              rx="40"
              ry="30"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
            />
            
            {/* Shoulders */}
            <path
              d="M 80 80 Q 150 60 220 80 L 220 100 Q 150 80 80 100 Z"
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
              d="M 100 100 Q 150 90 200 100 L 200 160 Q 150 150 100 160 Z"
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
              d="M 80 100 Q 70 120 80 140 L 90 160 Q 100 140 90 120 Z"
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
              d="M 220 100 Q 230 120 220 140 L 210 160 Q 200 140 210 120 Z"
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
              d="M 110 160 Q 150 155 190 160 L 190 200 Q 150 195 110 200 Z"
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
              d="M 100 200 Q 150 195 200 200 L 200 230 Q 150 225 100 230 Z"
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
              d="M 120 230 Q 150 225 180 230 L 180 350 Q 150 345 120 350 Z"
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
                <text x="70" y="130" textAnchor="middle" className="text-xs fill-blue-600 font-bold">Biceps</text>
                <text x="230" y="130" textAnchor="middle" className="text-xs fill-yellow-600 font-bold">Triceps</text>
                <text x="150" y="180" textAnchor="middle" className="text-xs fill-purple-600 font-bold">Abs</text>
                <text x="150" y="215" textAnchor="middle" className="text-xs fill-cyan-600 font-bold">Glutes</text>
                <text x="150" y="290" textAnchor="middle" className="text-xs fill-orange-600 font-bold">Legs</text>
              </>
            ) : (
              <>
                {/* Debug labels for back view */}
                <text x="150" y="90" textAnchor="middle" className="text-xs fill-red-600 font-bold">Shoulders</text>
                <text x="150" y="130" textAnchor="middle" className="text-xs fill-green-600 font-bold">Back</text>
                <text x="70" y="130" textAnchor="middle" className="text-xs fill-blue-600 font-bold">Triceps</text>
                <text x="230" y="130" textAnchor="middle" className="text-xs fill-yellow-600 font-bold">Triceps</text>
                <text x="150" y="180" textAnchor="middle" className="text-xs fill-purple-600 font-bold">Lower Back</text>
                <text x="150" y="215" textAnchor="middle" className="text-xs fill-cyan-600 font-bold">Glutes</text>
                <text x="150" y="290" textAnchor="middle" className="text-xs fill-orange-600 font-bold">Legs</text>
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
