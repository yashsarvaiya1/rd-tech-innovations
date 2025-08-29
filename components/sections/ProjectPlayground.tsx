'use client'
import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { ExternalLink, Github, X, Filter, Code, Folder, FileText, Search } from 'lucide-react';

export default function ProjectPlayground() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE HOOKS
  const { data: projects, loading, error } = useSectionContent('projects');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ State management - ALWAYS called
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<{ type: string; value: string } | null>(null);

  // ✅ Extract unique industries and technologies - ALWAYS called
  const allIndustries = useMemo(() => {
    if (!projects || loading || error || projects.hidden) {
      return [];
    }

    const cards = projects.cards || [];
    const industries = new Set<string>();

    cards.forEach((project: any) => {
      (project.industryTags || []).forEach((tag: string) => industries.add(tag));
    });

    return Array.from(industries);
  }, [projects, loading, error]);

  // ✅ Extract unique technologies - ALWAYS called  
  const allTechnologies = useMemo(() => {
    if (!projects || loading || error || projects.hidden) {
      return [];
    }

    const cards = projects.cards || [];
    const technologies = new Set<string>();

    cards.forEach((project: any) => {
      (project.techTags || []).forEach((tag: string) => technologies.add(tag));
    });

    return Array.from(technologies);
  }, [projects, loading, error]);

  // ✅ Filter projects based on selected filters - ALWAYS called
  const filteredProjects = useMemo(() => {
    if (!projects || loading || error || projects.hidden) {
      return [];
    }

    const cards = projects.cards || [];

    if (selectedIndustries.length === 0 && selectedTechnologies.length === 0) {
      return cards;
    }

    return cards.filter((project: any) => {
      const projectIndustries = project.industryTags || [];
      const projectTechnologies = project.techTags || [];

      const industryMatch = selectedIndustries.length === 0 || 
        selectedIndustries.some(industry => projectIndustries.includes(industry));
      
      const techMatch = selectedTechnologies.length === 0 || 
        selectedTechnologies.some(tech => projectTechnologies.includes(tech));

      return industryMatch && techMatch;
    });
  }, [projects, loading, error, selectedIndustries, selectedTechnologies]);

  // ✅ Enhanced GSAP animations - ALWAYS called
  useEffect(() => {
    if (!isInView || !containerRef.current || loading || !projects || projects.hidden) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.playground-title', 
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo('.playground-description', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 
        "-=0.7"
      )
      .fromTo('.vscode-container', 
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }, 
        "-=0.5"
      )
      .fromTo('.sidebar-item', 
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }, 
        "-=0.6"
      )
      .fromTo('.project-card', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }, 
        "-=0.3"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading, projects]);

  // ✅ NOW AFTER ALL HOOKS - CONDITIONAL RENDERING IS SAFE
  if (loading || error || !projects || projects.hidden) {
    return null;
  }

  const title = projects.title || '';
  const text = projects.text || '';
  const cards = projects.cards || [];

  if (!title && !text && cards.length === 0) {
    return null;
  }

  // ✅ Drag and drop handlers
  const handleDragStart = (type: string, value: string) => {
    setDraggedItem({ type, value });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === 'industry') {
      if (!selectedIndustries.includes(draggedItem.value)) {
        setSelectedIndustries([...selectedIndustries, draggedItem.value]);
      }
    } else if (draggedItem.type === 'technology') {
      if (!selectedTechnologies.includes(draggedItem.value)) {
        setSelectedTechnologies([...selectedTechnologies, draggedItem.value]);
      }
    }

    setDraggedItem(null);
  };

  const removeFilter = (type: string, value: string) => {
    if (type === 'industry') {
      setSelectedIndustries(selectedIndustries.filter(item => item !== value));
    } else {
      setSelectedTechnologies(selectedTechnologies.filter(item => item !== value));
    }
  };

  const clearAllFilters = () => {
    setSelectedIndustries([]);
    setSelectedTechnologies([]);
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden flex flex-col items-center justify-center pt-20"
    >
      {/* ✅ Header Section - Above Container with Better Sizing */}
      <div className="text-center max-w-4xl mx-auto mb-6 px-6">
        {title && (
          <h2 className="playground-title text-2xl md:text-4xl lg:text-5xl font-heading font-black leading-tight mb-3">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        )}
        
        {text && (
          <p className="playground-description text-sm md:text-base lg:text-lg text-foreground leading-relaxed font-sans font-medium">
            {text}
          </p>
        )}
      </div>

      {/* ✅ VSCode-like Container - Theme Consistent */}
      <div className="vscode-container w-full max-w-7xl h-[65vh] bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
        
        {/* ✅ VSCode Title Bar - Theme Colors */}
        <div className="bg-muted h-7 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Code className="w-3 h-3 text-primary" />
            <span className="text-foreground text-xs font-heading font-semibold">Project Playground</span>
          </div>
          <div className="text-muted-foreground text-xs">
            {filteredProjects.length} projects
          </div>
        </div>

        {/* ✅ VSCode Content Area */}
        <div className="flex h-[calc(100%-1.75rem)]">
          
          {/* ✅ Left Sidebar - Industries with Theme Colors */}
          <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
            {/* Sidebar Header */}
            <div className="h-8 bg-muted flex items-center px-3 border-b border-border">
              <Folder className="w-3 h-3 text-accent mr-2" />
              <span className="text-foreground text-xs font-heading font-semibold">Industries</span>
            </div>
            
            {/* Industries List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-clean">
              {allIndustries.map((industry, index) => (
                <motion.div
                  key={index}
                  className="sidebar-item bg-card hover:bg-card/80 rounded-lg px-2 py-1.5 cursor-move transition-colors group border border-border/50 hover:border-accent/50"
                  draggable
                  onDragStart={() => handleDragStart('industry', industry)}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground text-xs group-hover:text-accent transition-colors truncate font-sans">{industry}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ✅ Center Content Area */}
          <div className="flex-1 flex flex-col">
            
            {/* ✅ Filter Bar with Theme Colors */}
            <div className="h-10 bg-muted border-b border-border px-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-3 h-3 text-muted-foreground" />
                <div 
                  className="flex-1 bg-background rounded-lg px-3 py-1.5 min-h-[24px] border-2 border-dashed border-border flex items-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {selectedIndustries.length === 0 && selectedTechnologies.length === 0 ? (
                    <span className="text-muted-foreground text-xs font-sans">Drop filters here to search projects...</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedIndustries.map((industry, index) => (
                        <span
                          key={index}
                          className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs flex items-center border border-accent/30"
                        >
                          <span className="truncate max-w-[80px] font-sans">{industry}</span>
                          <button
                            onClick={() => removeFilter('industry', industry)}
                            className="ml-1 text-accent/70 hover:text-accent"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </span>
                      ))}
                      {selectedTechnologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs flex items-center border border-primary/30"
                        >
                          <span className="truncate max-w-[80px] font-sans">{tech}</span>
                          <button
                            onClick={() => removeFilter('technology', tech)}
                            className="ml-1 text-primary/70 hover:text-primary"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {(selectedIndustries.length > 0 || selectedTechnologies.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-accent hover:text-accent/80 text-xs px-2 py-1 bg-accent/10 rounded-lg border border-accent/30 font-sans"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* ✅ Projects Grid */}
            <div className="flex-1 bg-background overflow-y-auto p-3 scrollbar-clean">
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredProjects.map((project: any, index: number) => {
                    const projectTitle = project.title || '';
                    const imageUrl = project.imageUrl || '';
                    const links = project.links || [];

                    return (
                      <motion.div
                        key={index}
                        className="project-card bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -3, scale: 1.02 }}
                      >
                        {/* Project Image */}
                        {imageUrl && (
                          <div className="relative h-24 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={projectTitle}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent" />
                          </div>
                        )}

                        {/* Project Content */}
                        <div className="p-3 space-y-2">
                          {/* Title */}
                          {projectTitle && (
                            <div className="flex items-center space-x-2">
                              <FileText className="w-3 h-3 text-primary" />
                              <h3 className="text-foreground font-semibold text-xs group-hover:text-primary transition-colors truncate font-heading">
                                {projectTitle}
                              </h3>
                            </div>
                          )}

                          {/* Project Links */}
                          {links.length > 0 && (
                            <div className="flex space-x-1">
                              {links.slice(0, 2).map((link: any, linkIndex: number) => {
                                const linkName = link.name || '';
                                const linkUrl = link.url || '';

                                if (!linkName || !linkUrl) return null;

                                const isGithub = linkName.toLowerCase().includes('github') || linkUrl.includes('github.com');

                                return (
                                  <motion.a
                                    key={linkIndex}
                                    href={linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                      isGithub
                                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                        : 'bg-primary text-primary-foreground hover:bg-primary/80'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {isGithub ? (
                                      <Github className="w-2 h-2" />
                                    ) : (
                                      <ExternalLink className="w-2 h-2" />
                                    )}
                                    <span className="truncate max-w-[80px] font-sans">{linkName}</span>
                                  </motion.a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Filter className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-foreground text-sm font-heading font-medium mb-2">No Projects Found</h3>
                    <p className="text-muted-foreground text-xs mb-3 font-sans">Try adjusting your filters</p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs hover:bg-primary/80 transition-colors font-sans"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Right Sidebar - Technologies with Theme Colors */}
          <div className="w-64 bg-muted/30 border-l border-border flex flex-col">
            {/* Sidebar Header */}
            <div className="h-8 bg-muted flex items-center px-3 border-b border-border">
              <Code className="w-3 h-3 text-primary mr-2" />
              <span className="text-foreground text-xs font-heading font-semibold">Technologies</span>
            </div>
            
            {/* Technologies List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-clean">
              {allTechnologies.map((tech, index) => (
                <motion.div
                  key={index}
                  className="sidebar-item bg-card hover:bg-card/80 rounded-lg px-2 py-1.5 cursor-move transition-colors group border border-border/50 hover:border-primary/50"
                  draggable
                  onDragStart={() => handleDragStart('technology', tech)}
                  whileHover={{ scale: 1.02, x: -3 }}
                  whileDrag={{ scale: 1.05, rotate: -2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground text-xs group-hover:text-primary transition-colors truncate font-sans">{tech}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
