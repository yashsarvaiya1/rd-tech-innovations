'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { ArrowRight, Phone } from 'lucide-react';

export default function ServiceOptions() {
  const { serviceOptions } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.service-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.service-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.service-cards', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!serviceOptions || serviceOptions.hidden) return null;

  const title = serviceOptions.title || '';
  const description = serviceOptions.description || '';
  const cards = serviceOptions.cards || [];

  if (!title && !description && cards.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="service-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="service-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Service Cards */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${
            cards.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            cards.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            cards.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {cards.map((card: any, index: number) => {
              const imageUrl = card.imageUrl || '';
              const text = card.text || '';
              const cardDescription = card.description || '';
              const contactButton = card.contactButton || 'Contact Us';

              return (
                <motion.div
                  key={index}
                  className="service-cards group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Service Image */}
                  {imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={text || `Service ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-8 space-y-4">
                    {/* Service Title */}
                    {text && (
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {text}
                      </h3>
                    )}

                    {/* Service Description */}
                    {cardDescription && (
                      <p className="text-gray-600 leading-relaxed">
                        {cardDescription}
                      </p>
                    )}

                    {/* Contact Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{contactButton}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
