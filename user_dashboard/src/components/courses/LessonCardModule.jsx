import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Book, Clock, FileText, Video } from "lucide-react";

export function LessonCardModule({ lesson, className }) {
  return (
    <Link to={`/courses/module/${lesson.moduleId}/lesson/${lesson.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300", 
          className
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl line-clamp-1">{lesson.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
          
          <Progress value={lesson.progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Book size={14} />
              <span>{lesson.lessonCount} Lessons</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-1 pb-3 border-t flex justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {lesson.quizCount} Quizzes
            </span>
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {lesson.assignmentCount} Assignments
            </span>
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
        </CardFooter>
      </Card>
    </Link>
  );
}

export default LessonCardModule;