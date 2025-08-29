'use client';

import { useEffect, Suspense } from 'react';
import { useContentStore } from '@/stores/content';
import dynamic from 'next/dynamic';

// Lazy load both sections
const JobOpening = dynamic(() => import('../sections/JobOpening'), {
  ssr: false,
  loading: () => <SectionLoader label="Loading job openings..." />,
});
const CareerForm = dynamic(() => import('../sections/CareerForm'), {
  ssr: false,
  loading: () => <SectionLoader label="Loading career form..." />,
});

// Shared loader (consider moving to components/common/SectionLoader.tsx)
function SectionLoader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      {label}
    </div>
  );
}

export default function CareerPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen">
      <Suspense fallback={<SectionLoader label="Loading job openings..." />}>
        <JobOpening />
      </Suspense>
      <Suspense fallback={<SectionLoader label="Loading career form..." />}>
        <CareerForm />
      </Suspense>
    </main>
  );
}
