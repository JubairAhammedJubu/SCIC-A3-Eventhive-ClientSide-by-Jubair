"use client";

import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useAuth} from "@/hooks/useAuth";
import {addReview, fetchReviews} from "@/service/reviews.service";
import type {Review} from "@/types/review";

export default function ReviewsSection({eventId}: {eventId: string}) {
  const {user} = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews(eventId)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Log in to leave a review");
      return;
    }
    setSubmitting(true);
    try {
      const {review} = await addReview(eventId, {rating, text});
      setReviews((prev) => [review, ...prev]);
      setText("");
      toast.success("Review posted");
    } catch (err: any) {
      toast.error(err.message || "Could not post review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-1">
            {Array.from({length: 5}).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      value <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience (optional)"
            className="mt-3"
          />
          <Button type="submit" size="sm" className="mt-3" disabled={submitting}>
            {submitting ? "Posting..." : "Post review"}
          </Button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-gray-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet — be the first to share your experience.
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.userName}</span>
                <div className="flex">
                  {Array.from({length: 5}).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {r.text && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{r.text}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
