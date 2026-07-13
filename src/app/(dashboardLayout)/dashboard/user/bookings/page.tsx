"use client";

import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {XCircle, Ticket, CheckCircle2} from "lucide-react";
import DataTable, {type Column} from "@/components/dashboard/DataTable";
import {cancelBooking, fetchMyBookings} from "@/service/bookings.service";
import type {Booking} from "@/types/booking";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking cancelled");
    } catch (err: any) {
      toast.error(err.message || "Could not cancel booking");
    }
  };

  const columns: Column<Booking>[] = [
    {
      header: "Booking",
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center flex-shrink-0">
            <Ticket className="w-4 h-4 text-rose-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {b.eventTitle || "Event no longer available"}
            </p>
            {b.eventLocation && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                {b.eventLocation}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (b) => (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
            {b.status}
          </span>
        </div>
      ),
    },
    {
      header: "Booked on",
      render: (b) =>
        new Date(b.bookedAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Actions",
      render: (b) => (
        <button
          onClick={() => handleCancel(b._id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <XCircle className="w-3.5 h-3.5" /> Cancel
        </button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-6 pt-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        My bookings
      </h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Events you&apos;ve booked a spot at.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={bookings}
            keyField={(b) => b._id}
            emptyMessage="You haven't booked any events yet."
          />
        )}
      </div>
    </div>
  );
}
