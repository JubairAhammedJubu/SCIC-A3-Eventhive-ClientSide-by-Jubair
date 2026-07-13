export type EventVisibility = "public" | "private";

export interface EventItem {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl: string;
  visibility: EventVisibility;
  featured: boolean;
  reviewed: boolean;
  attendeesCount: number;
  ratingAvg: number;
  ratingCount: number;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponse {
  events: EventItem[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface EventFilters {
  search?: string;
  category?: string;
  sort?: "newest" | "price_low" | "price_high" | "most_rated";
  page?: number;
  perPage?: number;
}

export interface CreateEventPayload {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  imageUrl?: string;
}
