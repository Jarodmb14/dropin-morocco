import React from 'react';
import { BODY_PART_MAP } from '@/lib/bodypart-map';

type BodyDiagramProps = {
  variant: "front" | "back";
  selectedPart?: string | null;
  onBodyPartClick?: (id: string) => void;
  onMouseEnter?: (id: string | null) => void;
  onMouseLeave?: () => void;
};

export function BodyDiagram({ 
  variant, 
  selectedPart, 
  onBodyPartClick, 
  onMouseEnter, 
  onMouseLeave 
}: BodyDiagramProps) {
  
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLElement;
    const bodyPartId = target?.dataset?.bodypart;
    
    if (bodyPartId && onBodyPartClick) {
      onBodyPartClick(bodyPartId);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLElement;
    const bodyPartId = target?.dataset?.bodypart;
    
    if (bodyPartId && onMouseEnter) {
      onMouseEnter(bodyPartId);
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  const getBodyPartColor = (bodyPartId: string, isSelected: boolean) => {
    // Match the anatomical style from your images - light blue-grey base with white outlines
    const colorMap: Record<string, { normal: string; selected: string }> = {
      'chest': { normal: '#a8b2d1', selected: '#8b9dd1' }, // Light blue-grey
      'shoulders': { normal: '#a8b2d1', selected: '#8b9dd1' },
      'biceps': { normal: '#a8b2d1', selected: '#8b9dd1' },
      'triceps': { normal: '#a8b2d1', selected: '#8b9dd1' },
      'abs': { normal: '#a8b2d1', selected: '#8b9dd1' },
      'back': { normal: '#a8b2d1', selected: '#8b9dd1' },
      'glutes': { normal: '#a8b2d1', selected: '#8b9dd1' },
      'legs': { normal: '#4a90e2', selected: '#357abd' }, // Highlighted blue for legs like in your image
    };
    
    const colors = colorMap[bodyPartId] || { normal: '#a8b2d1', selected: '#8b9dd1' };
    return isSelected ? colors.selected : colors.normal;
  };

  const renderFrontView = () => (
    <g>
      {/* Head - darker grey like in your image */}
      <circle
        cx="300"
        cy="70"
        r="35"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="3"
      />
      
      {/* Neck */}
      <rect
        x="285"
        y="105"
        width="30"
        height="20"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Chest - more anatomical shape */}
      <path
        id="chest"
        data-bodypart="chest"
        d="M 230 125 Q 300 110 370 125 L 370 200 Q 300 190 230 200 Z"
        fill={getBodyPartColor('chest', selectedPart === 'chest')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'chest' ? 'selected' : ''}`}
      />
      
      {/* Shoulders - deltoid shape */}
      <path
        id="shoulders"
        data-bodypart="shoulders"
        d="M 190 130 Q 300 115 410 130 L 410 180 Q 300 170 190 180 Z"
        fill={getBodyPartColor('shoulders', selectedPart === 'shoulders')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'shoulders' ? 'selected' : ''}`}
      />
      
      {/* Biceps - upper arm */}
      <path
        id="biceps"
        data-bodypart="biceps"
        d="M 190 180 L 230 180 L 230 320 L 190 320 Z"
        fill={getBodyPartColor('biceps', selectedPart === 'biceps')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'biceps' ? 'selected' : ''}`}
      />
      
      {/* Triceps - upper arm */}
      <path
        id="triceps"
        data-bodypart="triceps"
        d="M 370 180 L 410 180 L 410 320 L 370 320 Z"
        fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'triceps' ? 'selected' : ''}`}
      />
      
      {/* Abs - more defined six-pack shape */}
      <path
        id="abs"
        data-bodypart="abs"
        d="M 230 200 L 370 200 L 370 280 L 230 280 Z"
        fill={getBodyPartColor('abs', selectedPart === 'abs')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'abs' ? 'selected' : ''}`}
      />
      
      {/* Glutes - hip area */}
      <path
        id="glutes"
        data-bodypart="glutes"
        d="M 230 280 L 370 280 L 370 320 L 230 320 Z"
        fill={getBodyPartColor('glutes', selectedPart === 'glutes')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'glutes' ? 'selected' : ''}`}
      />
      
      {/* Legs - highlighted blue like in your image */}
      <path
        id="legs"
        data-bodypart="legs"
        d="M 250 320 L 350 320 L 350 600 L 250 600 Z"
        fill={getBodyPartColor('legs', selectedPart === 'legs')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'legs' ? 'selected' : ''}`}
      />
      
      {/* Hands - darker grey */}
      <circle
        cx="200"
        cy="350"
        r="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle
        cx="400"
        cy="350"
        r="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
      
      {/* Feet - darker grey */}
      <ellipse
        cx="280"
        cy="620"
        rx="20"
        ry="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <ellipse
        cx="320"
        cy="620"
        rx="20"
        ry="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
    </g>
  );

  const renderBackView = () => (
    <g>
      {/* Head - darker grey */}
      <circle
        cx="300"
        cy="70"
        r="35"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="3"
      />
      
      {/* Neck */}
      <rect
        x="285"
        y="105"
        width="30"
        height="20"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />

      {/* Back - large V-shaped back muscles */}
      <path
        id="back"
        data-bodypart="back"
        d="M 230 125 Q 300 110 370 125 L 370 200 Q 300 190 230 200 Z"
        fill={getBodyPartColor('back', selectedPart === 'back')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'back' ? 'selected' : ''}`}
      />
      
      {/* Back Shoulders - deltoids from behind */}
      <path
        id="shoulders-back"
        data-bodypart="shoulders"
        d="M 190 130 Q 300 115 410 130 L 410 180 Q 300 170 190 180 Z"
        fill={getBodyPartColor('shoulders', selectedPart === 'shoulders')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'shoulders' ? 'selected' : ''}`}
      />
      
      {/* Back Arms - triceps from behind */}
      <path
        id="triceps-back-left"
        data-bodypart="triceps"
        d="M 190 180 L 230 180 L 230 320 L 190 320 Z"
        fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'triceps' ? 'selected' : ''}`}
      />
      
      <path
        id="triceps-back-right"
        data-bodypart="triceps"
        d="M 370 180 L 410 180 L 410 320 L 370 320 Z"
        fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'triceps' ? 'selected' : ''}`}
      />
      
      {/* Back Glutes - more prominent from behind */}
      <path
        id="glutes-back"
        data-bodypart="glutes"
        d="M 230 280 L 370 280 L 370 320 L 230 320 Z"
        fill={getBodyPartColor('glutes', selectedPart === 'glutes')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'glutes' ? 'selected' : ''}`}
      />
      
      {/* Back Legs - hamstrings, highlighted blue */}
      <path
        id="legs-back"
        data-bodypart="legs"
        d="M 250 320 L 350 320 L 350 600 L 250 600 Z"
        fill={getBodyPartColor('legs', selectedPart === 'legs')}
        stroke="#ffffff"
        strokeWidth="3"
        className={`transition-colors ${selectedPart === 'legs' ? 'selected' : ''}`}
      />
      
      {/* Hands - darker grey */}
      <circle
        cx="200"
        cy="350"
        r="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle
        cx="400"
        cy="350"
        r="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
      
      {/* Feet - darker grey */}
      <ellipse
        cx="280"
        cy="620"
        rx="20"
        ry="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <ellipse
        cx="320"
        cy="620"
        rx="20"
        ry="15"
        fill="#4a5568"
        stroke="#ffffff"
        strokeWidth="2"
      />
    </g>
  );

  return (
    <svg
      width="600"
      height="800"
      viewBox="0 0 600 800"
      className="cursor-pointer"
      onClick={handleSvgClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: '#2d3748' }} // Dark background like your images
    >
      {variant === "front" ? renderFrontView() : renderBackView()}
    </svg>
  );
}
