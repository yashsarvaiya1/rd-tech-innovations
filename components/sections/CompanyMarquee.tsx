'use client';
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function CompanyMarquee() {
  const { data: companyMarquee, loading, error } = useSectionContent('companyMarquee');
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // ✅ Firestore-only data
  const companyLogos = companyMarquee?.companyLogoUrls || [];

  useEffect(() => {
    if (!isInView || !marqueeRef.current || companyLogos.length === 0) return;

    let tween: gsap.core.Tween;

    const startAnimation = () => {
      const marqueeElement = marqueeRef.current!;
      const firstChild = marqueeElement.children[0] as HTMLElement;

      if (!firstChild) return;

      const images = marqueeElement.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      });

      Promise.all(imagePromises).then(() => {
        const logoWidth = firstChild.offsetWidth;
        const gap = 32; // space-x-8
        const itemWidth = logoWidth + gap;
        const oneSetWidth = itemWidth * companyLogos.length;

        // ✅ Ensure initial placement
        gsap.set(marqueeElement, { x: 0 });

        // ✅ Infinite linear scrolling — seamless without jumps
        tween = gsap.to(marqueeElement, {
          x: -oneSetWidth,
          duration: companyLogos.length * 3,
          ease: "linear",
          repeat: -1,
          modifiers: {
            x: (x) => {
              // ✅ Wrap so it never snaps
              const current = parseFloat(x);
              const wrapped = ((current % -oneSetWidth) + -oneSetWidth) % -oneSetWidth;
              return `${wrapped}px`;
            }
          }
        });
      });
    };

    const timeoutId = setTimeout(startAnimation, 200);

    // Hover controls
    const handleMouseEnter = () => {
      if (tween) tween.pause();
    };
    const handleMouseLeave = () => {
      if (tween) tween.resume();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearTimeout(timeoutId);
      if (tween) tween.kill();
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isInView, companyLogos.length]);

  if (loading || error || !companyMarquee || companyMarquee.hidden || companyLogos.length === 0) {
    return null;
  }

  const duplicatedLogos = [...companyLogos, ...companyLogos, ...companyLogos];

  return (
    <section 
      ref={containerRef}
      className="py-12 md:py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="relative overflow-hidden">
          <div
            ref={marqueeRef}
            className="flex space-x-8"
            style={{ 
              width: 'max-content',
              willChange: 'transform'
            }}
          >
            {duplicatedLogos.map((logoUrl: string, index: number) => (
              <motion.div
                key={`logo-${index}`}
                className="flex-shrink-0 w-20 h-12 md:w-24 md:h-14 lg:w-28 lg:h-16 flex items-center justify-center p-2 md:p-3 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm border border-white/40 group hover:bg-white/80 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img
                  src={logoUrl}
                  alt={`Company logo ${(index % companyLogos.length) + 1}`}
                  className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            ))}
          </div>

          {/* Gradient masks */}
          <div className="absolute top-0 left-0 w-16 md:w-24 h-full bg-gradient-to-r from-slate-50 via-slate-50/60 to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-16 md:w-24 h-full bg-gradient-to-l from-slate-50 via-slate-50/60 to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
