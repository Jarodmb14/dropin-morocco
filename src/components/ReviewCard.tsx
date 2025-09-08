import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, Verified, Flag } from 'lucide-react';
import { ReviewWithUser } from '@/lib/api/reviews';
import { ReviewsAPI } from '@/lib/api/reviews';

interface ReviewCardProps {
  review: ReviewWithUser;
  onHelpfulToggle?: (reviewId: string, isHelpful: boolean) => void;
  showClubName?: boolean;
}

export const ReviewCard = ({ review, onHelpfulToggle, showClubName = false }: ReviewCardProps) => {
  const [isHelpful, setIsHelpful] = useState<boolean | null>(review.user_helpful || null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleHelpfulToggle = async (helpful: boolean) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await ReviewsAPI.toggleReviewHelpful(review.id, helpful);
      setIsHelpful(helpful);
      setHelpfulCount(prev => helpful ? prev + 1 : prev - 1);
      onHelpfulToggle?.(review.id, helpful);
    } catch (error) {
      console.error('Error toggling helpful:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {renderStars(review.rating)}
              <span className="text-sm font-medium text-gray-600">
                {review.rating}/5
              </span>
            </div>
            {review.is_verified && (
              <Badge variant="secondary" className="text-xs">
                <Verified className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {review.is_featured && (
              <Badge variant="default" className="text-xs">
                Featured
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(review.created_at)}
          </span>
        </div>
        
        {review.title && (
          <h4 className="font-semibold text-gray-900 mt-2">{review.title}</h4>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>by {review.user_name}</span>
          {showClubName && review.club_name && (
            <>
              <span>•</span>
              <span>{review.club_name}</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {review.comment && (
          <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
        )}

        {/* Detailed Ratings */}
        {(review.cleanliness || review.equipment || review.staff_friendliness || 
          review.value_for_money || review.atmosphere) && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            {review.cleanliness && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cleanliness:</span>
                <div className="flex">{renderStars(review.cleanliness)}</div>
              </div>
            )}
            {review.equipment && (
              <div className="flex justify-between">
                <span className="text-gray-600">Equipment:</span>
                <div className="flex">{renderStars(review.equipment)}</div>
              </div>
            )}
            {review.staff_friendliness && (
              <div className="flex justify-between">
                <span className="text-gray-600">Staff:</span>
                <div className="flex">{renderStars(review.staff_friendliness)}</div>
              </div>
            )}
            {review.value_for_money && (
              <div className="flex justify-between">
                <span className="text-gray-600">Value:</span>
                <div className="flex">{renderStars(review.value_for_money)}</div>
              </div>
            )}
            {review.atmosphere && (
              <div className="flex justify-between">
                <span className="text-gray-600">Atmosphere:</span>
                <div className="flex">{renderStars(review.atmosphere)}</div>
              </div>
            )}
          </div>
        )}

        {/* Helpful Actions */}
        <div className="flex items-center space-x-4 pt-3 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHelpfulToggle(true)}
              disabled={isLoading}
              className={`p-1 h-auto ${
                isHelpful === true ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">{helpfulCount}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleHelpfulToggle(false)}
              disabled={isLoading}
              className={`p-1 h-auto ${
                isHelpful === false ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-500">
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
