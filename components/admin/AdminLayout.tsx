'use client'
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import Sidebar from "./Sidebar";
import ContentEditor from "./ContentEditor";
import SubmissionsTable from "./SubmissionTable";
import AddMemberForm from "./AddMemberForm";
import { rdTechAuth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const router = useRouter();
  const { user, setUser, setMessage } = useAuthStore();
  const { selectedSection, fetchContent, fetchSubmissions, fetchAdmins, clearAdminData } = useAdminStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch initial data on mount (only once)
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        if (selectedSection && isMounted) {
          await fetchContent(selectedSection);
        }
        if (isMounted) {
          await fetchSubmissions();
          await fetchAdmins();
        }
      } catch (error) {
        console.error("Error loading initial admin data:", error);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [selectedSection, fetchContent, fetchSubmissions, fetchAdmins]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      console.log("Starting logout process...");
      
      // 1. Sign out from Firebase
      await rdTechAuth.signOut();
      
      // 2. Clear auth store
      setUser(null);
      setMessage(null);
      
      // 3. Clear admin store data
      clearAdminData();
      
      // 4. Clear auth token cookie
      document.cookie = "auth-token=; path=/; max-age=0; secure; samesite=strict";
      
      // 5. Clear any other session data if needed
      // localStorage.clear(); // Only if you're using localStorage
      // sessionStorage.clear(); // Only if you're using sessionStorage
      
      console.log("Logout successful, redirecting to auth page");
      
      // 6. Redirect to auth page
      router.replace("/auth");
      
    } catch (error) {
      console.error("Error during logout:", error);
      setMessage("Error during logout. Please try again.");
      
      // Force redirect even if logout fails
      setTimeout(() => {
        router.replace("/auth");
      }, 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Non-scrollable Navbar */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 h-16 z-10">
        <h1 className="text-xl font-bold">RD Tech Admin</h1>
        {user && (
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="hover:bg-gray-700"
          >
            {isLoggingOut ? "Logging out..." : `Logout (${user.email})`}
          </Button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Dynamic Middle Component */}
        <main className="flex-1 p-8 overflow-auto ml-64">
          {selectedSection === "contactSubmissions" && <SubmissionsTable type="enquiry" />}
          {selectedSection === "careerSubmissions" && <SubmissionsTable type="career" />}
          {selectedSection === "addMember" && <AddMemberForm />}
          {[
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
          ].includes(selectedSection || "") && <ContentEditor />}
        </main>
      </div>
    </div>
  );
}
