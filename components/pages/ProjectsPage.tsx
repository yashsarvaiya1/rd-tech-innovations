'use client'
import { useEffect } from 'react';
import { useContentStore } from '@/stores/content';
import ProjectPlayground from '../sections/ProjectPlayground';

export default function ProjectsPage() {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    fetchAllContent();
    const unsubscribe = subscribeToRealTimeUpdates();
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return (
    <main className="min-h-screen pt-20">
      <ProjectPlayground />
    </main>
  );
}
