"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Code2, Rocket, Sparkles, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSectionContent } from "@/stores/content";

export default function LandingPage() {
  const {
    data: landingPage,
    loading,
    error,
  } = useSectionContent("landingPage");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [animationComplete, setAnimationComplete] = useState(false);

  // Memoized background particles (only create once)
  const backgroundParticles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({ // Reduced from 12 to 8
        id: i,
        size: Math.random() * 50 + 25, // Slightly smaller
        top: Math.random() * 100,
        left: Math.random() * 100,
        hue: 200 + Math.random() * 80, // Narrower hue range
        delay: Math.random() * 2, // Reduced delay
        duration: 8 + Math.random() * 4, // Shorter duration
      })),
    [],
  );

  // Optimized GSAP animations with better performance
  useEffect(() => {
    if (!isInView || !containerRef.current || loading || animationComplete) return;

    const ctx = gsap.context(() => {
      // Set initial states without animation for better performance
      gsap.set(".hero-title", { y: 60, opacity: 0, scale: 0.98 });
      gsap.set(".hero-description", { y: 30, opacity: 0 });
      gsap.set(".image-item", { y: 40, opacity: 0, scale: 0.95 });
      gsap.set(".background-particle", { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true)
      });

      tl.to(".hero-title", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8, // Reduced duration
        ease: "power2.out", // Simpler easing
      })
      .to(".hero-description", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      .to(".image-item", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: { amount: 0.3, from: "start" }, // Reduced stagger
        ease: "power2.out",
      }, "-=0.3")
      .to(".background-particle", {
        opacity: 0.25, // Reduced opacity
        scale: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.6");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading, animationComplete]);

  // Memoized responsive classes
  const titleClasses = useMemo(() => {
    if (!landingPage?.title) return "";
    const titleLength = landingPage.title.length;
    
    if (titleLength > 100) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
    if (titleLength > 50) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
    return "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl";
  }, [landingPage?.title]);

  const descriptionClasses = useMemo(() => {
    if (!landingPage?.description) return "";
    const descLength = landingPage.description.length;
    
    if (descLength > 300) return "text-sm sm:text-base md:text-lg";
    if (descLength > 150) return "text-base sm:text-lg md:text-xl";
    return "text-lg sm:text-xl md:text-2xl";
  }, [landingPage?.description]);

  const imageGridClasses = useMemo(() => {
    const count = landingPage?.imageUrls?.length || 0;
    if (count === 0) return "";
    
    const gridClasses = {
      1: "grid-cols-1 max-w-xl",
      2: "grid-cols-1 sm:grid-cols-2 max-w-3xl gap-6",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl gap-5",
      4: "grid-cols-2 lg:grid-cols-4 max-w-5xl gap-4",
      5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl gap-4",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-6xl gap-3",
      7: "grid-cols-3 md:grid-cols-4 lg:grid-cols-7 max-w-7xl gap-3",
      8: "grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 max-w-7xl gap-3",
    };
    return gridClasses[Math.min(count, 8) as keyof typeof gridClasses] || gridClasses[8];
  }, [landingPage?.imageUrls?.length]);

  const imageHeightClasses = useMemo(() => {
    const count = landingPage?.imageUrls?.length || 0;
    if (count === 1) return "h-80 md:h-96";
    if (count <= 2) return "h-72 md:h-80";
    if (count <= 4) return "h-60 md:h-72";
    if (count <= 6) return "h-52 md:h-60";
    return "h-44 md:h-52";
  }, [landingPage?.imageUrls?.length]);

  if (loading) {
    return (
      <section className="relative min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-primary/15 overflow-hidden flex items-center justify-center pt-[4.5rem]">
        <div className="animate-pulse text-center space-y-6">
          <div className="h-12 sm:h-16 bg-muted rounded-lg w-80 mx-auto"></div>
          <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !landingPage || landingPage.hidden) return null;

  const title = landingPage.title || "";
  const description = landingPage.description || "";
  const imageUrls = landingPage.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative snap-start min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-primary/15 overflow-hidden flex items-center justify-center pt-[4.5rem]"
    >
      {/* Optimized background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/8 via-background/90 to-accent/8" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(39,180,198,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,20,147,0.04),transparent_50%)]" />
      </div>

      {/* Optimized floating particles - reduced count and complexity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full background-particle"
            style={{
              width: particle.size,
              height: particle.size,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              background: `radial-gradient(circle, hsla(${particle.hue}, 50%, 65%, 0.3), transparent)`,
              filter: 'blur(8px)',
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Simplified floating icons */}
        <motion.div
          className="absolute top-20 left-12 text-primary/50"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <Rocket size={36} />
        </motion.div>
        <motion.div
          className="absolute bottom-28 right-16 text-accent/50"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        >
          <Sparkles size={32} />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4 text-primary/40"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <Code2 size={34} />
        </motion.div>
        <motion.div
          className="absolute bottom-16 left-1/3 text-accent/40"
          animate={{ y: [0, 18, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        >
          <Star size={30} />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 gap-8">
        {title && (
          <h1 className={`hero-title ${titleClasses} font-heading font-extrabold leading-tight tracking-tight max-w-6xl`}>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        )}

        {description && (
          <div className="hero-description max-w-3xl">
            <p className={`${descriptionClasses} text-foreground leading-relaxed font-sans font-medium`}>
              {description}
            </p>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className="hero-images w-full">
            <div className={`grid ${imageGridClasses} mx-auto`}>
              {imageUrls.map((imageUrl: string, index: number) => (
                <motion.div
                  key={`image-${index}`}
                  className="image-item group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
                  whileHover={{ scale: 1.02 }} // Reduced scale for performance
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={imageUrl}
                    alt={`${title} showcase ${index + 1}`}
                    className={`w-full object-cover ${imageHeightClasses} transition-transform duration-300 group-hover:scale-105`}
                    loading={index < 2 ? "eager" : "lazy"} // Only eager load first 2 images
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 border-2 border-primary/60 rounded-full flex justify-center backdrop-blur-sm bg-background/10">
            <motion.div
              className="w-0.5 h-2 bg-primary rounded-full mt-1.5"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
