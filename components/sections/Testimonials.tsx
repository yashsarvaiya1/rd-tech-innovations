'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { Star, Quote, ExternalLink, User, Building } from 'lucide-react';

export default function Testimonials() {
  const { data: testimonials, loading, error } = useSectionContent('testimonials');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles
  const backgroundElements = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 120 + 80,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 280 + (Math.random() * 80), // Purple to pink spectrum
      delay: Math.random() * 3
    })), []
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.testimonial-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.testimonial-description', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
        "-=0.8"
      )
      .fromTo('.testimonial-card', 
        { y: 100, opacity: 0, scale: 0.8, rotationY: 15 },
        { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1, stagger: 0.2, ease: "back.out(1.4)" }, 
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Helper function to get dynamic text size based on message length
  const getMessageTextSize = (message: string) => {
    if (!message) return 'text-lg';
    
    if (message.length <= 100) return 'text-xl md:text-2xl';
    if (message.length <= 200) return 'text-lg md:text-xl';
    if (message.length <= 300) return 'text-base md:text-lg';
    if (message.length <= 400) return 'text-sm md:text-base';
    return 'text-xs md:text-sm';
  };

  // ✅ Helper function to get dynamic card height based on content
  const getCardHeight = (message: string) => {
    if (!message) return 'h-80';
    
    if (message.length <= 150) return 'h-80';
    if (message.length <= 300) return 'h-96';
    if (message.length <= 500) return 'h-[28rem]';
    return 'h-[32rem]';
  };

  // ✅ Early return after hooks
  if (loading || error || !testimonials || testimonials.hidden) return null;

  const title = testimonials.title || '';
  const description = testimonials.description || '';
  const cards = testimonials.cards || [];

  if (!title && !description && cards.length === 0) return null;

  // ✅ Dynamic grid classes based on card count
  const getGridClasses = (count: number) => {
    if (count === 1) return 'max-w-xl mx-auto';
    if (count === 2) return 'md:grid-cols-2 max-w-4xl mx-auto';
    if (count === 3) return 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
    if (count <= 6) return 'md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto';
    return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto';
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-50/30 to-pink-50/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(147,51,234,0.02)_70%)]" />
      </div>

      {/* ✅ Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-2xl opacity-20"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 70%, 0.4), transparent 70%)`
            }}
            animate={{
              y: [-25, 25, -25],
              x: [-15, 15, -15],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 18 + Math.random() * 8,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ✅ Enhanced header section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          {title && (
            <h2 className="testimonial-title text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-800 via-pink-700 to-purple-800 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}
          
          {description && (
            <p className="testimonial-description text-xl md:text-2xl text-slate-700 leading-relaxed font-light max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* ✅ Dynamic testimonial cards grid with adaptive heights */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${getGridClasses(cards.length)}`}>
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
                  className={`testimonial-card group relative ${getCardHeight(message)} perspective-1000`}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* ✅ Flip card container */}
                  <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">
                    
                    {/* ✅ FRONT CARD - Profile Information */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-8 flex flex-col items-center justify-center text-center">
                      
                      {/* Profile Image */}
                      <div className="relative mb-6">
                        {imageUrl ? (
                          <div className="relative">
                            <img
                              src={imageUrl}
                              alt={name}
                              className="w-24 h-24 object-cover rounded-full border-4 border-purple-200 shadow-lg"
                              loading="lazy"
                            />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                              <Quote className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                            <User className="w-12 h-12 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Name and Title */}
                      <div className="space-y-2 mb-6">
                        {name && (
                          <h3 className="text-2xl font-bold text-slate-900 break-words">
                            {name}
                          </h3>
                        )}
                        {designation && (
                          <p className="text-purple-600 font-semibold text-lg break-words">
                            {designation}
                          </p>
                        )}
                        {companyName && (
                          <div className="flex items-center justify-center space-x-2 text-slate-600">
                            <Building className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium break-words">{companyName}</span>
                          </div>
                        )}
                      </div>

                      {/* Star Rating */}
                      <div className="flex space-x-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 500 }}
                          >
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium"
                        >
                          Hover to read review
                        </motion.div>
                      </div>

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl pointer-events-none" />
                    </div>

                    {/* ✅ BACK CARD - Message and Links with Dynamic Text Sizing */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col justify-between text-white overflow-hidden">
                      
                      {/* Quote icon */}
                      <div className="absolute top-4 left-4 md:top-6 md:left-6">
                        <Quote className="w-8 h-8 md:w-12 md:h-12 text-white/30" />
                      </div>

                      {/* Message with dynamic sizing and scrollable container */}
                      <div className="flex-1 flex items-center justify-center pt-8">
                        {message ? (
                          <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            <blockquote 
                              className={`${getMessageTextSize(message)} leading-relaxed text-center font-light italic max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-2`}
                              style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                hyphens: 'auto'
                              }}
                            >
                              "{message}"
                            </blockquote>
                          </div>
                        ) : (
                          <div className="text-center text-white/80">
                            <Quote className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No message available</p>
                          </div>
                        )}
                      </div>

                      {/* Author attribution */}
                      <div className="text-center border-t border-white/20 pt-4 md:pt-6 flex-shrink-0">
                        <div className="text-white font-semibold mb-4 text-sm md:text-base break-words">
                          — {name}
                          {designation && `, ${designation}`}
                        </div>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                          <div className="flex justify-center space-x-3 md:space-x-4">
                            {socialLinks.slice(0, 4).map((social: any, socialIndex: number) => {
                              // Handle both string URLs and object structure
                              const socialUrl = typeof social === 'string' ? social : social.link || social.url || '';
                              const socialName = typeof social === 'string' ? `Link ${socialIndex + 1}` : social.name || `Link ${socialIndex + 1}`;
                              
                              return (
                                <motion.a
                                  key={socialIndex}
                                  href={socialUrl.startsWith('http') ? socialUrl : `https://${socialUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20 flex-shrink-0"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {social.iconUrl ? (
                                    <img
                                      src={social.iconUrl}
                                      alt={socialName}
                                      className="w-4 h-4 md:w-5 md:h-5 object-contain"
                                    />
                                  ) : (
                                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                  )}
                                </motion.a>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
                      </div>
                    </div>
                  </div>

                  {/* ✅ Enhanced shadow and glow effects */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Enhanced empty state */}
        {cards.length === 0 && (title || description) && (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Quote className="w-16 h-16 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">No Testimonials Yet</h3>
            <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
              Customer testimonials will appear here when they're added to showcase your amazing work.
            </p>
          </motion.div>
        )}
      </div>

      {/* ✅ Enhanced CSS for 3D flip effect with scrollbar styling */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </section>
  );
}
