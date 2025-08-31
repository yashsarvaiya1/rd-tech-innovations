// hooks/useAdminVerification.ts

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { rdTechAuth } from "@/firebase";
import { AdminService } from "@/services/adminService";
import { useAdminStore } from "@/stores/admin";
import { useAuthStore } from "@/stores/auth";

export const useAdminVerification = () => {
  const router = useRouter();
  const { user, clearAuthState, setAdminVerified, isAdminVerified } =
    useAuthStore();
  const { clearAdminData } = useAdminStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const redirectWithCleanup = async (path: string, reason: string) => {
    // Clear all state
    clearAuthState();
    clearAdminData();

    // Sign out if needed
    if (rdTechAuth.currentUser) {
      try {
        await rdTechAuth.signOut();
      } catch (_error) {}
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
        resolve(isAdminVerified);
        setIsVerifying(false);
        return;
      }

      unsubscribeRef.current = AdminService.listenAdmins((emails) => {
        const isAdmin = emails.includes(userEmail);

        if (isAdmin) {
          setAdminVerified(true);
          resolve(true);
        } else {
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
