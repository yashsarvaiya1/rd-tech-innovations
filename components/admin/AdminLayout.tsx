"use client";
import { AlertCircle, Bell, Loader2, LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { rdTechAuth } from "@/firebase";
import { useAdminStore } from "@/stores/admin";
import { useAuthStore } from "@/stores/auth";
import { useAdminVerification } from "@/hooks/useAdminVerification";
import AddMemberForm from "./AddMemberForm";
import AssetsManager from "./AssetsManager";
import ContentEditor from "./ContentEditor";
import DashboardOverview from "./DashboardOverview";
import Sidebar from "./Sidebar";
import SubmissionsTable from "./SubmissionTable";

export default function AdminLayout() {
  const router = useRouter();
  const { user, isAdminVerified, clearAuthState } = useAuthStore();
  const { verifyAdminAccess, isVerifying, redirectWithCleanup } =
    useAdminVerification();
  const {
    selectedSection,
    fetchContent,
    fetchSubmissions,
    fetchAdmins,
    fetchSubmissionStats,
    clearAdminData,
    loading,
    error,
    clearError,
    submissionStats,
    startAdminsListener,
  } = useAdminStore();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      message: string;
      type: "success" | "error" | "info";
      timestamp: Date;
    }>
  >([]);

  const hasInitialized = useRef(false);
  const hasVerified = useRef(false);

  // Content sections lookup
  const contentSections = useMemo(
    () =>
      new Set([
        "navbar",
        "landingPage",
        "companyMarquee",
        "companyBrief",
        "serviceOptions",
        "projects",
        "testimonials",
        "technologies",
        "industries",
        "contactUs",
        "footer",
        "whyUs",
        "vision",
        "eventsPhotoWall",
        "career",
        "jobOpening",
      ]),
    []
  );

  const isContentSection = useCallback(
    (section: string) => {
      return contentSections.has(section);
    },
    [contentSections]
  );

  // Add notification utility
  const addNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const notification = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: new Date(),
      };
      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    },
    []
  );

  // Handle redirects in useEffect, not during render
  useEffect(() => {
    // Redirect if no user - moved to useEffect to avoid render-time side effects
    if (!user?.email) {
      console.log("[AdminLayout] No user found, redirecting to auth");
      router.replace("/auth");
      return;
    }

    // Don't proceed if already initialized
    if (hasInitialized.current || isLoggingOut) return;

    hasInitialized.current = true;

    const initializeAdmin = async () => {
      try {
        if (!user?.email) {
          console.warn("[AuthPage] User has no email, cannot verify admin");
          return;
        }
        console.log("[AdminLayout] Initializing admin access for:", user.email);

        // If not already verified, verify admin access
        if (!hasVerified.current && !isAdminVerified) {
          const isValidAdmin = await verifyAdminAccess(user.email);
          if (!isValidAdmin) {
            // verifyAdminAccess handles the redirect
            return;
          }
          hasVerified.current = true;
        }

        // Start real-time listeners
        startAdminsListener();

        // Load initial data
        await Promise.all([
          fetchSubmissions(),
          fetchAdmins(),
          fetchSubmissionStats(),
        ]);

        console.log("[AdminLayout] Admin initialization completed");
      } catch (error) {
        console.error("[AdminLayout] Initialization error:", error);
        addNotification("Failed to initialize admin dashboard", "error");
      } finally {
        setInitialLoad(false);
      }
    };

    initializeAdmin();
  }, [
    user?.email,
    isAdminVerified,
    isLoggingOut,
    router,
    verifyAdminAccess,
    startAdminsListener,
    fetchSubmissions,
    fetchAdmins,
    fetchSubmissionStats,
    addNotification,
  ]);

  // Handle section changes - separate effect to avoid loops
  useEffect(() => {
    if (
      !selectedSection ||
      !isContentSection(selectedSection) ||
      initialLoad ||
      isVerifying ||
      isLoggingOut
    )
      return;

    console.log("[AdminLayout] Loading content for section:", selectedSection);
    fetchContent(selectedSection);
  }, [
    selectedSection,
    initialLoad,
    isVerifying,
    isLoggingOut,
    isContentSection,
    fetchContent,
  ]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutDialog(false);

    try {
      console.log("[AdminLayout] Starting logout...");

      // Clear error state
      clearError();

      // Sign out from Firebase
      await rdTechAuth.signOut();

      // Clear all app state
      clearAdminData();
      clearAuthState();

      // Reset initialization flags
      hasInitialized.current = false;
      hasVerified.current = false;

      addNotification("Logged out successfully", "success");

      // Redirect using the hook's cleanup method
      await redirectWithCleanup("/", "Logout completed");
    } catch (error) {
      console.error("[AdminLayout] Logout error:", error);
      addNotification("Logout error occurred", "error");

      // Force redirect even on error
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  }, [
    isLoggingOut,
    clearError,
    clearAdminData,
    clearAuthState,
    addNotification,
    redirectWithCleanup,
  ]);

  const openLogoutDialog = useCallback(() => {
    setLogoutDialog(true);
  }, []);

  const closeLogoutDialog = useCallback(() => {
    if (!isLoggingOut) {
      setLogoutDialog(false);
    }
  }, [isLoggingOut]);

  // Render main content
  const renderMainContent = useMemo(() => {
    if (initialLoad || isVerifying || isLoggingOut) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-semibold text-muted-foreground">
              {isLoggingOut
                ? "Logging out..."
                : initialLoad
                ? "Loading dashboard..."
                : "Verifying access..."}
            </p>
          </div>
        </div>
      );
    }

    switch (selectedSection) {
      case null:
      case "dashboard":
        return <DashboardOverview />;
      case "contactSubmissions":
        return <SubmissionsTable type="enquiry" />;
      case "careerSubmissions":
        return <SubmissionsTable type="career" />;
      case "addMember":
        return <AddMemberForm />;
      case "assetsManager":
        return <AssetsManager />;
      default:
        if (isContentSection(selectedSection)) {
          return <ContentEditor />;
        }
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Section Not Found
            </h3>
            <p className="text-muted-foreground">
              The selected section could not be found.
            </p>
          </div>
        );
    }
  }, [
    initialLoad,
    isVerifying,
    isLoggingOut,
    selectedSection,
    isContentSection,
  ]);

  // Show loading while checking auth or initializing
  if (!user?.email || initialLoad || isVerifying || isLoggingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl font-semibold text-muted-foreground">
            {!user?.email
              ? "Checking authentication..."
              : isLoggingOut
              ? "Logging out..."
              : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 h-16 z-30 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">RD Tech Admin</h1>
          </div>

          {submissionStats && (
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-200"
              >
                {submissionStats.pending} Pending
              </Badge>
              <Badge variant="outline" className="border-primary text-primary">
                {submissionStats.total} Total
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/50"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
              )}
            </Button>
          </div>

          {loading && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          )}

          {/* User Info & Logout */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {user.email}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={openLogoutDialog}
              disabled={isLoggingOut}
              className="hover:bg-muted/50 hover:text-destructive"
              title="Logout"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="fixed top-16 left-0 right-0 z-20 px-6 py-3 bg-card border-b border-border shadow-lg">
          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/20"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="flex justify-between items-center">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto p-1 text-destructive hover:text-destructive/80"
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-6 z-40 space-y-2">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              className={`
                max-w-md shadow-lg border-l-4 bg-card
                ${
                  notification.type === "success"
                    ? "border-l-emerald-500 bg-emerald-50"
                    : ""
                }
                ${
                  notification.type === "error"
                    ? "border-l-destructive bg-destructive/10"
                    : ""
                }
                ${
                  notification.type === "info"
                    ? "border-l-primary bg-primary/10"
                    : ""
                }
              `}
            >
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto ml-64 bg-gradient-to-br from-background to-muted/10">
          <div className="p-6 min-h-full">{renderMainContent}</div>
        </main>
      </div>

      {/* Logout Dialog */}
      <Dialog open={logoutDialog} onOpenChange={closeLogoutDialog}>
        <DialogContent className="bg-white border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center">
              <LogOut className="h-5 w-5 mr-2 text-destructive" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to logout? You will need to sign in again to
              access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeLogoutDialog}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
