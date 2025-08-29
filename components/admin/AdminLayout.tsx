"use client";
import { AlertCircle, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    isContentSection,
  ]); // Only run once on mount

  // Load content when section changes
  useEffect(() => {
    if (selectedSection && isContentSection(selectedSection) && !initialLoad) {
      fetchContent(selectedSection);
    }
  }, [selectedSection, fetchContent, initialLoad, isContentSection]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

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

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderMainContent = () => {
    if (initialLoad) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
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
      case "assetsManager": // ADD THIS CASE
        return <AssetsManager />;
      default:
        if (isContentSection(selectedSection)) {
          return <ContentEditor />;
        }
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Section Not Found
            </h3>
            <p className="text-gray-600">
              The selected section could not be found.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 h-16 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">RD Tech Admin</h1>
          {submissionStats && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {submissionStats.pending} Pending
              </Badge>
              <Badge variant="outline" className="text-xs">
                {submissionStats.total} Total
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {loading && (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          )}

          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hover:bg-gray-100"
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

      {/* Error Alert */}
      {error && (
        <div className="fixed top-16 left-0 right-0 z-20 px-6 py-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto p-1 text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        <Sidebar />

        <main className="flex-1 overflow-auto ml-64">
          <div className="p-6">{renderMainContent()}</div>
        </main>
      </div>
    </div>
  );
}
