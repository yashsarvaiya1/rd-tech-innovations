'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';

export default function Technologies() {
  const { technologies } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.tech-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.tech-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.tech-categories', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "-=0.3")
        .from('.tech-items', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!technologies || technologies.hidden) return null;

  const title = technologies.title || '';
  const description = technologies.description || '';
  const techCategories = technologies.techCategories || [];
  const tech = technologies.tech || [];

  if (!title && !description && techCategories.length === 0 && tech.length === 0) return null;

  // Group technologies by category
  const groupedTech = techCategories.reduce((acc: any, category: string) => {
    acc[category] = tech.filter((item: any) => item.techCategory === category);
    return acc;
  }, {});

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="tech-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="tech-description text-lg md:text-xl text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Technology Categories */}
        {Object.keys(groupedTech).length > 0 && (
          <div className="space-y-12">
            {Object.entries(groupedTech).map(([category, techItems]: [string, any]) => (
              <div key={category} className="tech-categories">
                {/* Category Title */}
                <h3 className="text-2xl font-bold text-center mb-8 text-cyan-400">
                  {category}
                </h3>
                
                {/* Technology Items */}
                <div className={`grid gap-6 ${
                  (techItems as any[]).length <= 4 ? 'grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto' :
                  (techItems as any[]).length <= 6 ? 'grid-cols-3 md:grid-cols-6 max-w-5xl mx-auto' :
                  'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
                }`}>
                  {(techItems as any[]).map((item: any, index: number) => {
                    const name = item.name || '';
                    const imageUrl = item.imageUrl || '';

                    return (
                      <motion.div
                        key={index}
                        className="tech-items group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 text-center"
                        whileHover={{ 
                          scale: 1.05, 
                          y: -5,
                          boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Tech Icon/Image */}
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

                        {/* Tech Name */}
                        {name && (
                          <p className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                            {name}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback: Show all tech without categories */}
        {Object.keys(groupedTech).length === 0 && tech.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
            {tech.map((item: any, index: number) => {
              const name = item.name || '';
              const imageUrl = item.imageUrl || '';

              return (
                <motion.div
                  key={index}
                  className="tech-items group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 text-center"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
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
          </div>
        )}
      </div>
    </section>
  );
}
