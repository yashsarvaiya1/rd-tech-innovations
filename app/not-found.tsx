"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home immediately
    router.replace("/");
  }, [router]);

  // Optional: Show a brief loading state during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting to home...</p>
      </div>
    </div>
  );
}
