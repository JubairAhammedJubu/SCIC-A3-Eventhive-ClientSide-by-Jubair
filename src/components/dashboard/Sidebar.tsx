"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import {
  LayoutDashboard,
  User,
  Plus,
  ClipboardList,
  Ticket,
  CalendarDays,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import type {Role} from "@/types/user";

const NAV_LINKS: Record<Role, {label: string; href: string; icon: typeof User}[]> = {
  user: [
    {label: "Overview", href: "/dashboard/user", icon: LayoutDashboard},
    {label: "My Profile", href: "/dashboard/user/profile", icon: User},
    {label: "Add Event", href: "/dashboard/user/add-event", icon: Plus},
    {label: "My Events", href: "/dashboard/user/my-events", icon: ClipboardList},
    {label: "My Bookings", href: "/dashboard/user/bookings", icon: Ticket},
  ],
  admin: [
    {label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard},
    {label: "My Profile", href: "/dashboard/admin/profile", icon: User},
    {label: "Manage Events", href: "/dashboard/admin/manage-events", icon: CalendarDays},
    {label: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users},
    {label: "Reports", href: "/dashboard/admin/reports", icon: FileText},
  ],
};

const ROLE_CONFIG: Record<Role, {label: string; color: string; icon: typeof User}> = {
  user: {label: "Event User", color: "from-indigo-500 to-violet-500", icon: User},
  admin: {label: "Admin", color: "from-emerald-500 to-teal-500", icon: Shield},
};

export default function Sidebar({role}: {role: Role}) {
  const pathname = usePathname();
  const {logout} = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = NAV_LINKS[role];
  const roleConfig = ROLE_CONFIG[role];
  const activeGradient =
    role === "admin" ? "from-emerald-500 to-teal-500" : "from-indigo-500 to-violet-500";

  const handleSignOut = async () => {
    await logout();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 py-8 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${activeGradient} text-white shadow-md shadow-indigo-500/20`
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${roleConfig.color} text-white`}
          >
            {roleConfig.label}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 w-10 h-10 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-[#1a1d24] border-r border-gray-100 dark:border-gray-800 shadow-sm">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{x: -280}}
              animate={{x: 0}}
              exit={{x: -280}}
              transition={{type: "spring", damping: 25, stiffness: 200}}
              className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#1a1d24] border-r border-gray-100 dark:border-gray-800 shadow-xl z-50"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
