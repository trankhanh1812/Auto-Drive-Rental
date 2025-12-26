"use client";

import { useState } from "react";
import { reviewService } from "@/lib/services/reviewService";

interface ReviewFormProps {
  carId: number;
  bookingId: number;
  userId: number;
  onReviewCreated?: () => void;
}

export default function ReviewForm({
  carId,
  bookingId,
  userId,
  onReviewCreated,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Vui lòng chọn đánh giá sao");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await reviewService.createReview({
        carId,
        bookingId,
        rating,
        comment,
      });

      setRating(0);
      setComment("");
      if (onReviewCreated) onReviewCreated();
      alert("Đánh giá của bạn đã được gửi thành công!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá xe</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl focus:outline-none transition-colors"
              >
                <span
                  className={
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nhận xét (tùy chọn)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Chia sẻ trải nghiệm của bạn về chiếc xe này..."
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/1000 ký tự
          </p>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
}
