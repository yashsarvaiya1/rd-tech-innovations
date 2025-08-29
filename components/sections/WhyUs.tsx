'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function WhyUs() {
  const { data: whyUs, loading, error } = useSectionContent('whyUs');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles
  const backgroundElements = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 120 + 80,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 190 + (Math.random() * 70),
      delay: Math.random() * 3
    })), []
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.whyus-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.whyus-row', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }, 
        "-=0.8"
      )
      .fromTo('.whyus-tag', 
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.05, ease: "back.out(1.4)" }, 
        "-=0.6"
      )
      .fromTo('.whyus-text-item', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !whyUs || whyUs.hidden) return null;

  const title = whyUs.title || '';
  const title2 = whyUs.title2 || '';
  const description = whyUs.description || '';
  const tags = whyUs.tags || [];
  const text = whyUs.text || [];

  if (!title && !title2 && !description && tags.length === 0 && text.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 relative overflow-hidden"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-muted/20 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(39,180,198,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,20,147,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(39,180,198,0.02)_70%)]" />
      </div>

      {/* ✅ Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-2xl opacity-20"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 50%, 70%, 0.3), transparent 70%)`
            }}
            animate={{
              y: [-25, 25, -25],
              x: [-20, 20, -20],
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-16 py-20">
        
        {/* ✅ Row 1: Title (Center) */}
        {title && (
          <div className="whyus-title text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          </div>
        )}

        {/* ✅ Row 2: Content Left + Tags Right */}
        <div className="whyus-row grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Content */}
          <div className="space-y-6">
            {title2 && (
              <h3 className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-foreground leading-tight">
                {title2}
              </h3>
            )}
            {description && (
              <div className="space-y-4">
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-sans font-medium">
                  {description}
                </p>
                
                {/* ✅ Decorative line */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary/70 rounded-full" />
                  <div className="w-6 h-1 bg-gradient-to-r from-primary/70 to-accent/70 rounded-full" />
                  <div className="w-3 h-1 bg-gradient-to-r from-accent/70 to-accent rounded-full" />
                </div>
              </div>
            )}
          </div>
          
          {/* Right: Tags Grid (Compact) */}
          <div className="grid grid-cols-2 gap-3">
            {tags.slice(0, 4).map((tag: any, index: number) => (
              <motion.div
                key={index}
                className="whyus-tag group p-4 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-border/60 text-center"
                whileHover={{ 
                  y: -6, 
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(39, 180, 198, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="space-y-2">
                  {/* Main stat/number */}
                  {tag.text1 && (
                    <div className="relative">
                      <div className="text-xl md:text-2xl font-heading font-black bg-gradient-to-r from-primary via-primary/80 to-accent/60 bg-clip-text text-transparent">
                        {tag.text1}
                      </div>
                      <div className="absolute inset-0 text-xl md:text-2xl font-heading font-black text-primary/10 blur-sm">
                        {tag.text1}
                      </div>
                    </div>
                  )}
                  
                  {/* Description/label */}
                  {tag.text2 && (
                    <div>
                      <p className="text-muted-foreground font-sans font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                        {tag.text2}
                      </p>
                      <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-primary/70 mx-auto opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-300" />
                    </div>
                  )}
                </div>

                {/* Enhanced hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ✅ Row 3: Right Top (Text Points) + Right Bottom (Extra Tags) */}
        <div className="whyus-row grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left: Empty space or additional content */}
          <div className="lg:order-2">
            {/* Right Top: Text Points */}
            {text.length > 0 && (
              <div className="space-y-3 mb-8">
                {text.map((textItem: string, index: number) => (
                  <motion.div
                    key={index}
                    className="whyus-text-item group flex items-center space-x-4 p-3 bg-card/50 backdrop-blur-sm rounded-xl hover:bg-card/70 transition-all duration-300 border border-border/30"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-heading font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-sans group-hover:text-foreground transition-colors">
                      {textItem}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Right Bottom: Extra Tags (if more than 4) */}
            {tags.length > 4 && (
              <div className="grid grid-cols-1 gap-4">
                {tags.slice(4).map((tag: any, index: number) => (
                  <motion.div
                    key={index + 4}
                    className="whyus-tag group p-5 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-border/60 flex items-center space-x-4"
                    whileHover={{ 
                      y: -6, 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(39, 180, 198, 0.15)"
                    }}
                  >
                    <div className="text-center">
                      {tag.text1 && (
                        <div className="text-lg md:text-xl font-heading font-black text-primary mb-1">
                          {tag.text1}
                        </div>
                      )}
                      {tag.text2 && (
                        <div className="text-muted-foreground font-sans font-semibold text-sm group-hover:text-primary transition-colors">
                          {tag.text2}
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced hover effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Spacer or additional visual element */}
          <div className="lg:order-1 flex items-center justify-center">
            <motion.div 
              className="w-32 h-32 bg-gradient-to-br from-muted/50 to-primary/20 rounded-full backdrop-blur-sm border border-border/40 flex items-center justify-center"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
