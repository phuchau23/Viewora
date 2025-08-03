"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  CreateReplyRequest,
  ReviewService,
  CreateMovieReviewRequest,
} from "@/lib/api/service/fetchReview";

export const useGetReviewsByMovieId = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["review", id],
    queryFn: () => ReviewService.getReviewsByMovieId(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    review: data ?? null,
    isLoading,
    isError: Boolean(error),
    error,
    refetch,
  };
};

export const useCreateReview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createReview, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: (data: CreateMovieReviewRequest) => ReviewService.createMovieReview(data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["review", variables.movieId], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: [response.data, ...old.data],
        };
      });
    },
    onError: (response: any) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to create review",
        variant: "destructive",
      });
    },
  });

  return { createReview, isPending, isError, isSuccess, data };
};

export const useCreateReply = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createReply, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: (data: CreateReplyRequest) => ReviewService.createReply(data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["review", variables.movieId], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((review: any) =>
            review.id === variables.parentReviewId
              ? { ...review, replies: [...review.replies, response.data] }
              : review
          ),
        };
      });
    },
    onError: (response: any) => {
      toast({
        title: "Failed",
        description: response.message || "Failed to create reply",
        variant: "destructive",
      });
    },
  });

  return { createReply, isPending, isError, isSuccess, data };
};

export const useLikeReview = () => {
  const queryClient = useQueryClient();

  const { mutate: likeReview, isPending, isError, isSuccess, data } = useMutation({
    mutationFn: (reviewId: string) => ReviewService.likeReview(reviewId),

    // ✅ Optimistic Update
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: ["review"] });

      const previousData = queryClient.getQueryData<any>(["review", reviewId]);

      queryClient.setQueryData(["review", previousData?.data?.[0]?.movieId], (old: any) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: old.data.map((review: any) => {
            if (review.id !== reviewId) return review;

            // giả lập toggle like
            const hasLiked = review.likes?.some((l: any) => l.userId === "currentUser"); // replace with actual user
            return {
              ...review,
              likes: hasLiked
                ? review.likes.filter((l: any) => l.userId !== "currentUser")
                : [...review.likes, { userId: "currentUser" }],
            };
          }),
        };
      });

      return { previousData };
    },

    // ❌ Nếu lỗi thì rollback
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["review", context.previousData.data?.[0]?.movieId], context.previousData);
      }
    },

    // ✅ Refetch để đồng bộ lại dữ liệu chính xác
    onSettled: (_data, _err, _variables, _context) => {
      queryClient.invalidateQueries({ queryKey: ["review"] });
    },
  });

  return { likeReview, isPending, isError, isSuccess, data };
};

export const useGetAverageRating = (movieId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["averageRating", movieId],
    queryFn: () => ReviewService.getAverageRating(movieId),
  });

  return {
    averageRating: data ?? null,
    isLoading,
    isError: Boolean(error),
    error,
  };
};
