import apiService from "../core";

export interface Review {
    id: string;
    movieId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
    parentReviewId: string | null;
    replies: Review[];
    likes: any[];
  }

  export interface CreateMovieReviewRequest {
    movieId: string;
    rating: number;
    comment: string;
  }

  export interface CreateReplyRequest {
    movieId: string;
    comment: string;
    parentReviewId: string;
  }
  
  export interface LikeReviewRequest {
    reviewId: string;
  }

export interface APIResponse<T> {
    code: number;
    statusCode: string;
    message: string;
    data: T;
}



export const ReviewService = {
    createMovieReview: async (data: CreateMovieReviewRequest) => {
        const response = await apiService.post<APIResponse<Review>>("/moviereview", data, true);
        return response.data;
      },
      createReply: async (data: CreateReplyRequest) => {
        const response = await apiService.post<APIResponse<Review>>("/moviereview/reply", data, true);
        return response.data;
      },
      getReviewsByMovieId: async (movieId: string) => {
        const response = await apiService.get<APIResponse<Review[]>>(`/moviereview/movie/${movieId}/tree`);
        return response.data;
      },
      likeReview: async (reviewId: string) => {
        const response = await apiService.post<APIResponse<Review>>(`/moviereview/${reviewId}/like`);
        return response.data;
      },
      deleteReview: async (reviewId: string) => {
        const response = await apiService.delete<APIResponse<Review>>(`/moviereview/${reviewId}`);
        return response.data;
      },
      getAverageRating: async (movieId: string) => {
        const response = await apiService.get<APIResponse<number>>(`/moviereview/movie/${movieId}/average-rating`);
        return response.data;
      },
}

export default ReviewService;