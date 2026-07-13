"use client";

import {usePathname} from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PublicLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Navbar />
      <main className={`flex-grow ${isHome ? "" : "pt-16"}`}>{children}</main>
      <Footer />
    </>
  );
}
