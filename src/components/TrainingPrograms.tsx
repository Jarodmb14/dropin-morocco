import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TRAINING_PROGRAMS, 
  TrainingProgram, 
  ProgramWeek, 
  ProgramWorkout,
  getProgramExerciseDetails 
} from '@/data/training-programs';
import { 
  Calendar, 
  Clock, 
  Target, 
  Users, 
  CheckCircle, 
  Play, 
  Star,
  TrendingUp,
  Award,
  Timer
} from 'lucide-react';

interface TrainingProgramsProps {
  onSelectProgram?: (program: TrainingProgram) => void;
  onStartWorkout?: (workout: ProgramWorkout) => void;
}

export function TrainingPrograms({ onSelectProgram, onStartWorkout }: TrainingProgramsProps) {
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<ProgramWeek | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800';
      case 'ADVANCED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'STRENGTH': return 'bg-purple-100 text-purple-800';
      case 'HYPERTROPHY': return 'bg-orange-100 text-orange-800';
      case 'ENDURANCE': return 'bg-cyan-100 text-cyan-800';
      case 'WEIGHT_LOSS': return 'bg-pink-100 text-pink-800';
      case 'GENERAL_FITNESS': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDayName = (day: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[day - 1] || 'Unknown';
  };

  if (selectedProgram && selectedWeek) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setSelectedWeek(null)}
          className="mb-4"
        >
          ← Back to {selectedProgram.name}
        </Button>

        {/* Week Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {selectedWeek.name}
            </CardTitle>
            <p className="text-gray-600">{selectedWeek.description}</p>
          </CardHeader>
        </Card>

        {/* Workouts */}
        <div className="grid gap-6">
          {selectedWeek.workouts.map((workout) => (
            <Card key={workout.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2 text-blue-500" />
                    {workout.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      {workout.focus}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Timer className="w-3 h-3 mr-1" />
                      {workout.duration} min
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.exercises.map((exercise, index) => {
                    const exerciseDetails = getProgramExerciseDetails(exercise.exerciseId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{exerciseDetails?.nameEn || 'Unknown Exercise'}</h4>
                            <p className="text-sm text-gray-600">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.restTime && ` • ${exercise.restTime}s rest`}
                            </p>
                          </div>
                        </div>
                        {exercise.notes && (
                          <div className="text-sm text-gray-500 max-w-xs">
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={() => onStartWorkout?.(workout)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start This Workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (selectedProgram) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setSelectedProgram(null)}
          className="mb-4"
        >
          ← Back to Programs
        </Button>

        {/* Program Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{selectedProgram.name}</CardTitle>
                <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getDifficultyColor(selectedProgram.difficulty)}>
                    {selectedProgram.difficulty}
                  </Badge>
                  <Badge className={getGoalColor(selectedProgram.goal)}>
                    {selectedProgram.goal}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {selectedProgram.duration} weeks
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedProgram.frequency}/week
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefits */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {selectedProgram.benefitsEn.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {selectedProgram.requirementsEn.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={() => onSelectProgram?.(selectedProgram)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start This Program
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Program Weeks */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Program Structure</h3>
          {selectedProgram.weeks.map((week) => (
            <Card 
              key={week.weekNumber} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedWeek(week)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {week.weekNumber}
                    </div>
                    {week.name}
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View Details →
                  </Button>
                </div>
                <p className="text-gray-600">{week.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {week.workouts.map((workout) => (
                    <div key={workout.id} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm">{workout.name}</div>
                      <div className="text-xs text-gray-600">{getDayName(workout.day)}</div>
                      <div className="text-xs text-gray-500">{workout.duration} min</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Pre-Designed Training Programs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our structured programs designed by fitness experts. Each program is tailored to specific goals and experience levels.
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAINING_PROGRAMS.map((program) => (
          <Card 
            key={program.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => setSelectedProgram(program)}
          >
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{program.name}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyColor(program.difficulty)}>
                  {program.difficulty}
                </Badge>
                <Badge className={getGoalColor(program.goal)}>
                  {program.goal}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Duration
                  </span>
                  <span className="font-medium">{program.duration} weeks</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Frequency
                  </span>
                  <span className="font-medium">{program.frequency}×/week</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    Workouts
                  </span>
                  <span className="font-medium">{program.weeks[0]?.workouts.length || 0} per week</span>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                View Program →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
