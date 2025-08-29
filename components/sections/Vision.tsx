"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { useSectionContent } from "@/stores/content";

export default function Vision() {
  const { data: vision, loading, error } = useSectionContent("vision");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles
  const backgroundElements = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 150 + 100,
        top: Math.random() * 100,
        left: Math.random() * 100,
        hue: 240 + Math.random() * 80, // Purple to blue spectrum
        delay: Math.random() * 4,
      })),
    [],
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".vision-title",
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" },
      )
        .fromTo(
          ".vision-description",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
          "-=1",
        )
        .fromTo(
          ".vision-card",
          { y: 120, opacity: 0, scale: 0.7, rotationY: 20 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "back.out(1.6)",
          },
          "-=0.8",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !vision || vision.hidden) return null;

  const title = vision.title || "";
  const description = vision.description || "";
  const cards = vision.cards || [];

  if (!title && !description && cards.length === 0) return null;

  // ✅ Dynamic grid classes based on card count
  const getGridClasses = (count: number) => {
    if (count === 0) return "";
    if (count === 1) return "max-w-lg mx-auto";
    if (count === 2) return "md:grid-cols-2 max-w-4xl mx-auto";
    if (count === 3) return "md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto";
    if (count <= 4) return "md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto";
    if (count <= 6) return "md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto";
    return "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto";
  };

  // ✅ Theme-consistent gradients for cards
  const gradients = [
    "from-primary to-accent/50",
    "from-accent to-primary/70",
    "from-primary/80 to-accent/60",
    "from-accent/80 to-primary/60",
    "from-primary to-accent/70",
    "from-accent to-primary/70",
    "from-primary/90 to-accent/60",
    "from-accent/90 to-primary/50",
  ];

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 relative overflow-hidden flex items-center"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-muted/20 to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(39,180,198,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,20,147,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(39,180,198,0.02),rgba(255,20,147,0.02),rgba(39,180,198,0.02))]" />
      </div>

      {/* ✅ Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 70%, 0.4), transparent 70%)`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-25, 25, -25],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* ✅ Enhanced header section */}
        <div className="text-center max-w-5xl mx-auto mb-20 space-y-8">
          {title && (
            <h2 className="vision-title text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h2>
          )}

          {description && (
            <div className="vision-description space-y-6">
              <p className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed font-sans font-medium max-w-4xl mx-auto">
                {description}
              </p>

              {/* ✅ Decorative element */}
              <div className="flex justify-center items-center space-x-4">
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-primary/70 rounded-full" />
                <div className="w-3 h-3 bg-gradient-to-r from-primary/70 to-accent/70 rounded-full" />
                <div className="w-20 h-1 bg-gradient-to-r from-accent/70 to-accent rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* ✅ Vision Cards with Dynamic Layout */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${getGridClasses(cards.length)}`}>
            {cards.map((card: any, index: number) => {
              const cardTitle = card.title || "";
              const cardDescription = card.description || "";
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={index}
                  className="vision-card group relative p-6 md:p-8 bg-card/90 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-700 border border-border/70 overflow-hidden"
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                    boxShadow: "0 30px 60px rgba(39, 180, 198, 0.15)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* ✅ Enhanced card content */}
                  <div className="relative z-10 space-y-5">
                    {/* ✅ Card number with gradient */}
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <span className="text-primary-foreground font-heading font-black text-lg">
                          {index + 1}
                        </span>
                      </div>

                      {/* ✅ Visual accent */}
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-border via-primary/30 to-border rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* ✅ Card Title */}
                    {cardTitle && (
                      <h3 className="text-lg md:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {cardTitle}
                      </h3>
                    )}

                    {/* ✅ Card Description */}
                    {cardDescription && (
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-sans group-hover:text-foreground transition-colors">
                        {cardDescription}
                      </p>
                    )}

                    {/* ✅ Interactive accent line */}
                    <div
                      className={`w-8 h-0.5 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-100 group-hover:w-16 transition-all duration-500`}
                    />
                  </div>

                  {/* ✅ Enhanced hover effects */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl pointer-events-none`}
                  />

                  {/* ✅ Floating accent element */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-full blur-xl`}
                    />
                  </div>

                  {/* ✅ Border glow */}
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 transition-colors duration-300" />

                  {/* ✅ Enhanced shadow glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-lg -z-10" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Enhanced empty state */}
        {cards.length === 0 && (title || description) && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-muted/50 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-border/60">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">
              Vision Cards Coming Soon
            </h3>
            <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed font-sans">
              Inspiring vision cards will be showcased here once they're added
              to the portfolio.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
