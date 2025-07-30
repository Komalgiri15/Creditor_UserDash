import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, FileText, Award } from "lucide-react";

export function AssignmentReportDialog({ open, onOpenChange, assignment }) {
  const percentage = Math.round((assignment.score / assignment.maxScore) * 100);
  const isPassing = percentage >= 70;

  const questionResults = [
    { question: "What is the main advantage of using React Context API?", score: 20, maxScore: 20, correct: true },
    { question: "Explain theme provider implementation", score: 35, maxScore: 40, correct: true },
    { question: "Potential drawbacks of Context API", score: 15, maxScore: 20, correct: false },
    { question: "Difference between createContext and useContext", score: 18, maxScore: 20, correct: true }
  ];

  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Assignment Report: {assignment.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award size={20} />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold">
                  {assignment.score}/{assignment.maxScore}
                </div>
                <Badge variant={isPassing ? "default" : "destructive"} className="text-lg px-3 py-1">
                  {percentage}%
                </Badge>
              </div>
              <Progress value={percentage} className="h-3 mb-4" />
              <div className="flex items-center gap-2">
                {isPassing ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span className={isPassing ? "text-green-600" : "text-red-600"}>
                  {isPassing ? "Passed" : "Failed"} - {isPassing ? "Great work!" : "Needs improvement"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Question Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Question Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      {result.correct ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : (
                        <XCircle className="text-red-500" size={16} />
                      )}
                      <span className="text-sm">{result.question}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {result.score}/{result.maxScore}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm">Submitted: {assignment.submittedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className="text-sm">Graded: {assignment.gradedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Feedback */}
          {assignment.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Instructor Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  {assignment.feedback}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Close Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
