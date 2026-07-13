"use client";

import {Suspense, useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {AlertCircle} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {getGoogleRedirectUri} from "@/lib/googleAuth";

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {googleLogin} = useAuth();
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError("Google sign-in was cancelled.");
      return;
    }
    if (!code) {
      setError("Missing authorization code from Google.");
      return;
    }

    googleLogin(code, getGoogleRedirectUri())
      .then((loggedInUser) =>
        router.push(loggedInUser.role === "admin" ? "/dashboard/admin" : "/dashboard/user"),
      )
      .catch((err: any) => setError(err.message || "Google sign-in failed."));
  }, [searchParams, googleLogin, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">{error}</p>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold hover:opacity-90 transition"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Signing you in with Google…</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}
