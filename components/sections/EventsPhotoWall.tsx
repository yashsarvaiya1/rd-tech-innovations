"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { useSectionContent } from "@/stores/content";

export default function EventsPhotoWall() {
  const {
    data: eventsPhotoWall,
    loading,
    error,
  } = useSectionContent("eventsPhotoWall");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  // Mobile detection for responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".events-title",
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      ).fromTo(
        ".events-description",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.7",
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !eventsPhotoWall || eventsPhotoWall.hidden)
    return null;

  const title = eventsPhotoWall.title || "";
  const description = eventsPhotoWall.description || "";
  const imageUrls = eventsPhotoWall.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  // ✅ Dynamic column calculation based on screen size
  const getColumnCount = () => {
    if (screenWidth < 640) return 2;      // mobile: 2 columns
    if (screenWidth < 768) return 3;      // sm: 3 columns  
    if (screenWidth < 1024) return 4;     // md: 4 columns
    if (screenWidth < 1280) return 5;     // lg: 5 columns
    if (screenWidth < 1536) return 6;     // xl: 6 columns
    return 8;                             // 2xl+: 8 columns
  };

  const columnCount = getColumnCount();
  const columnWidth = screenWidth > 0 ? Math.floor((screenWidth - 80) / columnCount) : 280;

  // ✅ Responsive marquee creation
  interface MarqueeImage {
    url: string;
    id: string;
    aspectRatio: number;
  }

  const createResponsiveMarquee = (images: string[]) => {
    if (images.length === 0) return [];

    // Create enough images for smooth infinite scroll
    const extendedImages: string[] = [];
    const targetLength = Math.max(40, columnCount * 8);
    while (extendedImages.length < targetLength) {
      extendedImages.push(...images);
    }

    // Organize into columns with varied aspect ratios
    const columnArrays: MarqueeImage[][] = Array.from(
      { length: columnCount },
      () => [],
    );

    extendedImages.forEach((img, index) => {
      const columnIndex = index % columnCount;
      
      // Varied aspect ratios for natural look
      const aspectRatios = [0.8, 1.0, 1.2, 0.9, 1.1, 0.7];
      const aspectRatio = aspectRatios[index % aspectRatios.length];
      
      columnArrays[columnIndex].push({
        url: img,
        id: `img-${index}`,
        aspectRatio,
      });
    });

    return columnArrays;
  };

  const marqueeColumns = createResponsiveMarquee(imageUrls);

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
      <div className="relative z-20 text-center py-8 sm:py-12 px-4 sm:px-6">
        {title && (
          <h2 className="events-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        )}

        {description && (
          <p className="events-description text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* ✅ RESPONSIVE Infinite Marquee Gallery */}
      {imageUrls.length > 0 && (
        <div className="relative flex-1 overflow-hidden px-4 sm:px-6">
          <div 
            className="flex gap-2 sm:gap-4"
            style={{ 
              height: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 200px)',
            }}
          >
            {marqueeColumns.map((column, columnIndex) => (
              <motion.div
                key={columnIndex}
                className="flex flex-col gap-2 sm:gap-4 min-h-full"
                style={{ width: `${columnWidth}px` }}
                animate={{
                  y: columnIndex % 2 === 0 ? [-2000, 0] : [0, -2000],
                }}
                transition={{
                  duration: 30 + columnIndex * 3, // Faster on mobile
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Duplicate for seamless loop */}
                {Array.from({ length: 2 }).map((_, setIndex) => (
                  <div key={setIndex} className="flex flex-col gap-2 sm:gap-4">
                    {column.slice(0, isMobile ? 8 : 12).map((image, imageIndex) => {
                      const imageHeight = Math.floor(columnWidth / image.aspectRatio);
                      
                      return (
                        <motion.div
                          key={`${setIndex}-${image.id}-${imageIndex}`}
                          className="relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/20 bg-card flex-shrink-0"
                          style={{
                            height: `${imageHeight}px`,
                            width: `${columnWidth}px`,
                          }}
                          whileHover={{
                            scale: isMobile ? 1.02 : 1.03,
                            zIndex: 10,
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`Event moment ${imageIndex + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              // Hide broken images
                              e.currentTarget.style.display = 'none';
                            }}
                          />

                          {/* Clean overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" />

                          {/* Subtle hover glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>

          {/* ✅ Responsive fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-10" />
        </div>
      )}

      {/* ✅ Responsive empty state */}
      {imageUrls.length === 0 && (title || description) && (
        <div className="flex-1 flex items-center justify-center py-16 sm:py-32 px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-muted/50 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg backdrop-blur-sm border border-border/30">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-accent/80 rounded-full shadow-lg" />
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-3 sm:mb-4">
              Photo Wall Coming Soon
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-sans">
              Amazing event photos will flow here once they're added to the
              gallery.
            </p>
          </motion.div>
        </div>
      )}
    </section>
  );
}
