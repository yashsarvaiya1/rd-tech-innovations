'use client'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { rdTechAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";

export default function Auth() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(rdTechAuth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Admin Sign-In</h1>
      <Button onClick={signIn} className="mt-4">
        Sign in with Google
      </Button>
    </main>
  );
}
