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
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 relative overflow-hidden py-20"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/30 to-indigo-50/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(59,130,246,0.02)_70%)]" />
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

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* ✅ Row 1: Title (Center) */}
        {title && (
          <div className="whyus-title text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
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
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {title2}
              </h3>
            )}
            {description && (
              <div className="space-y-4">
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
                  {description}
                </p>
                
                {/* ✅ Decorative line */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                  <div className="w-6 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                  <div className="w-3 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                </div>
              </div>
            )}
          </div>
          
          {/* Right: Tags Grid (Compact) */}
          <div className="grid grid-cols-2 gap-3">
            {tags.slice(0, 4).map((tag: any, index: number) => (
              <motion.div
                key={index}
                className="whyus-tag group p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/60 text-center"
                whileHover={{ 
                  y: -6, 
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="space-y-2">
                  {/* Main stat/number */}
                  {tag.text1 && (
                    <div className="relative">
                      <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {tag.text1}
                      </div>
                      <div className="absolute inset-0 text-2xl md:text-3xl font-black text-blue-500/10 blur-sm">
                        {tag.text1}
                      </div>
                    </div>
                  )}
                  
                  {/* Description/label */}
                  {tag.text2 && (
                    <div>
                      <p className="text-slate-700 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                        {tag.text2}
                      </p>
                      <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto opacity-0 group-hover:opacity-100 group-hover:w-10 transition-all duration-300" />
                    </div>
                  )}
                </div>

                {/* Enhanced hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-200/50 transition-colors duration-300" />
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
                    className="whyus-text-item group flex items-center space-x-4 p-3 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/70 transition-all duration-300"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-base md:text-lg group-hover:text-slate-900 transition-colors">
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
                    className="whyus-tag group p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/60 flex items-center space-x-4"
                    whileHover={{ 
                      y: -6, 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
                    }}
                  >
                    <div className="text-center">
                      {tag.text1 && (
                        <div className="text-2xl font-black text-blue-600 mb-1">
                          {tag.text1}
                        </div>
                      )}
                      {tag.text2 && (
                        <div className="text-slate-700 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                          {tag.text2}
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced hover effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right: Spacer or additional visual element */}
          <div className="lg:order-1 flex items-center justify-center">
            <motion.div 
              className="w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full backdrop-blur-sm border border-white/40 flex items-center justify-center"
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
