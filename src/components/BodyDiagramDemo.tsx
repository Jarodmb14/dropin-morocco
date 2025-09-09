import React, { useState } from 'react';
import { BodyDiagram } from './BodyDiagram';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Target, RotateCcw } from 'lucide-react';

/**
 * Demo component to showcase the BodyDiagram selection feedback
 */
export function BodyDiagramDemo() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [variant, setVariant] = useState<'front' | 'back'>('front');

  const handleBodyPartClick = (bodyPartId: string) => {
    setSelectedPart(bodyPartId);
  };

  const handleReset = () => {
    setSelectedPart(null);
  };

  const handleToggleVariant = () => {
    setVariant(prev => prev === 'front' ? 'back' : 'front');
    setSelectedPart(null); // Reset selection when switching views
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Body Diagram Selection Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Click on any muscle group to see the selection feedback with thicker stroke and pink glow.
            </p>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleToggleVariant}
                variant="outline"
                size="sm"
              >
                Switch to {variant === 'front' ? 'Back' : 'Front'} View
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={!selectedPart}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Selection
              </Button>
            </div>

            {/* Selection Status */}
            {selectedPart && (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-pink-500">
                  Selected: {selectedPart}
                </Badge>
                <span className="text-sm text-gray-600">
                  Notice the thicker stroke and pink glow effect
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Body Diagram */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <BodyDiagram
              variant={variant}
              selectedPart={selectedPart}
              onBodyPartClick={handleBodyPartClick}
            />
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How the Selection Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Click any muscle group</strong> to select it</p>
            <p>• <strong>Selected muscles</strong> get a thicker stroke (2.5px) and pink glow effect</p>
            <p>• <strong>Switch views</strong> to see both front and back muscle groups</p>
            <p>• <strong>Reset selection</strong> to clear the highlight effect</p>
            <p>• <strong>Hover effect</strong> provides visual feedback before clicking</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
