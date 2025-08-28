'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function LandingPage() {
  const { data: landingPage, loading, error } = useSectionContent('landingPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles with better distribution
  const backgroundParticles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 30,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 180 + (Math.random() * 180), // Cooler spectrum
      delay: Math.random() * 4,
      duration: 12 + Math.random() * 8
    })), []
  );

  // ✅ Enhanced GSAP animations with smoother transitions
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.hero-title', 
        { 
          y: 80, 
          opacity: 0,
          scale: 0.95,
          rotationX: 30
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2, 
          ease: "power3.out" 
        }
      )
      .fromTo('.hero-description', 
        { 
          y: 40, 
          opacity: 0,
          blur: 8
        },
        { 
          y: 0, 
          opacity: 1,
          blur: 0,
          duration: 1, 
          ease: "power2.out" 
        }, "-=0.7"
      )
      .fromTo('.image-item', 
        { 
          y: 60, 
          opacity: 0, 
          scale: 0.9,
          rotationY: 10
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotationY: 0,
          duration: 0.8, 
          stagger: {
            amount: 0.5,
            from: "center",
            ease: "power2.out"
          }
        }, "-=0.5"
      )
      .fromTo('.background-particle', 
        {
          opacity: 0,
          scale: 0,
          rotation: -90
        },
        {
          opacity: 0.4,
          scale: 1,
          rotation: 0,
          stagger: 0.08,
          duration: 1.5,
          ease: "elastic.out(1, 0.6)"
        }, "-=1"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !landingPage || landingPage.hidden) return null;

  const title = landingPage.title || '';
  const description = landingPage.description || '';
  const imageUrls = landingPage.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  // ✅ More balanced font sizing - significantly smaller
  const getTitleFontSize = (text: string) => {
    if (text.length > 100) return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
    if (text.length > 50) return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl';
    return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl';
  };

  const getDescriptionFontSize = (text: string) => {
    if (text.length > 300) return 'text-sm sm:text-base md:text-lg';
    if (text.length > 150) return 'text-base sm:text-lg md:text-xl';
    return 'text-lg sm:text-xl md:text-2xl';
  };

  // ✅ Enhanced responsive image grid system
  const getImageGridClasses = (count: number) => {
    const gridClasses = {
      1: 'grid-cols-1 max-w-xl',
      2: 'grid-cols-1 sm:grid-cols-2 max-w-3xl gap-6',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl gap-5',
      4: 'grid-cols-2 lg:grid-cols-4 max-w-5xl gap-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl gap-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-6xl gap-3',
      7: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-7 max-w-7xl gap-3',
      8: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 max-w-7xl gap-3'
    };
    return gridClasses[Math.min(count, 8) as keyof typeof gridClasses] || gridClasses[8];
  };

  const getImageHeight = (count: number) => {
    if (count === 1) return 'h-80 md:h-96';
    if (count <= 2) return 'h-72 md:h-80';
    if (count <= 4) return 'h-60 md:h-72';
    if (count <= 6) return 'h-52 md:h-60';
    return 'h-44 md:h-52';
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/70 to-indigo-100/80 overflow-hidden"
    >
      {/* ✅ Enhanced layered background with better depth */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/50 to-purple-50/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(99,102,241,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(59,130,246,0.02),rgba(147,51,234,0.02),rgba(59,130,246,0.02))]" />
      </div>

      {/* ✅ Enhanced floating particles with better physics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full background-particle blur-xl"
            style={{
              width: particle.size,
              height: particle.size,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              background: `radial-gradient(circle, hsla(${particle.hue}, 60%, 70%, 0.4), hsla(${particle.hue + 30}, 70%, 75%, 0.2))`
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              scale: [1, 1.08, 1],
              opacity: [0.15, 0.3, 0.15],
              rotate: [0, 120, 240, 360]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* ✅ Main content with improved spacing and hierarchy */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 gap-8">
        
        {/* ✅ Better balanced title with refined gradient */}
        {title && (
          <motion.h1 
            ref={titleRef}
            className={`hero-title ${getTitleFontSize(title)} font-bold mb-6 leading-tight tracking-tight max-w-6xl`}
            style={{
              textShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}
          >
            <span className="bg-gradient-to-r from-indigo-700 via-purple-600 to-blue-700 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>
        )}

        {/* ✅ Better balanced description with improved styling */}
        {description && (
          <motion.div 
            ref={descRef}
            className="hero-description mb-10 max-w-3xl"
          >
            <p className={`${getDescriptionFontSize(description)} text-slate-600 leading-relaxed font-normal max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-indigo-50 px-1`}>
              {description}
            </p>
          </motion.div>
        )}

        {/* ✅ Enhanced image grid with better proportions */}
        {imageUrls.length > 0 && (
          <motion.div 
            ref={imagesRef}
            className="hero-images w-full"
          >
            <div className={`grid ${getImageGridClasses(imageUrls.length)} mx-auto`}>
              {imageUrls.map((imageUrl: string, index: number) => (
                <motion.div
                  key={index}
                  className="image-item group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-400"
                  whileHover={{ 
                    scale: 1.03, 
                    rotate: Math.random() * 2 - 1,
                    z: 10
                  }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                >
                  {/* ✅ Enhanced image with better loading */}
                  <img
                    src={imageUrl}
                    alt={`${title} showcase ${index + 1}`}
                    className={`w-full object-cover ${getImageHeight(imageUrls.length)} transition-all duration-500 group-hover:scale-105`}
                    loading={index < 3 ? "eager" : "lazy"}
                    style={{
                      filter: 'brightness(0.96) contrast(1.05) saturate(1.05)'
                    }}
                  />
                  
                  {/* ✅ Subtle overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  
                  {/* ✅ Refined border glow */}
                  <div className="absolute inset-0 rounded-xl border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* ✅ Refined index indicator */}
                  {imageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-xs font-medium">{index + 1}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ✅ Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 border-2 border-indigo-300/70 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <motion.div 
              className="w-0.5 h-2 bg-indigo-400 rounded-full mt-1.5"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
