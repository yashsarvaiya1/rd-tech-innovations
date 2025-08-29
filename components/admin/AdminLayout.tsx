"use client";
import { AlertCircle, Bell, Loader2, LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import AddMemberForm from "./AddMemberForm";
import AssetsManager from "./AssetsManager";
import ContentEditor from "./ContentEditor";
import DashboardOverview from "./DashboardOverview";
import Sidebar from "./Sidebar";
import SubmissionsTable from "./SubmissionTable";

export default function AdminLayout() {
  const router = useRouter();
  const { user, setUser, setMessage } = useAuthStore();
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

  const isContentSection = (section: string) => {
    return [
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
    ].includes(section);
  };

  // Add notification function
  const addNotification = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  // Fetch initial data on mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        if (isMounted) {
          // Load essential data first
          await Promise.all([
            fetchSubmissions(),
            fetchAdmins(),
            fetchSubmissionStats(),
          ]);

          // Load content for selected section if exists
          if (selectedSection && isContentSection(selectedSection)) {
            await fetchContent(selectedSection);
          }
        }
      } catch (error) {
        console.error("Error loading initial admin data:", error);
        addNotification("Failed to load dashboard data", "error");
      } finally {
        if (isMounted) {
          setInitialLoad(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [
    fetchAdmins,
    fetchContent,
    fetchSubmissions,
    fetchSubmissionStats,
    selectedSection,
    addNotification,
    isContentSection,
  ]);

  // Load content when section changes
  useEffect(() => {
    if (selectedSection && isContentSection(selectedSection) && !initialLoad) {
      fetchContent(selectedSection);
    }
  }, [selectedSection, fetchContent, initialLoad, isContentSection]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutDialog(false);

    try {
      console.log("Starting logout process...");

      // Clear error state first
      clearError();

      // Sign out from Firebase
      await rdTechAuth.signOut();

      // Clear admin data and user state
      clearAdminData();
      setUser(null);
      setMessage(null);

      addNotification("Logged out successfully", "success");

      // Redirect to home page after short delay
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("Failed to logout. Please try again.");
      addNotification("Logout failed. Please try again.", "error");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const openLogoutDialog = () => {
    setLogoutDialog(true);
  };

  const closeLogoutDialog = () => {
    if (!isLoggingOut) {
      setLogoutDialog(false);
    }
  };

  const renderMainContent = () => {
    if (initialLoad) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-heading font-semibold text-muted-foreground">
              Loading admin dashboard...
            </p>
            <p className="text-sm text-muted-foreground font-sans mt-2">
              Please wait while we fetch your data
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
            <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
              Section Not Found
            </h3>
            <p className="text-muted-foreground font-sans">
              The selected section could not be found.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Enhanced Header with solid background */}
      <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 h-16 z-30 shadow-lg backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              RD Tech Admin
            </h1>
          </div>

          {submissionStats && (
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-200 font-heading"
              >
                {submissionStats.pending} Pending
              </Badge>
              <Badge
                variant="outline"
                className="border-primary text-primary font-heading"
              >
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
            <div className="flex items-center text-sm text-muted-foreground font-sans">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          )}

          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-heading font-semibold text-foreground">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  Administrator
                </p>
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
          )}
        </div>
      </header>

      {/* Error Alert - Solid Background */}
      {error && (
        <div className="fixed top-16 left-0 right-0 z-20 px-6 py-3 bg-card border-b border-border shadow-lg">
          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/20"
          >
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="flex justify-between items-center font-sans">
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

      {/* Notification System - Solid Background */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-6 z-40 space-y-2">
          {notifications.map((notification) => (
            <Alert
              key={notification.id}
              className={`
                max-w-md shadow-lg border-l-4 bg-card
                ${notification.type === "success" ? "border-l-emerald-500 bg-emerald-50" : ""}
                ${notification.type === "error" ? "border-l-destructive bg-destructive/10" : ""}
                ${notification.type === "info" ? "border-l-primary bg-primary/10" : ""}
              `}
            >
              <AlertDescription className="font-sans">
                {notification.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        <Sidebar />

        <main className="flex-1 overflow-auto ml-64 bg-gradient-to-br from-background to-muted/10">
          <div className="p-6 min-h-full">{renderMainContent()}</div>
        </main>
      </div>

      {/* Logout Confirmation Dialog - SOLID BACKGROUND */}
      <Dialog open={logoutDialog} onOpenChange={closeLogoutDialog}>
        <DialogContent className="bg-white border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading flex items-center">
              <LogOut className="h-5 w-5 mr-2 text-destructive" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Are you sure you want to logout? You will need to sign in again to
              access the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeLogoutDialog}
              disabled={isLoggingOut}
              className="font-heading"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="font-heading"
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
