import {api} from "@/lib/api";
import type {Review} from "@/types/review";

export async function fetchReviews(eventId: string) {
  return api.get<Review[]>(`/api/events/${eventId}/reviews`, {auth: false});
}

export async function addReview(
  eventId: string,
  payload: {rating: number; text?: string},
) {
  return api.post<{success: boolean; review: Review}>(
    `/api/events/${eventId}/reviews`,
    payload,
  );
}
