'use client'
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useContentStore } from '@/stores/content';

export default function CompanyMarquee() {
  const { companyMarquee } = useContentStore();

  if (!companyMarquee || companyMarquee.hidden) return null;

  const companyLogos = companyMarquee.companyLogoUrls || companyMarquee['companyMarquee.companyLogoUrls'] || [];

  if (companyLogos.length === 0) return null;

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...companyLogos, ...companyLogos];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-gray-600">
            Companies that believe in our expertise
          </p>
        </div>

        {/* Infinite Marquee */}
        <div className="relative">
          <div className="flex space-x-8 animate-marquee">
            {duplicatedLogos.map((logoUrl: string, index: number) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <img
                  src={logoUrl}
                  alt={`Company logo ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          
          {/* Gradient overlays for smooth fade */}
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
