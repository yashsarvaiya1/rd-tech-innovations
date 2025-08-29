"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { useContentStore } from "@/stores/content";
import CompanyBrief from "../sections/CompanyBrief"; // Critical section
import Vision from "../sections/Vision"; // Keep above the fold

// Lazy load heavier sections
const WhyUs = dynamic(() => import("../sections/WhyUs"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading why us..." />,
});

const EventsPhotoWall = dynamic(() => import("../sections/EventsPhotoWall"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading events..." />,
});

// Simple loader for sections
function SectionLoader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      {label}
    </div>
  );
}

export default function AboutPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen">
      <CompanyBrief />
      <Vision />

      <Suspense fallback={<SectionLoader label="Loading why us..." />}>
        <WhyUs />
      </Suspense>

      <Suspense fallback={<SectionLoader label="Loading events..." />}>
        <EventsPhotoWall />
      </Suspense>
    </main>
  );
}
