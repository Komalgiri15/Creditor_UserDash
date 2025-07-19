import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { File, FileText, Video } from "lucide-react";

export function LessonCard({ lesson, className }) {
  return (
    <Link to={`/courses/module/${lesson.moduleId}/lesson/${lesson.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300 border-l-4",
          lesson.progress === 100 ? "border-l-green-500" : lesson.progress > 0 ? "border-l-blue-500" : "border-l-gray-300",
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
            <Badge variant={lesson.progress === 100 ? "default" : "outline"}>
              {lesson.progress}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
          
          <Progress value={lesson.progress} className="h-1.5" />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-muted-foreground">
                <FileText size={14} />
                {lesson.lessonCount} Lessons
              </span>
              {lesson.quizCount > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <File size={14} />
                  {lesson.quizCount} Quiz
                </span>
              )}
              {lesson.assignmentCount > 0 && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <File size={14} />
                  {lesson.assignmentCount} Assignment
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Video size={14} />
                {lesson.videoCount}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {lesson.textCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default LessonCard;