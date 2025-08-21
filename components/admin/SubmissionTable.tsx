import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminStore } from "@/stores/admin";
import { Submission } from "@/models/submission";

export default function SubmissionsTable({ type }: { type: "enquiry" | "career" }) {
  const { submissions } = useAdminStore();

  console.log(`Rendering ${type} submissions:`, submissions.filter((s) => s.type === type));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "enquiry" ? "Contact Submissions" : "Career Submissions"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              {type === "career" && <TableHead>Resume</TableHead>}
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions
              .filter((s) => s.type === type)
              .map((submission: Submission) => (
                <TableRow key={submission.email}>
                  <TableCell>{submission.name || "N/A"}</TableCell>
                  <TableCell>{submission.email || "N/A"}</TableCell>
                  {type === "career" && (
                    <TableCell>
                      {submission.type === "career" && submission.resumeUrl ? (
                        <a href={submission.resumeUrl} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </a>
                      ) : (
                        "No Resume"
                      )}
                    </TableCell>
                  )}
                  <TableCell>{submission.status || "Pending"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
