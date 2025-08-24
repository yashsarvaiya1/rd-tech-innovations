'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import Career from '../sections/Career';
import JobOpening from '../sections/JobOpening';
import CareerForm from '../sections/CareerForm';

export default function CareerPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    // Initial data fetch
    fetchAllContent();
    
    // Set up real-time subscriptions
    const unsubscribe = subscribeToRealTimeUpdates();
    
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen pt-20">
      <Career />
      <CareerForm />
      <JobOpening />
    </main>
  );
}
