"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Comment {
  id: string;
  user: string;
  rating: number;
  content: string;
  replies: Comment[];
}

interface Props {
  movieId: string;
}

const MovieRatingComment: React.FC<Props> = ({ movieId }) => {
  const { t } = useTranslation(); // dùng namespace movie
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = () => {
    if (!comment || rating === 0) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      user: t("rating.defaultUser"), // "Khách"
      rating,
      content: comment,
      replies: [],
    };
    setComments([newComment, ...comments]);
    setComment("");
    setRating(0);
  };

  const handleReply = (parentId: string, replyText: string) => {
    if (!replyText) return;
    const updatedComments = comments.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: Date.now().toString(),
              user: t("rating.you"), // "Bạn"
              rating: 0,
              content: replyText,
              replies: [],
            },
          ],
        };
      }
      return c;
    });
    setComments(updatedComments);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-orange-400 mb-3">
          {t("rating.yourRating")}
        </h2>
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer transition ${
                i <= rating ? "text-yellow-400" : "text-gray-400"
              }`}
              onClick={() => setRating(i)}
            />
          ))}
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none"
          rows={3}
          placeholder={t("rating.placeholder") || ""}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          {t("rating.submit")}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          {t("rating.recent")}
        </h2>
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t("rating.noComment")}
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="mb-4 border-b pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{c.user}</span>
              <div className="flex gap-1">
                {[...Array(c.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground mb-2">{c.content}</p>
            <ReplyInput
              onReply={(text) => handleReply(c.id, text)}
              placeholder={t("rating.replyPlaceholder") || ""}
              submitLabel={t("rating.replyButton")}
            />
            {c.replies.map((r) => (
              <div key={r.id} className="ml-6 mt-2">
                <p className="text-xs text-muted-foreground">
                  <strong>{r.user}</strong>: {r.content}
                </p>
              </div>
            ))}
          </div>
        ))}
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
    onReply(reply);
    setReply("");
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
        placeholder={placeholder}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button
        onClick={handle}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default MovieRatingComment;
