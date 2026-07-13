"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  Flag,
  Ticket,
  Shield,
  ArrowRight,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {useAuth} from "@/hooks/useAuth";
import {fetchCollectionStats, fetchStats, type CollectionStats, type SiteStats} from "@/service/admin.service";

export default function AdminOverviewPage() {
  const {user} = useAuth();
  const [collectionStats, setCollectionStats] = useState<CollectionStats | null>(null);
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCollectionStats().catch(() => null),
      fetchStats().catch(() => null),
    ]).then(([c, s]) => {
      setCollectionStats(c);
      setSiteStats(s);
      setLoading(false);
    });
  }, []);

  const eventsByCategory =
    siteStats?.byCategory?.slice(0, 6).map((item) => ({
      category: item.category?.length > 10 ? item.category.slice(0, 10) + "…" : item.category || "Other",
      count: item.count,
    })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pt-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 rounded-2xl p-6 text-white"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px"}}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Admin Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.username?.split(" ")[0]}!</h1>
            <p className="text-white/70 text-sm mt-1">Platform overview — EventHive</p>
          </div>
          <Link
            href="/dashboard/admin/manage-events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
          >
            Manage Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.1}}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {label: "Total Users", value: collectionStats?.users ?? 0, icon: Users, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-100 dark:border-indigo-800/50", href: "/dashboard/admin/manage-users"},
          {label: "Total Events", value: collectionStats?.events ?? 0, icon: CalendarDays, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-800/50", href: "/dashboard/admin/manage-events"},
          {label: "Total Bookings", value: collectionStats?.bookings ?? 0, icon: Ticket, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800/50", href: "/dashboard/admin/manage-events"},
          {label: "Reported Events", value: collectionStats?.reports ?? 0, icon: Flag, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", border: "border-rose-100 dark:border-rose-800/50", href: "/dashboard/admin/reports"},
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className={`rounded-xl p-4 border ${stat.border} bg-white dark:bg-[#1a1d24] hover:shadow-sm transition-all`}>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Category */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Events by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventsByCategory}>
              <defs>
                <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="category" tick={{fontSize: 10, fill: "#9ca3af"}} />
              <YAxis tick={{fontSize: 11, fill: "#9ca3af"}} allowDecimals={false} />
              <Tooltip contentStyle={{background: "#1a1d24", border: "1px solid #374151", borderRadius: "12px", fontSize: "12px"}} />
              <Bar dataKey="count" fill="url(#adminBarGrad)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Reports & Quick Actions */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.25}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Reports Overview</h2>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Open reports</span>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{collectionStats?.reports ?? 0}</span>
            </div>
            <div className="h-2 my-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{width: 0}}
                animate={{width: (collectionStats?.reports ?? 0) > 0 ? "100%" : "0%"}}
                transition={{delay: 0.4, duration: 0.8, ease: "easeOut"}}
                className="h-full rounded-full bg-rose-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/admin/reports"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Review Reports
            </Link>
            <Link
              href="/dashboard/admin/manage-users"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Manage Users
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
