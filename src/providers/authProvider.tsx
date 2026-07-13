"use client";

import {createContext, useCallback, useEffect, useState, ReactNode} from "react";
import toast from "react-hot-toast";
import {getMe, loginUser, loginWithGoogle, logoutUser, registerUser} from "@/service/auth.service";
import {getToken} from "@/lib/token";
import type {AppUser} from "@/types/user";

export interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  googleLogin: (code: string, redirectUri: string) => Promise<AppUser>;
  register: (username: string, email: string, password: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: AppUser) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await loginUser({email, password});
    setUser(loggedInUser);
    toast.success("Welcome back! ✨");
    return loggedInUser;
  }, []);

  const googleLogin = useCallback(async (code: string, redirectUri: string) => {
    const loggedInUser = await loginWithGoogle(code, redirectUri);
    setUser(loggedInUser);
    toast.success("Welcome back! ✨");
    return loggedInUser;
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const newUser = await registerUser({username, email, password});
      setUser(newUser);
      toast.success("Account created! Welcome to EventHive 🎉");
      return newUser;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    toast.success("Signed out successfully!");
  }, []);

  return (
    <AuthContext.Provider value={{user, loading, login, googleLogin, register, logout, refreshUser, setUser}}>
      {children}
    </AuthContext.Provider>
  );
}
