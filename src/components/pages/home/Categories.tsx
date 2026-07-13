"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import {Music, Briefcase, Utensils, Dumbbell, Palette, GraduationCap, PartyPopper, Laptop} from "lucide-react";

const categories = [
  {name: "Music", icon: Music, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300"},
  {name: "Business", icon: Briefcase, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300"},
  {name: "Food & Drink", icon: Utensils, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300"},
  {name: "Sports", icon: Dumbbell, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300"},
  {name: "Arts", icon: Palette, color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40 dark:text-pink-300"},
  {name: "Education", icon: GraduationCap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300"},
  {name: "Festivals", icon: PartyPopper, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300"},
  {name: "Tech", icon: Laptop, color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300"},
];

const containerVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {staggerChildren: 0.06}},
};

const itemVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {opacity: 1, y: 0, transition: {duration: 0.4, ease: [0.22, 1, 0.36, 1] as const}},
};

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.6}}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
          Browse by category
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Jump straight to the kind of event you&apos;re in the mood for.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{once: true, amount: 0.2}}
        className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {categories.map(({name, icon: Icon, color}) => (
          <motion.div key={name} variants={itemVariants} whileHover={{y: -4}}>
            <Link
              href={`/events?category=${encodeURIComponent(name)}`}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24] p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
