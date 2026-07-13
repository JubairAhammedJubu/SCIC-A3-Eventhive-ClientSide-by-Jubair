"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {Eye, CheckCircle, Flag} from "lucide-react";
import DataTable, {type Column} from "@/components/dashboard/DataTable";
import {clearEventReports} from "@/service/admin.service";
import {fetchReports, type Report} from "@/service/reports.service";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchReports()
      .then(setReports)
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleClear = async (eventId: string) => {
    try {
      await clearEventReports(eventId);
      setReports((prev) => prev.filter((r) => r.eventId !== eventId));
      toast.success("Reports cleared for this event");
    } catch (err: any) {
      toast.error(err.message || "Could not clear reports");
    }
  };

  const columns: Column<Report>[] = [
    {
      header: "Reported by",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {r.reporterEmail?.charAt(0).toUpperCase()}
          </div>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[160px]">{r.reporterEmail}</p>
        </div>
      ),
    },
    {
      header: "Reason",
      render: (r) => (
        <div className="inline-flex items-start gap-1.5 max-w-xs">
          <Flag className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{r.reason}</span>
        </div>
      ),
    },
    {header: "Date", render: (r) => new Date(r.createdAt).toLocaleDateString("en-US", {day: "numeric", month: "short", year: "numeric"})},
    {
      header: "Actions",
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/events/${r.eventId}`}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
            title="View event"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => handleClear(r.eventId)}
            className="p-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            title="Clear reports for this event"
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="p-6 pt-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">Events flagged by the community.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <DataTable columns={columns} data={reports} keyField={(r) => r._id} emptyMessage="No reports right now." />
        )}
      </div>
    </div>
  );
}
