'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { ArrowRight, Users, Target, Award } from 'lucide-react';

export default function CompanyBrief() {
  const { companyBrief } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.company-title', {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        })
        .from('.company-description', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.5")
        .from('.company-stats', {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!companyBrief || companyBrief.hidden) return null;

  const title = companyBrief.title || '';
  const description = companyBrief.description || '';
  const tags = companyBrief.tags || [];

  if (!title && !description && tags.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        <div className="text-center max-w-4xl mx-auto space-y-12">
          
          {/* Title */}
          {title && (
            <h2 className="company-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="company-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}

          {/* Statistics Tags */}
          {tags.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
              {tags.map((tag: any, index: number) => {
                // Extract number and text from tag
                const text1 = tag.text1 || tag.title || '';
                const text2 = tag.text2 || tag.description || '';
                
                const icons = [Users, Target, Award, ArrowRight];
                const Icon = icons[index % icons.length];

                return (
                  <motion.div
                    key={index}
                    className="company-stats group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {text1}
                      </div>
                      
                      {text2 && (
                        <p className="text-gray-600 font-medium">
                          {text2}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
