"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {Eye, Trash2, CalendarDays, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import DataTable, {type Column} from "@/components/dashboard/DataTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {deleteEvent, fetchMyEvents} from "@/service/events.service";
import type {EventItem} from "@/types/event";

export default function MyEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchMyEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      await deleteEvent(target._id);
      setEvents((prev) => prev.filter((e) => e._id !== target._id));
      toast.success("Event deleted");
      setTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Could not delete event");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<EventItem>[] = [
    {
      header: "Event",
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] flex items-center gap-1.5">
              {e.title}
              {e.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(e.date).toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"})}
            </p>
          </div>
        </div>
      ),
    },
    {header: "Category", render: (e) => <Badge>{e.category}</Badge>},
    {header: "Attendees", render: (e) => `${e.attendeesCount}/${e.capacity}`},
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My events</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Events you&apos;ve created.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={events}
            keyField={(e) => e._id}
            emptyMessage="You haven't created any events yet."
          />
        )}
      </div>

      <ConfirmDeleteModal
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={`Delete "${target?.title}"?`}
        description="This will permanently remove the event."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
