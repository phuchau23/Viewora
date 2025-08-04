"use client";
import React, { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateReview,
  useCreateReply,
  useGetReviewsByMovieId,
  useLikeReview,
} from "@/hooks/useReview";
import { CreateMovieReviewRequest } from "@/lib/api/service/fetchReview";
import { useTranslation } from "react-i18next";

interface Props {
  movieId: string;
}

const MovieRatingComment: React.FC<Props> = ({ movieId }) => {
  const { t } = useTranslation(); // dùng namespace movie
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { toast } = useToast();
  const { review, isLoading } = useGetReviewsByMovieId(movieId);
  const { createReview } = useCreateReview();
  const { createReply } = useCreateReply();
  const { likeReview } = useLikeReview();
  const [replyVisible, setReplyVisible] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleSubmit = () => {
    if (!comment || rating === 0) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn sao và nhập bình luận.",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateMovieReviewRequest = {
      movieId,
      comment,
      rating,
    };

    createReview(payload);
    setComment("");
    setRating(0);
  };

  const handleReply = (parentReviewId: string, replyText: string) => {
    if (!replyText) return;
    createReply({
      movieId,
      comment: replyText,
      parentReviewId,
    });
  };

  const handleLike = (reviewId: string) => {
    likeReview(reviewId);
  };

  const toggleReplyInput = (id: string) => {
    setReplyVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Form đánh giá */}
      <div className="bg-gray-200 dark:bg-neutral-800 p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">Đánh giá của bạn</h2>
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer transition ${
                i <= rating ? "text-yellow-400" : "text-gray-500"
              }`}
              onClick={() => setRating(i)}
            />
          ))}
        </div>
        <textarea
          className="w-full bg-gray-200 dark:bg-neutral-600 border border-gray-400 dark:border-neutral-400 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring"
          rows={3}
          placeholder={t("rating.placeholder") || ""}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="mt-3 bg-blue-600 dark:bg-neutral-600 border border-gray-400 dark:border-neutral-400 px-4 py-2 rounded hover:bg-blue-500 text-sm"
        >
          {t("rating.submit")}
        </button>
      </div>

      {/* Danh sách bình luận */}
      <div>
        <h2 className="text-base font-semibold mb-4 ">Bình luận gần đây</h2>
        {isLoading ? (
          <p className="text-sm text-gray-400">Đang tải đánh giá...</p>
        ) : review && review.data.length > 0 ? (
          review.data.map((c) => (
            <div
              key={c.id}
              className="mb-4 bg-gray-100 dark:bg-neutral-800 p-4 rounded-xl shadow"
            >
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-gray-200 dark:bg-neutral-600 rounded-full border border-gray-400 dark:border-neutral-400 text-xs flex items-center justify-center">
                  {c.avatar ? (
                    <img
                      src={c.avatar}
                      alt={c.fullName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    c.fullName.slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm ">{c.fullName}</span>
                  </div>
                  <p className="text-sm mt-1">{c.comment}</p>

                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <button
                      onClick={() => handleLike(c.id)}
                      className="ml-4 flex items-center space-x-1 group transition-all"
                    >
                      <ThumbsUp
                        className={`w-4 h-4 transition-all 
      ${
        c.likes?.length > 0
          ? "fill-blue-500 stroke-blue-500"
          : "stroke-gray-400 group-hover:stroke-blue-500"
      }`}
                      />
                      <span
                        className={`text-xs leading-none mt-[1px] transition 
      ${
        c.likes?.length > 0
          ? "text-blue-500"
          : "text-gray-400 group-hover:text-blue-500"
      }`}
                      >
                        {c.likes?.length || 0}
                      </span>
                    </button>

                    <span>|</span>
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => toggleReplyInput(c.id)}
                    >
                      Phản hồi
                    </span>
                  </div>

                  {c.replies.map((r) => (
                    <div
                      key={r.id}
                      className="ml-10 mt-2 p-2 bg-gray-200 dark:bg-neutral-600 border border-gray-400 dark:border-neutral-400 rounded-lg text-sm "
                    >
                      <strong>{r.fullName}</strong>: {r.comment}
                    </div>
                  ))}
                  
                  {replyVisible[c.id] && (
                    <ReplyInput
                      onReply={(text) => handleReply(c.id, text)}
                      placeholder="Nhập phản hồi"
                      submitLabel="Gửi"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

const ReplyInput: React.FC<{
  onReply: (text: string) => void;
  placeholder: string;
  submitLabel: string;
}> = ({ onReply, placeholder, submitLabel }) => {
  const [reply, setReply] = useState("");
  const handle = () => {
    if (!reply.trim()) return;
    onReply(reply);
    setReply("");
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        className="flex-1 bg-gray-200 dark:bg-neutral-600 border border-gray-400 dark:border-neutral-400 rounded px-3 py-1 text-sm focus:outline-none"
        placeholder={placeholder}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button
        onClick={handle}
        className="px-3 py-1 bg-gray-700 dark:bg-neutral-600 border border-gray-400 dark:border-neutral-400 text-white rounded hover:bg-gray-600 text-sm"
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default MovieRatingComment;
