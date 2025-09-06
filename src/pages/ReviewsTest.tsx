import React, { useState, useEffect } from 'react';
import { ReviewsAPI, ClubRatingSummary } from '../lib/api/reviews';
import ReviewsSection from '../components/ReviewsSection';
import RatingDisplay from '../components/RatingDisplay';

const ReviewsTest: React.FC = () => {
  const [clubId, setClubId] = useState('test-club-1');
  const [clubName, setClubName] = useState('Test Gym');
  const [ratingSummary, setRatingSummary] = useState<ClubRatingSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock club data for testing
  const mockClubs = [
    { id: 'test-club-1', name: 'Atlas Power Gym' },
    { id: 'test-club-2', name: 'Casablanca Pro Fitness' },
    { id: 'test-club-3', name: 'Rabat Champion Club' }
  ];

  useEffect(() => {
    loadRatingSummary();
  }, [clubId]);

  const loadRatingSummary = async () => {
    try {
      setLoading(true);
      const summary = await ReviewsAPI.getClubRatingSummary(clubId);
      setRatingSummary(summary);
    } catch (error) {
      console.error('Error loading rating summary:', error);
      // Set mock data for testing
      setRatingSummary({
        average_rating: 4.2,
        total_reviews: 15,
        rating_breakdown: {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 6,
          '5': 6
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClubChange = (clubId: string) => {
    setClubId(clubId);
    const club = mockClubs.find(c => c.id === clubId);
    setClubName(club?.name || 'Unknown Club');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Reviews System Test
          </h1>
          
          {/* Club Selector */}
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
            <h3 className="font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Select Club to Test
            </h3>
            <div className="flex gap-2">
              {mockClubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => handleClubChange(club.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    clubId === club.id
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {club.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current Club Rating Display */}
          {ratingSummary && (
            <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
              <h3 className="font-semibold mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Current Rating for {clubName}
              </h3>
              <div className="flex items-center gap-4">
                <RatingDisplay
                  rating={ratingSummary.average_rating}
                  reviewCount={ratingSummary.total_reviews}
                  size="lg"
                />
                <div className="text-sm text-gray-600">
                  Average: {ratingSummary.average_rating.toFixed(1)}/5.0
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          clubId={clubId}
          clubName={clubName}
          onReviewCreated={() => {
            console.log('Review created!');
            loadRatingSummary(); // Reload rating summary
          }}
        />

        {/* API Test Section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="font-semibold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            API Test Functions
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={loadRatingSummary}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Load Rating Summary
            </button>
            
            <button
              onClick={async () => {
                try {
                  const canReview = await ReviewsAPI.canUserReviewClub(clubId);
                  alert(`Can review: ${canReview}`);
                } catch (error) {
                  console.error('Error checking review eligibility:', error);
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Check Review Eligibility
            </button>
            
            <button
              onClick={async () => {
                try {
                  const reviews = await ReviewsAPI.getClubReviews(clubId, { limit: 5 });
                  console.log('Club reviews:', reviews);
                  alert(`Found ${reviews.length} reviews`);
                } catch (error) {
                  console.error('Error fetching reviews:', error);
                }
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Get Club Reviews
            </button>
            
            <button
              onClick={async () => {
                try {
                  const featured = await ReviewsAPI.getFeaturedReviews(clubId, 3);
                  console.log('Featured reviews:', featured);
                  alert(`Found ${featured.length} featured reviews`);
                } catch (error) {
                  console.error('Error fetching featured reviews:', error);
                }
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get Featured Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTest;
