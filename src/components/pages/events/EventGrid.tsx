"use client";

import EventCard from "./EventCard";
import SkeletonCard from "@/components/shared/SkeletonCard";
import type {EventItem} from "@/types/event";

interface EventGridProps {
  events: EventItem[];
  loading: boolean;
}

export default function EventGrid({events, loading}: EventGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({length: 8}).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-16 text-center text-gray-500 dark:text-gray-400">
        No events match your search. Try a different keyword or category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {events.map((event, index) => (
        <EventCard key={event._id} event={event} index={index} />
      ))}
    </div>
  );
}
