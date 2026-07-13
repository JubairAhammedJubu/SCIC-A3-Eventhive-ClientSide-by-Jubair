import {api} from "@/lib/api";

export interface Report {
  _id: string;
  eventId: string;
  reason: string;
  reporterId: string;
  reporterEmail: string;
  createdAt: string;
}

export async function submitReport(payload: {eventId: string; reason: string}) {
  return api.post<{success: boolean; report: Report}>("/api/reports", payload);
}

export async function fetchReports() {
  return api.get<Report[]>("/api/reports");
}
