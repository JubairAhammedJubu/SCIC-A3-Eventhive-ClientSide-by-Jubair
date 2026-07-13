import {api} from "@/lib/api";
import type {AppUser, Role} from "@/types/user";
import type {EventItem} from "@/types/event";

export interface SiteStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  byCategory: {category: string; count: number}[];
}

export interface CollectionStats {
  users: number;
  events: number;
  bookings: number;
  reviews: number;
  reports: number;
}

export async function fetchStats() {
  return api.get<SiteStats>("/api/stats", {auth: false});
}

export async function fetchCollectionStats() {
  return api.get<CollectionStats>("/api/collection-stats");
}

export async function fetchUsers(params: {role?: Role; search?: string} = {}) {
  const qs = new URLSearchParams();
  if (params.role) qs.set("role", params.role);
  if (params.search) qs.set("search", params.search);
  const query = qs.toString();
  return api.get<AppUser[]>(`/api/users${query ? `?${query}` : ""}`);
}

export async function updateUserRole(id: string, role: Role) {
  return api.patch(`/api/users/${id}/role`, {role});
}

export async function fetchAdminEvents() {
  return api.get<EventItem[]>("/api/admin/events");
}

export async function adminDeleteEvent(id: string) {
  return api.delete(`/api/admin/events/${id}`);
}

export async function setEventFeatured(id: string, featured: boolean) {
  return api.patch(`/api/admin/events/${id}/featured`, {featured});
}

export async function setEventReviewed(id: string, reviewed: boolean) {
  return api.patch(`/api/admin/events/${id}/reviewed`, {reviewed});
}

export async function purgeEvent(id: string) {
  return api.delete(`/api/admin/events/${id}/purge`);
}

export async function clearEventReports(id: string) {
  return api.delete(`/api/admin/events/${id}/clear-reports`);
}
