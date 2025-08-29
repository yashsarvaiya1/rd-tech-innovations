"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useContentStore } from "@/stores/content";

export default function Navbar() {
  const pathname = usePathname();
  const { navbar } = useContentStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar for admin/auth or missing data
  if (
    !navbar ||
    navbar.hidden ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth")
  ) {
    return null;
  }

  // Extract safe values
  const logoUrl = navbar.logoUrl || "";
  const contactButton = navbar.contactButton || "Contact";
  const routesList = navbar.routesList || [];

  // Normalize routes (handle both ["Home", "About"] and [{ name, path }])
  const routes = Array.isArray(routesList)
    ? routesList
        .map((route: any, index: number) => {
          if (typeof route === "string") {
            const routeName = route;
            const routePath =
              routeName.toLowerCase() === "home"
                ? "/"
                : `/${routeName.toLowerCase().replace(/\s+/g, "-")}`;
            return { name: routeName, path: routePath };
          } else if (route && typeof route === "object") {
            return {
              name: route.name || route.title || `Route ${index + 1}`,
              path:
                route.path ||
                route.url ||
                `/${(route.name || route.title || "route")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
            };
          }
          return null;
        })
        .filter(Boolean)
    : [];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-8 right-8 z-50 mt-4 mx-auto max-w-7xl rounded-xl overflow-hidden transition-all duration-500 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-lg shadow-2xl border border-border"
          : "bg-background/70 backdrop-blur-sm shadow-lg"
      }`}
    >
      <div className="px-8 py-6 flex items-center justify-center relative">
        {/* Logo */}
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
                className="h-10 w-auto object-contain rounded-lg"
                onError={(e) => {
                  console.error("Logo failed to load:", logoUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="h-10 px-4 bg-gradient-to-r from-primary/90 via-primary/70 to-accent/50 rounded-lg flex items-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">
                  Logo
                </span>
              </div>
            )}
          </Link>
        </motion.div>

        {/* Routes (desktop) */}
        <div className="hidden lg:flex items-center space-x-8">
          {routes.length > 0 ? (
            routes.map((route, index) => (
              <motion.div
                key={route?.path || index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  href={route?.path}
                  className={`text-sm font-semibold font-sans transition-all duration-300 relative ${
                    pathname === route?.path
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {route?.name}
                  {pathname === route?.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))
          ) : (
            <span className="text-muted-foreground text-sm font-sans">
              No navigation routes
            </span>
          )}
        </div>

        {/* Contact Button + Mobile Menu Toggle */}
        <div className="absolute right-8 flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block"
          >
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg font-heading font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-ring/50"
            >
              <Phone className="h-4 w-4" />
              <span>{contactButton}</span>
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
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
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border bg-background rounded-b-xl overflow-hidden scrollbar-clean"
          >
            <div className="px-8 py-4 space-y-4">
              {routes.length > 0 ? (
                routes.map((route) => (
                  <Link
                    key={route?.path}
                    href={route?.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-foreground hover:text-primary transition-colors font-sans font-medium ${
                      pathname === route?.path ? "text-primary" : ""
                    }`}
                  >
                    {route?.name}
                  </Link>
                ))
              ) : (
                <span className="text-muted-foreground font-sans">
                  No navigation routes
                </span>
              )}

              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Phone className="h-4 w-4" />
                <span className="font-heading">{contactButton}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
