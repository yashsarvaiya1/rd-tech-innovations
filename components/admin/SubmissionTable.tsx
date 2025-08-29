"use client";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CareerSubmission,
  EnquirySubmission,
  Submission,
} from "@/models/submission";
import { useAdminStore } from "@/stores/admin";

interface SubmissionsTableProps {
  type: "enquiry" | "career";
}

export default function SubmissionsTable({ type }: SubmissionsTableProps) {
  const {
    submissions,
    fetchSubmissionsByType,
    updateSubmissionStatus,
    loading,
    error,
    clearError,
  } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSubmissionsByType(type);
  }, [type, fetchSubmissionsByType]);

  const filteredSubmissions = submissions
    .filter((s) => s.type === type)
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => {
      // Sort by createdAt in descending order (newest first)
      const aTime = (a as any).createdAt || 0;
      const bTime = (b as any).createdAt || 0;
      if (typeof aTime === "string" && typeof bTime === "string") {
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }
      return 0;
    });

  // ✅ Enhanced date formatting function
  const formatDate = (timestamp: any): string => {
    console.log("formatDate called with:", timestamp, typeof timestamp);

    if (!timestamp) {
      console.log("No timestamp provided");
      return "N/A";
    }

    try {
      let date: Date;

      // Handle Firestore Timestamp objects
      if (
        typeof timestamp === "object" &&
        timestamp?.toDate &&
        typeof timestamp.toDate === "function"
      ) {
        date = timestamp.toDate();
        console.log("Parsed as Firestore timestamp:", date);
      }
      // Handle ISO strings like "2025-08-27T17:55:59.875Z"
      else if (typeof timestamp === "string") {
        date = new Date(timestamp);
        console.log("Parsed as ISO string:", date);
      }
      // Handle numbers (milliseconds)
      else if (typeof timestamp === "number") {
        date = new Date(timestamp);
        console.log("Parsed as number:", date);
      }
      // Handle Date objects
      else if (timestamp instanceof Date) {
        date = timestamp;
        console.log("Already a Date object:", date);
      } else {
        console.log("Unknown timestamp type:", typeof timestamp, timestamp);
        return "Invalid Date";
      }

      // Validate date
      if (!date || Number.isNaN(date.getTime())) {
        console.log("Invalid date created from:", timestamp);
        return "Invalid Date";
      }

      // Format date nicely with relative time
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      let relativeTime = "";
      if (diffInMinutes < 1) {
        relativeTime = "Just now";
      } else if (diffInMinutes < 60) {
        relativeTime = `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        relativeTime = `${diffInHours}h ago`;
      } else if (diffInDays < 7) {
        relativeTime = `${diffInDays}d ago`;
      } else {
        relativeTime = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      const fullDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      console.log("Formatted date:", fullDate, "Relative:", relativeTime);
      return fullDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // ✅ Status change handler with proper document ID
  const handleStatusChange = async (
    submission: Submission,
    index: number,
    newStatus: string,
  ) => {
    // ✅ Use the actual Firestore document ID from submission
    const documentId = (submission as any).id;

    console.log("Status change attempt:", {
      submission,
      documentId,
      newStatus,
      hasId: !!(submission as any).id,
      submissionObject: submission,
    });

    if (!documentId) {
      console.error(
        "No document ID found for submission. Full submission object:",
        submission,
      );
      alert(
        "Cannot update: No document ID found. Please refresh the page and try again.",
      );
      return;
    }

    const tempId = `${submission.email}-${index}`;
    setUpdatingIds((prev) => new Set(prev).add(tempId));
    clearError();

    try {
      console.log(`Updating document ${documentId} status to: ${newStatus}`);
      await updateSubmissionStatus(documentId, newStatus);
      console.log("Status update successful");

      // Refresh data after update to show changes
      await fetchSubmissionsByType(type);
    } catch (error) {
      console.error("Error updating submission status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Update failed";
      alert(`Update failed: ${errorMessage}`);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  // Status styling functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      case "lost":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "lost":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleRefresh = () => {
    console.log(`Refreshing ${type} submissions...`);
    fetchSubmissionsByType(type);
  };

  const getTypeTitle = () => {
    return type === "enquiry" ? "Contact Enquiries" : "Job Applications";
  };

  const getTypeDescription = () => {
    return type === "enquiry"
      ? "Manage and respond to customer enquiries and contact form submissions"
      : "Review job applications and manage candidate responses";
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {type === "enquiry" ? (
              <Mail className="h-8 w-8 text-blue-600" />
            ) : (
              <Briefcase className="h-8 w-8 text-purple-600" />
            )}
            {getTypeTitle()}
          </h1>
          <p className="text-gray-600 mt-1">{getTypeDescription()}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {filteredSubmissions.length} items shown
            </span>
            {submissions.filter((s) => s.type === type).length !==
              filteredSubmissions.length && (
              <span>
                of {submissions.filter((s) => s.type === type).length} total
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {getTypeTitle()}
            </span>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredSubmissions.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Loading submissions...
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch the data
                </p>
              </div>
            </div>
          ) : filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Submitted At
                      </div>
                    </TableHead>
                    {type === "career" ? (
                      <>
                        <TableHead className="font-semibold">
                          Position(s)
                        </TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold">CTC</TableHead>
                        <TableHead className="font-semibold">Resume</TableHead>
                      </>
                    ) : (
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Requirement
                        </div>
                      </TableHead>
                    )}
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission: Submission, index) => {
                    const tempId = `${submission.email}-${index}`;
                    const isUpdating = updatingIds.has(tempId);

                    return (
                      <TableRow
                        key={(submission as any).id || tempId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            {submission.name}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-blue-600 hover:underline">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${submission.email}`}>
                              {submission.email}
                            </a>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-green-600">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${submission.number}`}>
                              {submission.number}
                            </a>
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate((submission as any).createdAt)}
                          </div>
                        </TableCell>

                        {type === "career" && submission.type === "career" ? (
                          <>
                            <TableCell>
                              <div className="space-y-1">
                                {(submission as CareerSubmission).positions
                                  ?.length > 0 ? (
                                  (
                                    submission as CareerSubmission
                                  ).positions.map((position, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="mr-1 mb-1 text-xs"
                                    >
                                      {position}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">
                                    No positions
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                {(submission as CareerSubmission).location ||
                                  "N/A"}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-3 w-3 text-gray-400" />
                                {(submission as CareerSubmission).ctc || "N/A"}
                              </div>
                            </TableCell>

                            <TableCell>
                              {(submission as CareerSubmission).resumeUrl ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <a
                                    href={
                                      (submission as CareerSubmission).resumeUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                  >
                                    <Download className="h-4 w-4" />
                                    View Resume
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-gray-500 text-sm flex items-center gap-2">
                                  <FileText className="h-3 w-3" />
                                  No Resume
                                </span>
                              )}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell className="max-w-xs">
                            <div
                              className="truncate cursor-help"
                              title={
                                submission.type === "enquiry"
                                  ? (submission as EnquirySubmission)
                                      .requirement
                                  : ""
                              }
                            >
                              {submission.type === "enquiry" &&
                              (submission as EnquirySubmission).requirement ? (
                                (submission as EnquirySubmission).requirement
                              ) : (
                                <span className="text-gray-500">
                                  No requirement
                                </span>
                              )}
                            </div>
                          </TableCell>
                        )}

                        <TableCell>
                          <Badge
                            className={`${getStatusColor(submission.status)} transition-colors`}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(submission.status)}
                              <span className="capitalize font-medium">
                                {submission.status}
                              </span>
                            </div>
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={submission.status}
                              onValueChange={(newStatus) =>
                                handleStatusChange(submission, index, newStatus)
                              }
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-36">
                                {isUpdating ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="ml-2">Updating...</span>
                                  </>
                                ) : (
                                  <SelectValue />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    Pending
                                  </div>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    Completed
                                  </div>
                                </SelectItem>
                                <SelectItem value="lost">
                                  <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    Lost
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                {type === "enquiry" ? (
                  <Mail className="h-12 w-12 text-gray-400" />
                ) : (
                  <Briefcase className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No {getTypeTitle()} Found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {statusFilter === "all"
                  ? `No ${type} submissions have been received yet. They will appear here once users start submitting forms.`
                  : `No submissions found with "${statusFilter}" status. Try changing the filter or check back later.`}
              </p>
              {statusFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("all")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filter
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
