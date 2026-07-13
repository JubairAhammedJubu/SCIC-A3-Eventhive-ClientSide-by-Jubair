export interface Review {
  _id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  text: string;
  createdAt: string;
}
