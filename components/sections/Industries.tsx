'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function Industries() {
  const { data: industries, loading, error } = useSectionContent('industries');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Theme-consistent background particles
  const backgroundElements = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 120 + 80,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 200 + (Math.random() * 60),
      delay: Math.random() * 3
    })), []
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.industry-content-left', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.industry-content-right', 
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.8"
      )
      .fromTo('.industry-item', 
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)" }, 
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !industries || industries.hidden) return null;

  const title = industries.title || '';
  const description = industries.description || '';
  const industriesList = industries.industries || [];

  if (!title && !description && industriesList.length === 0) return null;

  // ✅ Dynamic scattered positioning for 1-15 industries with wider spans
  const getScatteredLayout = (count: number) => {
    if (count === 0) return [];
    
    // Predefined scattered positions for up to 15 industries with column spans
    const positions = [
      // 1 industry
      [{ row: 2, col: 2, span: 2 }],
      
      // 2 industries
      [{ row: 1, col: 1, span: 2 }, { row: 3, col: 4, span: 2 }],
      
      // 3 industries
      [{ row: 1, col: 1, span: 2 }, { row: 2, col: 4, span: 2 }, { row: 4, col: 2, span: 2 }],
      
      // 4 industries
      [{ row: 1, col: 1, span: 2 }, { row: 1, col: 4, span: 2 }, { row: 3, col: 1, span: 2 }, { row: 3, col: 4, span: 2 }],
      
      // 5 industries
      [{ row: 1, col: 1, span: 2 }, { row: 1, col: 4, span: 2 }, { row: 2, col: 2, span: 2 }, { row: 3, col: 1, span: 2 }, { row: 3, col: 4, span: 2 }],
      
      // 6 industries
      [{ row: 1, col: 1, span: 2 }, { row: 1, col: 3, span: 2 }, { row: 1, col: 5, span: 1 }, { row: 3, col: 1, span: 2 }, { row: 3, col: 3, span: 2 }, { row: 3, col: 5, span: 1 }],
      
      // 7 industries
      [{ row: 1, col: 1, span: 2 }, { row: 1, col: 3, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 2, span: 2 }, { row: 3, col: 1, span: 2 }, { row: 3, col: 3, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 8 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 4, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 9 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 3, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 2, span: 2 }, { row: 2, col: 4, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 3, span: 1 }, { row: 3, col: 5, span: 1 }, { row: 4, col: 2, span: 2 }],
      
      // 10 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 4, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 2, span: 1 }, { row: 2, col: 4, span: 2 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 11 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 4, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 1, span: 2 }, { row: 2, col: 3, span: 1 }, { row: 2, col: 5, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 12 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 3, span: 1 }, { row: 1, col: 4, span: 1 }, { row: 2, col: 1, span: 2 }, { row: 2, col: 2, span: 1 }, { row: 2, col: 4, span: 1 }, { row: 2, col: 5, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 13 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 3, span: 1 }, { row: 1, col: 4, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 1, span: 2 }, { row: 2, col: 3, span: 1 }, { row: 2, col: 5, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 3, span: 1 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 14 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 3, span: 1 }, { row: 1, col: 4, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 1, span: 2 }, { row: 2, col: 2, span: 1 }, { row: 2, col: 4, span: 1 }, { row: 2, col: 5, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 3, span: 1 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }],
      
      // 15 industries
      [{ row: 1, col: 1, span: 1 }, { row: 1, col: 2, span: 2 }, { row: 1, col: 3, span: 1 }, { row: 1, col: 4, span: 1 }, { row: 1, col: 5, span: 1 }, { row: 2, col: 1, span: 1 }, { row: 2, col: 2, span: 2 }, { row: 2, col: 3, span: 1 }, { row: 2, col: 4, span: 1 }, { row: 2, col: 5, span: 1 }, { row: 3, col: 1, span: 1 }, { row: 3, col: 2, span: 2 }, { row: 3, col: 3, span: 1 }, { row: 3, col: 4, span: 1 }, { row: 3, col: 5, span: 1 }]
    ];
    
    return positions[Math.min(count - 1, 14)] || positions[14];
  };

  const scatteredPositions = getScatteredLayout(industriesList.length);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Theme background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(39,180,198,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,20,147,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(39,180,198,0.02),rgba(255,20,147,0.02),rgba(39,180,198,0.02))]" />
      </div>

      {/* ✅ Theme floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-2xl opacity-15"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 50%, 65%, 0.4), transparent 70%)`
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-15, 15, -15],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 16 + Math.random() * 8,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ✅ Split Layout: Left Content + Right Industries */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ✅ Left Side: Title and Description with theme colors */}
          <div className="industry-content-left space-y-8">
            {title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {title}
                </span>
              </h2>
            )}
            
            {description && (
              <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed font-sans font-medium">
                {description}
              </p>
            )}
          </div>

          {/* ✅ Right Side: Scattered Industries Layout with theme styling */}
          <div className="industry-content-right">
            {industriesList.length > 0 && (
              <div className="relative w-full h-80">
                <div className="grid grid-cols-6 grid-rows-4 gap-2 h-full w-full">
                  {industriesList.map((industry: any, index: number) => {
                    const name = industry.name || '';
                    const iconUrl = industry.iconUrl || '';
                    const position = scatteredPositions[index];
                    
                    if (!position) return null;

                    return (
                      <motion.div
                        key={index}
                        className="industry-item group flex items-center space-x-2 px-3 py-2 bg-card/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-border/60"
                        style={{
                          gridColumn: `${position.col} / span ${position.span}`,
                          gridRow: position.row,
                          height: '40px'
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        {/* ✅ Small Logo/Icon with theme colors */}
                        <div className="flex-shrink-0">
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={name}
                              className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-primary-foreground font-heading font-bold text-xs">
                                {name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ✅ Industry Name with theme colors */}
                        {name && (
                          <span className="text-xs font-heading font-semibold text-foreground group-hover:text-primary transition-colors leading-tight whitespace-nowrap overflow-hidden">
                            {name}
                          </span>
                        )}

                        {/* ✅ Theme hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
