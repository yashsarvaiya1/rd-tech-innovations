'use client'
import { useEffect, ReactNode } from 'react';
import { useContentStore } from '@/stores/content';

interface ContentProviderProps {
  children: ReactNode;
}

export default function ContentProvider({ children }: ContentProviderProps) {
  const { subscribeToRealTimeUpdates, fetchAllContent } = useContentStore();

  useEffect(() => {
    // Initial data fetch
    fetchAllContent();

    // Set up real-time subscriptions
    const unsubscribe = subscribeToRealTimeUpdates();

    // Cleanup on unmount
    return unsubscribe;
  }, [subscribeToRealTimeUpdates, fetchAllContent]);

  return <>{children}</>;
}
