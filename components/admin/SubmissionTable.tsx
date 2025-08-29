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
  AlertTriangle,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    submission: Submission | null;
    newStatus: string;
    index: number;
  }>({ open: false, submission: null, newStatus: "", index: -1 });
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchSubmissionsByType(type);
  }, [type, fetchSubmissionsByType]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      setNotification({ type, message });
    },
    []
  );

  const filteredSubmissions = submissions
    .filter((s) => s.type === type)
    .filter((s) => statusFilter === "all" || s.status === statusFilter)
    .sort((a, b) => {
      const aTime = (a as any).createdAt || 0;
      const bTime = (b as any).createdAt || 0;
      if (typeof aTime === "string" && typeof bTime === "string") {
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }
      return 0;
    });

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "N/A";

    try {
      let date: Date;

      if (
        typeof timestamp === "object" &&
        timestamp?.toDate &&
        typeof timestamp.toDate === "function"
      ) {
        date = timestamp.toDate();
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return "Invalid Date";
      }

      if (!date || Number.isNaN(date.getTime())) {
        return "Invalid Date";
      }

      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
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

      return `${date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })} (${relativeTime})`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleStatusChange = async (
    submission: Submission,
    index: number,
    newStatus: string
  ) => {
    const documentId = (submission as any).id;

    if (!documentId) {
      showNotification(
        "error",
        "Cannot update: No document ID found. Please refresh the page."
      );
      return;
    }

    const tempId = `${submission.email}-${index}`;
    setUpdatingIds((prev) => new Set(prev).add(tempId));
    clearError();

    try {
      await updateSubmissionStatus(documentId, newStatus);
      showNotification(
        "success",
        `Status updated to ${newStatus} successfully!`
      );
      await fetchSubmissionsByType(type);
    } catch (error) {
      console.error("Error updating submission status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Update failed";
      showNotification("error", `Update failed: ${errorMessage}`);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
      setConfirmDialog({
        open: false,
        submission: null,
        newStatus: "",
        index: -1,
      });
    }
  };

  const openConfirmDialog = (
    submission: Submission,
    index: number,
    newStatus: string
  ) => {
    setConfirmDialog({ open: true, submission, newStatus, index });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      submission: null,
      newStatus: "",
      index: -1,
    });
  };

  const confirmStatusChange = () => {
    if (confirmDialog.submission) {
      handleStatusChange(
        confirmDialog.submission,
        confirmDialog.index,
        confirmDialog.newStatus
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200";
      case "lost":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted/80";
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
    fetchSubmissionsByType(type);
    showNotification("info", "Data refreshed successfully");
  };

  const getTypeTitle = () => {
    return type === "enquiry" ? "Contact Enquiries" : "Job Applications";
  };

  const getTypeDescription = () => {
    return type === "enquiry"
      ? "Manage and respond to customer enquiries and contact form submissions"
      : "Review job applications and manage candidate responses";
  };

  const statusStats = {
    total: filteredSubmissions.length,
    pending: filteredSubmissions.filter((s) => s.status === "pending").length,
    completed: filteredSubmissions.filter((s) => s.status === "completed")
      .length,
    lost: filteredSubmissions.filter((s) => s.status === "lost").length,
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                type === "enquiry" ? "bg-blue-100" : "bg-purple-100"
              }`}
            >
              {type === "enquiry" ? (
                <Mail className="h-6 w-6 text-blue-600" />
              ) : (
                <Briefcase className="h-6 w-6 text-purple-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                {getTypeTitle()}
              </h1>
              <p className="text-muted-foreground font-sans mt-1">
                {getTypeDescription()}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-sans">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {statusStats.total} total
                </span>
                <span className="text-amber-600">
                  {statusStats.pending} pending
                </span>
                <span className="text-emerald-600">
                  {statusStats.completed} completed
                </span>
                <span className="text-red-600">{statusStats.lost} lost</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background border-border font-heading">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-border shadow-xl">
                <SelectItem value="all" className="font-heading">
                  All Status
                </SelectItem>
                <SelectItem value="pending" className="font-heading">
                  Pending
                </SelectItem>
                <SelectItem value="completed" className="font-heading">
                  Completed
                </SelectItem>
                <SelectItem value="lost" className="font-heading">
                  Lost
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="font-heading"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <Alert
          className={`
            ${
              notification.type === "success"
                ? "border-emerald-200 bg-emerald-50"
                : ""
            }
            ${notification.type === "error" ? "border-red-200 bg-red-50" : ""}
            ${notification.type === "info" ? "border-blue-200 bg-blue-50" : ""}
          `}
        >
          {notification.type === "success" && (
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          )}
          {notification.type === "error" && (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          {notification.type === "info" && (
            <Eye className="h-5 w-5 text-blue-600" />
          )}
          <AlertDescription
            className={`font-sans font-medium ${
              notification.type === "success" ? "text-emerald-800" : ""
            }${notification.type === "error" ? "text-red-800" : ""}${
              notification.type === "info" ? "text-blue-800" : ""
            }`}
          >
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="flex justify-between items-center font-sans">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="text-destructive hover:text-destructive/80"
            >
              ✕
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* FIXED: Main Table with Proper Horizontal Scrolling */}
      <Card className="bg-card border-border shadow-lg w-full">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="flex items-center justify-between text-foreground font-heading">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              {getTypeTitle()}
            </div>
            <Badge variant="secondary" className="font-heading">
              {filteredSubmissions.length} items
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-card">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  Loading submissions...
                </h3>
                <p className="text-muted-foreground font-sans">
                  Please wait while we fetch the data
                </p>
              </div>
            </div>
          ) : filteredSubmissions.length > 0 ? (
            /* FIXED: Removed ScrollArea wrapper and added proper scrolling container */
            <div className="h-[600px] overflow-auto bg-white">
              <Table className="w-full">
                <TableHeader className="bg-muted/20 sticky top-0 z-20">
                  <TableRow>
                    <TableHead className="font-heading font-bold min-w-[150px] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name
                      </div>
                    </TableHead>
                    <TableHead className="font-heading font-bold min-w-[200px] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                    </TableHead>
                    <TableHead className="font-heading font-bold min-w-[120px] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                    </TableHead>
                    <TableHead className="font-heading font-bold min-w-[180px] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Submitted
                      </div>
                    </TableHead>
                    {type === "career" ? (
                      <>
                        <TableHead className="font-heading font-bold min-w-[200px] whitespace-nowrap">
                          Position(s)
                        </TableHead>
                        <TableHead className="font-heading font-bold min-w-[120px] whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </div>
                        </TableHead>
                        <TableHead className="font-heading font-bold min-w-[100px] whitespace-nowrap">
                          CTC
                        </TableHead>
                        <TableHead className="font-heading font-bold min-w-[120px] whitespace-nowrap">
                          Resume
                        </TableHead>
                      </>
                    ) : (
                      <TableHead className="font-heading font-bold min-w-[250px] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Requirement
                        </div>
                      </TableHead>
                    )}
                    <TableHead className="font-heading font-bold min-w-[120px] whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="font-heading font-bold min-w-[150px] whitespace-nowrap">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission: Submission, index) => {
                    const tempId = `${submission.email}-${index}`;
                    const isUpdating = updatingIds.has(tempId);

                    return (
                      <TableRow
                        key={(submission as any).id || tempId}
                        className="hover:bg-muted/30 transition-colors border-b border-border"
                      >
                        <TableCell className="font-sans font-medium min-w-[150px]">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <span className="truncate">{submission.name}</span>
                          </div>
                        </TableCell>

                        <TableCell className="min-w-[200px]">
                          <a
                            href={`mailto:${submission.email}`}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 hover:underline font-sans truncate"
                            title={submission.email}
                          >
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{submission.email}</span>
                          </a>
                        </TableCell>

                        <TableCell className="min-w-[120px]">
                          <a
                            href={`tel:${submission.number}`}
                            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-sans"
                          >
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{submission.number}</span>
                          </a>
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground font-sans min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">
                              {formatDate((submission as any).createdAt)}
                            </span>
                          </div>
                        </TableCell>

                        {type === "career" && submission.type === "career" ? (
                          <>
                            <TableCell className="min-w-[200px]">
                              <div className="space-y-1">
                                {(submission as CareerSubmission).positions
                                  ?.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {(
                                      submission as CareerSubmission
                                    ).positions.map((position, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs font-heading bg-primary/10 text-primary border-primary/30 truncate"
                                        title={position}
                                      >
                                        {position.length > 10
                                          ? `${position.slice(0, 10)}...`
                                          : position}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm font-sans">
                                    No positions
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="min-w-[120px]">
                              <div className="flex items-center gap-2 font-sans">
                                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate" title={(submission as CareerSubmission).location}>
                                  {(submission as CareerSubmission).location ||
                                    "N/A"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="min-w-[100px]">
                              <div className="flex items-center gap-2 font-sans">
                                <Briefcase className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="truncate" title={(submission as CareerSubmission).ctc}>
                                  {(submission as CareerSubmission).ctc || "N/A"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="min-w-[120px]">
                              {(submission as CareerSubmission).resumeUrl ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="text-primary hover:text-primary/80 hover:bg-primary/10 font-heading"
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
                                    <span className="hidden sm:inline">View</span>
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-sm flex items-center gap-2 font-sans">
                                  <FileText className="h-3 w-3" />
                                  <span className="hidden sm:inline">None</span>
                                </span>
                              )}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell className="min-w-[250px]">
                            <div
                              className="truncate cursor-help font-sans"
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
                                <span className="text-muted-foreground">
                                  No requirement
                                </span>
                              )}
                            </div>
                          </TableCell>
                        )}

                        <TableCell className="min-w-[120px]">
                          <Badge
                            className={`${getStatusColor(
                              submission.status
                            )} transition-colors font-heading`}
                          >
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(submission.status)}
                              <span className="capitalize font-medium">
                                {submission.status}
                              </span>
                            </div>
                          </Badge>
                        </TableCell>

                        <TableCell className="min-w-[150px]">
                          <Select
                            value={submission.status}
                            onValueChange={(newStatus) =>
                              openConfirmDialog(submission, index, newStatus)
                            }
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-36 bg-white border-border font-heading">
                              {isUpdating ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="ml-2 hidden sm:inline">Updating...</span>
                                </>
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border shadow-xl">
                              <SelectItem
                                value="pending"
                                className="font-heading"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-amber-600" />
                                  Pending
                                </div>
                              </SelectItem>
                              <SelectItem
                                value="completed"
                                className="font-heading"
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                                  Completed
                                </div>
                              </SelectItem>
                              <SelectItem value="lost" className="font-heading">
                                <div className="flex items-center gap-2">
                                  <XCircle className="h-4 w-4 text-red-600" />
                                  Lost
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  type === "enquiry" ? "bg-blue-50" : "bg-purple-50"
                }`}
              >
                {type === "enquiry" ? (
                  <Mail className="h-10 w-10 text-blue-400" />
                ) : (
                  <Briefcase className="h-10 w-10 text-purple-400" />
                )}
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                No {getTypeTitle()} Found
              </h3>
              <p className="text-muted-foreground font-sans mb-6 max-w-md mx-auto">
                {statusFilter === "all"
                  ? `No ${type} submissions have been received yet. They will appear here once users start submitting forms.`
                  : `No submissions found with "${statusFilter}" status. Try changing the filter or check back later.`}
              </p>
              {statusFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("all")}
                  className="font-heading"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filter
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={closeConfirmDialog}>
        <DialogContent className="bg-white border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
              Confirm Status Change
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Are you sure you want to change the status of{" "}
              <strong>{confirmDialog.submission?.name}</strong>'s submission to{" "}
              <strong>{confirmDialog.newStatus}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={closeConfirmDialog}
              className="font-heading"
            >
              Cancel
            </Button>
            <Button onClick={confirmStatusChange} className="font-heading">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
