"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteInfo {
  path: string;
  displayName: string;
}

// Define your actual routes here - update this as you add pages
const APP_ROUTES: RouteInfo[] = [
  { path: "/", displayName: "Home" },
  // Add routes as you create them:
  { path: "/about", displayName: "About" },
  { path: "/career", displayName: "Career" },
  { path: "/projects", displayName: "Projects" },
];

export function useAvailableRoutes() {
  const _pathname = usePathname();
  const [routes, setRoutes] = useState<RouteInfo[]>([]);

  useEffect(() => {
    // Filter out admin and auth routes (if any accidentally added)
    const publicRoutes = APP_ROUTES.filter(
      (route) =>
        !route.path.startsWith("/admin") &&
        !route.path.startsWith("/auth") &&
        !route.path.startsWith("/contact"),
    );

    setRoutes(publicRoutes);
  }, []);

  return routes;
}

// Function to add new route to the config
export function addRoute(path: string, displayName: string) {
  APP_ROUTES.push({ path, displayName });
}

// Export for server-side usage
export function getAvailableRoutes(): RouteInfo[] {
  return APP_ROUTES.filter(
    (route) =>
      !route.path.startsWith("/admin") && !route.path.startsWith("/auth"),
  );
}
