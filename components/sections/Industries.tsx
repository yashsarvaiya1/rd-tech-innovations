'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';

export default function Industries() {
  const { industries } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.industry-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.industry-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.industry-cards', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!industries || industries.hidden) return null;

  const title = industries.title || '';
  const description = industries.description || '';
  const industriesList = industries.industries || [];

  if (!title && !description && industriesList.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="industry-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="industry-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Industry Cards */}
        {industriesList.length > 0 && (
          <div className={`grid gap-6 ${
            industriesList.length <= 4 ? 'grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto' :
            industriesList.length <= 6 ? 'grid-cols-3 md:grid-cols-6 max-w-5xl mx-auto' :
            'grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          }`}>
            {industriesList.map((industry: any, index: number) => {
              const name = industry.name || '';
              const iconUrl = industry.iconUrl || '';

              return (
                <motion.div
                  key={index}
                  className="industry-cards group p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100"
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Industry Icon */}
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={name}
                      className="w-16 h-16 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-xl">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Industry Name */}
                  {name && (
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {name}
                    </h3>
                  )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
