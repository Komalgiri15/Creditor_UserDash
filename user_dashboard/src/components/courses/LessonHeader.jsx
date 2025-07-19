import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, FileText, Clock, BookOpen, GraduationCap, FileCheck, Share2 } from "lucide-react";

export function LessonHeader({ 
  moduleId, 
  title, 
  description, 
  lessonCount, 
  quizCount = 0,
  assignmentCount = 0,
  totalDuration, 
  progress 
}) {
  return (
    <div className="lesson-header opacity-0 transition-all duration-500 ease-in-out">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild className="group transition-all duration-300 hover:bg-primary/10">
          <Link to={`/courses/module/${moduleId}`}>
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="ml-1">Back to module</span>
          </Link>
        </Button>
        <Badge className="bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors duration-300">
          Context API
        </Badge>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground mb-6 text-lg max-w-3xl">
          {description}
        </p>
        
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText size={18} className="text-primary" />
            <span className="font-medium">{lessonCount} Lessons</span>
          </div>
          
          {quizCount > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap size={18} className="text-primary" />
              <span className="font-medium">{quizCount} Quizzes</span>
            </div>
          )}
          
          {assignmentCount > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileCheck size={18} className="text-primary" />
              <span className="font-medium">{assignmentCount} Assignments</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={18} className="text-primary" />
            <span className="font-medium">{totalDuration}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">Lesson Progress</span>
            <span className="font-bold text-lg">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-accent" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-full">
              <BookOpen size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Lesson 3 of 4</h3>
              <p className="text-muted-foreground">Module: React Hooks & State Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-all duration-300">
              Continue Learning
            </Button>
            <Button variant="outline" size="icon">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonHeader;