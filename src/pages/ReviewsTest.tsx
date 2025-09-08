import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewsAPI, ReviewWithUser, ClubRatingSummary } from '@/lib/api/reviews';
import { ReviewsSection } from '@/components/ReviewsSection';

const ReviewsTest = () => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [ratingSummary, setRatingSummary] = useState<ClubRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Test club ID - you can change this to any club ID from your database
  const testClubId = 'club-1';
  const testClubName = 'Elite Fitness Center';

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      setLoading(true);
      
      // Load reviews for test club
      const reviewsData = await ReviewsAPI.getClubReviews(testClubId);
      setReviews(reviewsData);

      // Load rating summary
      const summary = await ReviewsAPI.getClubRatingSummary(testClubId);
      setRatingSummary(summary);
    } catch (error) {
      console.error('Error loading test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestReview = async () => {
    try {
      await ReviewsAPI.createReview({
        club_id: testClubId,
        rating: 5,
        title: 'Amazing gym!',
        comment: 'This is a test review. The facilities are excellent and the staff is very friendly.',
        cleanliness: 5,
        equipment: 4,
        staff_friendliness: 5,
        value_for_money: 4,
        atmosphere: 5
      });
      
      alert('Test review created successfully!');
      loadTestData(); // Refresh data
    } catch (error: any) {
      console.error('Error creating test review:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reviews System Test</h1>
          <p className="text-lg text-gray-600">Test the reviews and ratings functionality</p>
        </div>

        {/* Test Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
              <Button onClick={createTestReview} variant="outline">
                Create Test Review
              </Button>
              <Button onClick={loadTestData} variant="outline">
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <ReviewsSection clubId={testClubId} clubName={testClubName} />

        {/* Raw Data Display */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raw Data (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Rating Summary:</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(ratingSummary, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reviews ({reviews.length}):</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                  {JSON.stringify(reviews, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewsTest;