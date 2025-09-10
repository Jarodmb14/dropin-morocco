import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  Star,
  Dumbbell,
  Clock,
  Users
} from 'lucide-react';
import { ExerciseWithAttributes } from '@/types/exercise';
import { 
  getTutorial, 
  getFormTips, 
  getCommonMistakes, 
  getProgression, 
  getBenefits, 
  getVariations, 
  getDifficulty,
  getEquipment 
} from '@/data/enhanced-exercises';
import { ExerciseVideo } from './ExerciseVideo';

interface EnhancedExerciseCardProps {
  exercise: ExerciseWithAttributes;
  onPlayVideo?: () => void;
}

export function EnhancedExerciseCard({ exercise, onPlayVideo }: EnhancedExerciseCardProps) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isFormTipsOpen, setIsFormTipsOpen] = useState(false);
  const [isMistakesOpen, setIsMistakesOpen] = useState(false);
  const [isProgressionOpen, setIsProgressionOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [isVariationsOpen, setIsVariationsOpen] = useState(false);

  const tutorial = getTutorial(exercise);
  const formTips = getFormTips(exercise);
  const commonMistakes = getCommonMistakes(exercise);
  const progression = getProgression(exercise);
  const benefits = getBenefits(exercise);
  const variations = getVariations(exercise);
  const difficulty = getDifficulty(exercise);
  const equipment = getEquipment(exercise);

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatList = (text: string) => {
    return text.split('\n').filter(item => item.trim());
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold mb-2">{exercise.nameEn}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={getDifficultyColor(difficulty)}>
                <Target className="w-3 h-3 mr-1" />
                {difficulty}
              </Badge>
              <Badge variant="outline">
                <Dumbbell className="w-3 h-3 mr-1" />
                {equipment[0] || 'Bodyweight'}
              </Badge>
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                3 sets x 12 reps
              </Badge>
            </div>
          </div>
          {exercise.fullVideoUrl && (
            <Button
              onClick={onPlayVideo}
              size="sm"
              className="ml-4"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Tutorial
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Exercise Description */}
        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: exercise.descriptionEn }} />
        </div>

        {/* Exercise Video */}
        {exercise.fullVideoUrl && (
          <div className="mt-4">
            <ExerciseVideo
              videoUrl={exercise.fullVideoUrl}
              thumbnailUrl={exercise.fullVideoImageUrl}
              exerciseName={exercise.nameEn}
              className="w-full"
            />
          </div>
        )}

        {/* Tutorial Section */}
        {tutorial && (
          <Collapsible open={isTutorialOpen} onOpenChange={setIsTutorialOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  Step-by-Step Tutorial
                </div>
                {isTutorialOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <ol className="space-y-2">
                    {formatList(tutorial).map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Form Tips Section */}
        {formTips && (
          <Collapsible open={isFormTipsOpen} onOpenChange={setIsFormTipsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Form Tips
                </div>
                {isFormTipsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-green-50">
                <CardContent className="pt-4">
                  <ul className="space-y-1">
                    {formatList(formTips).map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Common Mistakes Section */}
        {commonMistakes && (
          <Collapsible open={isMistakesOpen} onOpenChange={setIsMistakesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Common Mistakes
                </div>
                {isMistakesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-red-50">
                <CardContent className="pt-4">
                  <ul className="space-y-1">
                    {formatList(commonMistakes).map((mistake, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-sm">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Progression Section */}
        {progression && (
          <Collapsible open={isProgressionOpen} onOpenChange={setIsProgressionOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Progression Tips
                </div>
                {isProgressionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-purple-50">
                <CardContent className="pt-4">
                  <ul className="space-y-1">
                    {formatList(progression).map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Benefits Section */}
        {benefits && (
          <Collapsible open={isBenefitsOpen} onOpenChange={setIsBenefitsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Benefits
                </div>
                {isBenefitsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-yellow-50">
                <CardContent className="pt-4">
                  <ul className="space-y-1">
                    {formatList(benefits).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Variations Section */}
        {variations && (
          <Collapsible open={isVariationsOpen} onOpenChange={setIsVariationsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Variations
                </div>
                {isVariationsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="bg-indigo-50">
                <CardContent className="pt-4">
                  <ul className="space-y-1">
                    {formatList(variations).map((variation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></span>
                        <span className="text-sm">{variation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
