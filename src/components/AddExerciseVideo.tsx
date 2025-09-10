import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Video, CheckCircle } from 'lucide-react';
import { FULL_EXERCISE_DATABASE } from '@/data/full-exercise-database';

interface AddExerciseVideoProps {
  onVideoAdded?: (exerciseId: string, videoUrl: string) => void;
}

export const AddExerciseVideo: React.FC<AddExerciseVideoProps> = ({ onVideoAdded }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddVideo = async () => {
    if (!selectedExerciseId || !videoUrl) {
      alert('Please select an exercise and enter a video URL');
      return;
    }

    setIsAdding(true);
    try {
      // Update the exercise database
      const exerciseIndex = FULL_EXERCISE_DATABASE.findIndex(ex => ex.id === selectedExerciseId);
      if (exerciseIndex !== -1) {
        FULL_EXERCISE_DATABASE[exerciseIndex].fullVideoUrl = videoUrl;
        FULL_EXERCISE_DATABASE[exerciseIndex].fullVideoImageUrl = 
          `https://img.youtube.com/vi/${videoUrl.split('v=')[1]}/hqdefault.jpg`;
      }

      // Call the callback
      onVideoAdded?.(selectedExerciseId, videoUrl);

      // Reset form
      setSelectedExerciseId('');
      setVideoUrl('');
      
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      alert('Error adding video. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = FULL_EXERCISE_DATABASE.find(ex => ex.id === exerciseId);
    return exercise ? exercise.nameEn : '';
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-6 h-6 mr-2 text-purple-500" />
          Add Exercise Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="exercise-select">Select Exercise</Label>
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an exercise..." />
            </SelectTrigger>
            <SelectContent>
              {FULL_EXERCISE_DATABASE.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  {exercise.nameEn} {exercise.fullVideoUrl ? '(has video)' : '(no video)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="video-url">YouTube Video URL</Label>
          <Input
            id="video-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter a YouTube watch URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
          </p>
        </div>

        {selectedExerciseId && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected Exercise:</strong> {getExerciseName(selectedExerciseId)}
            </p>
          </div>
        )}

        <Button
          onClick={handleAddVideo}
          disabled={!selectedExerciseId || !videoUrl || isAdding}
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          {isAdding ? (
            <>
              <Video className="w-4 h-4 mr-2 animate-spin" />
              Adding Video...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Add Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
