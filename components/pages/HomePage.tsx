'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import LandingPage from '../sections/LandingPage';
import CompanyMarquee from '../sections/CompanyMarquee';
import ServiceOptions from '../sections/ServiceOptions';
import ProjectShowcase from '../sections/ProjectShowcase';
import Testimonials from '../sections/Testimonials';
import Technologies from '../sections/Technologies';
import Industries from '../sections/Industries';

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
      <ServiceOptions />
      <ProjectShowcase />
      <Testimonials />
      <Technologies />
      <Industries />
    </main>
  );
}
