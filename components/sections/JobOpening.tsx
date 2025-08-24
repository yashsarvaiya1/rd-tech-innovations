'use client'
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { X, ZoomIn, Calendar, Users } from 'lucide-react';

export default function EventsPhotoWall() {
  const { eventsPhotoWall } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.events-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.events-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.events-photos', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!eventsPhotoWall || eventsPhotoWall.hidden) return null;

  const title = eventsPhotoWall.title || '';
  const description = eventsPhotoWall.description || '';
  const imageUrls = eventsPhotoWall.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  return (
    <>
      <section 
        ref={containerRef}
        className="py-20 bg-gradient-to-br from-gray-900 to-indigo-900 text-white relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative">
          {/* Header */}
          <div className="text-center mb-16">
            {title && (
              <h2 className="events-title text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {title}
              </h2>
            )}
            
            {description && (
              <p className="events-description text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Photo Grid */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageUrls.map((imageUrl: string, index: number) => (
                <motion.div
                  key={index}
                  className="events-photos group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(imageUrl)}
                >
                  <img
                    src={imageUrl}
                    alt={`Event photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">{imageUrls.length}+</div>
              <div className="text-gray-300 text-sm">Memorable Moments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">12+</div>
              <div className="text-gray-300 text-sm">Team Events</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300 text-sm">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">2024</div>
              <div className="text-gray-300 text-sm">Amazing Year</div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Event photo"
                className="w-full h-full object-contain rounded-2xl"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
