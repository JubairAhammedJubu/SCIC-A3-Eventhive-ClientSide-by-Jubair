"use client";

import {useEffect, useState, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";
import {Sparkles, ArrowRight, Users, CalendarDays, Star, ChevronLeft, ChevronRight, MapPin} from "lucide-react";
import {fetchEvents} from "@/service/events.service";
import type {EventItem} from "@/types/event";

const API_AVATAR = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff`;

const PER_PAGE = 6;

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-48 bg-gray-100 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
        <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-24 self-center" />
        </div>
      </div>
    </div>
  );
}

function EventCard({event}: {event: EventItem}) {
  return (
    <motion.div
      variants={{
        hidden: {opacity: 0, y: 36},
        visible: {opacity: 1, y: 0, transition: {duration: 0.4, ease: [0.22, 1, 0.36, 1]}},
      }}
      whileHover={{y: -6}}
      className="group bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden shrink-0">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <CalendarDays className="w-10 h-10 text-white/40" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 backdrop-blur-sm text-xs font-bold text-white shadow-md">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </span>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur">
          {event.price > 0 ? `Tk ${event.price}` : "Free"}
        </div>

        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur">
          {event.category}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">{event.title}</h3>

        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 line-clamp-2">{event.shortDescription}</p>

        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <img
            src={event.organizerPhoto || API_AVATAR(event.organizerName)}
            alt={event.organizerName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span>{event.organizerName}</span>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {event.attendeesCount}
          </span>
        </div>

        <div className="flex-1" />

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/events/${event._id}`}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:opacity-90 transition"
          >
            See Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Pagination({page, totalPages, onChange}: {page: number; totalPages: number; onChange: (p: number) => void}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
            p === page
              ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 border-transparent"
              : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function FeaturedEvents() {
  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEvents({perPage: 500, sort: "newest"})
      .then((data) => setAllEvents(data.events.filter((e) => e.featured)))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(allEvents.length / PER_PAGE);
  const currentSlice = allEvents.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
    document.getElementById("featured-events")?.scrollIntoView({behavior: "smooth", block: "start"});
  }, []);

  if (!loading && allEvents.length === 0) return null;

  return (
    <section id="featured-events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.6}}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Editor&apos;s Picks
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Featured{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Events
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
          Hand-picked by our moderators — events worth clearing your calendar for.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length: PER_PAGE}).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={{hidden: {}, visible: {transition: {staggerChildren: 0.08}}}}
            initial="hidden"
            animate="visible"
            exit={{opacity: 0, y: -10, transition: {duration: 0.2}}}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentSlice.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!loading && allEvents.length > 0 && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, allEvents.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-600 dark:text-gray-300">{allEvents.length}</span> featured
            events
          </p>

          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />

          <motion.div initial={{opacity: 0, y: 10}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} transition={{delay: 0.2}} className="mt-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore all events
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
}
