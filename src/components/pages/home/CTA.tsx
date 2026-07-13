import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-[#151328] px-8 py-16 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl"
        />
        <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
          Ready to host your next event?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-gray-300">
          Set up a listing in minutes, manage bookings in one place, and reach
          people actively looking for something to do.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="gradient" size="lg" asChild>
            <Link href="/dashboard/user/add-event">Create an event</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-gray-600 text-white hover:bg-white/10" asChild>
            <Link href="/events">Browse events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
