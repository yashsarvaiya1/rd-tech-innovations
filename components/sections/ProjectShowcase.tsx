'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ExternalLink, Layers } from 'lucide-react';
import Link from 'next/link';
import { useSectionContent } from '@/stores/content';

export default function ProjectShowcase() {
  const { data: projects, loading, error } = useSectionContent('projects');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Dynamic project selection based on available count
  const displayProjects = useMemo(() => {
    if (!projects?.cards || projects.cards.length === 0) return [];
    
    const shuffled = [...projects.cards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(3, projects.cards.length));
  }, [projects?.cards]);

  const hasMoreProjects = projects?.cards && projects.cards.length > 3;

  // ✅ Refined background elements
  const backgroundElements = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 60,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 210 + (Math.random() * 50),
      delay: Math.random() * 3
    })), []
  );

  // ✅ Smooth GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.hero-content', 
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.project-card', 
        { y: 100, opacity: 0, scale: 0.8, rotationY: 15 },
        { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1, stagger: 0.2, ease: "back.out(1.4)" }, 
        "-=0.8"
      )
      .fromTo('.cta-button',
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, 
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  if (loading || error || !projects || projects.hidden) return null;

  const title = projects.title || '';
  const text = projects.text || '';
  
  if (!title && !text && displayProjects.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Enhanced dark background with depth */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.02),rgba(147,51,234,0.02),rgba(59,130,246,0.02))]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.01)_25%,rgba(59,130,246,0.01)_50%,transparent_50%)] bg-[length:100px_100px]" />
      </div>

      {/* ✅ Elegant floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-3xl"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 50%, 0.08), transparent 70%)`
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ✅ Stunning hero section */}
        <div className="hero-content text-center max-w-5xl mx-auto mb-20">
          {title && (
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tight">
              <span 
                className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                }}
              >
                {title}
              </span>
            </h1>
          )}
          
          {text && (
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 leading-relaxed font-light max-w-4xl mx-auto opacity-90">
              {text}
            </p>
          )}
        </div>

        {/* ✅ Premium project grid with perfect spacing */}
        {displayProjects.length > 0 && (
          <div className={`grid gap-10 mb-16 ${
            displayProjects.length === 1 ? 'max-w-2xl mx-auto' :
            displayProjects.length === 2 ? 'md:grid-cols-2 max-w-6xl mx-auto' :
            'lg:grid-cols-3 max-w-7xl mx-auto'
          }`}>
            {displayProjects.map((project: any, index: number) => {
              const projectTitle = project.title || '';
              const about = project.about || '';
              const industryTags = project.industryTags || [];
              const techTags = project.techTags || [];
              const links = project.links || [];
              const imageUrl = project.imageUrl || '';

              return (
                <motion.div
                  key={index}
                  className="project-card group relative bg-slate-800/60 backdrop-blur-2xl rounded-3xl border border-slate-700/60 shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 overflow-hidden"
                  whileHover={{ 
                    y: -16, 
                    scale: 1.03,
                    boxShadow: "0 30px 60px rgba(59, 130, 246, 0.2)"
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                  }}
                >
                  {/* ✅ Stunning project image with enhanced effects */}
                  <div className="relative h-56 overflow-hidden">
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={projectTitle}
                          className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000"
                          loading={index === 0 ? "eager" : "lazy"}
                          style={{
                            filter: 'brightness(0.9) contrast(1.1) saturate(1.1)'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-slate-700/30 flex items-center justify-center">
                        <Layers className="w-20 h-20 text-slate-400 opacity-60" />
                      </div>
                    )}
                    
                    {/* Enhanced project index with glow */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-slate-900/90 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-slate-600/50 shadow-lg group-hover:bg-blue-600/80 transition-all duration-500">
                      <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform">{index + 1}</span>
                    </div>

                    {/* Floating quality indicator */}
                    <div className="absolute top-6 left-6 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:translate-y-0 translate-y-2">
                      <div className="px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                        Premium
                      </div>
                    </div>

                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* ✅ Enhanced content with better hierarchy */}
                  <div className="p-8 space-y-6">
                    {/* Project title with enhanced typography */}
                    {projectTitle && (
                      <div className="space-y-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                          {projectTitle}
                        </h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500"></div>
                      </div>
                    )}

                    {/* Enhanced project description */}
                    {about && (
                      <p className="text-slate-300 leading-relaxed text-base md:text-lg font-light line-clamp-4 group-hover:text-slate-200 transition-colors">
                        {about}
                      </p>
                    )}

                    {/* ✅ Beautiful tag system with animations */}
                    <div className="space-y-5">
                      {/* Industry tags with enhanced styling */}
                      {industryTags.length > 0 && (
                        <div>
                          <div className="flex items-center mb-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mr-3 shadow-lg shadow-emerald-400/20"></div>
                            <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Industries</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {industryTags.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <motion.span
                                key={tagIndex}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 text-sm rounded-xl font-semibold border border-emerald-500/30 shadow-lg backdrop-blur-sm hover:shadow-emerald-400/20 transition-all duration-300"
                              >
                                {tag}
                              </motion.span>
                            ))}
                            {industryTags.length > 3 && (
                              <span className="px-4 py-2 bg-slate-700/50 text-slate-400 text-sm rounded-xl font-medium border border-slate-600/30">
                                +{industryTags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tech tags with enhanced styling */}
                      {techTags.length > 0 && (
                        <div>
                          <div className="flex items-center mb-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-3 shadow-lg shadow-blue-400/20"></div>
                            <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">Technologies</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {techTags.slice(0, 4).map((tech: string, techIndex: number) => (
                              <motion.span
                                key={techIndex}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-sm rounded-xl font-semibold border border-blue-500/30 shadow-lg backdrop-blur-sm hover:shadow-blue-400/20 transition-all duration-300"
                              >
                                {tech}
                              </motion.span>
                            ))}
                            {techTags.length > 4 && (
                              <span className="px-4 py-2 bg-slate-700/50 text-slate-400 text-sm rounded-xl font-medium border border-slate-600/30">
                                +{techTags.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ✅ FIXED: Clickable links with proper z-index and event handling */}
                    {links.length > 0 && (
                      <div className="pt-6 border-t border-slate-700/50">
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 shadow-lg shadow-purple-400/20"></div>
                          <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">Project Links</span>
                        </div>
                        <div className="flex flex-wrap gap-3 relative z-50">
                          {links.slice(0, 4).map((link: any, linkIndex: number) => {
                            const linkName = link?.name || `Link ${linkIndex + 1}`;
                            const linkUrl = link?.url || '';
                            
                            // Ensure URL has protocol
                            const finalUrl = linkUrl && !linkUrl.startsWith('http') ? 
                              `https://${linkUrl}` : linkUrl;
                            
                            return (
                              <a
                                key={linkIndex}
                                href={finalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-50 px-4 py-2 bg-slate-700/40 text-slate-300 rounded-xl text-sm font-semibold border border-slate-600/40 shadow-lg backdrop-blur-sm hover:bg-slate-600/50 hover:text-white hover:border-purple-500/30 transition-all duration-300 cursor-pointer group/link inline-block"
                                style={{ 
                                  pointerEvents: linkUrl ? 'auto' : 'none',
                                  opacity: linkUrl ? 1 : 0.5
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
                                <span className="group-hover/link:text-purple-300 transition-colors relative z-50">
                                  {linkName}
                                </span>
                              </a>
                            );
                          })}
                          {links.length > 4 && (
                            <div className="px-4 py-2 bg-slate-800/50 text-slate-500 rounded-xl text-sm font-medium border border-slate-700/30">
                              +{links.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ Enhanced hover effects with glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
                  
                  {/* Multi-layer border glow */}
                  <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-blue-500/30 transition-colors duration-500" />
                  <div className="absolute -inset-1 rounded-3xl border border-transparent group-hover:border-purple-500/20 transition-colors duration-700 blur-sm" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Stunning CTA button with enhanced effects */}
        {hasMoreProjects && (
          <div className="cta-button text-center">
            <Link href="/projects">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-16 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group border border-blue-500/30 relative overflow-hidden"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative z-10">Explore All Projects</span>
                <motion.div
                  className="relative z-10 ml-4"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ExternalLink className="h-6 w-6" />
                </motion.div>
              </motion.button>
            </Link>
          </div>
        )}

        {/* ✅ Elegant empty state */}
        {displayProjects.length === 0 && (title || text) && (
          <motion.div 
            className="text-center py-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-slate-700/50 shadow-2xl">
              <Layers className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">Projects Coming Soon</h3>
            <p className="text-slate-400 text-xl max-w-lg mx-auto leading-relaxed">
              Amazing projects will be showcased here once they're added to the portfolio.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
