"use client";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import {
  Code,
  ExternalLink,
  FileText,
  Filter,
  Folder,
  Github,
  Search,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSectionContent } from "@/stores/content";

export default function ProjectPlayground() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST - NO EARLY RETURNS BEFORE HOOKS
  const { data: projects, loading, error } = useSectionContent("projects");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ State management - ALWAYS called
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<{
    type: string;
    value: string;
  } | null>(null);
  
  // New mobile states
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'industries' | 'technologies'>('industries');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Extract unique industries and technologies - ALWAYS called
  const allIndustries = useMemo(() => {
    if (!projects || loading || error || projects.hidden) {
      return [];
    }

    const cards = projects.cards || [];
    const industries = new Set<string>();

    cards.forEach((project: any) => {
      (project.industryTags || []).forEach((tag: string) =>
        industries.add(tag),
      );
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

      const industryMatch =
        selectedIndustries.length === 0 ||
        selectedIndustries.some((industry) =>
          projectIndustries.includes(industry),
        );

      const techMatch =
        selectedTechnologies.length === 0 ||
        selectedTechnologies.some((tech) => projectTechnologies.includes(tech));

      return industryMatch && techMatch;
    });
  }, [projects, loading, error, selectedIndustries, selectedTechnologies]);

  // ✅ Enhanced GSAP animations - ALWAYS called
  useEffect(() => {
    if (
      !isInView ||
      !containerRef.current ||
      loading ||
      !projects ||
      projects.hidden
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".playground-title",
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
      )
        .fromTo(
          ".playground-description",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.7",
        )
        .fromTo(
          ".vscode-container",
          { y: 40, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          ".sidebar-item",
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .fromTo(
          ".project-card",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3",
        );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading, projects]);

  // ✅ NOW AFTER ALL HOOKS - CONDITIONAL RENDERING IS SAFE
  if (loading || error || !projects || projects.hidden) {
    return null;
  }

  const title = projects.title || "";
  const text = projects.text || "";
  const cards = projects.cards || [];

  if (!title && !text && cards.length === 0) {
    return null;
  }

  // ✅ Drag and drop handlers (desktop only)
  const handleDragStart = (type: string, value: string) => {
    if (isMobile) return;
    setDraggedItem({ type, value });
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isMobile) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isMobile) return;
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === "industry") {
      if (!selectedIndustries.includes(draggedItem.value)) {
        setSelectedIndustries([...selectedIndustries, draggedItem.value]);
      }
    } else if (draggedItem.type === "technology") {
      if (!selectedTechnologies.includes(draggedItem.value)) {
        setSelectedTechnologies([...selectedTechnologies, draggedItem.value]);
      }
    }

    setDraggedItem(null);
  };

  // ✅ Mobile click handlers
  const handleMobileFilterClick = (type: string, value: string) => {
    if (type === "industry") {
      if (!selectedIndustries.includes(value)) {
        setSelectedIndustries([...selectedIndustries, value]);
      }
    } else if (type === "technology") {
      if (!selectedTechnologies.includes(value)) {
        setSelectedTechnologies([...selectedTechnologies, value]);
      }
    }
  };

  const removeFilter = (type: string, value: string) => {
    if (type === "industry") {
      setSelectedIndustries(
        selectedIndustries.filter((item) => item !== value),
      );
    } else {
      setSelectedTechnologies(
        selectedTechnologies.filter((item) => item !== value),
      );
    }
  };

  const clearAllFilters = () => {
    setSelectedIndustries([]);
    setSelectedTechnologies([]);
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden flex flex-col items-center justify-center pt-20 px-4"
    >
      {/* ✅ Header Section */}
      <div className="text-center max-w-4xl mx-auto mb-6 px-6">
        {title && (
          <h2 className="playground-title text-xl sm:text-2xl md:text-4xl lg:text-5xl font-heading font-black leading-tight mb-3">
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

      {/* Mobile Filter Toggle */}
      {isMobile && (
        <div className="w-full max-w-sm mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-card rounded-lg px-4 py-3 flex items-center justify-between border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-foreground text-sm font-medium">
                Filters {(selectedIndustries.length + selectedTechnologies.length > 0) && 
                  `(${selectedIndustries.length + selectedTechnologies.length})`}
              </span>
            </div>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
              showMobileFilters ? 'rotate-90' : ''
            }`} />
          </button>
        </div>
      )}

      {/* Mobile Filters Panel */}
      {isMobile && showMobileFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full max-w-sm mb-4 bg-card rounded-lg border border-border overflow-hidden"
        >
          {/* Active Filters */}
          {(selectedIndustries.length > 0 || selectedTechnologies.length > 0) && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground text-sm font-medium">Active Filters</span>
                <button
                  onClick={clearAllFilters}
                  className="text-accent text-xs px-2 py-1 bg-accent/10 rounded-md"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedIndustries.map((industry, index) => (
                  <span
                    key={index}
                    className="bg-accent/10 text-accent px-2 py-1 rounded text-xs flex items-center border border-accent/30"
                  >
                    <span className="font-sans">{industry}</span>
                    <button
                      onClick={() => removeFilter("industry", industry)}
                      className="ml-1 text-accent/70 hover:text-accent"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedTechnologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-2 py-1 rounded text-xs flex items-center border border-primary/30"
                  >
                    <span className="font-sans">{tech}</span>
                    <button
                      onClick={() => removeFilter("technology", tech)}
                      className="ml-1 text-primary/70 hover:text-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setMobileActiveTab('industries')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                mobileActiveTab === 'industries' 
                  ? 'text-accent border-b-2 border-accent bg-accent/5' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Folder className="w-4 h-4" />
                <span>Industries</span>
              </div>
            </button>
            <button
              onClick={() => setMobileActiveTab('technologies')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                mobileActiveTab === 'technologies' 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Technologies</span>
              </div>
            </button>
          </div>

          {/* Filter Content */}
          <div className="p-4 max-h-48 overflow-y-auto">
            {mobileActiveTab === 'industries' ? (
              <div className="space-y-2">
                {allIndustries.map((industry, index) => (
                  <button
                    key={index}
                    onClick={() => handleMobileFilterClick('industry', industry)}
                    disabled={selectedIndustries.includes(industry)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedIndustries.includes(industry)
                        ? 'bg-accent/20 text-accent cursor-not-allowed'
                        : 'bg-muted/50 text-foreground hover:bg-accent/10 hover:text-accent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedIndustries.includes(industry) ? 'bg-accent' : 'bg-muted-foreground'
                      }`}></div>
                      <span className="font-sans">{industry}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {allTechnologies.map((tech, index) => (
                  <button
                    key={index}
                    onClick={() => handleMobileFilterClick('technology', tech)}
                    disabled={selectedTechnologies.includes(tech)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedTechnologies.includes(tech)
                        ? 'bg-primary/20 text-primary cursor-not-allowed'
                        : 'bg-muted/50 text-foreground hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedTechnologies.includes(tech) ? 'bg-primary' : 'bg-muted-foreground'
                      }`}></div>
                      <span className="font-sans">{tech}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ✅ VSCode-like Container */}
      <div className={`vscode-container w-full max-w-7xl bg-card rounded-xl shadow-2xl overflow-hidden border border-border ${
        isMobile ? 'h-[60vh]' : 'h-[65vh]'
      }`}>
        {/* ✅ VSCode Title Bar */}
        <div className="bg-muted h-8 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Code className="w-3 h-3 text-primary" />
            <span className="text-foreground text-xs font-heading font-semibold">
              Project Playground
            </span>
          </div>
          <div className="text-muted-foreground text-xs">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ✅ VSCode Content Area */}
        <div className="flex h-[calc(100%-2rem)]">
          
          {/* Desktop Sidebars */}
          {!isMobile && (
            <>
              {/* Left Sidebar - Industries */}
              <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
                <div className="h-8 bg-muted flex items-center px-3 border-b border-border">
                  <Folder className="w-3 h-3 text-accent mr-2" />
                  <span className="text-foreground text-xs font-heading font-semibold">
                    Industries
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-clean">
                  {allIndustries.map((industry, index) => (
                    <motion.div
                      key={index}
                      className="sidebar-item bg-card hover:bg-card/80 rounded-lg px-2 py-1.5 cursor-move transition-colors group border border-border/50 hover:border-accent/50"
                      draggable
                      onDragStart={() => handleDragStart("industry", industry)}
                      whileHover={{ scale: 1.02, x: 3 }}
                      whileDrag={{ scale: 1.05, rotate: 2 }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <span className="text-muted-foreground text-xs group-hover:text-accent transition-colors truncate font-sans">
                          {industry}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ✅ Center Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Filter Bar */}
            {!isMobile && (
              <div className="h-10 bg-muted border-b border-border px-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 w-full">
                  <Search className="w-3 h-3 text-muted-foreground" />
                  <div
                    className="flex-1 bg-background rounded-lg px-3 py-1.5 min-h-[24px] border-2 border-dashed border-border flex items-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {selectedIndustries.length === 0 &&
                    selectedTechnologies.length === 0 ? (
                      <span className="text-muted-foreground text-xs font-sans">
                        Drop filters here to search projects...
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selectedIndustries.map((industry, index) => (
                          <span
                            key={index}
                            className="bg-accent/10 text-accent px-2 py-0.5 rounded text-xs flex items-center border border-accent/30"
                          >
                            <span className="truncate max-w-[80px] font-sans">
                              {industry}
                            </span>
                            <button
                              onClick={() => removeFilter("industry", industry)}
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
                            <span className="truncate max-w-[80px] font-sans">
                              {tech}
                            </span>
                            <button
                              onClick={() => removeFilter("technology", tech)}
                              className="ml-1 text-primary/70 hover:text-primary"
                            >
                              <X className="w-2 h-2" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {(selectedIndustries.length > 0 ||
                    selectedTechnologies.length > 0) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-accent hover:text-accent/80 text-xs px-2 py-1 bg-accent/10 rounded-lg border border-accent/30 font-sans"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Projects Grid */}
            <div className="flex-1 bg-background overflow-y-auto p-3 scrollbar-clean">
              {filteredProjects.length > 0 ? (
                <div className={`grid gap-3 ${
                  isMobile 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                }`}>
                  {filteredProjects.map((project: any, index: number) => {
                    const projectTitle = project.title || "";
                    const imageUrl = project.imageUrl || "";
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
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Project Image */}
                        {imageUrl && (
                          <div className={`relative overflow-hidden ${isMobile ? 'h-32' : 'h-24'}`}>
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
                        <div className="p-4 space-y-3">
                          {/* Title */}
                          {projectTitle && (
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                              <h3 className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors font-heading">
                                {projectTitle}
                              </h3>
                            </div>
                          )}

                          {/* Project Links */}
                          {links.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {links
                                .slice(0, isMobile ? 1 : 2)
                                .map((link: any, linkIndex: number) => {
                                  const linkName = link.name || "";
                                  const linkUrl = link.url || "";

                                  if (!linkName || !linkUrl) return null;

                                  const isGithub =
                                    linkName.toLowerCase().includes("github") ||
                                    linkUrl.includes("github.com");

                                  return (
                                    <motion.a
                                      key={linkIndex}
                                      href={linkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                                        isGithub
                                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                          : "bg-primary text-primary-foreground hover:bg-primary/80"
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {isGithub ? (
                                        <Github className="w-3 h-3" />
                                      ) : (
                                        <ExternalLink className="w-3 h-3" />
                                      )}
                                      <span className="font-sans">
                                        {linkName}
                                      </span>
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
                    <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-foreground text-lg font-heading font-medium mb-2">
                      No Projects Found
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 font-sans">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/80 transition-colors font-sans"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Sidebar - Technologies */}
          {!isMobile && (
            <div className="w-64 bg-muted/30 border-l border-border flex flex-col">
              <div className="h-8 bg-muted flex items-center px-3 border-b border-border">
                <Code className="w-3 h-3 text-primary mr-2" />
                <span className="text-foreground text-xs font-heading font-semibold">
                  Technologies
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-clean">
                {allTechnologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    className="sidebar-item bg-card hover:bg-card/80 rounded-lg px-2 py-1.5 cursor-move transition-colors group border border-border/50 hover:border-primary/50"
                    draggable
                    onDragStart={() => handleDragStart("technology", tech)}
                    whileHover={{ scale: 1.02, x: -3 }}
                    whileDrag={{ scale: 1.05, rotate: -2 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground text-xs group-hover:text-primary transition-colors truncate font-sans">
                        {tech}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
