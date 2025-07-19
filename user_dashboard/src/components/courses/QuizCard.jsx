import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Play, CheckCircle, AlertCircle, Timer, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizCard({ quiz, className }) {
  const isPassed = quiz.status === "completed" && quiz.score && quiz.score >= quiz.passingScore;
  const isFailed = quiz.status === "completed" && quiz.score && quiz.score < quiz.passingScore;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300 border-l-4",
        quiz.status === "completed" 
          ? (isPassed ? "border-l-green-500 bg-green-50/30 dark:bg-green-900/10" : "border-l-red-500 bg-red-50/30 dark:bg-red-900/10")
          : quiz.status === "in-progress" ? "border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10" : "border-l-gray-300",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-start gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {quiz.status === "completed" && isPassed && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {quiz.status === "completed" && isFailed && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {quiz.status === "in-progress" && (
                  <Timer className="h-5 w-5 text-amber-500" />
                )}
                <span>{quiz.title}</span>
              </div>
              {quiz.status === "completed" && quiz.score && (
                <Badge variant={isPassed ? "default" : "destructive"} className="text-xs">
                  Score: {quiz.score}% {isPassed ? "(Passed)" : "(Failed)"}
                </Badge>
              )}
            </div>
          </CardTitle>
          
          <Badge variant={
            quiz.status === "completed" 
              ? (isPassed ? "default" : "destructive")
              : quiz.status === "in-progress" ? "outline" : "secondary"
          }>
            {quiz.status === "completed" 
              ? (isPassed ? "Completed" : "Retry Required") 
              : quiz.status === "in-progress" ? "In Progress" : "Not Started"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText size={14} />
            <span>{quiz.questionCount} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{quiz.duration}</span>
          </div>
        </div>
        
        {quiz.dueDate && (
          <div className="text-sm text-muted-foreground">
            Due: {quiz.dueDate}
          </div>
        )}
        
        {quiz.status === "completed" && (
          <div className="bg-muted rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Your Score:</span>
              <span className={cn("font-medium", isPassed ? "text-green-600" : "text-red-600")}>
                {quiz.score}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Required Score:</span>
              <span className="font-medium">{quiz.passingScore}%</span>
            </div>
            {isFailed && (
              <p className="text-xs text-amber-600 mt-2">
                You can retake this quiz to improve your score.
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex gap-2">
          {quiz.status === "completed" ? (
            <>
              <Link to={`/courses/module/${quiz.moduleId}/unit/${quiz.unitId}/quiz/${quiz.id}?mode=review`} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Eye size={14} />
                  Review Quiz
                </Button>
              </Link>
              {isFailed && (
                <Link to={`/courses/module/${quiz.moduleId}/unit/${quiz.unitId}/quiz/${quiz.id}?mode=start`} className="flex-1">
                  <Button className="w-full gap-2">
                    <Play size={14} />
                    Retake Quiz
                  </Button>
                </Link>
              )}
            </>
          ) : quiz.status === "in-progress" ? (
            <Link to={`/courses/module/${quiz.moduleId}/unit/${quiz.unitId}/quiz/${quiz.id}?mode=continue`} className="w-full">
              <Button className="w-full gap-2">
                <Play size={14} />
                Continue Quiz
              </Button>
            </Link>
          ) : (
            <Link to={`/courses/module/${quiz.moduleId}/unit/${quiz.unitId}/quiz/${quiz.id}?mode=start`} className="w-full">
              <Button className="w-full gap-2">
                <Play size={14} />
                Start Quiz
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default QuizCard;