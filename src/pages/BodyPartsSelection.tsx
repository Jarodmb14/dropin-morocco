import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { useExerciseData } from '@/hooks/useExerciseDB';
import { Dumbbell, Target, Zap, Heart, Activity, Loader2 } from 'lucide-react';

interface BodyPart {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  exerciseCount: number;
  color: string;
}

const BodyPartsSelection = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const { targets, loading, error } = useExerciseData();

  // Map API targets to our body parts with icons and descriptions
  const getBodyPartInfo = (targetName: string) => {
    if (!targetName) {
      return { 
        icon: <Dumbbell className="w-6 h-6" />, 
        description: 'Muscle training', 
        color: '#6b7280' 
      };
    }

    const targetMap: Record<string, { icon: React.ReactNode; description: string; color: string }> = {
      'chest': { icon: <Target className="w-6 h-6" />, description: 'Build powerful pecs', color: '#ef4444' },
      'shoulders': { icon: <Zap className="w-6 h-6" />, description: 'Strong deltoids', color: '#3b82f6' },
      'biceps': { icon: <Dumbbell className="w-6 h-6" />, description: 'Arm strength', color: '#10b981' },
      'triceps': { icon: <Activity className="w-6 h-6" />, description: 'Arm definition', color: '#8b5cf6' },
      'abs': { icon: <Heart className="w-6 h-6" />, description: 'Core stability', color: '#f97316' },
      'back': { icon: <Target className="w-6 h-6" />, description: 'Posture & strength', color: '#14b8a6' },
      'legs': { icon: <Zap className="w-6 h-6" />, description: 'Lower body power', color: '#6366f1' },
      'glutes': { icon: <Activity className="w-6 h-6" />, description: 'Hip strength', color: '#ec4899' },
      'upper arms': { icon: <Dumbbell className="w-6 h-6" />, description: 'Upper arm strength', color: '#10b981' },
      'lower arms': { icon: <Activity className="w-6 h-6" />, description: 'Forearm strength', color: '#8b5cf6' },
      'upper legs': { icon: <Zap className="w-6 h-6" />, description: 'Thigh strength', color: '#6366f1' },
      'lower legs': { icon: <Activity className="w-6 h-6" />, description: 'Calf strength', color: '#ec4899' },
      'waist': { icon: <Heart className="w-6 h-6" />, description: 'Core definition', color: '#f97316' },
      'neck': { icon: <Target className="w-6 h-6" />, description: 'Neck strength', color: '#14b8a6' },
    };

    return targetMap[targetName.toLowerCase()] || { 
      icon: <Dumbbell className="w-6 h-6" />, 
      description: 'Muscle training', 
      color: '#6b7280' 
    };
  };

  // Fallback body parts if API data is not loaded yet
  const fallbackBodyParts: BodyPart[] = [
    { id: 'chest', name: 'Chest', icon: <Target className="w-6 h-6" />, description: 'Build powerful pecs', exerciseCount: 0, color: '#ef4444' },
    { id: 'shoulders', name: 'Shoulders', icon: <Zap className="w-6 h-6" />, description: 'Strong deltoids', exerciseCount: 0, color: '#3b82f6' },
    { id: 'biceps', name: 'Biceps', icon: <Dumbbell className="w-6 h-6" />, description: 'Arm strength', exerciseCount: 0, color: '#10b981' },
    { id: 'triceps', name: 'Triceps', icon: <Activity className="w-6 h-6" />, description: 'Arm definition', exerciseCount: 0, color: '#8b5cf6' },
    { id: 'abs', name: 'Core', icon: <Heart className="w-6 h-6" />, description: 'Core stability', exerciseCount: 0, color: '#f97316' },
    { id: 'back', name: 'Back', icon: <Target className="w-6 h-6" />, description: 'Posture & strength', exerciseCount: 0, color: '#14b8a6' },
    { id: 'legs', name: 'Legs', icon: <Zap className="w-6 h-6" />, description: 'Lower body power', exerciseCount: 0, color: '#6366f1' },
    { id: 'glutes', name: 'Glutes', icon: <Activity className="w-6 h-6" />, description: 'Hip strength', exerciseCount: 0, color: '#ec4899' }
  ];

  const bodyParts: BodyPart[] = (targets && targets.length > 0) 
    ? targets.map(target => {
        if (!target || !target.name) {
          return fallbackBodyParts[0]; // Return first fallback if target is invalid
        }
        const info = getBodyPartInfo(target.name);
        return {
          id: target.name.toLowerCase(),
          name: target.name.charAt(0).toUpperCase() + target.name.slice(1),
          icon: info.icon,
          description: info.description,
          exerciseCount: target.count || 0,
          color: info.color
        };
      })
    : fallbackBodyParts;

  const handleBodyPartClick = (bodyPart: BodyPart) => {
    navigate(`/exercises/${bodyPart.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Loading Exercise Data</h2>
            <p className="text-gray-400">Fetching the latest exercises from ExerciseDB...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <SimpleHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold mb-2 text-red-400">Error Loading Data</h2>
            <p className="text-gray-400 text-center mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Select Your Target Area</h1>
          <p className="text-gray-300 text-lg">Click on any body part to see exercises for that area</p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by ExerciseDB • {bodyParts.length} muscle groups • {bodyParts.reduce((sum, part) => sum + part.exerciseCount, 0)} exercises
          </p>
        </div>

        {/* Interactive Body Diagram */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <svg
              width="600"
              height="800"
              viewBox="0 0 600 800"
              className="cursor-pointer"
            >
              {/* Front View Body */}
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
                  d="M 220 145 Q 300 125 380 145 L 380 250 Q 300 240 220 250 Z"
                  fill={selectedPart === 'chest' ? "#f87171" : "#ef4444"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'chest') || bodyParts[0])}
                  onMouseEnter={() => setSelectedPart('chest')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Shoulders */}
                <path
                  d="M 180 150 Q 300 130 420 150 L 420 200 Q 300 190 180 200 Z"
                  fill={selectedPart === 'shoulders' ? "#60a5fa" : "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'shoulders') || bodyParts[1])}
                  onMouseEnter={() => setSelectedPart('shoulders')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Biceps */}
                <path
                  d="M 180 200 L 220 200 L 220 350 L 180 350 Z"
                  fill={selectedPart === 'biceps' ? "#34d399" : "#10b981"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'biceps') || bodyParts[2])}
                  onMouseEnter={() => setSelectedPart('biceps')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Triceps */}
                <path
                  d="M 380 200 L 420 200 L 420 350 L 380 350 Z"
                  fill={selectedPart === 'triceps' ? "#a78bfa" : "#8b5cf6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'triceps') || bodyParts[3])}
                  onMouseEnter={() => setSelectedPart('triceps')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Abs */}
                <path
                  d="M 220 250 L 380 250 L 380 350 L 220 350 Z"
                  fill={selectedPart === 'abs' ? "#fb923c" : "#f97316"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'abs') || bodyParts[4])}
                  onMouseEnter={() => setSelectedPart('abs')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Glutes */}
                <path
                  d="M 220 350 L 380 350 L 380 400 L 220 400 Z"
                  fill={selectedPart === 'glutes' ? "#f472b6" : "#ec4899"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'glutes') || bodyParts[7])}
                  onMouseEnter={() => setSelectedPart('glutes')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Legs */}
                <path
                  d="M 240 400 L 360 400 L 360 650 L 240 650 Z"
                  fill={selectedPart === 'legs' ? "#818cf8" : "#6366f1"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'legs') || bodyParts[6])}
                  onMouseEnter={() => setSelectedPart('legs')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
              </g>

              {/* Back View Body */}
              <g transform="translate(0, 0)">
                {/* Back */}
                <path
                  d="M 220 145 Q 300 125 380 145 L 380 250 Q 300 240 220 250 Z"
                  fill={selectedPart === 'back' ? "#5eead4" : "#14b8a6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'back') || bodyParts[5])}
                  onMouseEnter={() => setSelectedPart('back')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Shoulders */}
                <path
                  d="M 180 150 Q 300 130 420 150 L 420 200 Q 300 190 180 200 Z"
                  fill={selectedPart === 'shoulders' ? "#60a5fa" : "#3b82f6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'shoulders') || bodyParts[1])}
                  onMouseEnter={() => setSelectedPart('shoulders')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Arms */}
                <path
                  d="M 180 200 L 220 200 L 220 350 L 180 350 Z"
                  fill={selectedPart === 'triceps' ? "#a78bfa" : "#8b5cf6"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'triceps') || bodyParts[3])}
                  onMouseEnter={() => setSelectedPart('triceps')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                <path
                  d="M 380 200 L 420 200 L 420 350 L 380 350 Z"
                  fill={selectedPart === 'biceps' ? "#34d399" : "#10b981"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'biceps') || bodyParts[2])}
                  onMouseEnter={() => setSelectedPart('biceps')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Glutes */}
                <path
                  d="M 220 350 L 380 350 L 380 400 L 220 400 Z"
                  fill={selectedPart === 'glutes' ? "#f472b6" : "#ec4899"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'glutes') || bodyParts[7])}
                  onMouseEnter={() => setSelectedPart('glutes')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
                
                {/* Back Legs */}
                <path
                  d="M 240 400 L 360 400 L 360 650 L 240 650 Z"
                  fill={selectedPart === 'legs' ? "#818cf8" : "#6366f1"}
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="transition-colors cursor-pointer hover:opacity-80"
                  onClick={() => handleBodyPartClick(bodyParts.find(p => p.id === 'legs') || bodyParts[6])}
                  onMouseEnter={() => setSelectedPart('legs')}
                  onMouseLeave={() => setSelectedPart(null)}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Hover Info */}
        {selectedPart && (
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-800 rounded-lg p-4 border border-gray-600">
              <h3 className="text-xl font-semibold text-white">
                {bodyParts.find(part => part.id === selectedPart)?.name}
              </h3>
              <p className="text-gray-300">
                {bodyParts.find(part => part.id === selectedPart)?.exerciseCount} exercises available
              </p>
            </div>
          </div>
        )}

        {/* Body Parts List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {bodyParts.map((part) => (
            <div
              key={part.id}
              className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 border border-gray-600 hover:border-blue-500 hover:shadow-lg"
              onClick={() => handleBodyPartClick(part)}
            >
              <div className="flex flex-col items-center text-center">
                <div 
                  className="mb-3 p-3 rounded-full"
                  style={{ backgroundColor: part.color + '20', color: part.color }}
                >
                  {part.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{part.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{part.description}</p>
                <p 
                  className="text-sm font-medium"
                  style={{ color: part.color }}
                >
                  {part.exerciseCount} exercises
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate('/training')}
            className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Training Center →
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            💡 Click on any body part above or in the diagram to see exercises
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyPartsSelection;
