'use client'
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/admin";

const sections = [
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
  "contactSubmissions",
  "careerSubmissions",
  "addMember",
];

export default function Sidebar() {
  const { selectedSection, setSelectedSection } = useAdminStore();

  return (
    <aside className="w-64 bg-gray-100 p-4 fixed top-16 bottom-0 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {sections.map((section) => (
          <Button
            key={section}
            variant={selectedSection === section ? "default" : "ghost"}
            className="justify-start"
            onClick={() => setSelectedSection(section)}
          >
            {section.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
