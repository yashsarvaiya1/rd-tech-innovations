"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Building, ExternalLink, Quote, Star, User } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useSectionContent } from "@/stores/content";

export default function Testimonials() {
  const {
    data: testimonials,
    loading,
    error,
  } = useSectionContent("testimonials");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Theme-consistent background particles
  const backgroundElements = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 120 + 80,
        top: Math.random() * 100,
        left: Math.random() * 100,
        hue: 280 + Math.random() * 80,
        delay: Math.random() * 3,
      })),
    [],
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".testimonial-title",
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      )
        .fromTo(
          ".testimonial-description",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
          "-=0.8",
        )
        .fromTo(
          ".testimonial-card",
          { y: 100, opacity: 0, scale: 0.8, rotationY: 15 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.4)",
          },
          "-=0.6",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Helper function to get dynamic text size based on message length
  const getMessageTextSize = (message: string) => {
    if (!message) return "text-base";

    if (message.length <= 100) return "text-lg md:text-xl";
    if (message.length <= 200) return "text-base md:text-lg";
    if (message.length <= 300) return "text-sm md:text-base";
    if (message.length <= 400) return "text-sm md:text-base";
    return "text-xs md:text-sm";
  };

  // ✅ Helper function to get dynamic card height based on content
  const getCardHeight = (message: string) => {
    if (!message) return "h-72";

    if (message.length <= 150) return "h-72";
    if (message.length <= 300) return "h-80";
    if (message.length <= 500) return "h-96";
    return "h-[26rem]";
  };

  // ✅ Early return after hooks
  if (loading || error || !testimonials || testimonials.hidden) return null;

  const title = testimonials.title || "";
  const description = testimonials.description || "";
  const cards = testimonials.cards || [];

  if (!title && !description && cards.length === 0) return null;

  // ✅ Dynamic grid classes based on card count
  const getGridClasses = (count: number) => {
    if (count === 1) return "max-w-xl mx-auto";
    if (count === 2) return "md:grid-cols-2 max-w-4xl mx-auto";
    if (count === 3) return "md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto";
    if (count <= 6) return "md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto";
    return "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto";
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/8 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Enhanced theme background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,20,147,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(39,180,198,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,20,147,0.02)_70%)]" />
      </div>

      {/* ✅ Theme floating particles */}
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
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 70%, 0.4), transparent 70%)`,
            }}
            animate={{
              y: [-25, 25, -25],
              x: [-15, 15, -15],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 18 + Math.random() * 8,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* ✅ Header section with smaller fonts */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          {title && (
            <h2 className="testimonial-title text-2xl md:text-3xl lg:text-4xl font-heading font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}

          {description && (
            <p className="testimonial-description text-base md:text-lg lg:text-xl text-foreground leading-relaxed font-sans font-medium max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* ✅ Theme-consistent testimonial cards */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${getGridClasses(cards.length)}`}>
            {cards.map((testimonial: any, index: number) => {
              const name = testimonial.name || "";
              const designation = testimonial.designation || "";
              const companyName = testimonial.companyName || "";
              const imageUrl = testimonial.imageUrl || "";
              const message = testimonial.message || "";
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
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-card/90 backdrop-blur-xl rounded-xl shadow-xl border border-border/60 p-6 flex flex-col items-center justify-center text-center">
                      {/* Profile Image */}
                      <div className="relative mb-5">
                        {imageUrl ? (
                          <div className="relative">
                            <img
                              src={imageUrl}
                              alt={name}
                              className="w-20 h-20 object-cover rounded-full border-4 border-accent/30 shadow-lg"
                              loading="lazy"
                            />
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-accent to-accent/70 rounded-full flex items-center justify-center shadow-lg">
                              <Quote className="w-3 h-3 text-accent-foreground" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center shadow-lg border-4 border-card">
                            <User className="w-10 h-10 text-accent-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Name and Title */}
                      <div className="space-y-2 mb-5">
                        {name && (
                          <h3 className="text-lg md:text-xl font-heading font-bold text-foreground break-words">
                            {name}
                          </h3>
                        )}
                        {designation && (
                          <p className="text-accent font-sans font-semibold text-sm md:text-base break-words">
                            {designation}
                          </p>
                        )}
                        {companyName && (
                          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                            <Building className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs md:text-sm font-sans font-medium break-words">
                              {companyName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Star Rating */}
                      <div className="flex space-x-1 mb-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: i * 0.1,
                              type: "spring",
                              stiffness: 500,
                            }}
                          >
                            <Star className="w-4 h-4 text-accent fill-current" />
                          </motion.div>
                        ))}
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-sans font-medium"
                        >
                          Hover to read review
                        </motion.div>
                      </div>

                      {/* Theme gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl pointer-events-none" />
                    </div>

                    {/* ✅ BACK CARD - Message and Links */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-accent to-primary rounded-xl shadow-2xl p-5 md:p-6 flex flex-col justify-between text-accent-foreground overflow-hidden">
                      {/* Quote icon */}
                      <div className="absolute top-3 left-3 md:top-4 md:left-4">
                        <Quote className="w-6 h-6 md:w-8 md:h-8 text-accent-foreground/30" />
                      </div>

                      {/* Message with dynamic sizing */}
                      <div className="flex-1 flex items-center justify-center pt-6">
                        {message ? (
                          <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            <blockquote
                              className={`${getMessageTextSize(message)} leading-relaxed text-center font-sans font-light italic max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-2`}
                              style={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                hyphens: "auto",
                              }}
                            >
                              "{message}"
                            </blockquote>
                          </div>
                        ) : (
                          <div className="text-center text-accent-foreground/80">
                            <Quote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-base font-sans">
                              No message available
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Author attribution */}
                      <div className="text-center border-t border-accent-foreground/20 pt-3 md:pt-4 flex-shrink-0">
                        <div className="text-accent-foreground font-sans font-semibold mb-3 text-sm break-words">
                          — {name}
                          {designation && `, ${designation}`}
                        </div>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                          <div className="flex justify-center space-x-2 md:space-x-3">
                            {socialLinks
                              .slice(0, 4)
                              .map((social: any, socialIndex: number) => {
                                const socialUrl =
                                  typeof social === "string"
                                    ? social
                                    : social.link || social.url || "";
                                const socialName =
                                  typeof social === "string"
                                    ? `Link ${socialIndex + 1}`
                                    : social.name || `Link ${socialIndex + 1}`;

                                return (
                                  <motion.a
                                    key={socialIndex}
                                    href={
                                      socialUrl.startsWith("http")
                                        ? socialUrl
                                        : `https://${socialUrl}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-7 h-7 md:w-8 md:h-8 bg-accent-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent-foreground/30 transition-colors border border-accent-foreground/20 flex-shrink-0"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {social.iconUrl ? (
                                      <img
                                        src={social.iconUrl}
                                        alt={socialName}
                                        className="w-3 h-3 md:w-4 md:h-4 object-contain"
                                      />
                                    ) : (
                                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-accent-foreground" />
                                    )}
                                  </motion.a>
                                );
                              })}
                          </div>
                        )}
                      </div>

                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-foreground rounded-full -translate-y-12 translate-x-12" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent-foreground rounded-full translate-y-10 -translate-x-10" />
                      </div>
                    </div>
                  </div>

                  {/* ✅ Theme shadow effects */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Theme empty state */}
        {cards.length === 0 && (title || description) && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Quote className="w-16 h-16 text-accent" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              No Testimonials Yet
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed font-sans">
              Customer testimonials will appear here when they're added to
              showcase your amazing work.
            </p>
          </motion.div>
        )}
      </div>

      {/* ✅ Enhanced CSS for 3D flip effect */}
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

        .scrollbar-thumb-white\\/20::-webkit-scrollbar-thumb {
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
