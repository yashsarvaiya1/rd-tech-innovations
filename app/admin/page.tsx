'use client'
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { rdTechDb, collections } from "../../firebase";
import { useEffect, useState } from "react";
import { Content } from "../../models/content";
import { Submission } from "../../models/submission";
import { Admins } from "../../models/admins";

const sections = [
  "navbar", "landingPage", "companyMarquee", "companyBrief", "serviceOptions",
  "projects", "testimonials", "technologies", "industries", "contactUs",
  "footer", "whyUs", "vision", "eventsPhotoWall", "career", "jobOpening",
];

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);

  useEffect(() => {
    // Fetch content
    const fetchContent = async () => {
      if (selectedSection && sections.includes(selectedSection)) {
        const docRef = doc(rdTechDb, collections.content, selectedSection);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent({ id: selectedSection, ...docSnap.data() } as Content);
        } else {
          setContent({ id: selectedSection }); // Initialize empty content with ID
        }
      }
    };

    // Fetch submissions
    const fetchSubmissions = async () => {
      // Implement fetching submissions (simplified for now)
    };

    // Fetch admins
    const fetchAdmins = async () => {
      const docRef = doc(rdTechDb, collections.admins, "admins");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdmins(docSnap.data().emails || []);
      }
    };

    fetchContent();
    fetchSubmissions();
    fetchAdmins();
  }, [selectedSection]);

  const handleSaveContent = async () => {
    if (content && selectedSection) {
      await setDoc(doc(rdTechDb, collections.content, selectedSection), content);
    }
  };

  const handleAddAdmin = async (email: string) => {
    const newAdmins = [...admins, email];
    await setDoc(doc(rdTechDb, collections.admins, "admins"), { emails: newAdmins });
    setAdmins(newAdmins);
  };

  const handleContentChange = (field: string, value: string) => {
    if (!selectedSection || !content || !sections.includes(selectedSection)) return;

    // Ensure the section is a valid key excluding seoTitle and seoDescription
    const sectionKey = selectedSection as keyof Omit<Content, "id" | "seoTitle" | "seoDescription">;
    setContent({
      ...content,
      id: selectedSection,
      [sectionKey]: {
        ...(content[sectionKey] || {}),
        [field]: value,
      },
    });
  };

  // Safely get title for the selected section
  const getSectionTitle = () => {
    if (!content || !selectedSection || !sections.includes(selectedSection)) return "";
    const sectionKey = selectedSection as keyof Omit<Content, "id" | "seoTitle" | "seoDescription">;
    return (content[sectionKey] as any)?.title || "";
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <nav>
          {sections.map((section) => (
            <Button
              key={section}
              variant="ghost"
              className="w-full text-left"
              onClick={() => setSelectedSection(section)}
            >
              {section}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full text-left"
            onClick={() => setSelectedSection("contactSubmissions")}
          >
            Contact Submissions
          </Button>
          <Button
            variant="ghost"
            className="w-full text-left"
            onClick={() => setSelectedSection("careerSubmissions")}
          >
            Career Submissions
          </Button>
          <Button
            variant="ghost"
            className="w-full text-left"
            onClick={() => setSelectedSection("addMember")}
          >
            Add Member
          </Button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8">
        {selectedSection && sections.includes(selectedSection) && (
          <Card>
            <CardHeader>
              <CardTitle>Edit {selectedSection}</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <Label>Title</Label>
                <Input
                  value={getSectionTitle()}
                  onChange={(e) => handleContentChange("title", e.target.value)}
                />
                {/* Add more fields dynamically based on section */}
                <Button onClick={handleSaveContent} className="mt-4">
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {selectedSection === "contactSubmissions" && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions
                    .filter((s) => s.type === "enquiry")
                    .map((submission) => (
                      <TableRow key={submission.email}>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {selectedSection === "careerSubmissions" && (
          <Card>
            <CardHeader>
              <CardTitle>Career Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions
                    .filter((s) => s.type === "career")
                    .map((submission) => (
                      <TableRow key={submission.email}>
                        <TableCell>{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>
                          <a href={submission.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </TableCell>
                        <TableCell>{submission.status}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {selectedSection === "addMember" && (
          <Card>
            <CardHeader>
              <CardTitle>Add Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as any).email.value;
                  handleAddAdmin(email);
                }}
              >
                <Label>Email</Label>
                <Input name="email" type="email" />
                <Button type="submit" className="mt-4">
                  Add Admin
                </Button>
              </form>
              <ul className="mt-4">
                {admins.map((email) => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
