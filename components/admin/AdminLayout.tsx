import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import Sidebar from "./Sidebar";
import ContentEditor from "./ContentEditor";
import SubmissionsTable from "./SubmissionTable";
import AddMemberForm from "./AddMemberForm";
import { rdTechAuth } from "@/firebase";

export default function AdminLayout() {
  const { user, setUser } = useAuthStore();
  const { selectedSection, fetchContent, fetchSubmissions, fetchAdmins } = useAdminStore();

  // Fetch initial data on mount
  if (selectedSection) {
    fetchContent(selectedSection);
  }
  fetchSubmissions();
  fetchAdmins();

  const handleLogout = async () => {
    await rdTechAuth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Non-scrollable Navbar */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 h-16 z-10">
        <h1 className="text-xl font-bold">RD Tech Admin</h1>
        {user && (
          <Button variant="ghost" onClick={handleLogout}>
            Logout ({user.email})
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
