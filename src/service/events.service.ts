import {api} from "@/lib/api";
import type {
  CreateEventPayload,
  EventFilters,
  EventItem,
  EventListResponse,
} from "@/types/event";

export async function fetchEvents(filters: EventFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.perPage) params.set("perPage", String(filters.perPage));

  const qs = params.toString();
  return api.get<EventListResponse>(`/api/events${qs ? `?${qs}` : ""}`, {
    auth: false,
  });
}

export async function fetchEventById(id: string) {
  return api.get<EventItem>(`/api/events/${id}`, {auth: false});
}

export async function fetchRelatedEvents(id: string) {
  return api.get<EventItem[]>(`/api/events/${id}/related`, {auth: false});
}

export async function fetchMyEvents() {
  return api.get<EventItem[]>("/api/events/user");
}

export async function fetchEventsByOrganizer(email: string) {
  return api.get<EventItem[]>(`/api/events/by-organizer/${email}`, {
    auth: false,
  });
}

export async function createEvent(payload: CreateEventPayload) {
  return api.post<{success: boolean; event: EventItem}>(
    "/api/events",
    payload,
  );
}

export async function updateEvent(id: string, payload: Partial<CreateEventPayload>) {
  return api.patch(`/api/events/${id}`, payload);
}

export async function deleteEvent(id: string) {
  return api.delete(`/api/events/${id}`);
}
