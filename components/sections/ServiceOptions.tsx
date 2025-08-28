'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { ArrowRight, Phone, Zap, Star } from 'lucide-react';

export default function ServiceOptions() {
  const { data: serviceOptions, loading, error } = useSectionContent('serviceOptions');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles
  const backgroundElements = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 40,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 220 + (Math.random() * 60), // Blue to purple spectrum
      delay: Math.random() * 2
    })), []
  );

  // ✅ Enhanced GSAP timeline animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Staggered entrance with better easing
      tl.fromTo('.service-title', 
        { 
          y: 80, 
          opacity: 0,
          scale: 0.9,
          rotationX: 15
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.2, 
          ease: "power3.out" 
        }
      )
      .fromTo('.service-description', 
        { 
          y: 50, 
          opacity: 0,
          blur: 5
        },
        { 
          y: 0, 
          opacity: 1,
          blur: 0,
          duration: 1, 
          ease: "power2.out" 
        }, "-=0.6"
      )
      .fromTo('.service-card', 
        { 
          y: 60, 
          opacity: 0, 
          scale: 0.85,
          rotationY: 10
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotationY: 0,
          duration: 0.8, 
          stagger: {
            amount: 0.6,
            from: "start",
            ease: "power2.out"
          }
        }, "-=0.4"
      )
      .fromTo('.bg-particle',
        {
          opacity: 0,
          scale: 0,
          rotation: -90
        },
        {
          opacity: 0.4,
          scale: 1,
          rotation: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }, "-=1"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !serviceOptions || serviceOptions.hidden) return null;

  const title = serviceOptions.title || '';
  const description = serviceOptions.description || '';
  const cards = serviceOptions.cards || [];

  if (!title && !description && cards.length === 0) return null;

  // ✅ Enhanced dynamic grid system with better responsiveness
  const getGridClasses = (count: number) => {
    const gridConfigs = {
      1: 'grid-cols-1 max-w-lg mx-auto',
      2: 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto gap-8',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto gap-6',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto gap-6',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-7xl mx-auto gap-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto gap-4',
      7: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-7 max-w-7xl mx-auto gap-4',
      8: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 max-w-7xl mx-auto gap-3'
    };
    return gridConfigs[Math.min(count, 8) as keyof typeof gridConfigs] || gridConfigs[8];
  };

  // ✅ Smart card height based on count
  const getCardHeight = (count: number) => {
    if (count === 1) return 'min-h-[400px]';
    if (count <= 3) return 'min-h-[350px]';
    if (count <= 6) return 'min-h-[300px]';
    return 'min-h-[280px]';
  };

  return (
    <section 
      ref={containerRef}
      className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* ✅ Enhanced dynamic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/30 to-indigo-100/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.04),transparent_50%)]" />
      </div>

      {/* ✅ Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="bg-particle absolute rounded-full opacity-20 blur-xl"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 70%, 0.4), hsla(${element.hue + 30}, 70%, 75%, 0.2))`
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.35, 0.2]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ✅ Enhanced header section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h2 
              ref={titleRef}
              className="service-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.1)' }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}
          
          {description && (
            <p 
              ref={descRef}
              className="service-description text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed font-medium max-w-3xl mx-auto"
            >
              {description}
            </p>
          )}
        </div>

        {/* ✅ Enhanced service cards grid */}
        {cards.length > 0 && (
          <div 
            ref={cardsRef}
            className={`grid ${getGridClasses(cards.length)}`}
          >
            {cards.map((card: any, index: number) => {
              const imageUrl = card.imageUrl || '';
              const text = card.text || '';
              const contactButton = card.contactButton || '';

              return (
                <motion.div
                  key={index}
                  className={`service-card group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50 ${getCardHeight(cards.length)}`}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    rotateY: 2
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                >
                  {/* ✅ Enhanced service image with overlay effects */}
                  {imageUrl && (
                    <div className="relative h-48 md:h-52 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={text || `Service ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading={index < 4 ? "eager" : "lazy"}
                        style={{
                          filter: 'brightness(0.9) contrast(1.1) saturate(1.1)'
                        }}
                      />
                      
                      {/* Multiple overlay gradients for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Service number indicator */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>

                      {/* Quality indicator */}
                      <div className="absolute top-4 left-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* ✅ Enhanced card content */}
                  <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between flex-grow">
                    {/* Service title with icon */}
                    {text && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                            {text}
                          </h3>
                        </div>
                        
                        {/* Service description placeholder if needed */}
                        <p className="text-slate-600 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Professional service with premium quality and dedicated support.
                        </p>
                      </div>
                    )}

                    {/* Enhanced contact button */}
                    {contactButton && (
                      <div className="mt-auto">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full inline-flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group/button"
                        >
                          <Phone className="w-5 h-5" />
                          <span className="text-base">{contactButton}</span>
                          <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* ✅ Enhanced hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Subtle border glow */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-200/50 transition-colors duration-300" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Call to action section (only if cards exist) */}
        {cards.length > 0 && (
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <p className="text-slate-600 text-lg font-medium">
              Need a custom solution? Let's discuss your requirements.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
