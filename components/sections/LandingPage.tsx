'use client';
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { Rocket, Sparkles, Code2, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { data: landingPage, loading, error } = useSectionContent('landingPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Background particles
  const backgroundParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 20,
        top: Math.random() * 100,
        left: Math.random() * 100,
        hue: 200 + Math.random() * 100,
        delay: Math.random() * 3,
        duration: 10 + Math.random() * 6,
      })),
    []
  );

  // ✅ GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        '.hero-title',
        { y: 80, opacity: 0, scale: 0.95, rotationX: 30 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: 'power3.out' }
      )
        .fromTo(
          '.hero-description',
          { y: 40, opacity: 0, blur: 8 },
          { y: 0, opacity: 1, blur: 0, duration: 1, ease: 'power2.out' },
          '-=0.7'
        )
        .fromTo(
          '.image-item',
          { y: 60, opacity: 0, scale: 0.9, rotationY: 10 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: { amount: 0.5, from: 'center', ease: 'power2.out' },
          },
          '-=0.5'
        )
        .fromTo(
          '.background-particle',
          { opacity: 0, scale: 0, rotation: -90 },
          {
            opacity: 0.35,
            scale: 1,
            rotation: 0,
            stagger: 0.08,
            duration: 1.5,
            ease: 'elastic.out(1, 0.6)',
          },
          '-=1'
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  if (loading || error || !landingPage || landingPage.hidden) return null;

  const title = landingPage.title || '';
  const description = landingPage.description || '';
  const imageUrls = landingPage.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  // ✅ Balanced font sizing - smaller and more professional
  const getTitleFontSize = (text: string) => {
    if (text.length > 100) return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
    if (text.length > 50) return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
    return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl';
  };

  const getDescriptionFontSize = (text: string) => {
    if (text.length > 300) return 'text-sm sm:text-base md:text-lg';
    if (text.length > 150) return 'text-base sm:text-lg md:text-xl';
    return 'text-lg sm:text-xl md:text-2xl';
  };

  // ✅ Grid layouts
  const getImageGridClasses = (count: number) => {
    const gridClasses = {
      1: 'grid-cols-1 max-w-xl',
      2: 'grid-cols-1 sm:grid-cols-2 max-w-3xl gap-6',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl gap-5',
      4: 'grid-cols-2 lg:grid-cols-4 max-w-5xl gap-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl gap-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-6xl gap-3',
      7: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-7 max-w-7xl gap-3',
      8: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 max-w-7xl gap-3',
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
      className="
        relative snap-start min-h-screen w-full 
        bg-gradient-to-br from-background via-muted/30 to-primary/15
        overflow-hidden flex items-center justify-center pt-[4.5rem]
      "
    >
      {/* ✅ Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/8 via-background/90 to-accent/8 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(39,180,198,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,20,147,0.06),transparent_50%)]" />
      </div>

      {/* ✅ Floating particles */}
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
              background: `radial-gradient(circle, hsla(${particle.hue}, 60%, 70%, 0.4), hsla(${particle.hue + 30}, 70%, 75%, 0.2))`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              scale: [1, 1.08, 1],
              opacity: [0.15, 0.3, 0.15],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* ✅ Floating static icons */}
        <motion.div className="absolute top-20 left-12 text-primary/60" animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 7 }}>
          <Rocket size={42} />
        </motion.div>
        <motion.div className="absolute bottom-28 right-16 text-accent/60" animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 9 }}>
          <Sparkles size={38} />
        </motion.div>
        <motion.div className="absolute top-1/3 right-1/4 text-primary/50" animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
          <Code2 size={40} />
        </motion.div>
        <motion.div className="absolute bottom-16 left-1/3 text-accent/50" animate={{ y: [0, 25, 0] }} transition={{ repeat: Infinity, duration: 10 }}>
          <Star size={36} />
        </motion.div>
      </div>

      {/* ✅ Main content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-24 gap-8">
        {title && (
          <motion.h1
            ref={titleRef}
            className={`hero-title ${getTitleFontSize(title)} font-heading font-extrabold leading-tight tracking-tight max-w-6xl`}
          >
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>
        )}

        {description && (
          <motion.div ref={descRef} className="hero-description max-w-3xl">
            <p
              className={`${getDescriptionFontSize(
                description
              )} text-foreground leading-relaxed font-sans font-medium`}
            >
              {description}
            </p>
          </motion.div>
        )}

        {imageUrls.length > 0 && (
          <motion.div ref={imagesRef} className="hero-images w-full">
            <div className={`grid ${getImageGridClasses(imageUrls.length)} mx-auto`}>
              {imageUrls.map((imageUrl: string, index: number) => (
                <motion.div
                  key={index}
                  className="image-item group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-400 border border-border/50"
                  whileHover={{ scale: 1.03, z: 10 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <img
                    src={imageUrl}
                    alt={`${title} showcase ${index + 1}`}
                    className={`w-full object-cover ${getImageHeight(
                      imageUrls.length
                    )} transition-all duration-500 group-hover:scale-105`}
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-background/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-5 h-8 border-2 border-primary/70 rounded-full flex justify-center backdrop-blur-sm bg-background/20">
            <motion.div
              className="w-0.5 h-2 bg-primary rounded-full mt-1.5"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
