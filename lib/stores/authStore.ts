import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/lib/types";

interface UserRole {
  isAdmin: boolean;
}

interface AuthState {
  user: FirebaseUser | null;
  userRole: UserRole | null;
  userData: User | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserRole: (role: UserRole | null) => void;
  setUserData: (data: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userRole: null,
  userData: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setUserRole: (role) => set({ userRole: role }),
  setUserData: (data) => set({ userData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
