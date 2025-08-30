// hooks/useAdminVerification.ts
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { rdTechAuth } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import { AdminService } from "@/services/adminService";

export const useAdminVerification = () => {
  const router = useRouter();
  const { user, clearAuthState, setAdminVerified, isAdminVerified } =
    useAuthStore();
  const { clearAdminData } = useAdminStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const redirectWithCleanup = async (path: string, reason: string) => {
    console.log(`[AdminVerification] Redirecting to ${path}: ${reason}`);

    // Clear all state
    clearAuthState();
    clearAdminData();

    // Sign out if needed
    if (rdTechAuth.currentUser) {
      try {
        await rdTechAuth.signOut();
      } catch (error) {
        console.error("Error signing out during redirect:", error);
      }
    }

    // Use window.location.href for logout to force full reload and prevent render loops
    if (reason.includes("Logout")) {
      window.location.href = path;
      return;
    }
    router.push(path);
  };

  const verifyAdminAccess = async (userEmail: string): Promise<boolean> => {
    if (!userEmail) return false;

    setIsVerifying(true);

    return new Promise((resolve) => {
      // If already subscribed, don’t duplicate
      if (unsubscribeRef.current) {
        console.log("[AdminVerification] Already listening for admin updates");
        resolve(isAdminVerified);
        setIsVerifying(false);
        return;
      }

      console.log("[AdminVerification] Subscribing to admin updates...");

      unsubscribeRef.current = AdminService.listenAdmins((emails) => {
        const isAdmin = emails.includes(userEmail);

        if (isAdmin) {
          console.log(`[AdminVerification] ${userEmail} is an admin ✅`);
          setAdminVerified(true);
          resolve(true);
        } else {
          console.warn(`[AdminVerification] ${userEmail} is NOT an admin ❌`);
          setAdminVerified(false);
          redirectWithCleanup("/", "User is not an admin");
          resolve(false);
        }
        setIsVerifying(false);
      });
    });
  };

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        console.log("[AdminVerification] Cleaning up admin listener");
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    verifyAdminAccess,
    isVerifying,
    redirectWithCleanup,
  };
};
