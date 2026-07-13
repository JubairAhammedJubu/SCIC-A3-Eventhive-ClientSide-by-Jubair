import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "react-hot-toast";
import {AuthProvider} from "@/providers/authProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventHive | Discover & Host Great Events",
  description: "Find, book, and host memorable events in your city.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1a1d24",
                color: "#f1f5f9",
                border: "1px solid #374151",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: {
                iconTheme: {primary: "#6366f1", secondary: "#fff"},
              },
              error: {
                iconTheme: {primary: "#ef4444", secondary: "#fff"},
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
