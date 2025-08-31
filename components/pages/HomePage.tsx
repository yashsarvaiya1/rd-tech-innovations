"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useContentStore } from "@/stores/content";
import CompanyMarquee from "../sections/CompanyMarquee";
import LandingPage from "../sections/LandingPage";

// Optimized lazy loading with intersection observer
const ServiceOptions = dynamic(() => import("../sections/ServiceOptions"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-96" />,
});

const ProjectShowcase = dynamic(() => import("../sections/ProjectShowcase"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-[32rem]" />,
});

const Testimonials = dynamic(() => import("../sections/Testimonials"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-80" />,
});

const Technologies = dynamic(() => import("../sections/Technologies"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-72" />,
});

const Industries = dynamic(() => import("../sections/Industries"), {
  ssr: false,
  loading: () => <SectionSkeleton height="h-80" />,
});

// Enhanced skeleton loader
function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`py-12 sm:py-16 px-4 sm:px-6 lg:px-8 ${height}`}>
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Title skeleton */}
          <div className="h-6 sm:h-8 bg-gradient-to-r from-muted via-muted/60 to-muted rounded-lg w-2/5 mx-auto"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-32 sm:h-40 bg-gradient-to-br from-muted to-muted/60 rounded-xl"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Intersection Observer hook for lazy loading
function useIntersectionObserver() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['landing', 'marquee']));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId && entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, sectionId]));
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '200px' // Start loading 200px before section is visible
      }
    );

    // Observer will be set up by individual components
    return () => observer.disconnect();
  }, []);

  return { visibleSections, observer: null };
}

// Lazy section wrapper
function LazySection({ 
  sectionId, 
  children, 
  fallback 
}: { 
  sectionId: string; 
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div ref={setRef} data-section={sectionId}>
      {isVisible ? children : fallback}
    </div>
  );
}

export default function HomePage() {
  const { subscribeToRealTimeUpdates, fetchAllContent, loading, error } = useContentStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Memoized initialization
  const initializeContent = useCallback(async () => {
    if (isInitialized) return;

    try {
      // Fetch critical content first (navbar, landing, marquee)
      await fetchAllContent();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize content:', error);
      setInitError(error instanceof Error ? error.message : 'Initialization failed');
      setIsInitialized(true); // Still allow render
    }
  }, [fetchAllContent, isInitialized]);

  // Initialize content and real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      await initializeContent();
      
      // Set up real-time updates after initial load
      unsubscribe = subscribeToRealTimeUpdates();
    };

    setup();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initializeContent, subscribeToRealTimeUpdates]);

  // Show loading for critical sections only
  if (!isInitialized && loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (initError || error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <p className="text-destructive">Failed to load content</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Critical above-the-fold content - always loaded */}
      <LandingPage />
      <CompanyMarquee />

      {/* Lazy loaded sections with intersection observer */}
      <LazySection 
        sectionId="services" 
        fallback={<SectionSkeleton height="h-96" />}
      >
        <Suspense fallback={<SectionSkeleton height="h-96" />}>
          <ServiceOptions />
        </Suspense>
      </LazySection>

      <LazySection 
        sectionId="projects" 
        fallback={<SectionSkeleton height="h-[32rem]" />}
      >
        <Suspense fallback={<SectionSkeleton height="h-[32rem]" />}>
          <ProjectShowcase />
        </Suspense>
      </LazySection>

      <LazySection 
        sectionId="technologies" 
        fallback={<SectionSkeleton height="h-72" />}
      >
        <Suspense fallback={<SectionSkeleton height="h-72" />}>
          <Technologies />
        </Suspense>
      </LazySection>

      <LazySection 
        sectionId="testimonials" 
        fallback={<SectionSkeleton height="h-80" />}
      >
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <Testimonials />
        </Suspense>
      </LazySection>

      <LazySection 
        sectionId="industries" 
        fallback={<SectionSkeleton height="h-80" />}
      >
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <Industries />
        </Suspense>
      </LazySection>
    </main>
  );
}
