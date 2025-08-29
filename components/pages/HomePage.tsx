"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { useContentStore } from "@/stores/content";
import CompanyMarquee from "../sections/CompanyMarquee";
import LandingPage from "../sections/LandingPage";

// Lazy load non-critical sections
const ServiceOptions = dynamic(() => import("../sections/ServiceOptions"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading services..." />,
});

const ProjectShowcase = dynamic(() => import("../sections/ProjectShowcase"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading projects..." />,
});

const Testimonials = dynamic(() => import("../sections/Testimonials"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading testimonials..." />,
});

const Technologies = dynamic(() => import("../sections/Technologies"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading technologies..." />,
});

const Industries = dynamic(() => import("../sections/Industries"), {
  ssr: false,
  loading: () => <SectionLoader label="Loading industries..." />,
});

// Simple fallback loader for sections
function SectionLoader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      {label}
    </div>
  );
}

export default function HomePage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen">
      <LandingPage />
      <CompanyMarquee />

      <Suspense fallback={<SectionLoader label="Loading services..." />}>
        <ServiceOptions />
      </Suspense>

      <Suspense fallback={<SectionLoader label="Loading projects..." />}>
        <ProjectShowcase />
      </Suspense>

      <Suspense fallback={<SectionLoader label="Loading technologies..." />}>
        <Technologies />
      </Suspense>

      <Suspense fallback={<SectionLoader label="Loading testimonials..." />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionLoader label="Loading industries..." />}>
        <Industries />
      </Suspense>
    </main>
  );
}
