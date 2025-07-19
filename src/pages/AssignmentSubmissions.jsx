import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, FileText, Download, RotateCcw, Eye } from "lucide-react";
import { toast } from "sonner";

export function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([
    {
      id: "sub1",
      submittedAt: "2023-06-15T14:30:00Z",
      score: 85,
      maxScore: 100,
      status: "graded",
      feedback: "Good work overall, but could use more detailed analysis in section 3.",
      files: ["document1.pdf", "analysis.docx"]
    },
    {
      id: "sub2",
      submittedAt: "2023-06-10T09:15:00Z",
      score: 0,
      maxScore: 100,
      status: "pending",
      files: ["assignment2.pdf"]
    }
  ]);

  const handleRegrade = (submissionId) => {
    toast.success(`Regrade requested for submission ${submissionId}`);
    // Add regrade logic here
  };

  const handleDownload = (filename) => {
    toast.success(`Downloading ${filename}...`);
    // Add download logic here
  };

  const handleViewFeedback = (submission) => {
    navigate(`/assignments/${assignmentId}/submissions/${submission.id}`, {
      state: { submission }
    });
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Assignments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assignment Submissions</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {submissions.length} submissions
              </span>
              <Button variant="outline" size="sm">
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {formatDate(submission.submittedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {submission.files.map((file, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 gap-1"
                          onClick={() => handleDownload(file)}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {file}
                          <Download className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === "graded"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {submission.status === "graded" ? "Graded" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {submission.status === "graded" ? (
                      <span className="font-medium">
                        {submission.score}/{submission.maxScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {submission.status === "graded" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFeedback(submission)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Feedback
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegrade(submission.id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Request Regrade
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default AssignmentSubmissions;