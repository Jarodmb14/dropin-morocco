import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleHeader from '@/components/SimpleHeader';
import { ArrowLeft, Play, Clock, Target, Info, Shuffle, Star, Dumbbell, Zap } from 'lucide-react';
import { getExercisesByMuscleGroup, getPrimaryMuscle, getSecondaryMuscles, getEquipment, getExerciseTypes, getMechanicsType } from '../data/exercises';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ExercisesList = () => {
  const { bodyPart } = useParams<{ bodyPart: string }>();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState<string | null>(null);
  
  // Get exercises for the selected body part
  const exercises = getExercisesByMuscleGroup(bodyPart || 'chest');
  
  const getDifficultyColor = (exerciseTypes: string[]) => {
    if (exerciseTypes.includes('PLYOMETRICS') || exerciseTypes.includes('CROSSFIT')) {
      return 'bg-red-500';
    }
    if (exerciseTypes.includes('STRENGTH')) {
      return 'bg-yellow-500';
    }
    return 'bg-green-500';
  };

  const getDifficultyText = (exerciseTypes: string[]) => {
    if (exerciseTypes.includes('PLYOMETRICS') || exerciseTypes.includes('CROSSFIT')) {
      return 'Advanced';
    }
    if (exerciseTypes.includes('STRENGTH')) {
      return 'Intermediate';
    }
    return 'Beginner';
  };

  const getEquipmentIcon = (equipment: string[]) => {
    if (equipment.includes('BARBELL') || equipment.includes('BAR')) {
      return <Dumbbell className="w-4 h-4" />;
    }
    if (equipment.includes('BODYWEIGHT')) {
      return <Target className="w-4 h-4" />;
    }
    if (equipment.includes('CABLE') || equipment.includes('ROPE')) {
      return <Zap className="w-4 h-4" />;
    }
    return <Dumbbell className="w-4 h-4" />;
  };

  const handlePlayVideo = (exerciseId: string) => {
    setShowVideo(exerciseId);
  };

  const handleShuffleExercise = () => {
    // Simple shuffle - just reload the page with a different random selection
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SimpleHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/body-parts')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Body Parts
          </button>
          
          <Button
            onClick={handleShuffleExercise}
            variant="outline"
            className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle Exercises
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            {bodyPart?.charAt(0).toUpperCase() + bodyPart?.slice(1)} Exercises
          </h1>
          <p className="text-gray-300 text-lg">
            {exercises.length} professional exercises to strengthen your {bodyPart}
          </p>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {exercises.map((exercise) => {
            const primaryMuscle = getPrimaryMuscle(exercise);
            const secondaryMuscles = getSecondaryMuscles(exercise);
            const equipment = getEquipment(exercise);
            const exerciseTypes = getExerciseTypes(exercise);
            const mechanicsType = getMechanicsType(exercise);
            const difficulty = getDifficultyText(exerciseTypes);
            const difficultyColor = getDifficultyColor(exerciseTypes);

            return (
              <Card
                key={exercise.id}
                className="group relative overflow-hidden bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <CardHeader className="relative p-0">
                  {/* Exercise Image/Video thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800">
                    {exercise.fullVideoImageUrl ? (
                      <>
                        <img
                          alt={exercise.name}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                          loading="lazy"
                          src={exercise.fullVideoImageUrl}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            className="bg-white/90 text-gray-900 hover:bg-white" 
                            onClick={() => handlePlayVideo(exercise.id)} 
                            size="sm"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Watch Video
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-gray-400">
                          <Target className="h-12 w-12" />
                        </div>
                      </div>
                    )}

                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${difficultyColor} text-white`}>
                        {difficulty}
                      </Badge>
                    </div>

                    {/* Exercise Type Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-600">
                        {mechanicsType[0] || 'COMPOUND'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {/* Exercise Title */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2">
                      {exercise.name}
                    </h3>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Exercise Description */}
                  <div 
                    className="text-gray-300 text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: exercise.introduction?.replace(/<[^>]*>/g, '') || exercise.description.replace(/<[^>]*>/g, '') 
                    }}
                  />

                  {/* Equipment Tags */}
                  {equipment.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {equipment.slice(0, 2).map((eq, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 text-gray-300 border-gray-600">
                          {getEquipmentIcon([eq])}
                          <span className="ml-1">{eq.replace("_", " ")}</span>
                        </Badge>
                      ))}
                      {equipment.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-300 border-gray-600">
                          +{equipment.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Exercise Types */}
                  {exerciseTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {exerciseTypes.slice(0, 2).map((type, index) => (
                        <Badge
                          key={index}
                          className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                      onClick={handleShuffleExercise}
                      size="sm"
                      variant="outline"
                    >
                      <Shuffle className="h-4 w-4 mr-1" />
                      Shuffle
                    </Button>
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                      onClick={() => handlePlayVideo(exercise.id)} 
                      size="sm"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workout Summary */}
        <div className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Workout Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{exercises.length}</div>
              <div className="text-gray-300">Total Exercises</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {exercises.filter(ex => getExerciseTypes(ex).includes('STRENGTH')).length}
              </div>
              <div className="text-gray-300">Strength</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {exercises.filter(ex => getExerciseTypes(ex).includes('CARDIO')).length}
              </div>
              <div className="text-gray-300">Cardio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {exercises.filter(ex => getEquipment(ex).includes('BODYWEIGHT')).length}
              </div>
              <div className="text-gray-300">Bodyweight</div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-4 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {exercises.find(ex => ex.id === showVideo)?.name}
                </h3>
                <Button
                  onClick={() => setShowVideo(null)}
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={exercises.find(ex => ex.id === showVideo)?.fullVideoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={exercises.find(ex => ex.id === showVideo)?.name}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesList;