'use client'
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useContentStore } from '@/stores/content';
import { Calendar, Users, Camera, Heart } from 'lucide-react';

export default function EventsPhotoWall() {
  const { eventsPhotoWall } = useContentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.timeline()
        .from('.events-title', { y: 50, opacity: 0, duration: 1, ease: "power2.out" })
        .from('.events-description', { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .from('.events-stats', { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    }, containerRef);

    return () => ctx.revert();
  }, [isInView]);

  if (!eventsPhotoWall || eventsPhotoWall.hidden) return null;

  const title = eventsPhotoWall.title || '';
  const description = eventsPhotoWall.description || '';
  const imageUrls = eventsPhotoWall.imageUrls || [];

  if (!title && !description && imageUrls.length === 0) return null;

  // Duplicate images for seamless infinite scroll
  const duplicatedImages = imageUrls.length > 0 ? [...imageUrls, ...imageUrls, ...imageUrls] : [];

  return (
    <section 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
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
            <p className="events-description text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
              {description}
            </p>
          )}
        </div>

        {/* Tilted Marquee Strips */}
        {imageUrls.length > 0 && (
          <div className="space-y-8 mb-16">
            {/* First Marquee - Left to Right, Tilted */}
            <div className="relative -rotate-3 overflow-hidden">
              <div className="flex animate-marquee-left [animation-duration:40s] hover:[animation-play-state:paused]">
                {duplicatedImages.slice(0, Math.ceil(duplicatedImages.length / 2)).map((imageUrl: string, index: number) => (
                  <motion.div
                    key={`left-${index}`}
                    className="flex-shrink-0 mx-3 group relative"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 relative overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={imageUrl}
                        alt={`Event moment ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                      
                      {/* Heart Icon on Hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart className="w-6 h-6 text-white fill-red-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Second Marquee - Right to Left, Tilted Opposite */}
            <div className="relative rotate-3 overflow-hidden">
              <div className="flex animate-marquee-right [animation-duration:45s] hover:[animation-play-state:paused]">
                {duplicatedImages.slice(Math.ceil(duplicatedImages.length / 2)).map((imageUrl: string, index: number) => (
                  <motion.div
                    key={`right-${index}`}
                    className="flex-shrink-0 mx-3 group relative"
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40 relative overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={imageUrl}
                        alt={`Event moment ${index + Math.ceil(duplicatedImages.length / 2) + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                      
                      {/* Camera Icon on Hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Third Marquee - Left to Right, Different Speed */}
            {imageUrls.length > 6 && (
              <div className="relative -rotate-2 overflow-hidden">
                <div className="flex animate-marquee-left [animation-duration:35s] hover:[animation-play-state:paused]">
                  {duplicatedImages.map((imageUrl: string, index: number) => (
                    <motion.div
                      key={`third-${index}`}
                      className="flex-shrink-0 mx-3 group relative"
                      whileHover={{ scale: 1.1, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-44 h-28 md:w-52 md:h-32 lg:w-60 lg:h-36 relative overflow-hidden rounded-2xl shadow-lg">
                        <img
                          src={imageUrl}
                          alt={`Event highlight ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div 
            className="events-stats group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{imageUrls.length}+</div>
            <div className="text-gray-300 text-sm">Captured Moments</div>
          </motion.div>

          <motion.div 
            className="events-stats group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">15+</div>
            <div className="text-gray-300 text-sm">Team Events</div>
          </motion.div>

          <motion.div 
            className="events-stats group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-300 text-sm">Team Members</div>
          </motion.div>

          <motion.div 
            className="events-stats group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">2024</div>
            <div className="text-gray-300 text-sm">Amazing Year</div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Camera className="w-5 h-5 mr-2" />
            Join Our Next Event
          </motion.div>
        </div>
      </div>
    </section>
  );
}
