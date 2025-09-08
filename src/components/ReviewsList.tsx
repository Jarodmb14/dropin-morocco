import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Filter, Loader2 } from 'lucide-react';
import { ReviewWithUser, ReviewsAPI, ClubRatingSummary } from '@/lib/api/reviews';
import { ReviewCard } from './ReviewCard';

interface ReviewsListProps {
  clubId: string;
  clubName: string;
}

export const ReviewsList = ({ clubId, clubName }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [ratingSummary, setRatingSummary] = useState<ClubRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const loadReviews = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = reset ? 0 : offset;
      
      // Load reviews
      const reviewsData = await ReviewsAPI.getClubReviews(clubId, {
        limit,
        offset: currentOffset,
        rating: ratingFilter || undefined
      });

      if (reset) {
        setReviews(reviewsData);
      } else {
        setReviews(prev => [...prev, ...reviewsData]);
      }

      setHasMore(reviewsData.length === limit);
      setOffset(currentOffset + reviewsData.length);

      // Load rating summary (only on first load)
      if (reset) {
        try {
          const summary = await ReviewsAPI.getClubRatingSummary(clubId);
          setRatingSummary(summary);
        } catch (error) {
          console.error('Error loading rating summary:', error);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadReviews(true);
  }, [clubId, ratingFilter]);

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value === 'all' ? null : parseInt(value));
  };

  const handleLoadMore = () => {
    loadReviews(false);
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

  const renderRatingBreakdown = () => {
    if (!ratingSummary?.rating_breakdown) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingSummary.rating_breakdown[star as keyof typeof ratingSummary.rating_breakdown];
          const percentage = ratingSummary.total_reviews > 0 ? (count / ratingSummary.total_reviews) * 100 : 0;
          
          return (
            <div key={star} className="flex items-center space-x-2 text-sm">
              <span className="w-4">{star}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading reviews...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {ratingSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>Reviews & Ratings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {ratingSummary.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(ratingSummary.average_rating))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {ratingSummary.total_reviews} review{ratingSummary.total_reviews !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Rating Breakdown</h4>
                {renderRatingBreakdown()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews</CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={ratingFilter?.toString() || 'all'} onValueChange={handleRatingFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No reviews yet</p>
              <p className="text-sm">Be the first to review {clubName}!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Reviews'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
