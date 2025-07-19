import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssignmentCard({ assignment, className, onSubmit, onViewSubmission }) {
  // Check if assignment is due soon (within 2 days)
  const isDueSoon = () => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= 2 && diffDays > 0;
  };
  
  // Check if assignment is overdue
  const isOverdue = () => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    return now > dueDate && assignment.status !== "submitted" && assignment.status !== "graded";
  };

  const getStatusBadge = () => {
    switch (assignment.status) {
      case "graded":
        return assignment.score && assignment.score >= (assignment.maxScore * 0.6) ? "default" : "destructive";
      case "submitted":
        return "default";
      case "in-progress":
        return "outline";
      case "not-started":
        return isOverdue() ? "destructive" : isDueSoon() ? "outline" : "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusText = () => {
    switch (assignment.status) {
      case "graded":
        return "Graded";
      case "submitted":
        return "Submitted";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return isOverdue() ? "Overdue" : isDueSoon() ? "Due Soon" : "Not Submitted";
      default:
        return "Unknown";
    }
  };

  const getButtonText = () => {
    switch (assignment.status) {
      case "graded":
        return "View Feedback";
      case "submitted":
        return "View Submission";
      case "in-progress":
        return "Continue Assignment";
      case "not-started":
        return "Submit Assignment";
      default:
        return "Start Assignment";
    }
  };

  const getButtonVariant = () => {
    return assignment.status === "graded" || assignment.status === "submitted" ? "outline" : "default";
  };

  const handleButtonClick = () => {
    if (assignment.status === "submitted" || assignment.status === "graded") {
      onViewSubmission?.();
    } else {
      onSubmit?.();
    }
  };

  const getLinkPath = () => {
    if (assignment.status === "submitted" || assignment.status === "graded") {
      return `/assignment/${assignment.id}/submissions`;
    }
    return `/assignment/${assignment.id}/submit`;
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border-l-4",
        assignment.status === "graded" 
          ? (assignment.score && assignment.score >= (assignment.maxScore * 0.6) ? "border-l-green-500 bg-green-50/30 dark:bg-green-900/10" : "border-l-red-500 bg-red-50/30 dark:bg-red-900/10") 
          : assignment.status === "submitted" ? "border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10" 
          : assignment.status === "in-progress" ? "border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10" 
          : isOverdue() ? "border-l-red-500" : "border-l-gray-300",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {assignment.status === "graded" && assignment.score && assignment.score >= (assignment.maxScore * 0.6) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {assignment.status === "graded" && assignment.score && assignment.score < (assignment.maxScore * 0.6) && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{assignment.title}</span>
              </div>
              {assignment.status === "graded" && assignment.score && (
                <Badge variant={assignment.score >= (assignment.maxScore * 0.6) ? "default" : "destructive"} className="text-xs">
                  Score: {assignment.score}/{assignment.maxScore} {assignment.score >= (assignment.maxScore * 0.6) ? "(Passed)" : "(Failed)"}
                </Badge>
              )}
            </div>
          </CardTitle>
          
          <Badge variant={getStatusBadge()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{assignment.description}</p>
        
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Due: {assignment.dueDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{assignment.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span>{assignment.fileCount} Files</span>
          </div>
        </div>
        
        {(assignment.status === "graded" || assignment.status === "submitted") && (
          <div className="bg-muted rounded-lg p-3 space-y-1">
            {assignment.status === "graded" && assignment.score && (
              <div className="flex justify-between text-sm">
                <span>Your Score:</span>
                <span className={cn("font-medium", assignment.score >= (assignment.maxScore * 0.6) ? "text-green-600" : "text-red-600")}>
                  {assignment.score}/{assignment.maxScore} ({Math.round((assignment.score/assignment.maxScore)*100)}%)
                </span>
              </div>
            )}
            {assignment.attempts && (
              <div className="flex justify-between text-sm">
                <span>Attempts:</span>
                <span className="font-medium">{assignment.attempts.used}/{assignment.attempts.total}</span>
              </div>
            )}
            {assignment.status === "graded" && assignment.score < (assignment.maxScore * 0.6) && assignment.attempts?.used < assignment.attempts?.total && (
              <p className="text-xs text-amber-600 mt-2">
                You can resubmit to improve your score.
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex gap-2">
          {assignment.status === "graded" ? (
            <>
              <Link to={`/assignment/${assignment.id}/submissions`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Feedback
                </Button>
              </Link>
              {assignment.score < (assignment.maxScore * 0.6) && assignment.attempts?.used < assignment.attempts?.total && (
                <Link to={`/assignment/${assignment.id}/submit`} className="flex-1">
                  <Button className="w-full">
                    Resubmit
                  </Button>
                </Link>
              )}
            </>
          ) : assignment.status === "submitted" ? (
            <Link to={`/assignment/${assignment.id}/submissions`} className="w-full">
              <Button variant="outline" className="w-full">
                View Submission
              </Button>
            </Link>
          ) : assignment.status === "in-progress" ? (
            <Link to={`/assignment/${assignment.id}/submit`} className="w-full">
              <Button className="w-full">
                Continue Submission
              </Button>
            </Link>
          ) : (
            <Link to={`/assignment/${assignment.id}/submit`} className="w-full">
              <Button className="w-full">
                Start Assignment
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default AssignmentCard;