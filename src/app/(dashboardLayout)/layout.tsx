"use client";

import {useAuthGuard} from "@/hooks/authGuard";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/shared/Navbar";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuthGuard();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex flex-1">
        <Sidebar role={user.role} />
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
      </div>
    </div>
  );
}
