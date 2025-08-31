"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ExternalLink, Heart, Layers } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useCallback, useState } from "react";
import { useSectionContent } from "@/stores/content";

// Types for better TypeScript support
interface ProjectCard {
  title?: string;
  about?: string;
  industryTags?: string[];
  techTags?: string[];
  links?: Array<{ name?: string; url?: string }>;
  imageUrl?: string;
}

interface ProjectsData {
  title?: string;
  text?: string;
  cards?: ProjectCard[];
  hidden?: boolean;
}

interface BackgroundElement {
  id: number;
  size: number;
  top: number;
  left: number;
  hue: number;
  delay: number;
}

// Enhanced image cache for better performance
const imageCache = new Map<string, Promise<void>>();

const preloadImage = (src: string): Promise<void> => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
};

// Optimized background element creation with reduced count and complexity
const createBackgroundElements = (): BackgroundElement[] =>
  Array.from({ length: 3 }, (_, i) => ({
    id: i,
    size: 80 + (i % 2) * 40, // Predictable sizes
    top: 20 + (i * 25), // Better distribution
    left: 15 + (i * 30), // Avoid overlap
    hue: 190 + (i * 20), // Wider color range
    delay: i * 0.6, // Longer delays for smoother animation
  }));

// Memoized background particle component with GPU acceleration
const BackgroundParticle = ({ element }: { element: BackgroundElement }) => (
  <motion.div
    className="absolute rounded-full blur-2xl opacity-20 pointer-events-none"
    style={{
      width: element.size,
      height: element.size,
      top: `${element.top}%`,
      left: `${element.left}%`,
      background: `radial-gradient(circle, hsla(${element.hue}, 60%, 60%, 0.25), transparent 70%)`,
      willChange: 'transform, opacity',
    }}
    animate={{
      y: [-20, 20],
      x: [-12, 12],
      scale: [1, 1.15],
      opacity: [0.15, 0.25],
    }}
    transition={{
      duration: 18,
      repeat: Infinity,
      repeatType: "reverse",
      delay: element.delay,
      ease: "linear",
    }}
  />
);

