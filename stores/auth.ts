import type { User } from "firebase/auth";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { AdminService } from "@/services/adminService";

interface AuthState {
  user: User | null;
  message: string | null;
  isAdminVerified: boolean;
  adminEmails: string[]; // cached admin list
  setUser: (user: User | null) => void;
  setMessage: (message: string | null) => void;
  setAdminVerified: (verified: boolean) => void;
  clearAuthState: () => void;
  fetchAndCacheAdmins: () => Promise<void>;
  verifyAdmin: (email: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        message: null,
        isAdminVerified: false,
        adminEmails: [],

        setUser: (user) => {
          set({ user });
          // Clear admin verification when user changes
          if (!user) {
            set({ isAdminVerified: false, adminEmails: [] });
          }
        },

        setMessage: (message) => set({ message }),

        setAdminVerified: (verified) => {
          set({ isAdminVerified: verified });
        },

        clearAuthState: () => {
          console.log("[AuthStore] Clearing all auth state");
          set({
            user: null,
            message: null,
            isAdminVerified: false,
            adminEmails: [],
          });
        },

        // Fetch admins once and cache them locally
        fetchAndCacheAdmins: async () => {
          try {
            console.log("[AuthStore] Fetching and caching admin emails...");
            const emails = await AdminService.fetchAdmins();
            set({ adminEmails: emails });
            console.log(`[AuthStore] Cached ${emails.length} admin emails`);
          } catch (error) {
            console.error("[AuthStore] Failed to fetch admin emails:", error);
          }
        },

        // Verify admin locally using cached emails
        verifyAdmin: (email: string) => {
          const { adminEmails } = get();
          const isAdmin = adminEmails.includes(email);
          set({ isAdminVerified: isAdmin });
          return isAdmin;
        },
      }),
      {
        name: "auth-store",
        storage: createJSONStorage(() => localStorage), // Persist in localStorage
      }
    ),
    {
      name: "auth-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
