"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "./useAuth";
import type {Role} from "@/types/user";

export function useAuthGuard(requiredRole?: Role) {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace("/dashboard/user");
    }
  }, [user, loading, requiredRole, router]);

  return {user, loading};
}
