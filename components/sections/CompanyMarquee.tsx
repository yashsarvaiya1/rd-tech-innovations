"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSectionContent } from "@/stores/content";

// Simple skeleton component
function SectionSkeleton({ height = "h-16" }: { height?: string }) {
  return (
    <div className={`flex items-center justify-center ${height}`}>
      <div className="flex space-x-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-20 h-12 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export default function CompanyMarquee() {
  const {
    data: companyMarquee,
    loading,
    error,
  } = useSectionContent("companyMarquee");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);

  // Memoize mobile check
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  // Memoize company logos to prevent unnecessary re-renders
  const companyLogos = useMemo(() => {
    return companyMarquee?.companyLogoUrls || [];
  }, [companyMarquee?.companyLogoUrls]);

  // Memoize duplicated logos
  const duplicatedLogos = useMemo(() => {
    if (companyLogos.length === 0) return [];
    return [...companyLogos, ...companyLogos, ...companyLogos];
  }, [companyLogos]);

  // Optimized image preloading
  useEffect(() => {
    if (!isInView || companyLogos.length === 0) return;

    let loadedCount = 0;
    const totalImages = companyLogos.length; // Only count unique images

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        setImagesLoaded(true);
      }
    };

    // Preload unique images only
    const imagePromises = companyLogos.map((logoUrl: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          handleImageLoad();
          resolve(void 0);
        };
        img.onerror = () => {
          handleImageLoad(); // Still count as "loaded" to prevent hanging
          resolve(void 0);
        };
        img.src = logoUrl;
      });
    });

    Promise.all(imagePromises).then(() => {
      // Small delay to ensure DOM is ready
      setTimeout(() => setAnimationReady(true), 100);
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      setImagesLoaded(true);
      setAnimationReady(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isInView, companyLogos]);

  // OPTIMIZED GSAP Animation
  useEffect(() => {
    if (!animationReady || !marqueeRef.current || !imagesLoaded || companyLogos.length === 0) return;

    const marquee = marqueeRef.current;
    let tween: gsap.core.Tween;

    // Use requestAnimationFrame for better timing
    const timer = requestAnimationFrame(() => {
      // Get the width of one complete set
      const children = Array.from(marquee.children);
      const oneSetChildren = children.slice(0, companyLogos.length);
      
      let oneSetWidth = 0;
      oneSetChildren.forEach(child => {
        const rect = child.getBoundingClientRect();
        const style = window.getComputedStyle(child);
        const marginRight = parseFloat(style.marginRight) || 0;
        oneSetWidth += rect.width + marginRight;
      });

      if (oneSetWidth === 0) return;

      // Set initial position
      gsap.set(marquee, { x: 0 });

      // Create optimized animation
      tween = gsap.to(marquee, {
        x: -oneSetWidth,
        duration: Math.max(companyLogos.length * 2.5, 12), // Slower, smoother
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x);
            return val <= -oneSetWidth ? "0px" : x;
          }
        }
      });

      // Optimized hover controls
      let isHovered = false;
      
      const handleMouseEnter = () => {
        if (!isMobile && tween && !isHovered) {
          isHovered = true;
          gsap.to(tween, { timeScale: 0.1, duration: 0.5, ease: "power2.out" });
        }
      };

      const handleMouseLeave = () => {
        if (!isMobile && tween && isHovered) {
          isHovered = false;
          gsap.to(tween, { timeScale: 1, duration: 0.5, ease: "power2.out" });
        }
      };

      marquee.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      marquee.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      return () => {
        if (tween) tween.kill();
        marquee.removeEventListener('mouseenter', handleMouseEnter);
        marquee.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => {
      cancelAnimationFrame(timer);
      if (tween) tween.kill();
    };
  }, [animationReady, imagesLoaded, companyLogos.length, isMobile]);

  // Early returns
  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-primary/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <SectionSkeleton height="h-16" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !companyMarquee || companyMarquee.hidden || companyLogos.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="company-marquee-section py-8 sm:py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-primary/8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative px-4 sm:px-6">
        {companyMarquee.heading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {companyMarquee.heading}
            </h2>
          </motion.div>
        )}

        <div className="marquee-container relative overflow-hidden">
          <div
            ref={marqueeRef}
            className="marquee-track flex items-center gap-4 sm:gap-6 md:gap-8"
            style={{
              width: "max-content",
              willChange: "transform",
            }}
          >
            {duplicatedLogos.map((logoUrl: string, index: number) => (
              <motion.div
                key={`logo-${index}-${logoUrl.split('/').pop()}`}
                className="logo-item flex-shrink-0 w-16 h-10 sm:w-20 sm:h-12 md:w-24 md:h-14 lg:w-28 lg:h-16 flex items-center justify-center p-1.5 sm:p-2 md:p-3 bg-card/80 backdrop-blur-sm rounded-lg shadow-sm border border-border/40 group hover:bg-card/90 transition-all duration-300"
                whileHover={!isMobile ? { scale: 1.05, y: -2 } : {}}
                whileTap={isMobile ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img
                  src={logoUrl}
                  alt={`Partner company logo ${(index % companyLogos.length) + 1}`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  loading={index < companyLogos.length ? "eager" : "lazy"}
                  draggable={false}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Gradient fade masks */}
          <div className="absolute top-0 left-0 w-8 sm:w-12 md:w-16 lg:w-24 h-full bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-8 sm:w-12 md:w-16 lg:w-24 h-full bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
