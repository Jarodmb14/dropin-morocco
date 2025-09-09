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
  const [imageError, setImageError] = useState(false);

  // Base URL for workout-cool repository images
  const baseUrl = 'https://raw.githubusercontent.com/Snouzy/workout-cool/main';
  
  // Common paths where body part images might be stored
  const possiblePaths = [
    '/public/images/body',
    '/src/assets/images/body',
    '/assets/images/body',
    '/public/assets/body',
    '/src/assets/body',
    '/assets/body'
  ];

  // Try to construct the image URL
  const getImageUrl = () => {
    const imageName = variant === 'front' ? 'body-front.png' : 'body-back.png';
    
    // Try different possible paths
    for (const path of possiblePaths) {
      return `${baseUrl}${path}/${imageName}`;
    }
    
    // Fallback to a generic path
    return `${baseUrl}/public/images/${imageName}`;
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // This would need to be implemented based on the actual image structure
    // For now, we'll use a simple coordinate-based approach
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click coordinates to body part (this is a simplified approach)
    const bodyPart = getBodyPartFromCoordinates(x, y, variant);
    if (bodyPart && onBodyPartClick) {
      onBodyPartClick(bodyPart);
    }
  };

  const getBodyPartFromCoordinates = (x: number, y: number, variant: string): string | null => {
    // This is a simplified coordinate-based mapping
    // In a real implementation, you'd need to know the exact image dimensions
    // and create proper clickable areas
    
    const width = 400; // Assuming image width
    const height = 600; // Assuming image height
    
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    if (variant === 'front') {
      // Front view body part mapping based on coordinates
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
    // Fallback to our custom SVG if the image fails to load
    return (
      <div className="text-center p-8 bg-gray-100 rounded-lg">
        <p className="text-gray-600 mb-4">
          Unable to load body diagram from workout-cool repository
        </p>
        <p className="text-sm text-gray-500">
          Using fallback diagram instead
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={getImageUrl()}
        alt={`Human body ${variant} view`}
        className="w-full h-auto cursor-pointer"
        onClick={handleImageClick}
        onError={() => setImageError(true)}
        onMouseEnter={() => onMouseEnter?.(null)}
        onMouseLeave={() => onMouseLeave?.()}
        style={{ maxWidth: '400px', maxHeight: '600px' }}
      />
      
      {/* Overlay for selection feedback */}
      {selectedPart && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full border-4 border-pink-400 rounded-lg shadow-lg" 
               style={{ 
                 boxShadow: '0 0 20px rgba(227, 191, 192, 0.8)',
                 borderRadius: '8px'
               }}>
          </div>
        </div>
      )}
    </div>
  );
}
