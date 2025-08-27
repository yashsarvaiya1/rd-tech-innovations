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
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden py-20"
      >
        {/* ✅ Enhanced background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-slate-50/30 to-blue-50/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(99,102,241,0.06),transparent_50%)]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
          {/* ✅ Header */}
          <div className="text-center mb-16">
            {title && (
              <h2 className="job-title text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-8">
                <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
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
                  className="job-card group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/60 cursor-pointer"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="p-8 space-y-6">
                    
                    {/* Job Icon */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Job Title */}
                    {job.title && (
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                    )}

                    {/* Position - Label + Value */}
                    {(job.position || job.positionValue) && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <div>
                          {job.position && (
                            <span className="text-sm text-slate-500 font-medium">{job.position}: </span>
                          )}
                          {job.positionValue && (
                            <span className="text-slate-800 font-semibold">{job.positionValue}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience - Label + Value */}
                    {(job.experience || job.experienceValue) && (
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          {job.experience && (
                            <span className="text-sm text-slate-500 font-medium">{job.experience}: </span>
                          )}
                          {job.experienceValue && (
                            <span className="text-slate-800 font-semibold">{job.experienceValue}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-all duration-300">
                          {job.viewDetailsButton}
                        </span>
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
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
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg backdrop-blur-sm border border-white/60">
                <Briefcase className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">No Open Positions</h3>
              <p className="text-slate-600 text-xl max-w-lg mx-auto leading-relaxed">
                We're always looking for talented individuals. Check back soon for new opportunities!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ✅ Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Modal Content */}
              <div className="max-h-[90vh] overflow-y-auto p-8 space-y-8">
                
                {/* Job Header */}
                <div className="space-y-6">
                  {/* Job Title */}
                  {selectedJob.title && (
                    <h2 className="text-3xl font-bold text-slate-900">{selectedJob.title}</h2>
                  )}
                  
                  {/* Position & Experience in Modal - Label + Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Position Card */}
                    {(selectedJob.position || selectedJob.positionValue) && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          {selectedJob.position && (
                            <div className="text-blue-600 font-medium text-sm">{selectedJob.position}</div>
                          )}
                        </div>
                        {selectedJob.positionValue && (
                          <div className="text-slate-800 font-semibold text-lg">{selectedJob.positionValue}</div>
                        )}
                      </div>
                    )}
                    
                    {/* Experience Card */}
                    {(selectedJob.experience || selectedJob.experienceValue) && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          {selectedJob.experience && (
                            <div className="text-green-600 font-medium text-sm">{selectedJob.experience}</div>
                          )}
                        </div>
                        {selectedJob.experienceValue && (
                          <div className="text-slate-800 font-semibold text-lg">{selectedJob.experienceValue}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Required Skills */}
                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                      {selectedJob.requiredSkillsTitle || 'Required Skills'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedJob.requiredSkills.map((skill: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-slate-700 font-medium">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                      <Users className="w-6 h-6 text-blue-600 mr-3" />
                      {selectedJob.responsibilityTitle || 'Responsibilities'}
                    </h3>
                    <div className="space-y-3">
                      {selectedJob.responsibilities.map((responsibility: string, index: number) => (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-slate-700 leading-relaxed">{responsibility}</span>
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
