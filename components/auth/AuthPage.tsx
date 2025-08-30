"use client";

import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { rdTechAuth } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { useAdminVerification } from "@/hooks/useAdminVerification";

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser, message, setMessage } = useAuthStore();
  const { verifyAdminAccess, isVerifying } = useAdminVerification();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const hasRedirected = useRef(false);

  // Clear any persisted state on mount
  useEffect(() => {
    setMessage(null);
    if (user && !rdTechAuth.currentUser) {
      console.log("[AuthPage] Clearing stale user from store");
      setUser(null);
    }
    setIsInitializing(false);
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(rdTechAuth, (firebaseUser) => {
      console.log("[AuthPage] Auth state changed:", {
        email: firebaseUser?.email,
        isAuthenticated: !!firebaseUser,
      });

      setUser(firebaseUser);

      if (!firebaseUser) {
        hasRedirected.current = false;
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  // Handle redirect after authentication
  useEffect(() => {
    if (
      isInitializing ||
      !user?.email ||
      hasRedirected.current ||
      isSigningIn ||
      isVerifying
    ) {
      return;
    }

    const handleRedirect = async () => {
      if (hasRedirected.current) return;

      try {
        if (!user?.email) {
          console.warn("[AuthPage] User has no email, cannot verify admin");
          return;
        }
        hasRedirected.current = true;
        console.log(`[AuthPage] Verifying admin status for: ${user.email}`);

        const isAdmin = await verifyAdminAccess(user.email);

        if (isAdmin) {
          console.log("[AuthPage] Admin verified, redirecting to admin panel");
          router.replace("/admin");
        } else {
          console.log("[AuthPage] Regular user, redirecting to home");
          router.replace("/");
        }
      } catch (error) {
        console.error("[AuthPage] Error during redirect:", error);
        hasRedirected.current = false;
        setMessage("Failed to verify permissions. Please try again.");
      }
    };

    const timeoutId = setTimeout(handleRedirect, 200);
    return () => clearTimeout(timeoutId);
  }, [
    user?.email,
    isInitializing,
    isSigningIn,
    isVerifying,
    router,
    verifyAdminAccess,
    setMessage,
  ]);

  // Google sign-in
  const signIn = async () => {
    if (isSigningIn || isVerifying) return;

    setIsSigningIn(true);
    setMessage(null);
    hasRedirected.current = false;

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      console.log("[AuthPage] Starting Google sign-in...");
      const result = await signInWithPopup(rdTechAuth, provider);
      console.log("[AuthPage] Sign-in successful for:", result.user.email);
    } catch (error: unknown) {
      console.error("[AuthPage] Sign-in error:", error);
      hasRedirected.current = false;

      let errorMessage = "Failed to sign in with Google. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            errorMessage = "Sign-in was cancelled.";
            break;
          case "auth/popup-blocked":
            errorMessage =
              "Pop-up was blocked. Please allow pop-ups and try again.";
            break;
          case "auth/cancelled-popup-request":
            setIsSigningIn(false);
            return;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection.";
            break;
        }
      }

      setMessage(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>

        {!user ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Sign in with your Google account
            </p>
            <Button
              onClick={signIn}
              disabled={isSigningIn || isVerifying}
              className="w-full"
            >
              {isSigningIn ? "Signing in..." : "Sign in with Google"}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-2">Signed in as {user.email}</p>
            {(isVerifying || hasRedirected.current) && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">
                  {isVerifying ? "Verifying permissions..." : "Redirecting..."}
                </p>
              </div>
            )}
          </div>
        )}

        {message && (
          <Alert
            className={`mt-4 ${
              message.includes("Failed") || message.includes("error")
                ? "border-red-200 bg-red-50"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <AlertTitle>
              {message.includes("Failed") || message.includes("error")
                ? "Error"
                : "Info"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}