// Optimized project card component with enhanced image handling
const ProjectCard = ({ project, index }: { project: ProjectCard; index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    title: projectTitle = "",
    about = "",
    industryTags = [],
    techTags = [],
    links = [],
    imageUrl = ""
  } = project;

  // Preload image for better performance
  useEffect(() => {
    if (imageUrl) {
      preloadImage(imageUrl)
        .then(() => setImageLoaded(true))
        .catch(() => setImageError(true));
    }
  }, [imageUrl]);

  const handleLinkClick = useCallback((e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!url) {
      e.preventDefault();
    }
  }, []);

  return (
    <motion.div
      className="project-card group relative bg-white/90 backdrop-blur-xl rounded-2xl border border-border/60 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
      style={{ willChange: 'transform' }}
      whileHover={{
        y: -12,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Project image with enhanced loading */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        {imageUrl ? (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {imageLoaded && !imageError && (
              <motion.img
                src={imageUrl}
                alt={projectTitle || `Project ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                style={{ willChange: 'transform' }}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}

            {imageError && (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/15 to-muted/20 flex items-center justify-center">
                <Layers className="w-16 h-16 text-muted-foreground opacity-60" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-secondary/15 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/15 to-muted/20 flex items-center justify-center">
            <Layers className="w-16 h-16 text-muted-foreground opacity-60" />
          </div>
        )}

        {/* Enhanced quality indicator */}
        <motion.div 
          className="absolute top-4 right-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 py-1 bg-accent/20 backdrop-blur-sm text-accent text-xs font-semibold rounded-full border border-accent/30 flex items-center">
            <Heart className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Enhanced theme gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Project title with enhanced animation */}
        {projectTitle && (
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
              {projectTitle}
            </h2>
            <motion.div 
              className="h-0.5 bg-gradient-to-r from-primary to-primary/70 rounded-full opacity-60"
              initial={{ width: 32 }}
              whileHover={{ width: 64, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Project description */}
        {about && (
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3 group-hover:text-foreground transition-colors duration-300">
            {about}
          </p>
        )}

        {/* Enhanced tag system */}
        <div className="space-y-3">
          {/* Industry tags */}
          {industryTags.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <motion.div 
                  className="w-2 h-2 bg-accent rounded-full mr-2"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                <span className="text-accent text-xs font-bold uppercase tracking-wide">
                  Industries
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {industryTags.slice(0, 3).map((tag, tagIndex) => (
                  <motion.span
                    key={tagIndex}
                    className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-lg font-semibold border border-accent/20 hover:border-accent/40 transition-colors duration-300"
                    whileHover={{ scale: 1.05, y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {tag}
                  </motion.span>
                ))}
                {industryTags.length > 3 && (
                  <span className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg border border-border/30">
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
                <motion.div 
                  className="w-2 h-2 bg-primary rounded-full mr-2"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
                <span className="text-primary text-xs font-bold uppercase tracking-wide">
                  Technologies
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {techTags.slice(0, 4).map((tech, techIndex) => (
                  <motion.span
                    key={techIndex}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-lg font-semibold border border-primary/20 hover:border-primary/40 transition-colors duration-300"
                    whileHover={{ scale: 1.05, y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {tech}
                  </motion.span>
                ))}
                {techTags.length > 4 && (
                  <span className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg border border-border/30">
                    +{techTags.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced project links */}
        {links.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center mb-3">
              <motion.div 
                className="w-2 h-2 bg-accent rounded-full mr-2"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              />
              <span className="text-accent text-xs font-bold uppercase tracking-wide">
                Links
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.slice(0, 3).map((link, linkIndex) => {
                const linkName = link?.name || `Link ${linkIndex + 1}`;
                const linkUrl = link?.url || "";
                const finalUrl = linkUrl && !linkUrl.startsWith("http") 
                  ? `https://${linkUrl}` 
                  : linkUrl;

                return (
                  <motion.a
                    key={linkIndex}
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-muted/40 text-muted-foreground rounded-lg text-xs font-semibold border border-border/40 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300"
                    style={{
                      pointerEvents: linkUrl ? "auto" : "none",
                      opacity: linkUrl ? 1 : 0.5,
                    }}
                    onClick={(e) => handleLinkClick(e, linkUrl)}
                    whileHover={linkUrl ? { scale: 1.05, y: -1 } : {}}
                    whileTap={linkUrl ? { scale: 0.95 } : {}}
                  >
                    {linkName}
                  </motion.a>
                );
              })}
              {links.length > 3 && (
                <div className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs rounded-lg border border-border/30">
                  +{links.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced hover effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 pointer-events-none rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

export default function ProjectShowcase() {
  const { data: projects, loading, error } = useSectionContent("projects");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [animationComplete, setAnimationComplete] = useState(false);

  // Optimized project selection with better memoization
  const displayProjects = useMemo(() => {
    if (!projects?.cards?.length) return [];
    
    // Use a more deterministic shuffle for consistent results
    const shuffled = [...projects.cards]
      .map((item, index) => ({ item, sort: Math.random() + index * 0.01 }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
    
    return shuffled.slice(0, Math.min(3, projects.cards.length));
  }, [projects?.cards]);

  const hasMoreProjects = projects?.cards && projects.cards.length > 3;

  // Memoized background elements
  const backgroundElements = useMemo(createBackgroundElements, []);

  // Enhanced GSAP animations with better performance
  useEffect(() => {
    if (!isInView || !containerRef.current || loading || !displayProjects.length || animationComplete) return;

    const ctx = gsap.context(() => {
      // Set initial states for better performance
      gsap.set(".hero-content", { y: 50, opacity: 0 });
      gsap.set(".project-card", { y: 60, opacity: 0, scale: 0.9 });
      gsap.set(".cta-button", { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => setAnimationComplete(true)
      });

      // Optimized animation timeline
      tl.to(".hero-content", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      })
      .to(".project-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      }, "-=0.4")
      .to(".cta-button", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading, displayProjects.length, animationComplete]);

  // Preload images when component comes into view
  useEffect(() => {
    if (!isInView || !displayProjects.length) return;

    const imagesToPreload = displayProjects
      .map(project => project.imageUrl)
      .filter(Boolean) as string[];

    imagesToPreload.forEach(imageUrl => {
      preloadImage(imageUrl).catch(() => {
        // Silently handle preload errors
      });
    });
  }, [isInView, displayProjects]);

  // Early returns
  if (loading || error || !projects || projects.hidden) return null;

  const title = projects.title || "";
  const text = projects.text || "";

  if (!title && !text && displayProjects.length === 0) return null;

  // Dynamic grid classes
  const gridClasses = useMemo(() => {
    if (displayProjects.length === 1) return "max-w-2xl mx-auto";
    if (displayProjects.length === 2) return "md:grid-cols-2 max-w-5xl mx-auto";
    return "lg:grid-cols-3 max-w-6xl mx-auto";
  }, [displayProjects.length]);

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/10 relative overflow-hidden flex items-center py-20"
    >
      {/* Simplified background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/6 via-background/95 to-accent/6" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(39,180,198,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(255,20,147,0.04),transparent_60%)]" />
      </div>

      {/* Optimized floating particles with GPU acceleration */}
      <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'contents' }}>
        {backgroundElements.map((element) => (
          <BackgroundParticle key={element.id} element={element} />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Hero section */}
        <div className="hero-content text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black mb-8 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          )}

          {text && (
            <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed font-medium max-w-3xl mx-auto">
              {text}
            </p>
          )}
        </div>

        {/* Project grid */}
        {displayProjects.length > 0 && (
          <div className={`grid gap-8 mb-16 ${gridClasses}`}>
            {displayProjects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Enhanced CTA button */}
        {hasMoreProjects && (
          <div className="cta-button text-center">
            <Link href="/projects">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(39, 180, 198, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-10 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-heading font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-400 group border border-primary/20 relative overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <span className="relative z-10">Explore All Projects</span>
                <motion.div
                  className="relative z-10 ml-3"
                  animate={{ x: [0, 4, 0] }}
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

        {/* Empty state */}
        {displayProjects.length === 0 && (title || text) && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Layers className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-4">
              Projects Coming Soon
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              Amazing projects will be showcased here once they're added to the portfolio.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
