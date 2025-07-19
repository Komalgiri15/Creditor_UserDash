import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Book, Clock, FileText, Video } from "lucide-react";

export function ModuleCard({ module, className }) {
  return (
    <Link to={`/courses/module/${module.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300", 
          className
        )}
      >
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={module.image} 
            alt={module.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <Badge 
            className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white"
          >
            {module.progress}% Complete
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-xl line-clamp-1">{module.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
          
          <Progress value={module.progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{module.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Book size={14} />
              <span>{module.lessonCount} Lessons</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-1 pb-3 border-t flex justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {module.quizCount} Quizzes
            </span>
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {module.assignmentCount} Assignments
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Video size={14} />
              {module.videoCount}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {module.textCount}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default ModuleCard;