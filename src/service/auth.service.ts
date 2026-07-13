import {api} from "@/lib/api";
import {clearToken, setToken} from "@/lib/token";
import type {AuthResponse, AppUser} from "@/types/user";

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
}) {
  const data = await api.post<AuthResponse>("/api/auth/register", payload, {
    auth: false,
  });
  setToken(data.token);
  return data.user;
}

export async function loginUser(payload: {email: string; password: string}) {
  const data = await api.post<AuthResponse>("/api/auth/login", payload, {
    auth: false,
  });
  setToken(data.token);
  return data.user;
}

export async function loginWithGoogle(code: string, redirectUri: string) {
  const data = await api.post<AuthResponse>(
    "/api/auth/google",
    {code, redirectUri},
    {auth: false},
  );
  setToken(data.token);
  return data.user;
}

export async function logoutUser() {
  try {
    await api.post("/api/auth/logout");
  } finally {
    clearToken();
  }
}

export async function getMe() {
  return api.get<AppUser>("/api/users/me");
}

export async function updateProfile(payload: {
  username?: string;
  photoURL?: string;
}) {
  const data = await api.patch<{success: boolean; user: AppUser}>(
    "/api/users/me",
    payload,
  );
  return data.user;
}

export async function fetchPublicProfiles(emails: string[]) {
  if (emails.length === 0) return [];
  return api.post<{username: string; email: string; photoURL: string}[]>(
    "/api/users/profiles",
    {emails},
    {auth: false},
  );
}
