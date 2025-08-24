'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { Star, Quote, ExternalLink } from 'lucide-react';

export default function Testimonials() {
  const { testimonials } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.testimonial-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.testimonial-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.testimonial-cards', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!testimonials || testimonials.hidden) return null;

  const title = testimonials.title || '';
  const description = testimonials.description || '';
  const cards = testimonials.cards || [];

  if (!title && !description && cards.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {title && (
            <h2 className="testimonial-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="testimonial-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Testimonial Cards */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${
            cards.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
            cards.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {cards.map((testimonial: any, index: number) => {
              const name = testimonial.name || '';
              const designation = testimonial.designation || '';
              const companyName = testimonial.companyName || '';
              const imageUrl = testimonial.imageUrl || '';
              const message = testimonial.message || '';
              const socialLinks = testimonial.socialLinks || [];

              return (
                <motion.div
                  key={index}
                  className="testimonial-cards group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6">
                    <Quote className="w-8 h-8 text-purple-200 group-hover:text-purple-300 transition-colors" />
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center space-x-4 mb-6">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-16 h-16 object-cover rounded-full border-2 border-purple-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      {name && (
                        <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
                      )}
                      {designation && (
                        <p className="text-purple-600 font-medium">{designation}</p>
                      )}
                      {companyName && (
                        <p className="text-gray-500 text-sm">{companyName}</p>
                      )}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Testimonial Message */}
                  {message && (
                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{message}"
                    </p>
                  )}

                  {/* Social Links */}
                  {socialLinks.length > 0 && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                      {socialLinks.map((social: any, socialIndex: number) => (
                        <motion.a
                          key={socialIndex}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-purple-100 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {social.iconUrl ? (
                            <img
                              src={social.iconUrl}
                              alt={social.name}
                              className="w-4 h-4 object-contain"
                            />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-gray-600" />
                          )}
                        </motion.a>
                      ))}
                    </div>
                  )}

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
