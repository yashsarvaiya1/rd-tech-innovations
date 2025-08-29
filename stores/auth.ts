import type { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  message: string | null;
  setUser: (user: User | null) => void;
  setMessage: (message: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  message: null,
  setUser: (user) => set({ user }),
  setMessage: (message) => set({ message }),
}));
