'use client'

import { useEffect, useState } from 'react';
import { useContentStore } from '@/stores/content';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const fetchAllContent = useContentStore((state) => state.fetchAllContent);
  const subscribeToRealTimeUpdates = useContentStore((state) => state.subscribeToRealTimeUpdates);

  useEffect(() => {
    let unsubscribe: () => void | undefined; // Explicitly type unsubscribe

    const setupStore = async () => {
      try {
        // Fetch initial content
        await fetchAllContent();
        // Set up real-time subscriptions
        unsubscribe = subscribeToRealTimeUpdates();
      } catch (error) {
        console.error('Failed to set up store:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupStore().catch((error) => {
      console.error('Error in setupStore:', error);
      setIsLoading(false); // Ensure loading state is cleared on error
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAllContent, subscribeToRealTimeUpdates]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // Fallback UI
  }

  return <>{children}</>;
}
