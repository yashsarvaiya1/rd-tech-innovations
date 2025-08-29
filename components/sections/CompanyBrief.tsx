'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function CompanyBrief() {
  const { data: companyBrief, loading, error } = useSectionContent('companyBrief');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles
  const backgroundElements = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 60,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 210 + (Math.random() * 50),
      delay: Math.random() * 3
    })), []
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.company-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.company-description-left', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.8"
      )
      .fromTo('.company-tags-right', 
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.8"
      )
      .fromTo('.company-tag', 
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)" }, 
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !companyBrief || companyBrief.hidden) return null;

  const title = companyBrief.title || '';
  const description = companyBrief.description || '';
  const tags = companyBrief.tags || [];

  if (!title && !description && tags.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 relative overflow-hidden flex items-center"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-muted/20 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(39,180,198,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,20,147,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(39,180,198,0.01)_70%)]" />
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
              y: [-20, 20, -20],
              x: [-15, 15, -15],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 18 + Math.random() * 8,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ✅ Title in Center */}
        {title && (
          <div className="text-center mb-16">
            <h2 className="company-title text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          </div>
        )}

        {/* ✅ Split Layout: Left Description + Right Tags */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* ✅ Left Side: Description */}
          <div className="company-description-left">
            {description && (
              <div className="space-y-8">
                <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed font-sans font-medium">
                  {description}
                </p>
                
                {/* ✅ Decorative line */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/70 rounded-full" />
                  <div className="w-8 h-1 bg-gradient-to-r from-primary/70 to-accent/70 rounded-full" />
                  <div className="w-4 h-1 bg-gradient-to-r from-accent/70 to-accent rounded-full" />
                </div>
              </div>
            )}
          </div>

          {/* ✅ Right Side: Tag Cards in 2-Column Grid */}
          <div className="company-tags-right">
            {tags.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {tags.map((tag: any, index: number) => {
                  const text1 = tag.text1 || '';
                  const text2 = tag.text2 || '';

                  return (
                    <motion.div
                      key={index}
                      className="company-tag group relative p-4 md:p-5 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-border/60 text-center"
                      whileHover={{ 
                        y: -8, 
                        scale: 1.03,
                        boxShadow: "0 25px 50px rgba(39, 180, 198, 0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* ✅ Content with better hierarchy */}
                      <div className="space-y-3">
                        
                        {/* ✅ Main stat/number */}
                        {text1 && (
                          <div className="relative">
                            <div className="text-xl md:text-2xl lg:text-3xl font-heading font-black bg-gradient-to-r from-primary via-primary/80 to-accent/60 bg-clip-text text-transparent">
                              {text1}
                            </div>
                            
                            {/* ✅ Subtle glow effect behind text */}
                            <div className="absolute inset-0 text-xl md:text-2xl lg:text-3xl font-heading font-black text-primary/10 blur-sm">
                              {text1}
                            </div>
                          </div>
                        )}
                        
                        {/* ✅ Description/label */}
                        {text2 && (
                          <div className="space-y-2">
                            <p className="text-muted-foreground font-sans font-semibold text-xs md:text-sm group-hover:text-primary transition-colors">
                              {text2}
                            </p>
                            
                            {/* ✅ Animated underline */}
                            <div className="w-6 h-0.5 bg-gradient-to-r from-primary to-primary/70 mx-auto opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />
                          </div>
                        )}
                      </div>

                      {/* ✅ Enhanced hover effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                      
                      {/* ✅ Border glow */}
                      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 transition-colors duration-300" />
                      
                      {/* ✅ Subtle shadow glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
