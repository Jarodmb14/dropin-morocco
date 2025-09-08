import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, MessageSquare, Plus } from 'lucide-react';
import { ReviewsAPI, ClubRatingSummary } from '@/lib/api/reviews';
import { ReviewsList } from './ReviewsList';
import { ReviewForm } from './ReviewForm';

interface ReviewsSectionProps {
  clubId: string;
  clubName: string;
}

export const ReviewsSection = ({ clubId, clubName }: ReviewsSectionProps) => {
  const [ratingSummary, setRatingSummary] = useState<ClubRatingSummary | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [clubId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load rating summary
      const summary = await ReviewsAPI.getClubRatingSummary(clubId);
      setRatingSummary(summary);

      // Check if user can review
      const canUserReview = await ReviewsAPI.canUserReviewClub(clubId);
      setCanReview(canUserReview);
    } catch (error) {
      console.error('Error loading reviews data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    loadData(); // Refresh data
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-gray-300 animate-pulse" />
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Reviews & Ratings</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {ratingSummary?.total_reviews || 0} review{(ratingSummary?.total_reviews || 0) !== 1 ? 's' : ''} for {clubName}
                </p>
              </div>
            </div>
            
            {canReview && (
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Write Review</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <ReviewForm
                    clubId={clubId}
                    clubName={clubName}
                    onReviewSubmitted={handleReviewSubmitted}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        {ratingSummary && (
          <CardContent className="pt-0">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {ratingSummary.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-1">
                  {renderStars(Math.round(ratingSummary.average_rating))}
                </div>
                <p className="text-sm text-gray-600">
                  {ratingSummary.total_reviews} review{ratingSummary.total_reviews !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex-1">
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingSummary.rating_breakdown[star as keyof typeof ratingSummary.rating_breakdown];
                    const percentage = ratingSummary.total_reviews > 0 ? (count / ratingSummary.total_reviews) * 100 : 0;
                    
                    return (
                      <div key={star} className="flex items-center space-x-2 text-sm">
                        <span className="w-3">{star}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Reviews List */}
      <ReviewsList clubId={clubId} clubName={clubName} />

      {/* Review Eligibility Notice */}
      {!canReview && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <p className="text-blue-800 font-medium mb-1">Want to leave a review?</p>
              <p className="text-blue-600 text-sm">
                You need to book and visit this gym before you can leave a review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};