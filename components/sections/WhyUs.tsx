'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { CheckCircle, Users, Target, Award, Zap } from 'lucide-react';

export default function WhyUs() {
  const { whyUs } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.whyus-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.whyus-stats', { y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }, "-=0.5")
        .from('.whyus-content', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .from('.whyus-features', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!whyUs || whyUs.hidden) return null;

  const title = whyUs.title || '';
  const title2 = whyUs.title2 || '';
  const description = whyUs.description || '';
  const tags = whyUs.tags || []; // Statistics tags
  const text = whyUs.text || []; // Feature points

  if (!title && !title2 && !description && tags.length === 0 && text.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Main Title */}
            {title && (
              <h2 className="whyus-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {title}
              </h2>
            )}

            {/* Statistics Tags */}
            {tags.length > 0 && (
              <div className="grid grid-cols-2 gap-6">
                {tags.map((tag: any, index: number) => {
                  const text1 = tag.text1 || '';
                  const text2 = tag.text2 || '';
                  const icons = [Users, Target, Award, Zap];
                  const Icon = icons[index % icons.length];

                  return (
                    <motion.div
                      key={index}
                      className="whyus-stats group p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{text1}</div>
                          <div className="text-sm text-gray-600 font-medium">{text2}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side - Features */}
          <div className="space-y-8">
            {/* Secondary Title */}
            {title2 && (
              <h3 className="whyus-content text-2xl md:text-3xl font-bold text-gray-900">
                {title2}
              </h3>
            )}

            {/* Description */}
            {description && (
              <p className="whyus-content text-lg text-gray-600 leading-relaxed">
                {description}
              </p>
            )}

            {/* Feature Points */}
            {text.length > 0 && (
              <div className="space-y-4">
                {text.map((feature: string, index: number) => (
                  <motion.div
                    key={index}
                    className="whyus-features flex items-start space-x-3 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
