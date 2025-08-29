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

  // ✅ Optimized marquee columns - NO CHAOS
  interface MarqueeImage {
    url: string;
    id: string;
    height: number;
  }

  const createOptimizedMarquee = (images: string[], columns: number = 6) => {
    if (images.length === 0) return [];
    
    // Create enough images for smooth infinite scroll
    const extendedImages: string[] = [];
    while (extendedImages.length < 60) { // Optimized count
      extendedImages.push(...images);
    }

    // Organize into columns with varied heights
    const columnArrays: MarqueeImage[][] = Array.from({ length: columns }, () => []);
    
    extendedImages.forEach((img, index) => {
      const columnIndex = index % columns;
      columnArrays[columnIndex].push({
        url: img,
        id: `img-${index}`,
        height: 200 + (index % 3) * 80, // Heights: 200, 280, 360
      });
    });

    return columnArrays;
  };

  const marqueeColumns = createOptimizedMarquee(imageUrls, 6);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden"
    >
      {/* ✅ Clean background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(39,180,198,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,20,147,0.03),transparent_60%)]" />
      </div>

      {/* ✅ Header section */}
      <div className="relative z-20 text-center py-12 px-6">
        {title && (
          <h2 className="events-title text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        )}
        
        {description && (
          <p className="events-description text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* ✅ OPTIMIZED Infinite Marquee Gallery */}
      {imageUrls.length > 0 && (
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-4 h-[calc(100vh-200px)]">
            {marqueeColumns.map((column, columnIndex) => (
              <motion.div
                key={columnIndex}
                className="flex flex-col gap-4 min-h-full"
                style={{ width: '240px' }}
                animate={{
                  y: columnIndex % 2 === 0 ? [-2000, 0] : [0, -2000]
                }}
                transition={{
                  duration: 40 + columnIndex * 5, // Varied speeds
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Duplicate for seamless loop */}
                {Array.from({ length: 2 }).map((_, setIndex) => (
                  <div key={setIndex} className="flex flex-col gap-4">
                    {column.slice(0, 10).map((image, imageIndex) => ( // Limit per column
                      <motion.div
                        key={`${setIndex}-${image.id}-${imageIndex}`}
                        className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/20 bg-card flex-shrink-0"
                        style={{
                          height: `${image.height}px`,
                          width: '240px'
                        }}
                        whileHover={{ 
                          scale: 1.03,
                          zIndex: 10
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <img
                          src={image.url}
                          alt={`Event moment ${imageIndex + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Clean overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" />
                        
                        {/* Subtle hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* ✅ Clean fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-10" />
        </div>
      )}

      {/* ✅ Clean empty state */}
      {imageUrls.length === 0 && (title || description) && (
        <div className="flex-1 flex items-center justify-center py-32">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-muted/50 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-border/30">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent/80 rounded-full shadow-lg" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">Photo Wall Coming Soon</h3>
            <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed font-sans">
              Amazing event photos will flow here once they're added to the gallery.
            </p>
          </motion.div>
        </div>
      )}
    </section>
  );
}
