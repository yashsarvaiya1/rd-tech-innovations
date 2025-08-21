import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/stores/admin";
import { doc, setDoc } from "firebase/firestore";
import { rdTechDb, collections } from "@/firebase";
import { Content } from "@/models/content";

export default function ContentEditor() {
  const { selectedSection, content, setContent } = useAdminStore();

  if (!selectedSection) return null;

  const handleContentChange = async (field: string, value: string) => {
    if (!selectedSection || !sections.includes(selectedSection)) return;

    const sectionKey = selectedSection as keyof Omit<Content, "id" | "seoTitle" | "seoDescription">;
    const updatedContent = {
      ...content,
      id: selectedSection,
      [sectionKey]: {
        ...(content?.[sectionKey] || {}),
        [field]: value,
      },
    };
    setContent(updatedContent);

    try {
      await setDoc(doc(rdTechDb, collections.content, selectedSection), updatedContent);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const getSectionField = (field: string) => {
    if (!content || !selectedSection || !sections.includes(selectedSection)) return "";
    const sectionKey = selectedSection as keyof Omit<Content, "id" | "seoTitle" | "seoDescription">;
    return (content[sectionKey] as any)?.[field] || "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {selectedSection?.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={getSectionField("title")}
              onChange={(e) => handleContentChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={getSectionField("description")}
              onChange={(e) => handleContentChange("description", e.target.value)}
            />
          </div>
          <Button onClick={() => handleContentChange("title", getSectionField("title"))}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
];
