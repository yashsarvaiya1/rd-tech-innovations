'use client';

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { rdTechAuth, rdTechDb, collections } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { FirebaseError } from "firebase/app";
import { useEffect, useState, useRef } from "react";

export default function AuthPage() {
  const router = useRouter();
  const { user, setUser, message, setMessage } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const hasRedirected = useRef(false);

  // Clear any persisted user state and message on mount
  useEffect(() => {
    setMessage(null);
    // If there's a stored user but no valid session, clear them
    const checkStoredUser = async () => {
      if (user && !rdTechAuth.currentUser) {
        console.log("Clearing stale user from store");
        setUser(null);
        document.cookie = "auth-token=; path=/; max-age=0"; // Clear cookie
      }
    };
    checkStoredUser();
  }, [setMessage, setUser, user]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(rdTechAuth, (firebaseUser) => {
      console.log("Auth state changed:", {
        email: firebaseUser?.email,
        uid: firebaseUser?.uid,
        isAuthenticated: !!firebaseUser,
      });
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  // Handle redirect after authentication
  useEffect(() => {
    if (!user || !user.email || hasRedirected.current || isSigningIn) return;

    const checkAdminAndRedirect = async () => {
      if (hasRedirected.current) return; // Double-check
      
      setIsLoading(true);
      
      try {
        const adminDocRef = doc(rdTechDb, collections.admins, "admins");
        const adminDocSnap = await getDoc(adminDocRef);
        const adminData = adminDocSnap.exists() ? adminDocSnap.data() : { emails: [] };
        const isAdmin = adminData.emails?.includes(user.email) || false;

        console.log("Admin check:", {
          email: user.email,
          isAdmin,
          adminEmails: adminData.emails || [],
        });

        // Set auth token with admin status
        const cookieValue = isAdmin ? "admin" : "user";
        document.cookie = `auth-token=${cookieValue}; path=/; max-age=86400; secure; samesite=strict`;

        const targetPath = isAdmin ? "/admin" : "/";
        
        console.log(`User is ${isAdmin ? 'admin' : 'regular user'}, redirecting to ${targetPath}`);
        hasRedirected.current = true;
        
        router.replace(targetPath);

      } catch (error) {
        console.error("Error checking admin status:", error);
        const errorMessage = error instanceof FirebaseError 
          ? error.message 
          : "Failed to verify admin status";
        setMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAndRedirect();
  }, [user, router, setMessage, isSigningIn]);

  const signIn = async () => {
    if (isSigningIn || isLoading) return;
    
    setIsSigningIn(true);
    setMessage(null);
    
    const provider = new GoogleAuthProvider();
    
    try {
      console.log("Starting Google sign-in...");
      await signInWithPopup(rdTechAuth, provider);
      console.log("Sign-in popup completed");
      
    } catch (error: unknown) {
      console.error("Sign-in error:", error);
      
      let errorMessage = "Failed to sign in with Google. Please try again.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = "Sign-in was cancelled.";
            break;
          case 'auth/popup-blocked':
            errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
            break;
          case 'auth/cancelled-popup-request':
            // Don't show error for cancelled requests
            setIsSigningIn(false);
            return;
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
            <p className="text-gray-600 mb-4">Sign in with your Google account</p>
            <Button 
              onClick={signIn} 
              disabled={isSigningIn}
              className="w-full"
            >
              {isSigningIn ? "Signing in..." : "Sign in with Google"}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">
              {isLoading 
                ? `Checking permissions for ${user.email}...` 
                : `Signed in as ${user.email}`
              }
            </p>
            {isLoading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}
          </div>
        )}

        {message && (
          <Alert className={`mt-4 ${message.includes("Failed") ? "border-red-200" : "border-blue-200"}`}>
            <AlertTitle>
              {message.includes("Failed") ? "Error" : "Info"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}
