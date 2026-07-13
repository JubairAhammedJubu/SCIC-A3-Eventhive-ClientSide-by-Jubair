"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {CalendarDays, MapPin, Users, DollarSign, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Gallery from "@/components/pages/event-details/Gallery";
import ReviewsSection from "@/components/pages/event-details/ReviewsSection";
import RelatedEvents from "@/components/pages/event-details/RelatedEvents";
import ReportModal from "@/components/modals/ReportModal";
import {useAuth} from "@/hooks/useAuth";
import {fetchEventById} from "@/service/events.service";
import {bookEvent} from "@/service/bookings.service";
import type {EventItem} from "@/types/event";

export default function EventDetailsPage() {
  const {id} = useParams<{id: string}>();
  const router = useRouter();
  const {user} = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setBooking(true);
    try {
      await bookEvent(id);
      toast.success("Booked! See it under My Bookings.");
    } catch (err: any) {
      toast.error(err.message || "Could not book this event");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-400">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-gray-500 dark:text-gray-400">
        Event not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Gallery imageUrl={event.imageUrl} title={event.title} />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge>{event.category}</Badge>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {event.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />{" "}
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {event.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {event.attendeesCount} /{" "}
              {event.capacity} attending
            </span>
            {event.ratingCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {event.ratingAvg.toFixed(1)} ({event.ratingCount})
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="flex items-center gap-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {event.price > 0 ? `Tk ${event.price}` : "Free"}
          </span>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleBook}
            disabled={booking}
          >
            {booking ? "Booking..." : "Book now"}
          </Button>
          <ReportModal eventId={event._id} />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-line text-gray-600 dark:text-gray-300">
              {event.fullDescription}
            </p>
          </div>

          <ReviewsSection eventId={event._id} />
        </div>

        <div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Key information
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Organizer</dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {event.organizerName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {event.category}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Capacity</dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {event.capacity}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Price</dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {event.price > 0 ? `Tk${event.price}` : "Free"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <RelatedEvents eventId={event._id} />
      </div>
    </div>
  );
}
