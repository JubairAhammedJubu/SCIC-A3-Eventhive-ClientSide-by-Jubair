import Link from "next/link";
import {CalendarDays, Facebook, Twitter, Instagram, Mail, Phone} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0b0d12]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span>
                <img
                  src="/logo.png"
                  alt=""
                  className="flex h-8 items-center justify-center rounded-lg text-white"
                />
              </span>
              <span className="text-lg font-bold eh-gradient-text">
                EventHive
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Discover, host, and book events that bring people together.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Explore
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/events"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  All events
                </Link>
              </li>
              <li>
                <Link
                  href="/events?sort=newest"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  New events
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/user/add-event"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Host an event
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Company
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@eventhive.app
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +1 (555) 010-2024
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} EventHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
