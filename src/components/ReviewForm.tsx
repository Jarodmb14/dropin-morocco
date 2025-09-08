import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { CreateReviewData, ReviewsAPI } from '@/lib/api/reviews';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  clubId: string;
  clubName: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
}

export const ReviewForm = ({ clubId, clubName, onReviewSubmitted, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [detailedRatings, setDetailedRatings] = useState({
    cleanliness: 0,
    equipment: 0,
    staff_friendliness: 0,
    value_for_money: 0,
    atmosphere: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleDetailedRatingChange = (category: keyof typeof detailedRatings, value: number) => {
    setDetailedRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const renderStars = (currentRating: number, onStarClick: (rating: number) => void, onStarHover: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={() => onStarClick(i + 1)}
        onMouseEnter={() => onStarHover(i + 1)}
        onMouseLeave={handleStarLeave}
      />
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: CreateReviewData = {
        club_id: clubId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
        ...detailedRatings
      };

      await ReviewsAPI.createReview(reviewData);
      
      toast({
        title: "Review Submitted!",
        description: "Thank you for your review. It will be visible once approved.",
      });

      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setDetailedRatings({
        cleanliness: 0,
        equipment: 0,
        staff_friendliness: 0,
        value_for_money: 0,
        atmosphere: 0
      });

      onReviewSubmitted?.();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Write a Review</CardTitle>
        <p className="text-sm text-gray-600">Share your experience at {clubName}</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Overall Rating *</Label>
            <div className="flex items-center space-x-2">
              {renderStars(hoveredRating || rating, handleStarClick, handleStarHover)}
              <span className="text-sm text-gray-600 ml-2">
                {hoveredRating || rating > 0 ? `${hoveredRating || rating}/5` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              maxLength={100}
            />
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience at this gym..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-sm text-gray-500">{comment.length}/1000 characters</p>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Detailed Ratings (Optional)</Label>
            
            {[
              { key: 'cleanliness', label: 'Cleanliness' },
              { key: 'equipment', label: 'Equipment Quality' },
              { key: 'staff_friendliness', label: 'Staff Friendliness' },
              { key: 'value_for_money', label: 'Value for Money' },
              { key: 'atmosphere', label: 'Atmosphere' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm">{label}</Label>
                <div className="flex items-center space-x-1">
                  {renderStars(
                    detailedRatings[key as keyof typeof detailedRatings],
                    (rating) => handleDetailedRatingChange(key as keyof typeof detailedRatings, rating),
                    () => {}
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
