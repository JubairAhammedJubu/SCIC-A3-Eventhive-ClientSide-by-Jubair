"use client";

import {motion} from "framer-motion";
import {CalendarCheck2, Users, ShieldCheck, Sparkles} from "lucide-react";

const features = [
  {
    id: 1,
    icon: CalendarCheck2,
    title: "Book in Seconds",
    description: "No back-and-forth emails or phone calls. See real-time availability and confirm your spot instantly.",
    gradient: "from-indigo-500 to-violet-500",
    shadow: "shadow-indigo-500/20",
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Host With Ease",
    description: "List an event in minutes with a simple form — manage bookings, attendees, and reviews from one dashboard.",
    gradient: "from-violet-500 to-purple-500",
    shadow: "shadow-violet-500/20",
  },
  {
    id: 3,
    icon: Users,
    title: "Real Community",
    description: "Every event is rated and reviewed by people who actually attended — no fake listings, no dead links.",
    gradient: "from-purple-500 to-rose-500",
    shadow: "shadow-purple-500/20",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Moderated & Safe",
    description: "Reports get reviewed by real moderators, so low-quality or misleading listings don't stick around.",
    gradient: "from-rose-500 to-pink-500",
    shadow: "shadow-rose-500/20",
  },
];

const containerVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {staggerChildren: 0.12}},
};

const itemVariants = {
  hidden: {opacity: 0, y: 30},
  visible: {opacity: 1, y: 0, transition: {duration: 0.6, ease: [0.22, 1, 0.36, 1] as const}},
};

export default function WhyChooseUs() {
  return (
    <section className="relative py-15 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            Why It Matters
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              EventHive
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            We built the platform we wished existed — simple for attendees, powerful for organizers.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, amount: 0.1}}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{y: -6, transition: {duration: 0.2}}}
              className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_16px_48px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_16px_48px_rgba(99,102,241,0.15)] transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`} />

              <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-lg flex items-center justify-center mb-5`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>

              <div className={`mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500 ease-out`} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.3}}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {value: "500+", label: "Events Hosted"},
            {value: "1200+", label: "Happy Attendees"},
            {value: "97%", label: "Would Book Again"},
            {value: "4.8★", label: "Average Rating"},
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-2xl bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
