"use client";

import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {Trophy, CalendarDays, Sparkles, TrendingUp, Medal} from "lucide-react";
import {fetchEvents} from "@/service/events.service";
import {fetchPublicProfiles} from "@/service/auth.service";

const RANK = [
  {
    pos: 1,
    icon: Trophy,
    gradient: "from-amber-400 to-yellow-500",
    ring: "ring-amber-400/60",
    shadow: "shadow-amber-200/60 dark:shadow-amber-900/40",
    size: "w-24 h-24",
    label: "🥇",
  },
  {
    pos: 2,
    icon: Medal,
    gradient: "from-slate-300 to-slate-400",
    ring: "ring-slate-300/60",
    shadow: "shadow-slate-200/60 dark:shadow-slate-900/40",
    size: "w-20 h-20",
    label: "🥈",
  },
  {
    pos: 3,
    icon: Medal,
    gradient: "from-orange-300 to-amber-500",
    ring: "ring-orange-400/60",
    shadow: "shadow-orange-200/60 dark:shadow-orange-900/40",
    size: "w-20 h-20",
    label: "🥉",
  },
];

interface Organizer {
  name: string;
  email: string;
  photo: string;
  count: number;
}

function Avatar({
  photo,
  name,
  size,
  ring,
}: {
  photo: string;
  name: string;
  size: string;
  ring: string;
}) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=6366F1&color=fff&bold=true`;
  return (
    <div
      className={`${size} rounded-full overflow-hidden ring-2 ${ring} shrink-0 bg-gray-100 dark:bg-gray-800`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo || fallback}
        alt={name}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function SkeletonPodium() {
  return (
    <div className="flex items-end justify-center gap-4 mb-10">
      {[20, 28, 20].map((h, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3"
          style={{paddingBottom: i === 1 ? 0 : 24}}
        >
          <div
            className={`${i === 1 ? "w-24 h-24" : "w-20 h-20"} rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse`}
          />
          <div className="w-20 h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
          <div
            className={`w-full ${i === 1 ? "h-28" : "h-20"} rounded-t-2xl bg-gray-100 dark:bg-gray-800 animate-pulse`}
            style={{width: 96}}
          />
        </div>
      ))}
    </div>
  );
}

function Podium({top3}: {top3: Organizer[]}) {
  const heightMap: Record<number, string> = {0: "h-36", 1: "h-24", 2: "h-20"};

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 mb-12">
      {top3.map((c, idx) => {
        const rank = RANK[idx];
        if (!c || !rank) return null;
        const isFirst = idx === 0;

        return (
          <motion.div
            key={c.email}
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{
              delay: 0.1 + idx * 0.1,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative">
              <Avatar
                photo={c.photo}
                name={c.name}
                size={rank.size}
                ring={rank.ring}
              />
              <span className="absolute -top-5 right-7 text-2xl leading-none">
                {rank.label}
              </span>
            </div>

            <div className="text-center">
              <p
                className={`font-bold truncate max-w-[88px] ${isFirst ? "text-sm text-gray-900 dark:text-gray-100" : "text-xs text-gray-700 dark:text-gray-300"}`}
              >
                {c.name?.split(" ")[0]}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                {c.count} events
              </p>
            </div>

            <div
              className={`w-20 sm:w-24 ${heightMap[idx]} rounded-t-2xl flex items-start justify-center pt-3 bg-gradient-to-b ${rank.gradient} shadow-lg ${rank.shadow}`}
            >
              <span className="text-white font-black text-xl">#{idx + 1}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function TopOrganizers() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    fetchEvents({perPage: 500})
      .then(async (data) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        const weekly = data.events.filter(
          (e) => new Date(e.createdAt) >= cutoff,
        );
        setTotalEvents(weekly.length);

        const map: Record<string, Organizer> = {};
        weekly.forEach((e) => {
          if (!e.organizerEmail) return;
          if (!map[e.organizerEmail]) {
            map[e.organizerEmail] = {
              name: e.organizerName || "Anonymous",
              email: e.organizerEmail,
              photo: e.organizerPhoto || "",
              count: 0,
            };
          }
          map[e.organizerEmail].count++;
        });

        const sorted = Object.values(map)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // organizerName / organizerPhoto on the event documents are a
        // snapshot taken when each event was created, so they go stale if
        // the organizer updates their profile later. Fetch current
        // username/photoURL straight from the users collection and use
        // that instead, so the leaderboard always reflects the latest
        // profile.
        try {
          const profiles = await fetchPublicProfiles(
            sorted.map((o) => o.email),
          );
          const profileByEmail: Record<
            string,
            {username: string; photoURL: string}
          > = {};
          profiles.forEach((p) => {
            profileByEmail[p.email] = {
              username: p.username,
              photoURL: p.photoURL,
            };
          });
          sorted.forEach((o) => {
            const live = profileByEmail[o.email];
            if (live) {
              o.name = live.username || o.name;
              o.photo = live.photoURL || o.photo;
            }
          });
        } catch {
          // fall back to the denormalized event snapshot if this fails
        }

        setOrganizers(sorted);
      })
      .catch(() => setOrganizers([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && organizers.length === 0) return null;

  const top3 = organizers.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.6}}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
          <TrendingUp className="w-3.5 h-3.5" />
          This Week&apos;s Leaderboard
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Top{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            Organizers
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
          The most active event hosts this week — bringing people together,
          again and again.
        </p>

        {!loading && organizers.length > 0 && (
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 0.3}}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-400/10 border border-indigo-200 dark:border-indigo-800/50 text-sm font-medium text-indigo-700 dark:text-indigo-300"
          >
            <Sparkles className="w-4 h-4" />
            {totalEvents} events published this week by {organizers.length}{" "}
            organizers
          </motion.div>
        )}
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {loading ? (
          <SkeletonPodium />
        ) : top3.length > 0 ? (
          <Podium top3={top3} />
        ) : null}

        {!loading && organizers.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No events published this week yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
