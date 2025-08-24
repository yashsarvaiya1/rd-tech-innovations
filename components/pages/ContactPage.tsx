'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import ContactUs from '../sections/ContactUs';

export default function ContactPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen pt-20">
      <ContactUs />
    </main>
  );
}
