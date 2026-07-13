import {Target, Heart, Globe2} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our mission",
    text: "Make it effortless for anyone to find or host an event worth showing up for.",
  },
  {
    icon: Heart,
    title: "Built for organizers",
    text: "From a 10-person workshop to a 500-person festival, listing, booking, and moderation tools scale with you.",
  },
  {
    icon: Globe2,
    title: "Local first",
    text: "We surface events happening near you before anything else — discovery starts with your city.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          About EventHive
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          EventHive started as a simple idea: booking a spot at a local event
          shouldn&apos;t take longer than deciding to go. Today, organizers use
          EventHive to list events and manage attendees, while attendees use
          it to discover things happening around them.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {values.map(({icon: Icon, title, text}) => (
          <div key={title} className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl eh-gradient-bg text-white">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
