'use client'
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';
import { X, MapPin, Clock, Users, ChevronRight, Briefcase, CheckCircle } from 'lucide-react';

export default function JobOpening() {
  const { data: jobOpening, loading, error } = useSectionContent('jobOpening');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.job-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      )
      .fromTo('.job-card', 
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: "back.out(1.4)" }, 
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !jobOpening || jobOpening.hidden) return null;

  const title = jobOpening.title || '';
  const cards = jobOpening.cards || [];

  if (!title && cards.length === 0) return null;

  return (
    <>
      <section 
        ref={containerRef}
        className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/8 relative overflow-hidden pt-26 pb-20"
      >
        {/* ✅ Enhanced background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(39,180,198,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,20,147,0.04),transparent_60%)]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          {/* ✅ Header */}
          <div className="text-center mb-16">
            {title && (
              <h2 className="job-title text-3xl md:text-4xl lg:text-5xl font-heading font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {title}
                </span>
              </h2>
            )}
          </div>

          {/* ✅ Job Cards Grid */}
          {cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((job: any, index: number) => (
                <motion.div
                  key={index}
                  className="job-card group bg-card/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-border/60 cursor-pointer"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="p-6 space-y-5">
                    
                    {/* Job Icon */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Job Title */}
                    {job.title && (
                      <h3 className="text-lg md:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                    )}

                    {/* Position - Label + Value */}
                    {(job.position || job.positionValue) && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          {job.position && (
                            <span className="text-sm text-muted-foreground font-sans font-medium">{job.position}: </span>
                          )}
                          {job.positionValue && (
                            <span className="text-foreground font-sans font-semibold">{job.positionValue}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience - Label + Value */}
                    {(job.experience || job.experienceValue) && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          {job.experience && (
                            <span className="text-sm text-muted-foreground font-sans font-medium">{job.experience}: </span>
                          )}
                          {job.experienceValue && (
                            <span className="text-foreground font-sans font-semibold">{job.experienceValue}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-primary hover:text-primary/80 font-heading font-semibold group-hover:translate-x-2 transition-all duration-300">
                          {job.viewDetailsButton || 'View Details'}
                        </span>
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}

          {/* ✅ Empty State */}
          {cards.length === 0 && title && (
            <motion.div 
              className="text-center py-24"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-muted/50 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-border/30">
                <Briefcase className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-6">No Open Positions</h3>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed font-sans">
                We're always looking for talented individuals. Check back soon for new opportunities!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ✅ Modal with same theme background (not transparent) */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-background via-muted/20 to-primary/8 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            {/* ✅ Same background pattern as main section */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-muted/10 to-primary/5" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(39,180,198,0.06),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,20,147,0.04),transparent_60%)]" />
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-card bg-primary-foreground rounded-xl shadow-2xl overflow-hidden border border-border z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ✅ Theme-consistent header */}
              <div className="sticky top-0 z-20 bg-gradient-to-r from-primary to-primary/80 px-6 py-4 border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-heading font-bold text-primary-foreground">
                        {selectedJob.title || 'Job Details'}
                      </h2>
                      <p className="text-primary-foreground/80 text-xs font-sans">
                        Full job description and requirements
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="w-8 h-8 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>

              {/* ✅ Modal content */}
              <div className="max-h-[calc(90vh-80px)] overflow-y-auto bg-card p-6 space-y-6 scrollbar-clean">
                
                {/* Position & Experience Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Position Card */}
                  {(selectedJob.position || selectedJob.positionValue) && (
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-primary-foreground" />
                        </div>
                        {selectedJob.position && (
                          <div className="text-primary font-heading font-semibold text-sm">
                            {selectedJob.position}
                          </div>
                        )}
                      </div>
                      {selectedJob.positionValue && (
                        <div className="text-foreground font-heading font-bold text-base ml-8">
                          {selectedJob.positionValue}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Experience Card */}
                  {(selectedJob.experience || selectedJob.experienceValue) && (
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
                          <Clock className="w-3 h-3 text-accent-foreground" />
                        </div>
                        {selectedJob.experience && (
                          <div className="text-accent font-heading font-semibold text-sm">
                            {selectedJob.experience}
                          </div>
                        )}
                      </div>
                      {selectedJob.experienceValue && (
                        <div className="text-foreground font-heading font-bold text-base ml-8">
                          {selectedJob.experienceValue}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Required Skills Section */}
                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h3 className="text-base font-heading font-bold text-foreground mb-3 flex items-center">
                      <div className="w-5 h-5 bg-accent rounded-md flex items-center justify-center mr-2">
                        <CheckCircle className="w-3 h-3 text-accent-foreground" />
                      </div>
                      {selectedJob.requiredSkillsTitle || 'Required Skills'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedJob.requiredSkills.map((skill: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-2 p-2 bg-card rounded-md border border-border shadow-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                          <span className="text-muted-foreground font-sans font-medium text-sm">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities Section */}
                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h3 className="text-base font-heading font-bold text-foreground mb-3 flex items-center">
                      <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center mr-2">
                        <Users className="w-3 h-3 text-primary-foreground" />
                      </div>
                      {selectedJob.responsibilityTitle || 'Key Responsibilities'}
                    </h3>
                    <div className="space-y-3">
                      {selectedJob.responsibilities.map((responsibility: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-card rounded-md border border-border shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="w-5 h-5 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-full flex items-center justify-center text-xs font-heading font-bold mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-muted-foreground font-sans text-sm leading-relaxed">{responsibility}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
