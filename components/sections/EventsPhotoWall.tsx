'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function EventsPhotoWall() {
  const { data: eventsPhotoWall, loading, error } = useSectionContent('eventsPhotoWall');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.events-title', 
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo('.events-description', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.7"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !eventsPhotoWall || eventsPhotoWall.hidden) return null;

  const title = eventsPhotoWall.title || '';
  const description = eventsPhotoWall.description || '';
  const imageUrls = eventsPhotoWall.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  // ✅ Create continuous masonry columns
  const createContinuousMasonry = (images: string[]) => {
    if (images.length === 0) return [];
    
    // Create enough duplicates for seamless loop
    const totalImages = [];
    while (totalImages.length < 200) { // More images for seamless loop
      totalImages.push(...images);
    }

    return totalImages.map((img, index) => ({
      url: img,
      id: `masonry-${index}`,
      height: 180 + (index % 4) * 60 // Consistent pattern: 180, 240, 300, 360
    }));
  };

  const masonryImages = createContinuousMasonry(imageUrls);

  return (
    <section 
      ref={containerRef}
      className="h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden flex flex-col"
      style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
    >
      {/* ✅ Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-indigo-900/70 to-purple-900/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(139,69,199,0.12),transparent_50%)]" />
      </div>

      {/* ✅ Header section - compact */}
      <div className="relative z-20 text-center py-8 px-6 bg-gradient-to-b from-slate-900/80 to-transparent">
        {title && (
          <h2 className="events-title text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        )}
        
        {description && (
          <p className="events-description text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* ✅ Full Screen Masonry Gallery - Continuous Loop */}
      {imageUrls.length > 0 && (
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex">
            {/* Create multiple sets for seamless infinite scroll */}
            {Array.from({ length: 3 }, (_, setIndex) => (
              <motion.div
                key={setIndex}
                className="flex gap-3 min-w-full"
                animate={{
                  x: [0, -100 * 16] // Move exactly one full set width
                }}
                transition={{
                  duration: 60, // Smooth 60 second cycle
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  animationDelay: `${setIndex * 20}s` // Stagger the sets
                }}
              >
                {/* 16 columns for full screen coverage */}
                {Array.from({ length: 16 }, (_, columnIndex) => (
                  <div key={columnIndex} className="flex flex-col gap-3 w-60 flex-shrink-0">
                    {masonryImages
                      .filter((_, imgIndex) => imgIndex % 16 === columnIndex)
                      .slice(0, 8) // Limit images per column for performance
                      .map((image, index) => (
                        <motion.div
                          key={`${setIndex}-${image.id}-${index}`}
                          className="relative group cursor-pointer overflow-hidden rounded-lg shadow-2xl flex-shrink-0"
                          style={{
                            height: `${image.height}px`,
                            width: '240px'
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            zIndex: 50
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <img
                            src={image.url}
                            alt={`Event moment ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            style={{
                              filter: 'brightness(0.9) contrast(1.1) saturate(1.1)'
                            }}
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
                          
                          {/* Hover glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                      ))}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* ✅ Fade edges for seamless effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 via-indigo-900/80 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 via-indigo-900/80 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-slate-900/50 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none z-10" />
        </div>
      )}

      {/* ✅ Enhanced empty state */}
      {imageUrls.length === 0 && (title || description) && (
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full shadow-lg" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Photo Wall Coming Soon</h3>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
              Amazing event photos will flow here once they're added to the gallery.
            </p>
          </motion.div>
        </div>
      )}
    </section>
  );
}
