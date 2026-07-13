"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {Eye, Trash2, Star, CalendarDays, Loader2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import DataTable, {type Column} from "@/components/dashboard/DataTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {adminDeleteEvent, fetchAdminEvents, setEventFeatured} from "@/service/admin.service";
import type {EventItem} from "@/types/event";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchAdminEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      await adminDeleteEvent(target._id);
      setEvents((prev) => prev.filter((e) => e._id !== target._id));
      toast.success("Event deleted");
      setTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Could not delete event");
    } finally {
      setDeleting(false);
    }
  };

  const toggleFeatured = async (event: EventItem) => {
    setActionLoading(event._id);
    try {
      await setEventFeatured(event._id, !event.featured);
      setEvents((prev) => prev.map((e) => (e._id === event._id ? {...e, featured: !e.featured} : e)));
    } catch (err: any) {
      toast.error(err.message || "Could not update event");
    } finally {
      setActionLoading(null);
    }
  };

  const columns: Column<EventItem>[] = [
    {
      header: "Event",
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-4 h-4 text-amber-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">{e.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(e.createdAt).toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"})}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Organizer",
      render: (e) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {e.organizerName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{e.organizerName}</p>
            <p className="text-xs text-gray-400 truncate max-w-[120px]">{e.organizerEmail}</p>
          </div>
        </div>
      ),
    },
    {header: "Category", render: (e) => <Badge>{e.category}</Badge>},
    {
      header: "Featured",
      render: (e) => (
        <button
          onClick={() => toggleFeatured(e)}
          disabled={!!actionLoading}
          title={e.featured ? "Remove from featured" : "Make featured"}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
            e.featured
              ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
              : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
          }`}
        >
          {actionLoading === e._id ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Star className={`w-3 h-3 ${e.featured ? "fill-current" : ""}`} />
          )}
          {e.featured ? "Featured" : "Feature"}
        </button>
      ),
    },
    {
      header: "Actions",
      render: (e) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/events/${e._id}`}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
            title="View event"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setTarget(e)}
            className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/30 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title="Delete event"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-6 pt-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage events</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">All events across the platform.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <DataTable columns={columns} data={events} keyField={(e) => e._id} emptyMessage="No events yet." />
        )}
      </div>

      <ConfirmDeleteModal
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={`Delete "${target?.title}"?`}
        description="This will permanently remove the event from the platform."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
