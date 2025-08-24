'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import CompanyBrief from '../sections/CompanyBrief'; // Will serve as "About" section
import WhyUs from '../sections/WhyUs';
import Vision from '../sections/Vision';
import EventsPhotoWall from '../sections/EventsPhotoWall';

export default function AboutPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen pt-20">
      <CompanyBrief />
      <WhyUs />
      <Vision />
      <EventsPhotoWall />
    </main>
  );
}
