'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { useContentStore } from '@/stores/content';

export default function Navbar() {
  const pathname = usePathname();
  const { navbar } = useContentStore(); // Same pattern as Footer
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // DEBUG: Log navbar data (same as Footer debug pattern)
  console.log('=== NAVBAR DEBUG (Footer Pattern) ===');
  console.log('navbar:', navbar);
  console.log('navbar type:', typeof navbar);
  console.log('navbar keys:', navbar ? Object.keys(navbar) : 'no navbar');

  // Same pattern as Footer - hide if no data, hidden, or on admin/auth paths
  if (!navbar || navbar.hidden || pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null;
  }

  // FIXED: Extract data using EXACT same pattern as Footer
  const logoUrl = navbar.logoUrl || '';
  const contactButton = navbar.contactButton || 'Contact';
  const routesList = navbar.routesList || [];

  // Additional debug for extracted data
  console.log('EXTRACTED NAVBAR DATA:', { 
    logoUrl, 
    contactButton, 
    routesList,
    routesListType: typeof routesList,
    routesListIsArray: Array.isArray(routesList),
    routesListLength: Array.isArray(routesList) ? routesList.length : 'not array'
  });

  // Process routes - handle both string array and object array
  const routes = Array.isArray(routesList) ? routesList.map((route: any, index: number) => {
    if (typeof route === 'string') {
      const routeName = route;
      const routePath = routeName.toLowerCase() === 'home' ? '/' : `/${routeName.toLowerCase().replace(/\s+/g, '-')}`;
      return { name: routeName, path: routePath };
    } else if (route && typeof route === 'object') {
      return {
        name: route.name || route.title || `Route ${index + 1}`,
        path: route.path || route.url || `/${(route.name || route.title || 'route').toLowerCase().replace(/\s+/g, '-')}`
      };
    }
    return null;
  }).filter(Boolean) : [];

  console.log('FINAL PROCESSED ROUTES:', routes);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-8 right-8 z-50 mt-4 mx-20 rounded-2xl transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-2xl border border-gray-100' : 'bg-white/70 backdrop-blur-sm shadow-lg'
      }`}
    >
      <div className="px-8 py-6 flex items-center justify-center relative">
        {/* Logo - positioned absolutely to left */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute left-8"
        >
          <Link href="/" className="flex items-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  console.error('Logo failed to load:', logoUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-10 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center">
                <span className="text-white font-bold text-sm">Logo</span>
              </div>
            )}
          </Link>
        </motion.div>

        {/* Navigation Routes - centered */}
        <div className="hidden lg:flex items-center space-x-8">
          {routes.length > 0 ? (
            routes.map((route: any, index: number) => (
              <motion.div
                key={route.path || index}
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
            <div className="text-center">
              <span className="text-gray-500 text-sm">No navigation routes found</span>
              <div className="text-xs text-red-500 mt-1">
                Available fields: {navbar ? Object.keys(navbar).join(', ') : 'none'}
              </div>
              <div className="text-xs text-blue-500">
                routesList: {JSON.stringify(routesList)}
              </div>
            </div>
          )}
        </div>

        {/* Contact Button - positioned absolutely to right */}
        <div className="absolute right-8 flex items-center space-x-4">
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
                <span className="text-gray-500">No navigation routes available</span>
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
