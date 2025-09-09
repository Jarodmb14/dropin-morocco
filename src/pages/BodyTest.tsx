import React, { useState } from 'react';
import { WorkoutCoolBodyDiagramSimple as WorkoutCoolBodyDiagram, MuscleGroup } from '@/components/WorkoutCoolBodyDiagramSimple';
import SimpleHeader from '@/components/SimpleHeader';

const BodyTest = () => {
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);

  const handleMuscleToggle = (muscle: MuscleGroup) => {
    console.log('Muscle clicked:', muscle);
    setSelectedMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Body Diagram Test</h1>
        
        <div className="max-w-md mx-auto">
          <WorkoutCoolBodyDiagram
            variant="front"
            selectedMuscles={selectedMuscles}
            onMuscleToggle={handleMuscleToggle}
            debugMode={true}
          />
        </div>
        
        <div className="mt-4 text-center">
          <p>Selected muscles: {selectedMuscles.join(', ') || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default BodyTest;
