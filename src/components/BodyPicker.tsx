"use client";
import { useEffect, useState } from "react";
import { BodyDiagram } from "@/components/BodyDiagram";
import { resolveBodyKey } from "@/lib/bodypart-map";
import { getExercisesByBodyPart } from "@/lib/api/exercises.getByBodyPart";
import { ExerciseDBExercise } from "@/lib/api/exercisedb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  X, 
  Play, 
  Target, 
  Dumbbell, 
  Clock, 
  Star, 
  Loader2, 
  AlertCircle,
  Zap
} from "lucide-react";

interface BodyPickerProps {
  variant?: "drawer" | "modal";
  className?: string;
}

export default function BodyPicker({ variant = "drawer", className = "" }: BodyPickerProps) {
  const [clicked, setClicked] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseDBExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const dbKey = clicked ? resolveBodyKey(clicked) : undefined;

  // Fetch exercises when a body part is clicked
  useEffect(() => {
    const fetchExercises = async () => {
      if (!dbKey) return;
      
      setLoading(true);
      setError(null);
      setExercises([]);
      setIsOpen(true);

      try {
        const data = await getExercisesByBodyPart(dbKey, 50);
        setExercises(Array.isArray(data) ? data : []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exercises';
        setError(errorMessage);
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [dbKey]);

  const handleBodyPartClick = (bodyPartId: string) => {
    setClicked(bodyPartId);
  };

  const handleClose = () => {
    setIsOpen(false);
    setClicked(null);
    setExercises([]);
    setError(null);
  };

  const getDifficultyColor = (equipment: string) => {
    if (equipment.toLowerCase().includes('barbell') || equipment.toLowerCase().includes('dumbbell')) {
      return 'bg-red-500';
    }
    if (equipment.toLowerCase().includes('machine') || equipment.toLowerCase().includes('cable')) {
      return 'bg-yellow-500';
    }
    if (equipment.toLowerCase().includes('body') || equipment.toLowerCase().includes('weight')) {
      return 'bg-green-500';
    }
    return 'bg-blue-500';
  };

  const getDifficultyText = (equipment: string) => {
    if (equipment.toLowerCase().includes('barbell') || equipment.toLowerCase().includes('dumbbell')) {
      return 'Advanced';
    }
    if (equipment.toLowerCase().includes('machine') || equipment.toLowerCase().includes('cable')) {
      return 'Intermediate';
    }
    if (equipment.toLowerCase().includes('body') || equipment.toLowerCase().includes('weight')) {
      return 'Beginner';
    }
    return 'All Levels';
  };

  const getEquipmentIcon = (equipment: string) => {
    if (equipment.toLowerCase().includes('barbell') || equipment.toLowerCase().includes('dumbbell')) {
      return <Dumbbell className="w-4 h-4" />;
    }
    if (equipment.toLowerCase().includes('machine') || equipment.toLowerCase().includes('cable')) {
      return <Zap className="w-4 h-4" />;
    }
    return <Target className="w-4 h-4" />;
  };

  const renderContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Exercises for <span className="font-mono text-blue-600">{clicked}</span>
          </h2>
          {dbKey && (
            <p className="text-sm text-gray-500 mt-1">
              Database key: <span className="font-mono">{dbKey}</span>
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading exercises...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-2">Error loading exercises</p>
            <p className="text-sm text-gray-500">{error}</p>
            <Button 
              onClick={() => dbKey && getExercisesByBodyPart(dbKey, 50).then(setExercises)} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && exercises.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Target className="w-8 h-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No exercises found for this body part</p>
            <p className="text-sm text-gray-500 mt-1">
              Try clicking on a different muscle group
            </p>
          </div>
        </div>
      )}

      {/* Exercises List */}
      {!loading && !error && exercises.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {exercises.length} exercises
            </p>
            <Badge variant="secondary" className="text-xs">
              {exercises.length} results
            </Badge>
          </div>

          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {exercise.name}
                    </CardTitle>
                    <Badge 
                      className={`text-white ${getDifficultyColor(exercise.equipment)}`}
                    >
                      {getDifficultyText(exercise.equipment)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Exercise Image */}
                    {exercise.gifUrl && (
                      <div className="relative">
                        <img 
                          src={exercise.gifUrl} 
                          alt={exercise.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="secondary">
                            <Play className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Exercise Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Target className="w-4 h-4 mr-2" />
                        <span className="truncate">{exercise.target}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        {getEquipmentIcon(exercise.equipment)}
                        <span className="ml-2 truncate">{exercise.equipment}</span>
                      </div>
                    </div>

                    {/* Secondary Muscles */}
                    {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Secondary Muscles
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {exercise.secondaryMuscles.slice(0, 3).map((muscle, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                          {exercise.secondaryMuscles.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{exercise.secondaryMuscles.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Instructions Preview */}
                    {exercise.instructions && exercise.instructions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Instructions
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exercise.instructions[0]}
                        </p>
                        {exercise.instructions.length > 1 && (
                          <p className="text-xs text-gray-500">
                            +{exercise.instructions.length - 1} more steps
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Body Diagrams */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-gray-900">Front View</h3>
          <div className="flex justify-center">
            <BodyDiagram 
              variant="front" 
              onBodyPartClick={handleBodyPartClick}
              selectedPart={clicked}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center text-gray-900">Back View</h3>
          <div className="flex justify-center">
            <BodyDiagram 
              variant="back" 
              onBodyPartClick={handleBodyPartClick}
              selectedPart={clicked}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-gray-600">
          Click on any muscle group to see exercises for that area
        </p>
      </div>

      {/* Results - Drawer or Modal */}
      {variant === "drawer" ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Exercise Results</SheetTitle>
              <SheetDescription>
                Exercises for the selected muscle group
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              {renderContent()}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Exercise Results</DialogTitle>
              <DialogDescription>
                Exercises for the selected muscle group
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              {renderContent()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
