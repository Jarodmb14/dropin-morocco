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
      
      // Head area
      if (normalizedY > 0.0 && normalizedY < 0.15 && normalizedX > 0.3 && normalizedX < 0.7) {
        return null; // Head not clickable
      }
      
      // Shoulders (wider area)
      if (normalizedY > 0.15 && normalizedY < 0.25 && normalizedX > 0.15 && normalizedX < 0.85) {
        return 'shoulders';
      }
      
      // Chest (main torso area)
      if (normalizedY > 0.25 && normalizedY < 0.45 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'chest';
      }
      
      // Arms - Left (biceps)
      if (normalizedY > 0.25 && normalizedY < 0.55 && normalizedX > 0.05 && normalizedX < 0.25) {
        return 'biceps';
      }
      
      // Arms - Right (triceps)
      if (normalizedY > 0.25 && normalizedY < 0.55 && normalizedX > 0.75 && normalizedX < 0.95) {
        return 'triceps';
      }
      
      // Abs (lower torso)
      if (normalizedY > 0.45 && normalizedY < 0.6 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'abs';
      }
      
      // Glutes (hip area)
      if (normalizedY > 0.6 && normalizedY < 0.75 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'glutes';
      }
      
      // Legs (thighs and calves)
      if (normalizedY > 0.75 && normalizedY < 0.95 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'legs';
      }
      
    } else {
      // Back view - more precise body part mapping
      
      // Head area
      if (normalizedY > 0.0 && normalizedY < 0.15 && normalizedX > 0.3 && normalizedX < 0.7) {
        return null; // Head not clickable
      }
      
      // Shoulders (wider area)
      if (normalizedY > 0.15 && normalizedY < 0.25 && normalizedX > 0.15 && normalizedX < 0.85) {
        return 'shoulders';
      }
      
      // Back (main torso area)
      if (normalizedY > 0.25 && normalizedY < 0.45 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'back';
      }
      
      // Arms - Left (triceps from back)
      if (normalizedY > 0.25 && normalizedY < 0.55 && normalizedX > 0.05 && normalizedX < 0.25) {
        return 'triceps';
      }
      
      // Arms - Right (triceps from back)
      if (normalizedY > 0.25 && normalizedY < 0.55 && normalizedX > 0.75 && normalizedX < 0.95) {
        return 'triceps';
      }
      
      // Lower back
      if (normalizedY > 0.45 && normalizedY < 0.6 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'back';
      }
      
      // Glutes (hip area)
      if (normalizedY > 0.6 && normalizedY < 0.75 && normalizedX > 0.25 && normalizedX < 0.75) {
        return 'glutes';
      }
      
      // Legs (hamstrings and calves)
      if (normalizedY > 0.75 && normalizedY < 0.95 && normalizedX > 0.3 && normalizedX < 0.7) {
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
      
      {/* Debug overlay to show clickable areas */}
      {debugMode && (
        <div className="absolute inset-0 pointer-events-none">
          <svg width="300" height="500" className="absolute inset-0">
            {variant === 'front' ? (
              <>
                {/* Shoulders */}
                <rect x="45" y="75" width="210" height="50" fill="rgba(255,0,0,0.2)" stroke="red" strokeWidth="1" />
                <text x="150" y="100" textAnchor="middle" className="text-xs fill-red-600">Shoulders</text>
                
                {/* Chest */}
                <rect x="75" y="125" width="150" height="100" fill="rgba(0,255,0,0.2)" stroke="green" strokeWidth="1" />
                <text x="150" y="175" textAnchor="middle" className="text-xs fill-green-600">Chest</text>
                
                {/* Left Arm (Biceps) */}
                <rect x="15" y="125" width="60" height="150" fill="rgba(0,0,255,0.2)" stroke="blue" strokeWidth="1" />
                <text x="45" y="200" textAnchor="middle" className="text-xs fill-blue-600">Biceps</text>
                
                {/* Right Arm (Triceps) */}
                <rect x="225" y="125" width="60" height="150" fill="rgba(255,255,0,0.2)" stroke="yellow" strokeWidth="1" />
                <text x="255" y="200" textAnchor="middle" className="text-xs fill-yellow-600">Triceps</text>
                
                {/* Abs */}
                <rect x="90" y="225" width="120" height="75" fill="rgba(255,0,255,0.2)" stroke="magenta" strokeWidth="1" />
                <text x="150" y="262" textAnchor="middle" className="text-xs fill-magenta-600">Abs</text>
                
                {/* Glutes */}
                <rect x="75" y="300" width="150" height="75" fill="rgba(0,255,255,0.2)" stroke="cyan" strokeWidth="1" />
                <text x="150" y="337" textAnchor="middle" className="text-xs fill-cyan-600">Glutes</text>
                
                {/* Legs */}
                <rect x="90" y="375" width="120" height="100" fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth="1" />
                <text x="150" y="425" textAnchor="middle" className="text-xs fill-orange-600">Legs</text>
              </>
            ) : (
              <>
                {/* Shoulders */}
                <rect x="45" y="75" width="210" height="50" fill="rgba(255,0,0,0.2)" stroke="red" strokeWidth="1" />
                <text x="150" y="100" textAnchor="middle" className="text-xs fill-red-600">Shoulders</text>
                
                {/* Back */}
                <rect x="75" y="125" width="150" height="100" fill="rgba(0,255,0,0.2)" stroke="green" strokeWidth="1" />
                <text x="150" y="175" textAnchor="middle" className="text-xs fill-green-600">Back</text>
                
                {/* Left Arm (Triceps) */}
                <rect x="15" y="125" width="60" height="150" fill="rgba(0,0,255,0.2)" stroke="blue" strokeWidth="1" />
                <text x="45" y="200" textAnchor="middle" className="text-xs fill-blue-600">Triceps</text>
                
                {/* Right Arm (Triceps) */}
                <rect x="225" y="125" width="60" height="150" fill="rgba(255,255,0,0.2)" stroke="yellow" strokeWidth="1" />
                <text x="255" y="200" textAnchor="middle" className="text-xs fill-yellow-600">Triceps</text>
                
                {/* Lower Back */}
                <rect x="90" y="225" width="120" height="75" fill="rgba(255,0,255,0.2)" stroke="magenta" strokeWidth="1" />
                <text x="150" y="262" textAnchor="middle" className="text-xs fill-magenta-600">Lower Back</text>
                
                {/* Glutes */}
                <rect x="75" y="300" width="150" height="75" fill="rgba(0,255,255,0.2)" stroke="cyan" strokeWidth="1" />
                <text x="150" y="337" textAnchor="middle" className="text-xs fill-cyan-600">Glutes</text>
                
                {/* Legs */}
                <rect x="90" y="375" width="120" height="100" fill="rgba(255,165,0,0.2)" stroke="orange" strokeWidth="1" />
                <text x="150" y="425" textAnchor="middle" className="text-xs fill-orange-600">Legs</text>
              </>
            )}
          </svg>
        </div>
      )}
      
      {/* Overlay for selection feedback */}
      {selectedPart && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-4 border-blue-500 rounded-lg shadow-lg" 
               style={{ 
                 boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)',
                 borderRadius: '8px'
               }}>
          </div>
        </div>
      )}
    </div>
  );
}
