export type Role = "user" | "admin";

export interface AppUser {
  _id: string;
  username: string;
  email: string;
  role: Role;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AppUser;
}
