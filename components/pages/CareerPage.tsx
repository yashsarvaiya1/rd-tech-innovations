'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import JobOpening from '../sections/JobOpening';
import CareerForm from '../sections/CareerForm';

export default function CareerPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen pt-20">
      <JobOpening />
      <CareerForm />
    </main>
  );
}
