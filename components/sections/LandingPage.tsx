'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';

export default function LandingPage() {
  const { landingPage, loading, error } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  // Generate few scattered background chips
  const backgroundChips = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 40 + (i * 15),
      top: [10, 20, 80, 75, 15, 85][i], // Avoid center area
      left: [15, 85, 10, 90, 75, 25][i], // Scatter around edges
      hue: (i * 60) % 360,
      delay: Math.random() * 3
    })), []
  );

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.hero-title', { 
          y: 50, 
          opacity: 0, 
          duration: 1.2, 
          ease: "power3.out" 
        })
        .from('.hero-description', { 
          y: 30, 
          opacity: 0, 
          duration: 1, 
          ease: "power2.out" 
        }, "-=0.6")
        .from('.hero-images .image-item', { 
          y: 40, 
          opacity: 0, 
          scale: 0.95, 
          duration: 0.8, 
          stagger: 0.1, 
          ease: "power2.out" 
        }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (loading || error || !landingPage || landingPage.hidden) return null;

  const title = landingPage.title || '';
  const description = landingPage.description || '';
  const imageUrls = landingPage.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  // Dynamic font size based on description length
  const getDescriptionFontSize = (text: string) => {
    if (text.length > 300) return 'text-base md:text-lg';
    if (text.length > 150) return 'text-lg md:text-xl';
    return 'text-xl md:text-2xl';
  };

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden"
    >
      {/* Full Screen Glass Background */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-sm" />

      {/* Scattered Background Chips - Few and Blurred */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundChips.map((chip) => (
          <motion.div
            key={chip.id}
            className="absolute rounded-full opacity-20 blur-2xl"
            style={{
              width: chip.size,
              height: chip.size,
              top: `${chip.top}%`,
              left: `${chip.left}%`,
              background: `hsl(${chip.hue}, 65%, 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: chip.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content - Centered, No Padding on Section */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
        
        {/* Title */}
        {title && (
          <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-6xl">
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
        )}

        {/* Dynamic Description */}
        {description && (
          <div className="hero-description mb-10 max-w-4xl">
            <p className={`${getDescriptionFontSize(description)} text-gray-700 leading-relaxed max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100`}>
              {description}
            </p>
          </div>
        )}

        {/* Images - Clean Grid */}
        {imageUrls.length > 0 && (
          <div className="hero-images max-w-5xl w-full">
            <div className={`grid gap-6 ${
              imageUrls.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              imageUrls.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' :
              imageUrls.length === 3 ? 'grid-cols-3 max-w-4xl mx-auto' :
              imageUrls.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
              'grid-cols-3 md:grid-cols-5'
            }`}>
              {imageUrls.slice(0, 6).map((imageUrl: string, index: number) => (
                <motion.div
                  key={index}
                  className="image-item group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <img
                    src={imageUrl}
                    alt={`${title} ${index + 1}`}
                    className={`w-full object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                      imageUrls.length === 1 ? 'h-64' :
                      imageUrls.length === 2 ? 'h-48' :
                      imageUrls.length <= 4 ? 'h-42' :
                      'h-38'
                    }`}
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
