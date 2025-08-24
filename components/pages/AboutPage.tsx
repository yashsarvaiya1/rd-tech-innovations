'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import CompanyBrief from '../sections/CompanyBrief';
import CompanyMarquee from '../sections/CompanyMarquee';
import WhyUs from '../sections/WhyUs';
import Vision from '../sections/Vision';
import EventsPhotoWall from '../sections/EventsPhotoWall'; // Add this

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
      <CompanyMarquee />
      <WhyUs />
      <Vision />
      <EventsPhotoWall /> {/* Add events section to about page */}
    </main>
  );
}
