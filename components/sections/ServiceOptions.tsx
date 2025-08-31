"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Phone, Star, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useSectionContent } from "@/stores/content";

// Types for better TypeScript support
interface ServiceCard {
  imageUrl?: string;
  text?: string;
  description?: string;
  contactButton?: string;
}

interface ServiceOptionsData {
  title?: string;
  description?: string;
  cards?: ServiceCard[];
  hidden?: boolean;
}

interface BackgroundElement {
  id: number;
  size: number;
  top: number;
  left: number;
  hue: number;
  delay: number;
}

// Image cache for better performance
const imageCache = new Map<string, Promise<void>>();

const preloadImage = (src: string): Promise<void> => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
};

// Optimized background element creation - reduced from 8 to 4 particles
const createBackgroundElements = (): BackgroundElement[] =>
  Array.from({ length: 4 }, (_, i) => ({
    id: i,
    size: 50 + (i % 3) * 20, // Predictable sizing
    top: 20 + (i * 25), // Even distribution
    left: 15 + (i * 25), // Even distribution
    hue: 220 + (i * 15), // Consistent color progression
    delay: i * 0.4, // Predictable delays
  }));

// Memoized background particle component with GPU acceleration
const BackgroundParticle = ({ element }: { element: BackgroundElement }) => (
  <motion.div
    className="bg-particle absolute rounded-full opacity-15 blur-xl pointer-events-none"
    style={{
      width: element.size,
      height: element.size,
      top: `${element.top}%`,
      left: `${element.left}%`,
      background: `radial-gradient(circle, hsla(${element.hue}, 50%, 65%, 0.3), hsla(${element.hue + 20}, 60%, 70%, 0.15))`,
      willChange: 'transform, opacity',
    }}
    animate={{
      y: [-12, 12],
      x: [-8, 8],
      scale: [1, 1.08],
      opacity: [0.12, 0.25],
    }}
    transition={{
      duration: 10 + (element.id * 2),
      repeat: Infinity,
      repeatType: "reverse",
      delay: element.delay,
      ease: "linear",
    }}
  />
);

