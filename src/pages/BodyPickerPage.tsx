import React, { useState } from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import BodyPicker from '@/components/BodyPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target, Zap, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BodyPickerPage = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = useState<"drawer" | "modal">("drawer");

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Body Picker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any muscle group to discover exercises tailored for that specific area. 
            Perfect for targeted workouts and muscle-specific training.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <Card className="p-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Display Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={variant === "drawer" ? "default" : "outline"}
                  onClick={() => setVariant("drawer")}
                  size="sm"
                >
                  Drawer View
                </Button>
                <Button
                  variant={variant === "modal" ? "default" : "outline"}
                  onClick={() => setVariant("modal")}
                  size="sm"
                >
                  Modal View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Interactive Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Click on any muscle group in the body diagram to instantly see exercises for that area.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-green-600" />
                Real-time Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Get instant exercise recommendations with detailed instructions and equipment info.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-red-600" />
                Comprehensive Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Access hundreds of exercises from our ExerciseDB integration with filtering options.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Body Picker Component */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <BodyPicker variant={variant} />
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <Badge className="mr-3 mt-1">1</Badge>
                  <p>Click on any muscle group in the front or back view body diagram</p>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 mt-1">2</Badge>
                  <p>View exercises in either a drawer (slides from right) or modal (centered popup)</p>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 mt-1">3</Badge>
                  <p>Browse exercise details including equipment, difficulty, and instructions</p>
                </div>
                <div className="flex items-start">
                  <Badge className="mr-3 mt-1">4</Badge>
                  <p>Click on different muscle groups to explore various exercise options</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BodyPickerPage;
