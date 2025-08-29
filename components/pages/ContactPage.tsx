"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { useContentStore } from "@/stores/content";

// Lazy load ContactUs
const ContactUs = dynamic(() => import("../sections/ContactUs"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading contact section..." />,
});

// Shared loader (could be reused across pages)
function SectionLoader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      {label}
    </div>
  );
}

export default function ContactPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<SectionLoader label="Loading contact section..." />}>
        <ContactUs />
      </Suspense>
    </main>
  );
}
