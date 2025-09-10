import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressTracker, ProgressMetrics, WorkoutSession, PersonalRecord } from '@/data/progress-tracking';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseSetup } from './DatabaseSetup';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Trophy,
  Activity,
  BarChart3,
  Flame,
  Star,
  Zap,
  Play
} from 'lucide-react';

interface ProgressDashboardProps {
  onViewHistory?: () => void;
  onViewRecords?: () => void;
  onStartWorkout?: () => void;
}

export function ProgressDashboard({ onViewHistory, onViewRecords, onStartWorkout }: ProgressDashboardProps) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [metricsData, workoutsData, recordsData] = await Promise.all([
        ProgressTracker.getProgressMetrics(user.id),
        ProgressTracker.getWorkoutHistory(user.id, 5),
        ProgressTracker.getPersonalRecords(user.id)
      ]);
      
      setMetrics(metricsData);
      setRecentWorkouts(workoutsData);
      setPersonalRecords(recordsData.slice(0, 5)); // Show top 5 recent records
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '💪';
    if (streak >= 3) return '⭐';
    return '🎯';
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'MAX_WEIGHT': return '🏋️';
      case 'MAX_REPS': return '🔢';
      case 'BEST_TIME': return '⏱️';
      case 'MAX_DISTANCE': return '🏃';
      default: return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Progress Data Yet</h3>
            <p className="text-gray-600 mb-4">
              Start your first workout to begin tracking your progress! We'll create a balanced full-body workout for you.
            </p>
            <Button onClick={onStartWorkout} className="bg-blue-500 hover:bg-blue-600">
              <Play className="w-4 h-4 mr-2" />
              Start Your First Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#F2E4E5' }}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-purple-300 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-pink-300 rounded-full opacity-20 animate-pulse delay-500"></div>
        
        {/* Comic-style action lines */}
        <div className="absolute top-32 left-1/2 w-32 h-1 bg-gradient-to-r from-orange-400 to-transparent transform rotate-12 opacity-30"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-1 bg-gradient-to-r from-blue-400 to-transparent transform -rotate-12 opacity-30"></div>
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-black text-lg border-4 border-green-600 transform rotate-1 shadow-lg">
              📊 PROGRESS DASHBOARD 📊
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Progress Dashboard
          </h2>
          <p className="text-gray-700 text-lg">
            Track your fitness journey and celebrate your achievements
          </p>
        </div>

        {/* Database Setup Check */}
        <DatabaseSetup />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold">{metrics.totalWorkouts}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold flex items-center">
                  {metrics.currentStreak} {getStreakEmoji(metrics.currentStreak)}
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Time</p>
                <p className="text-2xl font-bold">{Math.round(metrics.totalDuration / 60)}h</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold">{Math.round(metrics.averageWorkoutDuration)}m</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            Workout Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Streak</span>
              <span className="font-semibold">{metrics.currentStreak} days</span>
            </div>
            <Progress 
              value={(metrics.currentStreak / Math.max(metrics.longestStreak, 1)) * 100} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Longest Streak: {metrics.longestStreak} days</span>
              <span>{getStreakEmoji(metrics.currentStreak)} Keep it up!</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Recent Workouts
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onViewHistory}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentWorkouts.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No workouts yet</p>
            ) : (
              recentWorkouts.map((workout) => (
                <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {workout.programId ? 'Program Workout' : 'Custom Workout'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {workout.exercises.length} exercises • {workout.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatDate(workout.date)}</p>
                    {workout.rating && (
                      <div className="flex items-center justify-end mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < workout.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Personal Records
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onViewRecords}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalRecords.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No personal records yet</p>
            ) : (
              personalRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getRecordTypeIcon(record.recordType)}</div>
                    <div>
                      <p className="font-medium">{record.exerciseName}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {record.recordType.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{record.value}</p>
                    <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart */}
      {metrics.weeklyProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.weeklyProgress.slice(-4).map((week) => (
                <div key={week.week} className="flex items-center justify-between">
                  <span className="text-sm font-medium">Week {week.week.split('-W')[1]}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Workouts</p>
                      <p className="font-semibold">{week.workouts}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{Math.round(week.duration / 60)}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Exercises</p>
                      <p className="font-semibold">{week.exercises}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Your Favorite Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl mb-2">💪</div>
            <p className="text-lg font-semibold">{metrics.favoriteExercise}</p>
            <p className="text-sm text-gray-600">Most performed exercise</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
