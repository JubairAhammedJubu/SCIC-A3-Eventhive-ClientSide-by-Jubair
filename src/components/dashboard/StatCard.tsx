"use client";

import {motion} from "framer-motion";
import type {LucideIcon} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "indigo" | "amber" | "emerald" | "rose" | "sky" | "teal";
  delay?: number;
}

const accentMap = {
  indigo: {
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-100 dark:border-indigo-800",
  },
  amber: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-100 dark:border-amber-800",
  },
  emerald: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800",
  },
  rose: {
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-100 dark:border-rose-800",
  },
  sky: {
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-100 dark:border-sky-800",
  },
  teal: {
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-100 dark:border-teal-800",
  },
};

export default function StatCard({label, value, icon: Icon, accent = "indigo", delay = 0}: StatCardProps) {
  const c = accentMap[accent];

  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{delay}}
      className={`rounded-xl p-4 border ${c.border} bg-gray-50 dark:bg-gray-800/40`}
    >
      <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${c.color}`} />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className={`text-2xl font-bold ${c.color}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );
}
