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
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden flex flex-col items-center justify-center py-6"
    >
      {/* ✅ Header Section - Above Container with Bigger Title */}
      <div className="text-center max-w-4xl mx-auto mb-6 px-6">
        {title && (
          <h2 className="playground-title text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-3">
            <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        )}
        
        {text && (
          <p className="playground-description text-sm md:text-base lg:text-lg text-slate-600 leading-relaxed font-light">
            {text}
          </p>
        )}
      </div>

      {/* ✅ VSCode-like Container - Lighter Outlines */}
      <div className="vscode-container w-full max-w-7xl h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
        
        {/* ✅ VSCode Title Bar - Light Theme with Lighter Borders */}
        <div className="bg-slate-100 h-7 flex items-center justify-between px-4 border-b border-slate-300">
          <div className="flex items-center space-x-3">
            <Code className="w-3 h-3 text-blue-600" />
            <span className="text-slate-800 text-xs font-semibold">Project Playground</span>
          </div>
          <div className="text-slate-600 text-xs">
            {filteredProjects.length} projects
          </div>
        </div>

        {/* ✅ VSCode Content Area */}
        <div className="flex h-[calc(100%-1.75rem)]">
          
          {/* ✅ Left Sidebar - Industries with Lighter Borders */}
          <div className="w-64 bg-slate-50 border-r border-slate-300 flex flex-col">
            {/* Sidebar Header */}
            <div className="h-8 bg-slate-100 flex items-center px-3 border-b border-slate-300">
              <Folder className="w-3 h-3 text-green-600 mr-2" />
              <span className="text-slate-800 text-xs font-semibold">Industries</span>
            </div>
            
            {/* Industries List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {allIndustries.map((industry, index) => (
                <motion.div
                  key={index}
                  className="sidebar-item bg-white hover:bg-green-50 rounded-md px-2 py-1.5 cursor-move transition-colors group border border-slate-200 hover:border-green-300"
                  draggable
                  onDragStart={() => handleDragStart('industry', industry)}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700 text-xs group-hover:text-green-700 truncate">{industry}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ✅ Center Content Area */}
          <div className="flex-1 flex flex-col">
            
            {/* ✅ Filter Bar with Lighter Borders */}
            <div className="h-10 bg-slate-100 border-b border-slate-300 px-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-3 h-3 text-slate-600" />
                <div 
                  className="flex-1 bg-white rounded-md px-3 py-1.5 min-h-[24px] border-2 border-dashed border-slate-300 flex items-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {selectedIndustries.length === 0 && selectedTechnologies.length === 0 ? (
                    <span className="text-slate-500 text-xs">Drop filters here to search projects...</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedIndustries.map((industry, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs flex items-center border border-green-200"
                        >
                          <span className="truncate max-w-[80px]">{industry}</span>
                          <button
                            onClick={() => removeFilter('industry', industry)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </span>
                      ))}
                      {selectedTechnologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center border border-blue-200"
                        >
                          <span className="truncate max-w-[80px]">{tech}</span>
                          <button
                            onClick={() => removeFilter('technology', tech)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
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
                    className="text-red-600 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded border border-red-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* ✅ Projects Grid */}
            <div className="flex-1 bg-white overflow-y-auto p-3">
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredProjects.map((project: any, index: number) => {
                    const projectTitle = project.title || '';
                    const imageUrl = project.imageUrl || '';
                    const links = project.links || [];

                    return (
                      <motion.div
                        key={index}
                        className="project-card bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ y: -3, scale: 1.02 }}
                      >
                        {/* Project Image */}
                        {imageUrl && (
                          <div className="relative h-30 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={projectTitle}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          </div>
                        )}

                        {/* Project Content */}
                        <div className="p-3 space-y-2">
                          {/* Title */}
                          {projectTitle && (
                            <div className="flex items-center space-x-2">
                              <FileText className="w-3 h-3 text-blue-600" />
                              <h3 className="text-slate-800 font-semibold text-xs group-hover:text-blue-600 transition-colors truncate">
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
                                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
                                      isGithub
                                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {isGithub ? (
                                      <Github className="w-2 h-2" />
                                    ) : (
                                      <ExternalLink className="w-2 h-2" />
                                    )}
                                    <span className="truncate max-w-[80px]">{linkName}</span>
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
                    <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <h3 className="text-slate-600 text-sm font-medium mb-2">No Projects Found</h3>
                    <p className="text-slate-500 text-xs mb-3">Try adjusting your filters</p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Right Sidebar - Technologies with Lighter Borders */}
          <div className="w-64 bg-slate-50 border-l border-slate-300 flex flex-col">
            {/* Sidebar Header */}
            <div className="h-8 bg-slate-100 flex items-center px-3 border-b border-slate-300">
              <Code className="w-3 h-3 text-blue-600 mr-2" />
              <span className="text-slate-800 text-xs font-semibold">Technologies</span>
            </div>
            
            {/* Technologies List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {allTechnologies.map((tech, index) => (
                <motion.div
                  key={index}
                  className="sidebar-item bg-white hover:bg-blue-50 rounded-md px-2 py-1.5 cursor-move transition-colors group border border-slate-200 hover:border-blue-300"
                  draggable
                  onDragStart={() => handleDragStart('technology', tech)}
                  whileHover={{ scale: 1.02, x: -3 }}
                  whileDrag={{ scale: 1.05, rotate: -2 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700 text-xs group-hover:text-blue-700 truncate">{tech}</span>
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
