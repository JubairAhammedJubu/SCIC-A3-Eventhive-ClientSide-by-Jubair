"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {
  CalendarDays,
  Ticket,
  ArrowRight,
  Clock,
  Eye,
  Plus,
  ClipboardList,
  Star,
  MapPin,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {useAuth} from "@/hooks/useAuth";
import {fetchMyEvents} from "@/service/events.service";
import {fetchMyBookings} from "@/service/bookings.service";
import type {EventItem} from "@/types/event";
import type {Booking} from "@/types/booking";

// Safely parse a date-ish value. Returns null instead of throwing when the
// value is missing or unparseable, so callers can filter it out.
function toValidDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(value as string | number | Date);
  return isNaN(d.getTime()) ? null : d;
}

function EventRow({event}: {event: EventItem}) {
  const eventDate = toValidDate(event.date);
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400/20 to-violet-400/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center flex-shrink-0">
        <CalendarDays className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {event.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <Clock className="w-3 h-3" />
          <span>
            {eventDate
              ? eventDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })
              : "Date TBA"}
          </span>
          {event.attendeesCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Ticket className="w-3 h-3 text-emerald-400" />
              {event.attendeesCount}
            </span>
          )}
          {event.featured && (
            <span className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400" /> Featured
            </span>
          )}
        </div>
      </div>
      <Link
        href={`/events/${event._id}`}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
      >
        <Eye className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function UserOverviewPage() {
  const {user} = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMyEvents().catch(() => []),
      fetchMyBookings().catch(() => []),
    ]).then(([e, b]) => {
      setEvents(e);
      setBookings(b);
      setLoading(false);
    });
  }, []);

  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", {weekday: "short"});
    const dateStr = d.toISOString().split("T")[0];
    const count = events.filter((e) => {
      const created = toValidDate(e.createdAt);
      return created ? created.toISOString().split("T")[0] === dateStr : false;
    }).length;
    return {day: label, events: count};
  });

  const recentEvents = [...events]
    .sort((a, b) => {
      const aTime = toValidDate(a.createdAt)?.getTime() ?? 0;
      const bTime = toValidDate(b.createdAt)?.getTime() ?? 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 pt-6 max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-6 text-white"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">
                Event Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.username?.split(" ")[0]}!
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Here&apos;s what&apos;s happening with your events.
            </p>
          </div>
          <Link
            href="/dashboard/user/add-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
          >
            Add Event
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {[
          {
            label: "Events hosted",
            value: events.length,
            icon: CalendarDays,
            accent: "indigo" as const,
          },
          {
            label: "Events booked",
            value: bookings.length,
            icon: Ticket,
            accent: "emerald" as const,
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24] shadow-sm"
          >
            <StatInner {...stat} delay={i * 0.05} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth chart */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Events Created — Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.2}
              />
              <XAxis dataKey="day" tick={{fontSize: 11, fill: "#9ca3af"}} />
              <YAxis
                tick={{fontSize: 11, fill: "#9ca3af"}}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1d24",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#userGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent events */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.25}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Recently Added
          </h2>

          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[180px] gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm text-gray-400">No events yet</p>
              <Link
                href="/dashboard/user/add-event"
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold transition-all"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <EventRow key={event._id} event={event} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.3}}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "My Events",
              desc: "Manage your listings",
              icon: ClipboardList,
              href: "/dashboard/user/my-events",
              color: "text-indigo-600 dark:text-indigo-400",
              bg: "bg-indigo-50 dark:bg-indigo-900/20",
              border:
                "border-indigo-100 dark:border-indigo-800 hover:border-indigo-300",
            },
            {
              label: "My Bookings",
              desc: "Events you're attending",
              icon: Ticket,
              href: "/dashboard/user/bookings",
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-900/20",
              border:
                "border-rose-100 dark:border-rose-800 hover:border-rose-300",
            },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className={`flex flex-col gap-2 p-4 rounded-xl border ${action.border} bg-white dark:bg-[#1a1d24] hover:shadow-sm transition-all cursor-pointer`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${action.bg} flex items-center justify-center`}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${action.color}`}>
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatInner({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: number;
  icon: typeof CalendarDays;
  accent: "indigo" | "emerald";
  delay: number;
}) {
  const colors = {
    indigo: {
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    emerald: {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  }[accent];

  return (
    <motion.div
      initial={{opacity: 0, y: 8}}
      animate={{opacity: 1, y: 0}}
      transition={{delay}}
    >
      <div
        className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}
      >
        <Icon className={`w-4 h-4 ${colors.color}`} />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className={`text-2xl font-bold ${colors.color}`}>
        {value.toLocaleString()}
      </p>
    </motion.div>
  );
}
