import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Trophy, Clock, RotateCcw, CheckCircle, XCircle, Star, FileCheck, Calendar } from "lucide-react";

export function AssignmentResultsPage() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const score = parseInt(searchParams.get('score') || '0');
  const timeSpent = parseInt(searchParams.get('timeSpent') || '0');
  
  const [showAnimation, setShowAnimation] = useState(false);

  const assignmentInfo = {
    title: `Assignment ${assignmentId}: Context API Implementation`,
    maxScore: 100,
    timeLimit: "2 hours",
    passingScore: 70,
    attemptsRemaining: 2,
    totalAttempts: 3
  };

  const questionResults = [
    { id: "q1", question: "ThemeContext TypeScript Interface", points: 15, scored: 12, status: "partial" },
    { id: "q2", question: "ThemeProvider Component Implementation", points: 20, scored: 18, status: "good" },
    { id: "q3", question: "useTheme Custom Hook", points: 15, scored: 15, status: "excellent" },
    { id: "q4", question: "Styled Components Implementation", points: 25, scored: 20, status: "good" },
    { id: "q5", question: "Theme Persistence Feature", points: 15, scored: 10, status: "partial" },
    { id: "q6", question: "Error Handling & Testing Explanation", points: 10, scored: 10, status: "excellent" }
  ];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "partial":
        return <XCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { grade: "A+", color: "text-green-600" };
    if (percentage >= 80) return { grade: "A", color: "text-green-600" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-600" };
    if (percentage >= 60) return { grade: "C", color: "text-orange-600" };
    return { grade: "F", color: "text-red-600" };
  };

  const grade = getGrade(score, assignmentInfo.maxScore);
  const percentage = (score / assignmentInfo.maxScore) * 100;
  const isPassed = score >= assignmentInfo.passingScore;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ChevronLeft size={16} />
            Back to Assessments
          </Link>
        </Button>
        <Badge variant={isPassed ? "default" : "destructive"}>
          {isPassed ? "Assignment Passed" : "Assignment Failed"}
        </Badge>
      </div>

      {/* Results Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${isPassed ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} flex items-center justify-center text-white ${showAnimation ? 'animate-scale-in' : ''}`}>
            {isPassed ? <Trophy size={32} /> : <XCircle size={32} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Assignment Results
            </h1>
            <p className="text-muted-foreground text-lg">
              {assignmentInfo.title}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className={`text-3xl font-bold ${grade.color}`}>{score}</div>
            <div className="text-sm text-muted-foreground">Points Scored</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className={`text-3xl font-bold ${grade.color}`}>{grade.grade}</div>
            <div className="text-sm text-muted-foreground">Grade</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{Math.round(percentage)}%</div>
            <div className="text-sm text-muted-foreground">Percentage</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{formatTime(timeSpent)}</div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-yellow-500" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{score}/{assignmentInfo.maxScore} points</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="space-y-3">
            {questionResults.map((result, index) => (
              <div key={result.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-sm">{result.question}</p>
                    <p className="text-xs text-muted-foreground">Question {index + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">
                    {result.scored}/{result.points}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((result.scored / result.points) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={isPassed ? "default" : "destructive"}>
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Passing Score:</span>
              <span className="font-medium">{assignmentInfo.passingScore} points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Your Score:</span>
              <span className={`font-medium ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {score} points
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Time Limit:</span>
              <span className="font-medium">{assignmentInfo.timeLimit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Time Used:</span>
              <span className="font-medium">{formatTime(timeSpent)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attempt Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Current Attempt:</span>
              <span className="font-medium">
                {assignmentInfo.totalAttempts - assignmentInfo.attemptsRemaining} of {assignmentInfo.totalAttempts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Attempts Remaining:</span>
              <span className="font-medium text-blue-600">{assignmentInfo.attemptsRemaining}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Submission Date:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Next Attempt:</span>
              <span className="font-medium">
                {assignmentInfo.attemptsRemaining > 0 ? "Available Now" : "No attempts left"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section */}
      {!isPassed && (
        <Card className="mb-6 border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-orange-800">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-orange-700">
              <li>• Review TypeScript interface definitions for React Context</li>
              <li>• Strengthen your implementation of theme persistence features</li>
              <li>• Practice error handling patterns in React applications</li>
              <li>• Consider reviewing the assignment requirements more carefully</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" asChild className="flex-1">
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ChevronLeft size={16} className="mr-2" />
            Return to Assessments
          </Link>
        </Button>
        
        {assignmentInfo.attemptsRemaining > 0 && (
          <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
            <Link to={`/assignment-instruction/${assignmentId}?module=${moduleId}`}>
              <RotateCcw size={16} className="mr-2" />
              Retake Assignment
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default AssignmentResultsPage;