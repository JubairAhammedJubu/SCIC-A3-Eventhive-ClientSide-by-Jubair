"use client";

import Link from "next/link";
import Image from "next/image";
import {motion} from "framer-motion";
import {CalendarDays, MapPin, Star, Users} from "lucide-react";
import type {EventItem} from "@/types/event";

const API_AVATAR = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff`;

export default function EventCard({event, index = 0}: {event: EventItem; index?: number}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, delay: index * 0.05}}
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

        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur">
          {event.price > 0 ? `Tk${event.price}` : "Free"}
        </div>

        {event.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 text-white backdrop-blur text-xs font-bold">
            <Star className="w-3 h-3 fill-white" /> Featured
          </div>
        )}

        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur">
          {event.category}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm mt-2 text-gray-500 dark:text-gray-400 line-clamp-2">
          {event.shortDescription}
        </p>

        <div className="flex-1" />
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <img
            src={event.organizerPhoto || API_AVATAR(event.organizerName)}
            alt={event.organizerName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="truncate">{event.organizerName}</span>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{event.location}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {event.attendeesCount}
          </span>
          {event.ratingCount > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {event.ratingAvg.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-4">
          <Link
            href={`/events/${event._id}`}
            className="inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:opacity-90 transition"
          >
            See Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
