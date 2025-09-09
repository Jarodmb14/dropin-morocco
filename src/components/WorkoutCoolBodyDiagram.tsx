import React, { useState } from 'react';
import { BODY_PART_MAP } from '@/lib/bodypart-map';

type WorkoutCoolBodyDiagramProps = {
  variant: "front" | "back";
  selectedPart?: string | null;
  onBodyPartClick?: (id: string) => void;
  onMouseEnter?: (id: string | null) => void;
  onMouseLeave?: () => void;
};

export function WorkoutCoolBodyDiagram({ 
  variant, 
  selectedPart, 
  onBodyPartClick, 
  onMouseEnter, 
  onMouseLeave 
}: WorkoutCoolBodyDiagramProps) {
  // Workout-cool style body diagram - simplified and abstract
  const getBodyPartColor = (bodyPart: string, isSelected: boolean) => {
    if (isSelected) {
      return '#3b82f6'; // Blue when selected
    }
    
    // Different colors for different body parts in workout-cool style
    const colors = {
      chest: '#e5e7eb',
      shoulders: '#e5e7eb', 
      biceps: '#e5e7eb',
      triceps: '#e5e7eb',
      abs: '#e5e7eb',
      back: '#e5e7eb',
      glutes: '#e5e7eb',
      legs: '#3b82f6', // Blue for legs like in workout-cool
    };
    
    return colors[bodyPart as keyof typeof colors] || '#e5e7eb';
  };

  const handleBodyPartClick = (bodyPart: string) => {
    if (onBodyPartClick) {
      onBodyPartClick(bodyPart);
    }
  };

  const handleMouseEnter = (bodyPart: string) => {
    if (onMouseEnter) {
      onMouseEnter(bodyPart);
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  if (variant === 'front') {
    return (
      <div className="flex justify-center">
        <svg
          width="300"
          height="500"
          viewBox="0 0 300 500"
          className="cursor-pointer"
          onMouseLeave={handleMouseLeave}
        >
          {/* Head */}
          <circle
            cx="150"
            cy="50"
            r="25"
            fill="#6b7280"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Neck */}
          <rect
            x="140"
            y="70"
            width="20"
            height="20"
            fill="#6b7280"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Chest */}
          <ellipse
            cx="150"
            cy="140"
            rx="60"
            ry="40"
            fill={getBodyPartColor('chest', selectedPart === 'chest')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('chest')}
            onMouseEnter={() => handleMouseEnter('chest')}
          />
          
          {/* Shoulders */}
          <ellipse
            cx="150"
            cy="120"
            rx="80"
            ry="25"
            fill={getBodyPartColor('shoulders', selectedPart === 'shoulders')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('shoulders')}
            onMouseEnter={() => handleMouseEnter('shoulders')}
          />
          
          {/* Arms */}
          <ellipse
            cx="90"
            cy="180"
            rx="20"
            ry="60"
            fill={getBodyPartColor('biceps', selectedPart === 'biceps')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('biceps')}
            onMouseEnter={() => handleMouseEnter('biceps')}
          />
          
          <ellipse
            cx="210"
            cy="180"
            rx="20"
            ry="60"
            fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('triceps')}
            onMouseEnter={() => handleMouseEnter('triceps')}
          />
          
          {/* Abs */}
          <rect
            x="120"
            y="180"
            width="60"
            height="40"
            fill={getBodyPartColor('abs', selectedPart === 'abs')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('abs')}
            onMouseEnter={() => handleMouseEnter('abs')}
          />
          
          {/* Glutes */}
          <ellipse
            cx="150"
            cy="250"
            rx="50"
            ry="30"
            fill={getBodyPartColor('glutes', selectedPart === 'glutes')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('glutes')}
            onMouseEnter={() => handleMouseEnter('glutes')}
          />
          
          {/* Legs */}
          <rect
            x="130"
            y="280"
            width="40"
            height="120"
            fill={getBodyPartColor('legs', selectedPart === 'legs')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('legs')}
            onMouseEnter={() => handleMouseEnter('legs')}
          />
          
          {/* Feet */}
          <ellipse
            cx="150"
            cy="420"
            rx="30"
            ry="15"
            fill="#6b7280"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <svg
          width="300"
          height="500"
          viewBox="0 0 300 500"
          className="cursor-pointer"
          onMouseLeave={handleMouseLeave}
        >
          {/* Head */}
          <circle
            cx="150"
            cy="50"
            r="25"
            fill="#6b7280"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Neck */}
          <rect
            x="140"
            y="70"
            width="20"
            height="20"
            fill="#6b7280"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Back */}
          <ellipse
            cx="150"
            cy="140"
            rx="60"
            ry="40"
            fill={getBodyPartColor('back', selectedPart === 'back')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('back')}
            onMouseEnter={() => handleMouseEnter('back')}
          />
          
          {/* Shoulders */}
          <ellipse
            cx="150"
            cy="120"
            rx="80"
            ry="25"
            fill={getBodyPartColor('shoulders', selectedPart === 'shoulders')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('shoulders')}
            onMouseEnter={() => handleMouseEnter('shoulders')}
          />
          
          {/* Arms */}
          <ellipse
            cx="90"
            cy="180"
            rx="20"
            ry="60"
            fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('triceps')}
            onMouseEnter={() => handleMouseEnter('triceps')}
          />
          
          <ellipse
            cx="210"
            cy="180"
            rx="20"
            ry="60"
            fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('triceps')}
            onMouseEnter={() => handleMouseEnter('triceps')}
          />
          
          {/* Glutes */}
          <ellipse
            cx="150"
            cy="250"
            rx="50"
            ry="30"
            fill={getBodyPartColor('glutes', selectedPart === 'glutes')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('glutes')}
            onMouseEnter={() => handleMouseEnter('glutes')}
          />
          
          {/* Legs */}
          <rect
            x="130"
            y="280"
            width="40"
            height="120"
            fill={getBodyPartColor('legs', selectedPart === 'legs')}
            stroke="#374151"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity cursor-pointer"
            onClick={() => handleBodyPartClick('legs')}
            onMouseEnter={() => handleMouseEnter('legs')}
          />
          
          {/* Feet */}
          <ellipse
            cx="150"
            cy="420"
            rx="30"
            ry="15"
            fill="#6b7280"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }
}
