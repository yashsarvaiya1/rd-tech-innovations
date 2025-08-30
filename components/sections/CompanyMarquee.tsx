"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { useSectionContent } from "@/stores/content";

export default function CompanyMarquee() {
  const {
    data: companyMarquee,
    loading,
    error,
  } = useSectionContent("companyMarquee");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // Mobile detection for responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get company logos from Firestore
  const companyLogos = companyMarquee?.companyLogoUrls || [];

  // Preload images and set up animation
  useEffect(() => {
    if (!isInView || !marqueeRef.current || companyLogos.length === 0) return;

    const marquee = marqueeRef.current;
    
    // Wait for all images to load
    const images = marquee.querySelectorAll('img');
    let loadedCount = 0;
    
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setImagesLoaded(true);
      }
    };

    Array.from(images).forEach(img => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.onload = checkAllLoaded;
        img.onerror = checkAllLoaded;
      }
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isInView, companyLogos.length]);

  // GSAP Animation Effect
  useEffect(() => {
    if (!imagesLoaded || !marqueeRef.current || companyLogos.length === 0) return;

    const marquee = marqueeRef.current;
    let tween: gsap.core.Tween;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Calculate actual width
      const firstChild = marquee.firstElementChild as HTMLElement;
      if (!firstChild) return;

      // Get the width of one complete set (first third of the duplicated content)
      const children = Array.from(marquee.children);
      const oneSetWidth = children.slice(0, companyLogos.length).reduce((total, child) => {
        const rect = child.getBoundingClientRect();
        const style = window.getComputedStyle(child);
        const marginRight = parseFloat(style.marginRight) || 0;
        return total + rect.width + marginRight;
      }, 0);

      // Set initial position
      gsap.set(marquee, { x: 0 });

      // Create the animation
      tween = gsap.to(marquee, {
        x: -oneSetWidth,
        duration: Math.max(companyLogos.length * 2, 10), // Minimum 10s duration
        ease: "none", // Linear movement
        repeat: -1,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x);
            // Reset position when we've moved one full set
            return val <= -oneSetWidth ? "0px" : x;
          }
        }
      });

      // Hover controls (desktop only)
      const handleMouseEnter = () => {
        if (!isMobile && tween) {
          tween.pause();
        }
      };

      const handleMouseLeave = () => {
        if (!isMobile && tween) {
          tween.play();
        }
      };

      marquee.addEventListener('mouseenter', handleMouseEnter);
      marquee.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (tween) tween.kill();
        marquee.removeEventListener('mouseenter', handleMouseEnter);
        marquee.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (tween) tween.kill();
    };
  }, [imagesLoaded, companyLogos.length, isMobile]);

  // Early returns for loading states
  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-primary/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="animate-pulse text-muted-foreground">Loading companies...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !companyMarquee || companyMarquee.hidden || companyLogos.length === 0) {
    return null;
  }

  // Triple duplication for seamless infinite scroll
  const duplicatedLogos = [...companyLogos, ...companyLogos, ...companyLogos];

  return (
    <section
      ref={containerRef}
      className="company-marquee-section py-8 sm:py-12 md:py-16 bg-gradient-to-br from-background via-muted/20 to-primary/8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative px-4 sm:px-6">
        {/* Optional heading */}
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
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    // Hide broken images gracefully
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
