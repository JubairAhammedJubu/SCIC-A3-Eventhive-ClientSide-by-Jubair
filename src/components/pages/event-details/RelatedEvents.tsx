"use client";

import {useEffect, useState} from "react";
import EventCard from "@/components/pages/events/EventCard";
import {fetchRelatedEvents} from "@/service/events.service";
import type {EventItem} from "@/types/event";

export default function RelatedEvents({eventId}: {eventId: string}) {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetchRelatedEvents(eventId)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, [eventId]);

  if (events.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Related events</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <EventCard key={event._id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}
