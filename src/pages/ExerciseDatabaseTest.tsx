import React from 'react';
import SimpleHeader from '@/components/SimpleHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { COMPREHENSIVE_EXERCISES, getComprehensiveExercisesByMuscleGroup } from '@/data/comprehensive-exercises';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExerciseDatabaseTest = () => {
  const navigate = useNavigate();

  const muscleGroups = ['chest', 'shoulders', 'biceps', 'triceps', 'abs', 'back', 'legs', 'glutes'];

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exercise Database Test
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Testing the comprehensive exercise database with {COMPREHENSIVE_EXERCISES.length} exercises.
            All workout-cool functionality should now have access to a complete exercise library.
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
            <CardTitle>Database Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{COMPREHENSIVE_EXERCISES.length}</div>
                <div className="text-sm text-gray-600">Total Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{muscleGroups.length}</div>
                <div className="text-sm text-gray-600">Muscle Groups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Equipment Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">200+</div>
                <div className="text-sm text-gray-600">Target Exercises</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise by Muscle Group */}
        <div className="grid md:grid-cols-2 gap-6">
          {muscleGroups.map(muscleGroup => {
            const exercises = getComprehensiveExercisesByMuscleGroup(muscleGroup);
            return (
              <Card key={muscleGroup}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{muscleGroup}</span>
                    <Badge variant="secondary">{exercises.length} exercises</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exercises.slice(0, 5).map(exercise => (
                      <div key={exercise.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{exercise.nameEn}</span>
                        <Badge variant="outline" className="text-xs">
                          {exercise.attributes
                            .filter(attr => attr.attributeName === 'EQUIPMENT')
                            .map(attr => attr.attributeValue)[0] || 'Bodyweight'}
                        </Badge>
                      </div>
                    ))}
                    {exercises.length > 5 && (
                      <div className="text-sm text-gray-500 text-center">
                        +{exercises.length - 5} more exercises...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sample Exercises */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sample Exercises from Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {COMPREHENSIVE_EXERCISES.slice(0, 6).map(exercise => (
                <div key={exercise.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{exercise.nameEn}</h4>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {exercise.attributes
                        .filter(attr => attr.attributeName === 'PRIMARY_MUSCLE')
                        .map(attr => attr.attributeValue)[0]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.attributes
                        .filter(attr => attr.attributeName === 'EQUIPMENT')
                        .map(attr => attr.attributeValue)[0] || 'Bodyweight'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExerciseDatabaseTest;
