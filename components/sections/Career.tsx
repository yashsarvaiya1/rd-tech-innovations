'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { Users, Briefcase, TrendingUp, Heart } from 'lucide-react';

export default function Career() {
  const { career } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.career-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.career-benefits', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.5");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!career || career.hidden) return null;

  const title = career.title || '';

  if (!title) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="career-title text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            {title}
          </h2>
        </div>

        {/* Career Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Users,
              title: "Great Team",
              description: "Work with passionate and talented individuals",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: TrendingUp,
              title: "Growth Opportunities",
              description: "Continuous learning and career advancement",
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Briefcase,
              title: "Exciting Projects",
              description: "Work on cutting-edge technologies and solutions",
              color: "from-green-500 to-teal-500"
            },
            {
              icon: Heart,
              title: "Work-Life Balance",
              description: "Flexible hours and remote work options",
              color: "from-orange-500 to-red-500"
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="career-benefits group p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 text-center"
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1)"
                }}
              >
                <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