// Optimized service card component
const ServiceCard = ({ 
  card, 
  index, 
  cardHeight, 
  onContactClick 
}: { 
  card: ServiceCard; 
  index: number; 
  cardHeight: string;
  onContactClick: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    imageUrl = "",
    text = "",
    description = "",
    contactButton = ""
  } = card;

  // Preload image for better performance
  useEffect(() => {
    if (imageUrl) {
      preloadImage(imageUrl)
        .then(() => setImageLoaded(true))
        .catch(() => setImageError(true));
    }
  }, [imageUrl]);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContactClick();
  }, [onContactClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onContactClick();
    }
  }, [onContactClick]);

  return (
    <motion.div
      className={`service-card group relative bg-card/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-400 overflow-hidden border border-border/50 ${cardHeight}`}
      style={{ willChange: 'transform' }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Service image with optimized loading */}
      {imageUrl && (
        <div className="relative h-40 md:h-44 overflow-hidden rounded-t-xl">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {imageLoaded && !imageError && (
            <motion.img
              src={imageUrl}
              alt={text || `Service ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              style={{ willChange: 'transform' }}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          )}

          {imageError && (
            <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-muted-foreground/50" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-secondary/8 to-transparent" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Quality indicator - simplified with smooth animation */}
          <motion.div 
            className="absolute top-3 left-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Star className="w-2.5 h-2.5 text-accent fill-current" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Card content */}
      <div className="p-5 md:p-6 space-y-4 flex flex-col justify-between flex-grow">
        {/* Service title and description */}
        {text && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Zap className="w-4 h-4 text-primary-foreground" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {text}
              </h3>
            </div>

            {description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Contact button with enhanced animations */}
        {contactButton && (
          <div className="mt-auto pt-4">
            <motion.button
              type="button"
              onClick={handleContactClick}
              onKeyDown={handleKeyDown}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              tabIndex={0}
              aria-label={`Contact us about ${text || "this service"}`}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{contactButton}</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </motion.div>
            </motion.button>
          </div>
        )}
      </div>

      {/* Simplified hover effects with smooth transitions */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 pointer-events-none rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div 
        className="absolute inset-0 rounded-xl border border-transparent pointer-events-none"
        whileHover={{ borderColor: "hsl(var(--primary) / 0.25)" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default function ServiceOptions() {
  const {
    data: serviceOptions,
    loading,
    error,
  } = useSectionContent("serviceOptions");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const router = useRouter();
  const [animationComplete, setAnimationComplete] = useState(false);

  // Memoized background elements
  const backgroundElements = useMemo(createBackgroundElements, []);

  // Optimized navigation handler
  const handleContactClick = useCallback(() => {
    try {
      router.push("/contact");
    } catch {
      // Fallback navigation methods
      try {
        window.location.href = "/contact";
      } catch {
        window.location.replace("/contact");
      }
    }
  }, [router]);

  // Enhanced GSAP animations with better performance
  useEffect(() => {
    if (!isInView || !containerRef.current || loading || animationComplete) return;

    const ctx = gsap.context(() => {
      // Set initial states for better performance
      gsap.set(".service-title", { y: 50, opacity: 0, scale: 0.95 });
      gsap.set(".service-description", { y: 30, opacity: 0 });
      gsap.set(".service-card", { y: 40, opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true)
      });

      // Optimized animation timeline
      tl.to(".service-title", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      })
      .to(".service-description", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      .to(".service-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading, animationComplete]);

  // Preload images when component comes into view
  useEffect(() => {
    if (!isInView || !serviceOptions?.cards) return;

    const imagesToPreload = serviceOptions.cards
      .slice(0, 4) // Only preload first 4 images
      .map((card: ServiceCard) => card.imageUrl)
      .filter(Boolean) as string[];

    imagesToPreload.forEach(imageUrl => {
      preloadImage(imageUrl).catch(() => {
        // Silently handle preload errors
      });
    });
  }, [isInView, serviceOptions?.cards]);

  // Early return conditions
  if (loading || error || !serviceOptions || serviceOptions.hidden) return null;

  const title = serviceOptions.title || "";
  const description = serviceOptions.description || "";
  const cards = serviceOptions.cards || [];

  if (!title && !description && cards.length === 0) return null;

  // Optimized grid configuration function
  const getGridClasses = useCallback((count: number): string => {
    const gridConfigs: Record<number, string> = {
      1: "grid-cols-1 max-w-lg mx-auto",
      2: "grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto",
    };
    
    if (count <= 4) {
      return gridConfigs[count] || gridConfigs[4];
    }
    
    // For 5+ cards, use a responsive grid
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto";
  }, []);

  // Dynamic card height based on count
  const getCardHeight = useCallback((count: number): string => {
    if (count === 1) return "min-h-[400px]";
    if (count <= 3) return "min-h-[350px]";
    if (count <= 6) return "min-h-[320px]";
    return "min-h-[300px]";
  }, []);

  const gridClasses = useMemo(() => getGridClasses(cards.length), [cards.length, getGridClasses]);
  const cardHeight = useMemo(() => getCardHeight(cards.length), [cards.length, getCardHeight]);

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-20 bg-gradient-to-br from-background via-muted/15 to-primary/6 relative overflow-hidden"
    >
      {/* Simplified background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/96 via-muted/8 to-primary/4" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,rgba(39,180,198,0.03),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_75%,rgba(255,20,147,0.02),transparent_60%)]" />
      </div>

      {/* Optimized floating particles with GPU acceleration */}
      <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'contents' }}>
        {backgroundElements.map((element) => (
          <BackgroundParticle key={element.id} element={element} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h2 className="service-title text-2xl md:text-3xl lg:text-4xl font-heading font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}

          {description && (
            <p className="service-description text-base md:text-lg lg:text-xl text-foreground leading-relaxed font-medium max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Service cards */}
        {cards.length > 0 && (
          <div className={`grid gap-6 ${gridClasses}`}>
            {cards.map((card: ServiceCard, index: number) => (
              <ServiceCard
                key={index}
                card={card}
                index={index}
                cardHeight={cardHeight}
                onContactClick={handleContactClick}
              />
            ))}
          </div>
        )}

        {/* CTA section */}
        {cards.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-muted-foreground text-sm font-medium">
              Need a custom solution? Let's discuss your requirements.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
