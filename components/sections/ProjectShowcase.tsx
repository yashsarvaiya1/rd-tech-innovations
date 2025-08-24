'use client'
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Filter } from 'lucide-react';
import Link from 'next/link';
import { useContentStore } from '@/stores/content';

export default function ProjectShowcase() {
  const { projects } = useContentStore();
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Get unique industry and tech tags for filtering
  const { industries, technologies } = useMemo(() => {
    if (!projects?.cards) return { industries: [], technologies: [] };

    const allIndustries = new Set<string>();
    const allTechnologies = new Set<string>();

    projects.cards.forEach((project: any) => {
      project.industryTags?.forEach((tag: string) => allIndustries.add(tag));
      project.techTags?.forEach((tag: string) => allTechnologies.add(tag));
    });

    return {
      industries: Array.from(allIndustries),
      technologies: Array.from(allTechnologies)
    };
  }, [projects]);

  // Filter projects based on selection
  const filteredProjects = useMemo(() => {
    if (!projects?.cards || selectedFilter === 'all') {
      return projects?.cards?.slice(0, 6) || [];
    }

    return projects.cards.filter((project: any) => 
      project.industryTags?.includes(selectedFilter) ||
      project.techTags?.includes(selectedFilter)
    ).slice(0, 6);
  }, [projects, selectedFilter]);

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    ...industries.map((industry: string) => ({ value: industry, label: industry })),
    ...technologies.map((tech: string) => ({ value: tech, label: tech }))
  ];

  if (!projects || !filteredProjects.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
            {projects.title || 'Featured Projects'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {projects.text || 'Explore our latest work and see how we bring ideas to life through innovative solutions'}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <div className="flex items-center space-x-2 text-gray-500 mb-4">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.slice(0, 8).map((option: any) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(option.value)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border-2 ${
                  selectedFilter === option.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid - Responsive */}
        <div className={`grid gap-8 mb-12 ${
          filteredProjects.length === 1 ? 'max-w-2xl mx-auto' :
          filteredProjects.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
          filteredProjects.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3' :
          'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          <AnimatePresence mode="wait">
            {filteredProjects.map((project: any, index: number) => (
              <motion.div
                key={`${selectedFilter}-${index}`}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                  {project.imageUrl ? (
                    <>
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold text-center px-4">{project.title}</span>
                    </div>
                  )}
                  
                  {/* Project Links Overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    {project.links?.slice(0, 2).map((link: any, linkIndex: number) => (
                      <motion.a
                        key={linkIndex}
                        href={typeof link === 'string' ? link : link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: linkIndex * 0.1 }}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
                      >
                        {(typeof link === 'string' ? link : link.url)?.includes('github') ? (
                          <Github className="w-6 h-6 text-white" />
                        ) : (
                          <ExternalLink className="w-6 h-6 text-white" />
                        )}
                      </motion.a>
                    ))}
                  </motion.div>
                </div>

                {/* Project Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {project.about}
                  </p>

                  {/* Tags */}
                  <div className="space-y-4">
                    {project.industryTags && project.industryTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium text-gray-500 mr-2">Industries:</span>
                        {project.industryTags.slice(0, 2).map((tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.industryTags.length > 2 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{project.industryTags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {project.techTags && project.techTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-medium text-gray-500 mr-2">Tech:</span>
                        {project.techTags.slice(0, 3).map((tech: string, techIndex: number) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techTags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{project.techTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Gradient Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More Button */}
        {projects.cards && projects.cards.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                View All Projects
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
