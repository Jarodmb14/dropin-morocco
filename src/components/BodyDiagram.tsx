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
    const colorMap: Record<string, { normal: string; selected: string }> = {
      'chest': { normal: '#ef4444', selected: '#f87171' },
      'shoulders': { normal: '#3b82f6', selected: '#60a5fa' },
      'biceps': { normal: '#10b981', selected: '#34d399' },
      'triceps': { normal: '#8b5cf6', selected: '#a78bfa' },
      'abs': { normal: '#f97316', selected: '#fb923c' },
      'back': { normal: '#14b8a6', selected: '#5eead4' },
      'glutes': { normal: '#ec4899', selected: '#f472b6' },
      'legs': { normal: '#6366f1', selected: '#818cf8' },
    };
    
    const colors = colorMap[bodyPartId] || { normal: '#6b7280', selected: '#9ca3af' };
    return isSelected ? colors.selected : colors.normal;
  };

  const renderFrontView = () => (
    <g>
      {/* Head */}
      <circle
        cx="300"
        cy="80"
        r="40"
        fill="#374151"
        stroke="#6b7280"
        strokeWidth="3"
      />
      
      {/* Neck */}
      <rect
        x="280"
        y="120"
        width="40"
        height="25"
        fill="#374151"
        stroke="#6b7280"
        strokeWidth="2"
      />

      {/* Chest */}
      <path
        id="chest"
        data-bodypart="chest"
        d="M 220 145 Q 300 125 380 145 L 380 250 Q 300 240 220 250 Z"
        fill={getBodyPartColor('chest', selectedPart === 'chest')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Shoulders */}
      <path
        id="shoulders"
        data-bodypart="shoulders"
        d="M 180 150 Q 300 130 420 150 L 420 200 Q 300 190 180 200 Z"
        fill={getBodyPartColor('shoulders', selectedPart === 'shoulders')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Biceps */}
      <path
        id="biceps"
        data-bodypart="biceps"
        d="M 180 200 L 220 200 L 220 350 L 180 350 Z"
        fill={getBodyPartColor('biceps', selectedPart === 'biceps')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Triceps */}
      <path
        id="triceps"
        data-bodypart="triceps"
        d="M 380 200 L 420 200 L 420 350 L 380 350 Z"
        fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Abs */}
      <path
        id="abs"
        data-bodypart="abs"
        d="M 220 250 L 380 250 L 380 350 L 220 350 Z"
        fill={getBodyPartColor('abs', selectedPart === 'abs')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Glutes */}
      <path
        id="glutes"
        data-bodypart="glutes"
        d="M 220 350 L 380 350 L 380 400 L 220 400 Z"
        fill={getBodyPartColor('glutes', selectedPart === 'glutes')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Legs */}
      <path
        id="legs"
        data-bodypart="legs"
        d="M 240 400 L 360 400 L 360 650 L 240 650 Z"
        fill={getBodyPartColor('legs', selectedPart === 'legs')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
    </g>
  );

  const renderBackView = () => (
    <g>
      {/* Back */}
      <path
        id="back"
        data-bodypart="back"
        d="M 220 145 Q 300 125 380 145 L 380 250 Q 300 240 220 250 Z"
        fill={getBodyPartColor('back', selectedPart === 'back')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Back Shoulders */}
      <path
        id="shoulders-back"
        data-bodypart="shoulders"
        d="M 180 150 Q 300 130 420 150 L 420 200 Q 300 190 180 200 Z"
        fill={getBodyPartColor('shoulders', selectedPart === 'shoulders')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Back Arms - Triceps */}
      <path
        id="triceps-back-left"
        data-bodypart="triceps"
        d="M 180 200 L 220 200 L 220 350 L 180 350 Z"
        fill={getBodyPartColor('triceps', selectedPart === 'triceps')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      <path
        id="biceps-back-right"
        data-bodypart="biceps"
        d="M 380 200 L 420 200 L 420 350 L 380 350 Z"
        fill={getBodyPartColor('biceps', selectedPart === 'biceps')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Back Glutes */}
      <path
        id="glutes-back"
        data-bodypart="glutes"
        d="M 220 350 L 380 350 L 380 400 L 220 400 Z"
        fill={getBodyPartColor('glutes', selectedPart === 'glutes')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
      />
      
      {/* Back Legs */}
      <path
        id="legs-back"
        data-bodypart="legs"
        d="M 240 400 L 360 400 L 360 650 L 240 650 Z"
        fill={getBodyPartColor('legs', selectedPart === 'legs')}
        stroke="#ffffff"
        strokeWidth="4"
        className="transition-colors"
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
    >
      {variant === "front" ? renderFrontView() : renderBackView()}
    </svg>
  );
}
