export type BookingStatus = "confirmed" | "cancelled";

export interface Booking {
  _id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: BookingStatus;
  bookedAt: string;
  eventTitle?: string;
  eventDate?: string | null;
  eventImage?: string;
  eventLocation?: string;
}
