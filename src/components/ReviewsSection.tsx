import React, { useState, useEffect } from 'react';
import { ReviewsAPI, ReviewWithUser, ClubRatingSummary, CreateReviewData } from '../lib/api/reviews';
import { Star, ThumbsUp, MessageSquare, User, Calendar } from 'lucide-react';

interface ReviewsSectionProps {
  clubId: string;
  clubName: string;
  onReviewCreated?: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  clubId, 
  clubName, 
  onReviewCreated 
}) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [ratingSummary, setRatingSummary] = useState<ClubRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    loadReviewsData();
  }, [clubId]);

  const loadReviewsData = async () => {
    try {
      setLoading(true);
      const [reviewsData, summaryData, canReviewData] = await Promise.all([
        ReviewsAPI.getClubReviews(clubId, { limit: 10 }),
        ReviewsAPI.getClubRatingSummary(clubId),
        ReviewsAPI.canUserReviewClub(clubId)
      ]);

      setReviews(reviewsData);
      setRatingSummary(summaryData);
      setCanReview(canReviewData);
    } catch (error) {
      console.error('Error loading reviews data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (reviewData: CreateReviewData) => {
    try {
      await ReviewsAPI.createReview(reviewData);
      setShowReviewForm(false);
      loadReviewsData(); // Reload reviews
      onReviewCreated?.();
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Failed to create review. Please try again.');
    }
  };

  const handleHelpfulToggle = async (reviewId: string, isHelpful: boolean) => {
    try {
      await ReviewsAPI.toggleReviewHelpful(reviewId, isHelpful);
      loadReviewsData(); // Reload to get updated helpful count
    } catch (error) {
      console.error('Error toggling helpful:', error);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (interactive ? hoveredRating || selectedRating : rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const renderRatingBreakdown = () => {
    if (!ratingSummary) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingSummary.rating_breakdown[rating.toString() as keyof typeof ratingSummary.rating_breakdown];
          const percentage = ratingSummary.total_reviews > 0 ? (count / ratingSummary.total_reviews) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm font-medium w-8">{rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {ratingSummary && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Reviews & Ratings
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {ratingSummary.average_rating.toFixed(1)}
              </div>
              {renderStars(Math.round(ratingSummary.average_rating))}
              <div className="text-sm text-gray-600 mt-2">
                Based on {ratingSummary.total_reviews} review{ratingSummary.total_reviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div>
              <h4 className="font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Rating Distribution
              </h4>
              {renderRatingBreakdown()}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {canReview && !showReviewForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Write a Review
          </button>
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          clubId={clubId}
          clubName={clubName}
          onSubmit={handleCreateReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Recent Reviews
        </h4>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this gym!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpfulToggle={handleHelpfulToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Review Form Component
interface ReviewFormProps {
  clubId: string;
  clubName: string;
  onSubmit: (data: CreateReviewData) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ clubId, clubName, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateReviewData>({
    club_id: clubId,
    rating: 0,
    title: '',
    comment: '',
    cleanliness: 0,
    equipment: 0,
    staff_friendliness: 0,
    value_for_money: 0,
    atmosphere: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(formData);
  };

  const updateRating = (field: keyof CreateReviewData, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Write a Review for {clubName}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Overall Rating *</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${
                  star <= formData.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                onClick={() => updateRating('rating', star)}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Review Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            placeholder="Summarize your experience"
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            rows={4}
            placeholder="Tell others about your experience..."
          />
        </div>

        {/* Detailed Ratings */}
        <div className="space-y-3">
          <h5 className="font-medium">Rate Specific Aspects</h5>
          
          {[
            { key: 'cleanliness', label: 'Cleanliness' },
            { key: 'equipment', label: 'Equipment Quality' },
            { key: 'staff_friendliness', label: 'Staff Friendliness' },
            { key: 'value_for_money', label: 'Value for Money' },
            { key: 'atmosphere', label: 'Atmosphere' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 cursor-pointer transition-transform hover:scale-110 ${
                      star <= (formData[key as keyof CreateReviewData] as number)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                    onClick={() => updateRating(key as keyof CreateReviewData, star)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Review Card Component
interface ReviewCardProps {
  review: ReviewWithUser;
  onHelpfulToggle: (reviewId: string, isHelpful: boolean) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpfulToggle }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <div className="font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {review.user_name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {renderStars(review.rating)}
              <span>•</span>
              <Calendar className="w-3 h-3" />
              <span>{new Date(review.created_at).toLocaleDateString()}</span>
              {review.is_verified && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {review.title && (
        <h5 className="font-semibold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {review.title}
        </h5>
      )}

      {review.comment && (
        <p className="text-gray-700 mb-3 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Detailed Ratings */}
      {(review.cleanliness || review.equipment || review.staff_friendliness || review.value_for_money || review.atmosphere) && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          {review.cleanliness && (
            <div className="flex justify-between">
              <span>Cleanliness:</span>
              <span>{review.cleanliness}/5</span>
            </div>
          )}
          {review.equipment && (
            <div className="flex justify-between">
              <span>Equipment:</span>
              <span>{review.equipment}/5</span>
            </div>
          )}
          {review.staff_friendliness && (
            <div className="flex justify-between">
              <span>Staff:</span>
              <span>{review.staff_friendliness}/5</span>
            </div>
          )}
          {review.value_for_money && (
            <div className="flex justify-between">
              <span>Value:</span>
              <span>{review.value_for_money}/5</span>
            </div>
          )}
          {review.atmosphere && (
            <div className="flex justify-between">
              <span>Atmosphere:</span>
              <span>{review.atmosphere}/5</span>
            </div>
          )}
        </div>
      )}

      {/* Helpful Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onHelpfulToggle(review.id, !review.user_helpful)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
            review.user_helpful
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          Helpful ({review.helpful_count})
        </button>
      </div>
    </div>
  );
};

export default ReviewsSection;
