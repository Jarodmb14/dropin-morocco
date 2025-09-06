import { supabase } from '../../integrations/supabase/client';

export interface Review {
  id: string;
  user_id: string;
  club_id: string;
  booking_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  cleanliness?: number;
  equipment?: number;
  staff_friendliness?: number;
  value_for_money?: number;
  atmosphere?: number;
  is_verified: boolean;
  is_featured: boolean;
  helpful_count: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUser extends Review {
  user_name: string;
  user_avatar?: string;
  user_helpful?: boolean;
}

export interface CreateReviewData {
  club_id: string;
  booking_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  cleanliness?: number;
  equipment?: number;
  staff_friendliness?: number;
  value_for_money?: number;
  atmosphere?: number;
}

export interface ReviewFilters {
  club_id?: string;
  user_id?: string;
  rating?: number;
  limit?: number;
  offset?: number;
}

export interface ClubRatingSummary {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export class ReviewsAPI {
  /**
   * Get reviews for a specific club with pagination
   */
  static async getClubReviews(
    clubId: string,
    filters: ReviewFilters = {}
  ): Promise<ReviewWithUser[]> {
    try {
      const { data, error } = await supabase.rpc('get_club_reviews', {
        p_club_id: clubId,
        p_limit: filters.limit || 10,
        p_offset: filters.offset || 0,
        p_rating_filter: filters.rating || null
      });

      if (error) {
        console.error('Error fetching club reviews:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('ReviewsAPI.getClubReviews error:', error);
      throw error;
    }
  }

  /**
   * Create a new review
   */
  static async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      // Check if user can review this club
      const { data: canReview, error: canReviewError } = await supabase.rpc(
        'can_user_review_club',
        {
          p_user_id: (await supabase.auth.getUser()).data.user?.id,
          p_club_id: reviewData.club_id
        }
      );

      if (canReviewError) {
        console.error('Error checking review eligibility:', canReviewError);
        throw canReviewError;
      }

      if (!canReview) {
        throw new Error('You cannot review this club. You may not have a paid booking or may have already reviewed it.');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          club_id: reviewData.club_id,
          booking_id: reviewData.booking_id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          cleanliness: reviewData.cleanliness,
          equipment: reviewData.equipment,
          staff_friendliness: reviewData.staff_friendliness,
          value_for_money: reviewData.value_for_money,
          atmosphere: reviewData.atmosphere,
          is_verified: !!reviewData.booking_id,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ReviewsAPI.createReview error:', error);
      throw error;
    }
  }

  /**
   * Update an existing review
   */
  static async updateReview(
    reviewId: string,
    updates: Partial<CreateReviewData>
  ): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('ReviewsAPI.updateReview error:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   */
  static async deleteReview(reviewId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }
    } catch (error) {
      console.error('ReviewsAPI.deleteReview error:', error);
      throw error;
    }
  }

  /**
   * Mark a review as helpful/unhelpful
   */
  static async toggleReviewHelpful(
    reviewId: string,
    isHelpful: boolean
  ): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // First, try to update existing vote
      const { data: existingVote, error: selectError } = await supabase
        .from('review_helpful')
        .select('id')
        .eq('review_id', reviewId)
        .eq('user_id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('review_helpful')
          .update({ is_helpful: isHelpful })
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('review_helpful')
          .insert({
            review_id: reviewId,
            user_id: userId,
            is_helpful: isHelpful
          });

        if (error) throw error;
      }

      // Update helpful count on review
      const { error: countError } = await supabase.rpc('update_review_helpful_count', {
        p_review_id: reviewId
      });

      if (countError) {
        console.warn('Error updating helpful count:', countError);
      }
    } catch (error) {
      console.error('ReviewsAPI.toggleReviewHelpful error:', error);
      throw error;
    }
  }

  /**
   * Get club rating summary
   */
  static async getClubRatingSummary(clubId: string): Promise<ClubRatingSummary> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('average_rating, total_reviews, rating_breakdown')
        .eq('id', clubId)
        .single();

      if (error) {
        console.error('Error fetching club rating summary:', error);
        throw error;
      }

      return {
        average_rating: data.average_rating || 0,
        total_reviews: data.total_reviews || 0,
        rating_breakdown: data.rating_breakdown || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
      };
    } catch (error) {
      console.error('ReviewsAPI.getClubRatingSummary error:', error);
      throw error;
    }
  }

  /**
   * Get user's reviews
   */
  static async getUserReviews(
    userId?: string,
    filters: ReviewFilters = {}
  ): Promise<ReviewWithUser[]> {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!targetUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_user_id_fkey(full_name),
          clubs!reviews_club_id_fkey(name, tier)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(filters.limit || 20)
        .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

      if (error) {
        console.error('Error fetching user reviews:', error);
        throw error;
      }

      return data?.map(review => ({
        ...review,
        user_name: review.profiles?.full_name || 'Anonymous',
        club_name: review.clubs?.name,
        club_tier: review.clubs?.tier
      })) || [];
    } catch (error) {
      console.error('ReviewsAPI.getUserReviews error:', error);
      throw error;
    }
  }

  /**
   * Check if user can review a specific club
   */
  static async canUserReviewClub(clubId: string): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;

      const { data, error } = await supabase.rpc('can_user_review_club', {
        p_user_id: userId,
        p_club_id: clubId
      });

      if (error) {
        console.error('Error checking review eligibility:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('ReviewsAPI.canUserReviewClub error:', error);
      return false;
    }
  }

  /**
   * Get featured reviews for a club
   */
  static async getFeaturedReviews(clubId: string, limit: number = 3): Promise<ReviewWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!reviews_user_id_fkey(full_name)
        `)
        .eq('club_id', clubId)
        .eq('is_featured', true)
        .eq('status', 'APPROVED')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured reviews:', error);
        throw error;
      }

      return data?.map(review => ({
        ...review,
        user_name: review.profiles?.full_name || 'Anonymous'
      })) || [];
    } catch (error) {
      console.error('ReviewsAPI.getFeaturedReviews error:', error);
      throw error;
    }
  }
}
