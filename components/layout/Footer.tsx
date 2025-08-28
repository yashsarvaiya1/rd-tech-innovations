'use client';

import { useSectionContent } from '@/stores/content';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  ArrowUp,
  Calendar,
  Users,
  Building,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Social icon mapper
const getSocialIcon = (name: string) => {
  const icon = name?.toLowerCase();
  switch (icon) {
    case 'facebook':
      return <Facebook className="w-5 h-5" />;
    case 'twitter':
      return <Twitter className="w-5 h-5" />;
    case 'instagram':
      return <Instagram className="w-5 h-5" />;
    case 'linkedin':
      return <Linkedin className="w-5 h-5" />;
    case 'github':
      return <Github className="w-5 h-5" />;
    case 'youtube':
      return <Youtube className="w-5 h-5" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

export default function Footer() {
  const { data: footer, loading, error } = useSectionContent('footer');
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  // Avoid rendering in restricted pages or hidden
  if (!footer || footer.hidden || pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null;
  }

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded" />
                <div className="h-3 bg-gray-800 rounded w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  if (error) return null;

  // Extract footer data with defaults
  const {
    logoUrl = '',
    address = '',
    companyEmail = '',
    companyPhone = '',
    text = '',
    text2 = '',
    socialLinks = [],
    quickLinks = [],
  } = footer || {};

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.06),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-16">
          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {logoUrl ? (
                <Link href="/" className="inline-block group">
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </Link>
              ) : (
                <Link href="/" className="inline-block">
                  <div className="h-12 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center">
                    <span className="text-white font-bold text-lg">
                      RD Tech Innovations
                    </span>
                  </div>
                </Link>
              )}

              {text && (
                <p className="text-gray-300 leading-relaxed max-w-md text-sm lg:text-base">
                  {text}
                </p>
              )}
              {text2 && (
                <p className="text-gray-400 text-sm max-w-md">{text2}</p>
              )}

              {socialLinks.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-white">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social: any, idx: number) => (
                      <motion.a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group border border-gray-700 hover:border-blue-500"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        title={social.name}
                      >
                        {social.iconUrl ? (
                          <img
                            src={social.iconUrl}
                            alt={social.name}
                            className="w-5 h-5 object-contain group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <span className="group-hover:scale-110 transition-transform">
                            {getSocialIcon(social.name)}
                          </span>
                        )}
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-400" />
                Contact Info
              </h3>

              <div className="space-y-4">
                {companyEmail && (
                  <div className="flex items-start space-x-3 group">
                    <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${companyEmail}`}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {companyEmail}
                      </a>
                    </div>
                  </div>
                )}

                {companyPhone && (
                  <div className="flex items-start space-x-3 group">
                    <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${companyPhone}`}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {companyPhone}
                      </a>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex items-start space-x-3 group">
                    <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Address
                      </p>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Quick Links
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {(quickLinks.length > 0 ? quickLinks : [
                  { path: '/about', name: 'About Us' },
                  { path: '/projects', name: 'Projects' },
                  { path: '/career', name: 'Careers' },
                  { path: '/contact', name: 'Contact' },
                ]).map((link: { path: string; name: string }, idx: number) => (
                  <Link
                    key={idx}
                    href={link.path || '/'}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-4 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400 text-sm text-center lg:text-right flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                © {currentYear} RD Tech Innovations. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll-to-top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </footer>
    </>
  );
}
