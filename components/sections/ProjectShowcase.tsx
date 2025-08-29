"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ExternalLink, Heart, Layers } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useSectionContent } from "@/stores/content";

export default function ProjectShowcase() {
  const { data: projects, loading, error } = useSectionContent("projects");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Dynamic project selection based on available count
  const displayProjects = useMemo(() => {
    if (!projects?.cards || projects.cards.length === 0) return [];

    const shuffled = [...projects.cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, projects.cards.length));
  }, [projects?.cards]);

  const hasMoreProjects = projects?.cards && projects.cards.length > 3;

  // ✅ Enhanced background elements with theme colors
  const backgroundElements = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 120 + 80,
        top: Math.random() * 100,
        left: Math.random() * 100,
        hue: 190 + Math.random() * 80, // Blue to cyan spectrum matching your theme
        delay: Math.random() * 3,
      })),
    [],
  );

  // ✅ Smooth GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-content",
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      )
        .fromTo(
          ".project-card",
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
          "-=0.8",
        )
        .fromTo(
          ".cta-button",
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.5",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  if (loading || error || !projects || projects.hidden) return null;

  const title = projects.title || "";
  const text = projects.text || "";

  if (!title && !text && displayProjects.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/15 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Beautiful light gradient background with your theme colors */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/8 via-background/90 to-accent/8 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(39,180,198,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,20,147,0.06),transparent_50%)]" />
      </div>

      {/* ✅ Enhanced floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-2xl opacity-25"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 70%, 60%, 0.3), hsla(${element.hue + 20}, 80%, 70%, 0.2), transparent 70%)`,
            }}
            animate={{
              y: [-25, 25, -25],
              x: [-15, 15, -15],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* ✅ Hero section with theme typography */}
        <div className="hero-content text-center max-w-5xl mx-auto mb-20">
          {title && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-8 leading-[0.9] tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          )}

          {text && (
            <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed font-sans font-medium max-w-4xl mx-auto">
              {text}
            </p>
          )}
        </div>

        {/* ✅ Theme-consistent project grid */}
        {displayProjects.length > 0 && (
          <div
            className={`grid gap-10 mb-16 ${
              displayProjects.length === 1
                ? "max-w-2xl mx-auto"
                : displayProjects.length === 2
                  ? "md:grid-cols-2 max-w-6xl mx-auto"
                  : "lg:grid-cols-3 max-w-7xl mx-auto"
            }`}
          >
            {displayProjects.map((project: any, index: number) => {
              const projectTitle = project.title || "";
              const about = project.about || "";
              const industryTags = project.industryTags || [];
              const techTags = project.techTags || [];
              const links = project.links || [];
              const imageUrl = project.imageUrl || "";

              return (
                <motion.div
                  key={index}
                  className="project-card group relative bg-white/90 backdrop-blur-xl rounded-2xl border border-border/60 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden"
                  whileHover={{
                    y: -16,
                    scale: 1.03,
                    boxShadow: "0 30px 60px rgba(39, 180, 198, 0.15)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  {/* ✅ Project image with theme colors */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={projectTitle}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          loading={index === 0 ? "eager" : "lazy"}
                          style={{
                            filter:
                              "brightness(0.95) contrast(1.05) saturate(1.1)",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-secondary/20 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/15 to-muted/20 flex items-center justify-center">
                        <Layers className="w-16 h-16 text-muted-foreground opacity-60" />
                      </div>
                    )}

                    {/* Quality indicator */}
                    <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:translate-y-0 translate-y-2">
                      <div className="px-2 py-1 bg-accent/20 backdrop-blur-sm text-accent text-xs font-heading font-semibold rounded-full border border-accent/30">
                        <Heart className="w-3 h-3 inline-block my-0.5" />
                      </div>
                    </div>

                    {/* Theme gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* ✅ Enhanced content with theme colors */}
                  <div className="p-6 space-y-5">
                    {/* Project title */}
                    {projectTitle && (
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {projectTitle}
                        </h3>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-16 transition-all duration-500"></div>
                      </div>
                    )}

                    {/* Project description */}
                    {about && (
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-sans line-clamp-3 group-hover:text-foreground transition-colors">
                        {about}
                      </p>
                    )}

                    {/* ✅ Tag system with theme colors */}
                    <div className="space-y-4">
                      {/* Industry tags */}
                      {industryTags.length > 0 && (
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 bg-accent rounded-full mr-2 shadow-lg shadow-accent/20"></div>
                            <span className="text-accent text-xs font-heading font-bold uppercase tracking-wider">
                              Industries
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {industryTags
                              .slice(0, 3)
                              .map((tag: string, tagIndex: number) => (
                                <motion.span
                                  key={tagIndex}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-lg font-sans font-semibold border border-accent/30 backdrop-blur-sm hover:shadow-accent/20 transition-all duration-300"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            {industryTags.length > 3 && (
                              <span className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg font-sans font-medium border border-border/30">
                                +{industryTags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tech tags */}
                      {techTags.length > 0 && (
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2 shadow-lg shadow-primary/20"></div>
                            <span className="text-primary text-xs font-heading font-bold uppercase tracking-wider">
                              Technologies
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {techTags
                              .slice(0, 4)
                              .map((tech: string, techIndex: number) => (
                                <motion.span
                                  key={techIndex}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg font-sans font-semibold border border-primary/30 backdrop-blur-sm hover:shadow-primary/20 transition-all duration-300"
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            {techTags.length > 4 && (
                              <span className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg font-sans font-medium border border-border/30">
                                +{techTags.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ✅ Project links with theme colors */}
                    {links.length > 0 && (
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center mb-3">
                          <div className="w-2 h-2 bg-accent rounded-full mr-2 shadow-lg shadow-accent/20"></div>
                          <span className="text-accent text-xs font-heading font-bold uppercase tracking-wider">
                            Links
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 relative z-50">
                          {links
                            .slice(0, 3)
                            .map((link: any, linkIndex: number) => {
                              const linkName =
                                link?.name || `Link ${linkIndex + 1}`;
                              const linkUrl = link?.url || "";

                              const finalUrl =
                                linkUrl && !linkUrl.startsWith("http")
                                  ? `https://${linkUrl}`
                                  : linkUrl;

                              return (
                                <a
                                  key={linkIndex}
                                  href={finalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="relative z-50 px-3 py-1 bg-muted/40 text-muted-foreground rounded-lg text-xs font-sans font-semibold border border-border/40 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-pointer group/link inline-block"
                                  style={{
                                    pointerEvents: linkUrl ? "auto" : "none",
                                    opacity: linkUrl ? 1 : 0.5,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!linkUrl) {
                                      e.preventDefault();
                                    }
                                  }}
                                >
                                  <span className="group-hover/link:text-primary transition-colors relative z-50">
                                    {linkName}
                                  </span>
                                </a>
                              );
                            })}
                          {links.length > 3 && (
                            <div className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-lg text-xs font-sans font-medium border border-border/30">
                              +{links.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ Theme hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />

                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/30 transition-colors duration-500" />
                  <div className="absolute -inset-1 rounded-2xl border border-transparent group-hover:border-accent/20 transition-colors duration-700 blur-sm" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Theme-consistent CTA button */}
        {hasMoreProjects && (
          <div className="cta-button text-center">
            <Link href="/projects">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(39, 180, 198, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-heading font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-primary/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="relative z-10">Explore All Projects</span>
                <motion.div
                  className="relative z-10 ml-3"
                  animate={{ x: [0, 6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ExternalLink className="h-5 w-5" />
                </motion.div>
              </motion.button>
            </Link>
          </div>
        )}

        {/* ✅ Theme-consistent empty state */}
        {displayProjects.length === 0 && (title || text) && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-border/50 shadow-2xl">
              <Layers className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6">
              Projects Coming Soon
            </h3>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed font-sans">
              Amazing projects will be showcased here once they're added to the
              portfolio.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
