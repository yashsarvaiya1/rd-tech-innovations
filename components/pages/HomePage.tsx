'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import dynamic from 'next/dynamic';

// Dynamic imports for performance
const LandingPage = dynamic(() => import('../sections/LandingPage'), {
  loading: () => <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" />
});

const WhyUs = dynamic(() => import('../sections/WhyUs'));
const ProjectShowcase = dynamic(() => import('../sections/ProjectShowcase'));
const CompanyMarquee = dynamic(() => import('../sections/CompanyMarquee'));
const ServiceOptions = dynamic(() => import('../sections/ServiceOptions'));
const Technologies = dynamic(() => import('../sections/Technologies'));
const Industries = dynamic(() => import('../sections/Industries'));

export default function HomePage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    // Initial data fetch
    fetchAllContent();
    
    // Set up real-time subscriptions
    const unsubscribe = subscribeToRealTimeUpdates();
    
    // Cleanup on unmount
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen">
      <LandingPage />
      <WhyUs />
      <ProjectShowcase />
      <CompanyMarquee />
      <ServiceOptions />
      <Technologies />
      <Industries />
    </main>
  );
}
