'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminStore } from "@/stores/admin";
import { Submission, CareerSubmission } from "@/models/submission";
import { 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  AlertCircle,
  Filter,
  RefreshCw
} from "lucide-react";

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
    clearError 
  } = useAdminStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSubmissionsByType(type);
  }, [type, fetchSubmissionsByType]);

  const filteredSubmissions = submissions
    .filter((s) => s.type === type)
    .filter((s) => statusFilter === "all" || s.status === statusFilter);

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    setUpdatingIds(prev => new Set(prev).add(submissionId));
    clearError();

    try {
      await updateSubmissionStatus(submissionId, newStatus);
    } catch (error) {
      console.error("Error updating submission status:", error);
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(submissionId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'lost':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleRefresh = () => {
    fetchSubmissionsByType(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {type === "enquiry" ? "Contact Enquiries" : "Job Applications"}
          </h1>
          <p className="text-gray-600">
            Manage and respond to {type === "enquiry" ? "customer enquiries" : "job applications"}
          </p>
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
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            {error}
            <Button variant="ghost" size="sm" onClick={clearError}>×</Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {type === "enquiry" ? "Contact Submissions" : "Career Applications"}
            </span>
            <Badge variant="secondary">{filteredSubmissions.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading submissions...</span>
            </div>
          ) : filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    {type === "career" ? (
                      <>
                        <TableHead>Location</TableHead>
                        <TableHead>CTC</TableHead>
                        <TableHead>Resume</TableHead>
                      </>
                    ) : (
                      <TableHead>Requirement</TableHead>
                    )}
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission: Submission, index) => (
                    <TableRow key={`${submission.email}-${index}`}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.number}</TableCell>
                      
                      {type === "career" && submission.type === "career" ? (
                        <>
                          <TableCell>{(submission as CareerSubmission).location}</TableCell>
                          <TableCell>{(submission as CareerSubmission).ctc}</TableCell>
                          <TableCell>
                            {(submission as CareerSubmission).resumeUrl ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a 
                                  href={(submission as CareerSubmission).resumeUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                            ) : (
                              <span className="text-gray-500">No Resume</span>
                            )}
                          </TableCell>
                        </>
                      ) : (
                        <TableCell className="max-w-xs truncate">
                          {submission.type === "enquiry" && submission.requirement}
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <Badge className={getStatusColor(submission.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(submission.status)}
                            <span className="capitalize">{submission.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={submission.status}
                            onValueChange={(newStatus) => 
                              handleStatusChange(`${submission.email}-${index}`, newStatus)
                            }
                            disabled={updatingIds.has(`${submission.email}-${index}`)}
                          >
                            <SelectTrigger className="w-32">
                              {updatingIds.has(`${submission.email}-${index}`) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {type === "enquiry" ? "Enquiries" : "Applications"} Found
              </h3>
              <p className="text-gray-600">
                {statusFilter === "all" 
                  ? `No ${type} submissions have been received yet.`
                  : `No submissions with "${statusFilter}" status.`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
