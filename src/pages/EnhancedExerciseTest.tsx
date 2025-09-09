import React from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ENHANCED_EXERCISES } from '@/data/enhanced-exercises';
import { EnhancedExerciseCard } from '@/components/EnhancedExerciseCard';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhancedExerciseTest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Exercise Tutorials
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every exercise now includes detailed step-by-step tutorials, form tips, common mistakes, 
            progression advice, benefits, and variations. Click on any section to expand and learn more!
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

        {/* Exercise Count */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enhanced Exercise Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{ENHANCED_EXERCISES.length}</div>
                <div className="text-sm text-gray-600">Enhanced Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">6</div>
                <div className="text-sm text-gray-600">Tutorial Sections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Difficulty Levels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600">Complete Coverage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Enhanced Exercises */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sample Enhanced Exercises</h2>
          {ENHANCED_EXERCISES.slice(0, 3).map((exercise, index) => (
            <div key={exercise.id}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Exercise {index + 1}: {exercise.nameEn}
                </h3>
              </div>
              <EnhancedExerciseCard 
                exercise={exercise}
                onPlayVideo={() => {
                  if (exercise.fullVideoUrl) {
                    window.open(exercise.fullVideoUrl, '_blank');
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Features Overview */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Enhanced Exercise Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="font-semibold mb-2">Step-by-Step Tutorials</h3>
                <p className="text-sm text-gray-600">
                  Detailed numbered instructions for perfect form and execution
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="font-semibold mb-2">Form Tips</h3>
                <p className="text-sm text-gray-600">
                  Expert advice for maintaining proper technique throughout the movement
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="font-semibold mb-2">Common Mistakes</h3>
                <p className="text-sm text-gray-600">
                  Learn what to avoid to prevent injury and maximize effectiveness
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="font-semibold mb-2">Progression Tips</h3>
                <p className="text-sm text-gray-600">
                  How to advance and challenge yourself as you get stronger
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="font-semibold mb-2">Benefits</h3>
                <p className="text-sm text-gray-600">
                  Understand what each exercise does for your body and fitness
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-semibold mb-2">Variations</h3>
                <p className="text-sm text-gray-600">
                  Alternative ways to perform the exercise for different goals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedExerciseTest;
