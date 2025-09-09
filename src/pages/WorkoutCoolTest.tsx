import React, { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { WorkoutCoolBodyDiagram } from '@/components/WorkoutCoolBodyDiagram';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, ExternalLink, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkoutCoolTest = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [variant, setVariant] = useState<'front' | 'back'>('front');
  const [debugMode, setDebugMode] = useState<boolean>(true); // Enable debug mode by default

  const handleBodyPartClick = (bodyPartId: string) => {
    setSelectedPart(bodyPartId);
  };

  const handleReset = () => {
    setSelectedPart(null);
  };

  const handleToggleVariant = () => {
    setVariant(prev => prev === 'front' ? 'back' : 'front');
    setSelectedPart(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Workout-Cool Body Diagram Test
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Testing integration with body part images from the workout-cool repository.
            This component attempts to load the actual body diagram images from the GitHub repository.
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Body Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Body Diagram from Workout-Cool</span>
                <Badge variant="outline" className="text-xs">
                  {variant === 'front' ? 'Front View' : 'Back View'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Controls */}
                <div className="flex gap-2 flex-wrap">
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
                  
                  <Button
                    onClick={() => setDebugMode(!debugMode)}
                    variant={debugMode ? "default" : "outline"}
                    size="sm"
                  >
                    {debugMode ? 'Hide' : 'Show'} Debug
                  </Button>
                </div>

                {/* Body Diagram */}
                <div className="flex justify-center">
                  <WorkoutCoolBodyDiagram
                    variant={variant}
                    selectedPart={selectedPart}
                    onBodyPartClick={handleBodyPartClick}
                    debugMode={debugMode}
                  />
                </div>

                {/* Selection Status */}
                {selectedPart && (
                  <div className="text-center">
                    <Badge variant="default" className="bg-pink-500">
                      Selected: {selectedPart}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Repository Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Repository:</strong> Snouzy/workout-cool</p>
                  <p><strong>Base URL:</strong> https://raw.githubusercontent.com/Snouzy/workout-cool/main</p>
                  <p><strong>Image Paths:</strong> Multiple possible paths tested</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">How It Works</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Attempts to load images from the workout-cool repository</p>
                  <p>• Uses coordinate-based click detection</p>
                  <p>• Falls back to custom SVG if images fail to load</p>
                  <p>• Maintains the same interaction patterns</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Troubleshooting</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• If images don't load, check the repository structure</p>
                  <p>• Verify the image file names and paths</p>
                  <p>• Ensure the repository is publicly accessible</p>
                  <p>• Check browser console for CORS errors</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://github.com/Snouzy/workout-cool', '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Repository on GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>Click on body parts</strong> to select them (coordinate-based detection)</p>
              <p>• <strong>Switch views</strong> to see front and back body diagrams</p>
              <p>• <strong>Reset selection</strong> to clear the current selection</p>
              <p>• <strong>Fallback mode</strong> will show if images can't be loaded from the repository</p>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Implementation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
              Alternative Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                If the workout-cool images don't load properly, you can:
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>1. <strong>Download the images locally</strong> and place them in your assets folder</p>
                <p>2. <strong>Use the existing SVG implementation</strong> (which we've already customized to match your style)</p>
                <p>3. <strong>Create your own body diagram images</strong> based on the workout-cool style</p>
                <p>4. <strong>Use a different image hosting service</strong> for the workout-cool images</p>
              </div>
              
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/body-demo')}
                  className="w-full"
                >
                  View Custom SVG Implementation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutCoolTest;
