'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { Eye, Lightbulb, Target, Rocket } from 'lucide-react';

export default function Vision() {
  const { vision } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.vision-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.vision-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.vision-cards', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!vision || vision.hidden) return null;

  const title = vision.title || '';
  const description = vision.description || '';
  const cards = vision.cards || [];

  if (!title && !description && cards.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="vision-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="vision-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Vision Cards */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${
            cards.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            cards.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            cards.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {cards.map((card: any, index: number) => {
              const cardTitle = card.title || '';
              const cardDescription = card.description || '';
              const icons = [Eye, Lightbulb, Target, Rocket];
              const Icon = icons[index % icons.length];
              const gradients = [
                'from-blue-500 to-indigo-600',
                'from-purple-500 to-pink-600', 
                'from-green-500 to-teal-600',
                'from-orange-500 to-red-600'
              ];

              return (
                <motion.div
                  key={index}
                  className="vision-cards group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Card Icon */}
                  <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Card Title */}
                  {cardTitle && (
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {cardTitle}
                    </h3>
                  )}

                  {/* Card Description */}
                  {cardDescription && (
                    <p className="text-gray-600 leading-relaxed">
                      {cardDescription}
                    </p>
                  )}

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
