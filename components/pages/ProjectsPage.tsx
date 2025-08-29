"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { useContentStore } from "@/stores/content";

// Lazy load ProjectPlayground
const ProjectPlayground = dynamic(
  () => import("../sections/ProjectPlayground"),
  {
    ssr: false,
    loading: () => <SectionLoader label="Loading projects..." />,
  },
);

// Shared loader component (can be moved to common/ later)
function SectionLoader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      {label}
    </div>
  );
}

export default function ProjectsPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<SectionLoader label="Loading projects..." />}>
        <ProjectPlayground />
      </Suspense>
    </main>
  );
}
