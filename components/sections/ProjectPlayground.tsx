'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { ExternalLink, Github, Calendar, Users, Tag, ArrowRight } from 'lucide-react';

export default function ProjectPlayground() {
  const { projects } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.playground-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.playground-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.project-cards', { y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!projects || projects.hidden) return null;

  const title = projects.title || '';
  const text = projects.text || '';
  const cards = projects.cards || [];

  if (!title && !text && cards.length === 0) return null;

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          {title && (
            <h2 className="playground-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
          )}
          
          {text && (
            <p className="playground-description text-lg md:text-xl text-gray-600 leading-relaxed">
              {text}
            </p>
          )}
        </div>

        {/* Project Grid */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((project: any, index: number) => {
              const projectTitle = project.title || '';
              const about = project.about || '';
              const industryTags = project.industryTags || [];
              const techTags = project.techTags || [];
              const links = project.links || [];
              const imageUrl = project.imageUrl || '';

              return (
                <motion.div
                  key={index}
                  className="project-cards group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Project Image */}
                  {imageUrl && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={projectTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Project Content */}
                  <div className="p-8 space-y-6">
                    {/* Title */}
                    {projectTitle && (
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {projectTitle}
                      </h3>
                    )}

                    {/* Description */}
                    {about && (
                      <p className="text-gray-600 leading-relaxed">
                        {about}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="space-y-3">
                      {industryTags.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Tag className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">Industries</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {industryTags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {techTags.length > 0 && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-600">Technologies</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {techTags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Links */}
                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                        {links.map((link: any, linkIndex: number) => {
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
                              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                                isGithub
                                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isGithub ? (
                                <Github className="w-4 h-4" />
                              ) : (
                                <ExternalLink className="w-4 h-4" />
                              )}
                              <span>{linkName}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
        )}

        {/* Empty State */}
        {cards.length === 0 && (title || text) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Github className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600">Projects will appear here when they're added to the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
