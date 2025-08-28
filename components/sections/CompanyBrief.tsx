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
      className="min-h-screen bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-slate-50/40 to-blue-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(59,130,246,0.01)_70%)]" />
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
            <h2 className="company-title text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
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
                <p className="text-xl md:text-2xl lg:text-3xl text-slate-700 leading-relaxed font-light">
                  {description}
                </p>
                
                {/* ✅ Decorative line */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <div className="w-4 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
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
                      className="company-tag group relative p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/60 text-center"
                      whileHover={{ 
                        y: -8, 
                        scale: 1.03,
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.1)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      {/* ✅ Content with better hierarchy */}
                      <div className="space-y-3">
                        
                        {/* ✅ Main stat/number */}
                        {text1 && (
                          <div className="relative">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {text1}
                            </div>
                            
                            {/* ✅ Subtle glow effect behind text */}
                            <div className="absolute inset-0 text-2xl md:text-3xl lg:text-4xl font-black text-blue-500/10 blur-sm">
                              {text1}
                            </div>
                          </div>
                        )}
                        
                        {/* ✅ Description/label */}
                        {text2 && (
                          <div className="space-y-2">
                            <p className="text-slate-700 font-semibold text-sm md:text-base group-hover:text-blue-600 transition-colors">
                              {text2}
                            </p>
                            
                            {/* ✅ Animated underline */}
                            <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-300" />
                          </div>
                        )}
                      </div>

                      {/* ✅ Enhanced hover effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                      
                      {/* ✅ Border glow */}
                      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-200/50 transition-colors duration-300" />
                      
                      {/* ✅ Subtle shadow glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10" />
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
