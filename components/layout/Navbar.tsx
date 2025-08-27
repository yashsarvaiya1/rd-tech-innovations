'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { useSectionContent } from '@/stores/content';

export default function Navbar() {
  const pathname = usePathname();
  const { data: navbar, loading, error } = useSectionContent('navbar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log('[Navbar] Render - navbar:', navbar, 'loading:', loading, 'error:', error);

  // Don't render if hidden, on admin/auth paths, or critical error
  if (!navbar || navbar.hidden || pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    console.log('[Navbar] Not rendering - hidden or admin/auth path');
    return null;
  }

  if (loading) {
    console.log('[Navbar] Loading state, not rendering');
    return null;
  }

  if (error) {
    console.error('[Navbar] Error state:', error);
    return null;
  }

  // Safely extract routes and other data, with fallback to empty array/object
  const routesList = (navbar['navbar.routesList'] || navbar.routesList || navbar.navbar?.routesList || []).filter(Boolean);
  const logoUrl = navbar['navbar.logoUrl'] || navbar.logoUrl || navbar.navbar?.logoUrl || '';
  const contactButton = navbar['navbar.contactButton'] || navbar.contactButton || navbar.navbar?.contactButton || 'Contact';
  const title = navbar['navbar.title'] || navbar.title || navbar.navbar?.title || '';

  console.log('[Navbar] Processed navbar data:', { routesList, logoUrl, contactButton, title });

  // Handle routesList as array of strings or objects
  const routes = routesList.map((route: string | { name: string; path: string }) => {
    if (typeof route === 'string') {
      const routeName = route;
      const routePath = routeName.toLowerCase() === 'home' ? '/' : `/${routeName.toLowerCase().replace(/\s+/g, '-')}`;
      return {
        name: routeName,
        path: routePath
      };
    } else {
      return route;
    }
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-8 right-8 z-50 mt-4 mx-20 rounded-2xl transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-100' : 'bg-white/70 backdrop-blur-sm shadow-lg'
      }`}
    >
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title || 'Logo'}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center">
                <span className="text-white font-bold text-sm">{title || 'Logo'}</span>
              </div>
            )}
          </Link>
        </motion.div>

        {/* Navigation Routes */}
        <div className="hidden lg:flex items-center space-x-8">
          {routes.length > 0 ? (
            routes.map((route: any, index: number) => (
              <motion.div
                key={route.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={route.path}
                  className={`text-sm font-semibold transition-all duration-300 relative ${
                    pathname === route.path ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {route.name}
                  {pathname === route.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No routes available</span> // Fallback for empty routes
          )}
        </div>

        {/* Contact Button */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Phone className="h-4 w-4" />
              <span>{contactButton}</span>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-200 bg-white rounded-b-2xl overflow-hidden"
          >
            <div className="px-8 py-4 space-y-4">
              {routes.length > 0 ? (
                routes.map((route: any) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium ${
                      pathname === route.path ? 'text-blue-600' : ''
                    }`}
                  >
                    {route.name}
                  </Link>
                ))
              ) : (
                <span className="text-gray-500">No routes available</span>
              )}
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{contactButton}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
