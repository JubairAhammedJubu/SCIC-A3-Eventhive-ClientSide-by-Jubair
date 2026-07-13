import {api} from "@/lib/api";
import type {Booking} from "@/types/booking";

export async function bookEvent(eventId: string) {
  return api.post<{success: boolean; booking: Booking}>("/api/bookings", {
    eventId,
  });
}

export async function fetchMyBookings() {
  return api.get<Booking[]>("/api/bookings");
}

export async function cancelBooking(id: string) {
  return api.delete(`/api/bookings/${id}`);
}
