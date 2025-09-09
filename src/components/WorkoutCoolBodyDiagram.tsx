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
  debugMode?: boolean; // Add debug mode to show click areas
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to body part
    const bodyPart = getBodyPartFromCoordinates(x, y, variant);
    if (bodyPart && onBodyPartClick) {
      onBodyPartClick(bodyPart);
    }
  };

  const getBodyPartFromCoordinates = (x: number, y: number, variant: string): string | null => {
    // More accurate coordinates based on the actual body images
    // These are normalized coordinates (0-1) for better accuracy
    const normalizedX = x / 300; // Image width
    const normalizedY = y / 500; // Image height
    
    if (variant === 'front') {
      // Front view - more precise body part mapping
      
      // Head area (not clickable)
      if (normalizedY > 0.0 && normalizedY < 0.12 && normalizedX > 0.35 && normalizedX < 0.65) {
        return null;
      }
      
      // Shoulders (wider area)
      if (normalizedY > 0.12 && normalizedY < 0.22 && normalizedX > 0.1 && normalizedX < 0.9) {
        return 'shoulders';
      }
      
      // Chest (main torso area)
      if (normalizedY > 0.22 && normalizedY < 0.42 && normalizedX > 0.2 && normalizedX < 0.8) {
        return 'chest';
      }
      
      // Arms - Left (biceps)
      if (normalizedY > 0.22 && normalizedY < 0.52 && normalizedX > 0.0 && normalizedX < 0.2) {
        return 'biceps';
      }
      
      // Arms - Right (triceps)
      if (normalizedY > 0.22 && normalizedY < 0.52 && normalizedX > 0.8 && normalizedX < 1.0) {
        return 'triceps';
      }
      
      // Abs (lower torso)
      if (normalizedY > 0.42 && normalizedY < 0.58 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'abs';
      }
      
      // Glutes (hip area)
      if (normalizedY > 0.58 && normalizedY < 0.72 && normalizedX > 0.2 && normalizedX < 0.8) {
        return 'glutes';
      }
      
      // Legs (thighs and calves)
      if (normalizedY > 0.72 && normalizedY < 0.95 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'legs';
      }
      
    } else {
      // Back view - more precise body part mapping
      
      // Head area (not clickable)
      if (normalizedY > 0.0 && normalizedY < 0.12 && normalizedX > 0.35 && normalizedX < 0.65) {
        return null;
      }
      
      // Shoulders (wider area)
      if (normalizedY > 0.12 && normalizedY < 0.22 && normalizedX > 0.1 && normalizedX < 0.9) {
        return 'shoulders';
      }
      
      // Back (main torso area)
      if (normalizedY > 0.22 && normalizedY < 0.42 && normalizedX > 0.2 && normalizedX < 0.8) {
        return 'back';
      }
      
      // Arms - Left (triceps from back)
      if (normalizedY > 0.22 && normalizedY < 0.52 && normalizedX > 0.0 && normalizedX < 0.2) {
        return 'triceps';
      }
      
      // Arms - Right (triceps from back)
      if (normalizedY > 0.22 && normalizedY < 0.52 && normalizedX > 0.8 && normalizedX < 1.0) {
        return 'triceps';
      }
      
      // Lower back
      if (normalizedY > 0.42 && normalizedY < 0.58 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'back';
      }
      
      // Glutes (hip area)
      if (normalizedY > 0.58 && normalizedY < 0.72 && normalizedX > 0.2 && normalizedX < 0.8) {
        return 'glutes';
      }
      
      // Legs (hamstrings and calves)
      if (normalizedY > 0.72 && normalizedY < 0.95 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'legs';
      }
    }
    
    return null;
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

  // Get the color for a body part based on selection
  const getBodyPartColor = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return 'rgba(59, 130, 246, 0.3)'; // Blue when selected
    }
    return 'rgba(0, 0, 0, 0)'; // Transparent when not selected
  };

  // Get the stroke color for a body part
  const getBodyPartStroke = (bodyPartId: string) => {
    if (selectedPart === bodyPartId) {
      return '#3b82f6'; // Blue stroke when selected
    }
    return 'transparent'; // No stroke when not selected
  };

  return (
    <div className="relative">
      <img
        src={imageSrc}
        alt={`Human body ${variant} view`}
        className="w-full h-auto cursor-pointer max-w-sm mx-auto"
        onClick={handleImageClick}
        onError={() => setImageError(true)}
        onMouseEnter={() => onMouseEnter?.(null)}
        onMouseLeave={() => onMouseLeave?.()}
        style={{ maxWidth: '300px', maxHeight: '500px' }}
      />
      
      {/* Body part selection overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="300" height="500" className="absolute inset-0">
          {variant === 'front' ? (
            <>
              {/* Shoulders */}
              <rect 
                x="30" y="36" width="240" height="30" 
                fill={getBodyPartColor('shoulders')} 
                stroke={getBodyPartStroke('shoulders')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('shoulders')}
              />
              
              {/* Chest */}
              <rect 
                x="60" y="66" width="180" height="60" 
                fill={getBodyPartColor('chest')} 
                stroke={getBodyPartStroke('chest')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('chest')}
              />
              
              {/* Left Arm (Biceps) */}
              <rect 
                x="0" y="66" width="60" height="90" 
                fill={getBodyPartColor('biceps')} 
                stroke={getBodyPartStroke('biceps')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('biceps')}
              />
              
              {/* Right Arm (Triceps) */}
              <rect 
                x="240" y="66" width="60" height="90" 
                fill={getBodyPartColor('triceps')} 
                stroke={getBodyPartStroke('triceps')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('triceps')}
              />
              
              {/* Abs */}
              <rect 
                x="75" y="126" width="150" height="48" 
                fill={getBodyPartColor('abs')} 
                stroke={getBodyPartStroke('abs')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('abs')}
              />
              
              {/* Glutes */}
              <rect 
                x="60" y="174" width="180" height="42" 
                fill={getBodyPartColor('glutes')} 
                stroke={getBodyPartStroke('glutes')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('glutes')}
              />
              
              {/* Legs */}
              <rect 
                x="75" y="216" width="150" height="69" 
                fill={getBodyPartColor('legs')} 
                stroke={getBodyPartStroke('legs')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('legs')}
              />
            </>
          ) : (
            <>
              {/* Shoulders */}
              <rect 
                x="30" y="36" width="240" height="30" 
                fill={getBodyPartColor('shoulders')} 
                stroke={getBodyPartStroke('shoulders')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('shoulders')}
              />
              
              {/* Back */}
              <rect 
                x="60" y="66" width="180" height="60" 
                fill={getBodyPartColor('back')} 
                stroke={getBodyPartStroke('back')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('back')}
              />
              
              {/* Left Arm (Triceps) */}
              <rect 
                x="0" y="66" width="60" height="90" 
                fill={getBodyPartColor('triceps')} 
                stroke={getBodyPartStroke('triceps')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('triceps')}
              />
              
              {/* Right Arm (Triceps) */}
              <rect 
                x="240" y="66" width="60" height="90" 
                fill={getBodyPartColor('triceps')} 
                stroke={getBodyPartStroke('triceps')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('triceps')}
              />
              
              {/* Lower Back */}
              <rect 
                x="75" y="126" width="150" height="48" 
                fill={getBodyPartColor('back')} 
                stroke={getBodyPartStroke('back')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('back')}
              />
              
              {/* Glutes */}
              <rect 
                x="60" y="174" width="180" height="42" 
                fill={getBodyPartColor('glutes')} 
                stroke={getBodyPartStroke('glutes')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('glutes')}
              />
              
              {/* Legs */}
              <rect 
                x="75" y="216" width="150" height="69" 
                fill={getBodyPartColor('legs')} 
                stroke={getBodyPartStroke('legs')} 
                strokeWidth="3"
                className="pointer-events-auto cursor-pointer"
                onClick={() => onBodyPartClick?.('legs')}
              />
            </>
          )}
        </svg>
      </div>
      
      {/* Debug overlay to show clickable areas */}
      {debugMode && (
        <div className="absolute inset-0 pointer-events-none">
          <svg width="300" height="500" className="absolute inset-0">
            {variant === 'front' ? (
              <>
                {/* Shoulders */}
                <rect x="30" y="36" width="240" height="30" fill="rgba(255,0,0,0.2)" stroke="red" strokeWidth="1" />
                <text x="150" y="55" textAnchor="middle" className="text-xs fill-red-600">Shoulders</text>
                
                {/* Chest */}
                <rect x="60" y="66" width="180" height="60" fill="rgba(0,255,0,0.2)" stroke="green" strokeWidth="1" />
                <text x="150" y="100" textAnchor="middle" className="text-xs fill-green-600">Chest</text>
                
                {/* Left Arm (Biceps) */}
                <rect x="0" y="66" width="60" height="90" fill="rgba(0,0,255,0.2)" stroke="blue" strokeWidth="1" />
                <text x="30" y="115" textAnchor="middle" className="text-xs fill-blue-600">Biceps</text>
                
                {/* Right Arm (Triceps) */}
                <rect x="240" y="66" width="60" height="90" fill="rgba(255,255,0,0.2)" stroke="yellow" strokeWidth="1" />
                <text x="270" y="115" textAnchor="middle" className="text-xs fill-yellow-600">Triceps</text>
                
                {/* Abs */}
                <rect x="75" y="126" width="150" height="48" fill="rgba(255,0,255,0.2)" stroke="magenta" strokeWidth="1" />
                <text x="150" y="155" textAnchor="middle" className="text-xs fill-magenta-600">Abs</text>
                
                {/* Glutes */}
                <rect x="60" y="174" width="180" height="42" fill="rgba(0,255,255,0.2)" stroke="cyan" strokeWidth="1" />
                <text x="150" y="200" textAnchor="middle" className="text-xs fill-cyan-600">Glutes</text>
                
                {/* Legs */}
                <rect x="75" y="216" width="150" height="69" fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth="1" />
                <text x="150" y="255" textAnchor="middle" className="text-xs fill-orange-600">Legs</text>
              </>
            ) : (
              <>
                {/* Shoulders */}
                <rect x="30" y="36" width="240" height="30" fill="rgba(255,0,0,0.2)" stroke="red" strokeWidth="1" />
                <text x="150" y="55" textAnchor="middle" className="text-xs fill-red-600">Shoulders</text>
                
                {/* Back */}
                <rect x="60" y="66" width="180" height="60" fill="rgba(0,255,0,0.2)" stroke="green" strokeWidth="1" />
                <text x="150" y="100" textAnchor="middle" className="text-xs fill-green-600">Back</text>
                
                {/* Left Arm (Triceps) */}
                <rect x="0" y="66" width="60" height="90" fill="rgba(0,0,255,0.2)" stroke="blue" strokeWidth="1" />
                <text x="30" y="115" textAnchor="middle" className="text-xs fill-blue-600">Triceps</text>
                
                {/* Right Arm (Triceps) */}
                <rect x="240" y="66" width="60" height="90" fill="rgba(255,255,0,0.2)" stroke="yellow" strokeWidth="1" />
                <text x="270" y="115" textAnchor="middle" className="text-xs fill-yellow-600">Triceps</text>
                
                {/* Lower Back */}
                <rect x="75" y="126" width="150" height="48" fill="rgba(255,0,255,0.2)" stroke="magenta" strokeWidth="1" />
                <text x="150" y="155" textAnchor="middle" className="text-xs fill-magenta-600">Lower Back</text>
                
                {/* Glutes */}
                <rect x="60" y="174" width="180" height="42" fill="rgba(0,255,255,0.2)" stroke="cyan" strokeWidth="1" />
                <text x="150" y="200" textAnchor="middle" className="text-xs fill-cyan-600">Glutes</text>
                
                {/* Legs */}
                <rect x="75" y="216" width="150" height="69" fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth="1" />
                <text x="150" y="255" textAnchor="middle" className="text-xs fill-orange-600">Legs</text>
              </>
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
