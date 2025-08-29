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
      <footer className="bg-background text-foreground py-8 pt-20">
        <div className="max-w-7xl mx-auto px-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 bg-muted rounded-lg w-3/4" />
                <div className="h-3 bg-muted rounded-lg" />
                <div className="h-3 bg-muted rounded-lg w-5/6" />
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
      <footer className="bg-gradient-to-br from-background via-muted/20 to-primary/10 text-foreground relative overflow-hidden pt-20 py-8 rounded-xl border border-border/50">
        {/* Background accents */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(39,180,198,0.05),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,20,147,0.03),transparent_60%)]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent/40 to-primary/30 rounded-t-xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {logoUrl ? (
                <Link href="/" className="inline-block group">
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="h-12 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
                  />
                </Link>
              ) : (
                <Link href="/" className="inline-block">
                  <div className="h-12 px-4 bg-gradient-to-r from-primary/90 to-primary/70 rounded-lg flex items-center shadow-lg hover:from-primary hover:to-primary/80 transition-all duration-300">
                    <span className="text-primary-foreground font-heading font-bold text-lg">
                      RD Tech Innovations
                    </span>
                  </div>
                </Link>
              )}

              {text && (
                <p className="text-muted-foreground leading-relaxed max-w-md text-sm lg:text-base font-sans">
                  {text}
                </p>
              )}
              {text2 && (
                <p className="text-muted-foreground text-sm max-w-md font-sans">{text2}</p>
              )}

              {socialLinks.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-foreground font-heading">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social: any, idx: number) => (
                      <motion.a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-muted/50 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-primary/90 hover:to-primary/70 hover:text-primary-foreground transition-all duration-300 group border border-border hover:border-primary hover:shadow-lg"
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
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center font-heading">
                <Building className="w-5 h-5 mr-2 text-primary" />
                Contact Info
              </h3>

              <div className="space-y-4">
                {companyEmail && (
                  <div className="flex items-start space-x-3 group">
                    <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-sans">
                        Email
                      </p>
                      <a
                        href={`mailto:${companyEmail}`}
                        className="text-foreground hover:text-primary transition-colors text-sm font-sans"
                      >
                        {companyEmail}
                      </a>
                    </div>
                  </div>
                )}

                {companyPhone && (
                  <div className="flex items-start space-x-3 group">
                    <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-sans">
                        Phone
                      </p>
                      <a
                        href={`tel:${companyPhone}`}
                        className="text-foreground hover:text-primary transition-colors text-sm font-sans"
                      >
                        {companyPhone}
                      </a>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex items-start space-x-3 group">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-sans">
                        Address
                      </p>
                      <p className="text-foreground leading-relaxed text-sm font-sans">
                        {address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center font-heading">
                <Users className="w-5 h-5 mr-2 text-primary" />
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
                    className="text-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 text-sm font-sans flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 group-hover:bg-foreground transition-colors" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-4 pt-6 border-t border-border">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-muted-foreground text-sm text-center lg:text-right flex items-center font-sans">
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
              className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center focus:ring-2 focus:ring-ring/50 hover:from-primary/90 hover:to-accent/50"
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
