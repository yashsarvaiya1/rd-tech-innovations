'use client'
import { useEffect, useRef, useMemo, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function Technologies() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE HOOKS
  const { data: technologies, loading, error } = useSectionContent('technologies');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  // ✅ State for active category - ALWAYS called
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // ✅ Enhanced background particles - ALWAYS called
  const backgroundElements = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 60,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 180 + (Math.random() * 120),
      delay: Math.random() * 3
    })), []
  );

  // ✅ ALWAYS call useMemo - even if data is not available
  const groupedTech = useMemo(() => {
    if (!technologies || loading || error || technologies.hidden) {
      return {};
    }
    
    const techCategories = technologies.techCategories || [];
    const tech = technologies.tech || [];
    
    if (techCategories.length === 0) return {};
    
    return techCategories.reduce((acc: any, category: string) => {
      acc[category] = tech.filter((item: any) => 
        item.category === category || 
        item.techCategory === category ||
        (techCategories.indexOf(category) === 0 && !item.category && !item.techCategory)
      );
      return acc;
    }, {});
  }, [technologies, loading, error]);

  // ✅ Set first category as active when data loads - ALWAYS called
  useEffect(() => {
    if (!technologies || loading || error || technologies.hidden) return;
    
    const techCategories = technologies.techCategories || [];
    if (techCategories.length > 0 && !activeCategory) {
      setActiveCategory(techCategories[0]);
    }
  }, [technologies, loading, error, activeCategory]);

  // ✅ Enhanced GSAP animations - ALWAYS called
  useEffect(() => {
    if (!isInView || !containerRef.current || loading || !technologies || technologies.hidden) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.tech-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.tech-description', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.8"
      )
      .fromTo('.tech-category-button', 
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.4)" }, 
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading, technologies]);

  // ✅ NOW AFTER ALL HOOKS - CONDITIONAL RENDERING IS SAFE
  if (loading || error || !technologies || technologies.hidden) {
    return null;
  }

  const title = technologies.title || '';
  const description = technologies.description || '';
  const techCategories = technologies.techCategories || [];
  const tech = technologies.tech || [];

  if (!title && !description && techCategories.length === 0 && tech.length === 0) {
    return null;
  }

  // ✅ Get technologies for active category
  const activeTech = activeCategory ? groupedTech[activeCategory] || [] : [];

  // ✅ Dynamic grid classes based on tech count
  const getGridClasses = (count: number) => {
    if (count === 0) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2 md:grid-cols-4 max-w-2xl mx-auto';
    if (count <= 6) return 'grid-cols-3 md:grid-cols-6 max-w-4xl mx-auto';
    if (count <= 8) return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 max-w-6xl mx-auto';
    return 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 max-w-7xl mx-auto';
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.03),rgba(147,51,234,0.03),rgba(59,130,246,0.03))]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.02)_25%,rgba(59,130,246,0.02)_50%,transparent_50%)] bg-[length:100px_100px]" />
      </div>

      {/* ✅ Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 50%, 0.4), transparent 70%)`
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
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

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ✅ Enhanced header section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h2 className="tech-title text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}
          
          {description && (
            <p className="tech-description text-xl md:text-2xl text-slate-300 leading-relaxed font-light max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* ✅ Technology Category Buttons - One Line (NO counts) */}
        {techCategories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
              {techCategories.map((category: string) => {
                const isActive = activeCategory === category;
                
                return (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(isActive ? null : category)}
                    className={`tech-category-button group relative px-6 py-3 rounded-2xl font-semibold text-sm md:text-base transition-all duration-300 border-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-blue-400/50 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span>{category}</span>
                    
                    {/* Hover glow effect */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      isActive ? 'bg-white/10' : 'bg-blue-500/10'
                    }`} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ✅ Technologies Display with AnimatePresence (NO duplicate title) */}
        <AnimatePresence mode="wait">
          {activeCategory && activeTech.length > 0 && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                staggerChildren: 0.05,
                delayChildren: 0.1
              }}
            >
              {/* Technology Grid (NO category title shown here) */}
              <motion.div 
                className={`grid gap-6 ${getGridClasses(activeTech.length)}`}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {activeTech.map((item: any, index: number) => {
                  const name = item.name || '';
                  const imageUrl = item.imageUrl || '';

                  return (
                    <motion.div
                      key={`${activeCategory}-${index}`}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.8 },
                        show: { opacity: 1, y: 0, scale: 1 }
                      }}
                      className="group relative p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 text-center"
                      whileHover={{ 
                        scale: 1.05, 
                        y: -8,
                        boxShadow: "0 25px 50px rgba(6, 182, 212, 0.3)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Tech Icon/Image */}
                      <div className="relative mb-4">
                        {imageUrl ? (
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 p-3 group-hover:bg-white/20 transition-colors">
                            <img
                              src={imageUrl}
                              alt={name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              style={{
                                filter: 'brightness(0) invert(1)'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:shadow-cyan-400/25 transition-shadow">
                            <span className="text-white font-bold text-2xl">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tech Name */}
                      {name && (
                        <div>
                          <p className="text-base font-bold text-slate-200 group-hover:text-white transition-colors mb-1">
                            {name}
                          </p>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                      
                      {/* Border glow */}
                      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyan-400/20 transition-colors duration-300" />
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ✅ Fallback: Show all tech if no categories */}
        {techCategories.length === 0 && tech.length > 0 && (
          <motion.div 
            className={`grid gap-6 ${getGridClasses(tech.length)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.1 }}
          >
            {tech.map((item: any, index: number) => {
              const name = item.name || '';
              const imageUrl = item.imageUrl || '';

              return (
                <motion.div
                  key={index}
                  className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 text-center"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-12 h-12 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform filter brightness-0 invert"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {name && (
                    <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {name}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
