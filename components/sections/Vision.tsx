'use client'
import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { useSectionContent } from '@/stores/content';

export default function Vision() {
  const { data: vision, loading, error } = useSectionContent('vision');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // ✅ Enhanced background particles
  const backgroundElements = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 150 + 100,
      top: Math.random() * 100,
      left: Math.random() * 100,
      hue: 240 + (Math.random() * 80), // Purple to blue spectrum
      delay: Math.random() * 4
    })), []
  );

  // ✅ Enhanced GSAP animations
  useEffect(() => {
    if (!isInView || !containerRef.current || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.vision-title', 
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }
      )
      .fromTo('.vision-description', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" }, 
        "-=1"
      )
      .fromTo('.vision-card', 
        { y: 120, opacity: 0, scale: 0.7, rotationY: 20 },
        { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1.2, stagger: 0.2, ease: "back.out(1.6)" }, 
        "-=0.8"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  // ✅ Early return after hooks
  if (loading || error || !vision || vision.hidden) return null;

  const title = vision.title || '';
  const description = vision.description || '';
  const cards = vision.cards || [];

  if (!title && !description && cards.length === 0) return null;

  // ✅ Dynamic grid classes based on card count
  const getGridClasses = (count: number) => {
    if (count === 0) return '';
    if (count === 1) return 'max-w-lg mx-auto';
    if (count === 2) return 'md:grid-cols-2 max-w-4xl mx-auto';
    if (count === 3) return 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
    if (count <= 4) return 'md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto';
    if (count <= 6) return 'md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto';
    return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto';
  };

  // ✅ Dynamic gradient colors for cards
  const gradients = [
    'from-violet-600 to-purple-700',
    'from-blue-600 to-indigo-700', 
    'from-emerald-600 to-teal-700',
    'from-rose-600 to-pink-700',
    'from-amber-600 to-orange-700',
    'from-cyan-600 to-blue-700',
    'from-purple-600 to-fuchsia-700',
    'from-indigo-600 to-purple-700'
  ];

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 relative overflow-hidden flex items-center py-20"
    >
      {/* ✅ Enhanced background with floating particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-purple-50/30 to-indigo-50/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,69,199,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(139,69,199,0.02),rgba(99,102,241,0.02),rgba(139,69,199,0.02))]" />
      </div>

      {/* ✅ Floating background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {backgroundElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              width: element.size,
              height: element.size,
              top: `${element.top}%`,
              left: `${element.left}%`,
              background: `radial-gradient(circle, hsla(${element.hue}, 60%, 70%, 0.4), transparent 70%)`
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-25, 25, -25],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* ✅ Enhanced header section */}
        <div className="text-center max-w-5xl mx-auto mb-20 space-y-8">
          {title && (
            <h2 className="vision-title text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
              <span 
                className="bg-gradient-to-r from-purple-800 via-violet-700 to-indigo-800 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 10px 40px rgba(139, 69, 199, 0.3)'
                }}
              >
                {title}
              </span>
            </h2>
          )}
          
          {description && (
            <div className="vision-description space-y-6">
              <p className="text-xl md:text-2xl lg:text-3xl text-slate-700 leading-relaxed font-light max-w-4xl mx-auto">
                {description}
              </p>
              
              {/* ✅ Decorative element */}
              <div className="flex justify-center items-center space-x-4">
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full" />
                <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* ✅ Vision Cards with Dynamic Layout */}
        {cards.length > 0 && (
          <div className={`grid gap-8 ${getGridClasses(cards.length)}`}>
            {cards.map((card: any, index: number) => {
              const cardTitle = card.title || '';
              const cardDescription = card.description || '';
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={index}
                  className="vision-card group relative p-8 md:p-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 border border-white/70 overflow-hidden"
                  whileHover={{ 
                    y: -12, 
                    scale: 1.03,
                    boxShadow: "0 30px 60px rgba(139, 69, 199, 0.2)"
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* ✅ Enhanced card content */}
                  <div className="relative z-10 space-y-6">
                    
                    {/* ✅ Card number with gradient */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-white font-black text-2xl">
                          {index + 1}
                        </span>
                      </div>
                      
                      {/* ✅ Visual accent */}
                      <div className="flex-1 h-1 bg-gradient-to-r from-slate-200 via-purple-200 to-slate-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* ✅ Card Title */}
                    {cardTitle && (
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-tight">
                        {cardTitle}
                      </h3>
                    )}

                    {/* ✅ Card Description */}
                    {cardDescription && (
                      <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors">
                        {cardDescription}
                      </p>
                    )}

                    {/* ✅ Interactive accent line */}
                    <div className={`w-12 h-1 bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-100 group-hover:w-24 transition-all duration-500`} />
                  </div>

                  {/* ✅ Enhanced hover effects */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace('600', '500').replace('700', '600')} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl pointer-events-none`} />
                  
                  {/* ✅ Floating accent element */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className={`w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-2xl`} />
                  </div>
                  
                  {/* ✅ Border glow */}
                  <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-200/50 transition-colors duration-300" />
                  
                  {/* ✅ Enhanced shadow glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl -z-10" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ✅ Enhanced empty state */}
        {cards.length === 0 && (title || description) && (
          <motion.div 
            className="text-center py-24"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-40 h-40 bg-gradient-to-br from-purple-200/50 to-violet-200/50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg backdrop-blur-sm border border-white/60">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full shadow-lg" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">Vision Cards Coming Soon</h3>
            <p className="text-slate-600 text-xl max-w-lg mx-auto leading-relaxed">
              Inspiring vision cards will be showcased here once they're added to the portfolio.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
