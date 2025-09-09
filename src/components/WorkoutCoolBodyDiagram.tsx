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
};

export function WorkoutCoolBodyDiagram({ 
  variant, 
  selectedPart, 
  onBodyPartClick, 
  onMouseEnter, 
  onMouseLeave 
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
    // These coordinates are based on the realistic body images
    // You may need to adjust these based on the actual image dimensions
    const width = 300; // Image width
    const height = 500; // Image height
    
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    if (variant === 'front') {
      // Front view body part mapping based on realistic image coordinates
      if (normalizedY > 0.2 && normalizedY < 0.4 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'chest';
      }
      if (normalizedY > 0.15 && normalizedY < 0.3 && normalizedX > 0.2 && normalizedX < 0.8) {
        return 'shoulders';
      }
      if (normalizedY > 0.3 && normalizedY < 0.6 && normalizedX > 0.1 && normalizedX < 0.3) {
        return 'biceps';
      }
      if (normalizedY > 0.3 && normalizedY < 0.6 && normalizedX > 0.7 && normalizedX < 0.9) {
        return 'triceps';
      }
      if (normalizedY > 0.4 && normalizedY < 0.6 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'abs';
      }
      if (normalizedY > 0.6 && normalizedY < 0.8 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'glutes';
      }
      if (normalizedY > 0.7 && normalizedY < 0.95 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'legs';
      }
    } else {
      // Back view body part mapping
      if (normalizedY > 0.2 && normalizedY < 0.4 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'back';
      }
      if (normalizedY > 0.15 && normalizedY < 0.3 && normalizedX > 0.2 && normalizedX < 0.8) {
        return 'shoulders';
      }
      if (normalizedY > 0.3 && normalizedY < 0.6 && normalizedX > 0.1 && normalizedX < 0.3) {
        return 'triceps';
      }
      if (normalizedY > 0.3 && normalizedY < 0.6 && normalizedX > 0.7 && normalizedX < 0.9) {
        return 'triceps';
      }
      if (normalizedY > 0.6 && normalizedY < 0.8 && normalizedX > 0.3 && normalizedX < 0.7) {
        return 'glutes';
      }
      if (normalizedY > 0.7 && normalizedY < 0.95 && normalizedX > 0.3 && normalizedX < 0.7) {
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
