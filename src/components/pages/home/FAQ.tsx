"use client";

import {useState} from "react";
import {ChevronDown} from "lucide-react";

const faqs = [
  {
    q: "How do I book a spot at an event?",
    a: "Open any event's details page and click \"Book now.\" You'll need an account, so sign up or log in first if you haven't already.",
  },
  {
    q: "Can I host my own event for free?",
    a: "Yes. Creating and listing an event on EventHive doesn't cost anything — you set your own ticket price, including free.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, from your Bookings page in the dashboard. Cancelling releases your spot back to the event's capacity.",
  },
  {
    q: "How do I edit or remove an event I created?",
    a: "Go to \"My Events\" in your dashboard, where you can edit details or delete the listing at any time.",
  },
  {
    q: "What happens if I report an event?",
    a: "Reports go to our moderation team for review. We don't remove listings automatically — a human checks each report.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-gray-50 dark:bg-[#0b0d12] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24]">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
