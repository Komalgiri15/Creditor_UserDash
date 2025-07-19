import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search, Clock, Play, FileText, BookOpen, CheckCircle, Video } from "lucide-react";

// Sample lessons data for different modules
const moduleLessonsData = {
  "1": {
    title: "Introduction to Business Trust",
    description: "Understanding the fundamentals of business trust structures and their applications in modern commerce.",
    totalLessons: 3,
    estimatedTime: "2 hours",
    lessons: [
      {
        id: "1",
        title: "What is Business Trust?",
        description: "Learn the basic definition and key concepts of business trust structures.",
        type: "video",
        duration: "15:30",
        completed: true,
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000"
      },
      {
        id: "2", 
        title: "Types of Business Trusts",
        description: "Explore different types of business trusts and their specific use cases.",
        type: "text",
        duration: "8 min read",
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000"
      },
      {
        id: "3",
        title: "Legal Framework and Compliance",
        description: "Understanding the legal requirements and compliance aspects of business trusts.",
        type: "video",
        duration: "22:15",
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000"
      }
    ]
  },
  "2": {
    title: "Context API & useContext",
    description: "Managing global state with React Context and the useContext hook. Learn how to create, provide, and consume context in your React applications.",
    totalLessons: 5,
    estimatedTime: "1h 45m",
    lessons: [
      {
        id: "1",
        title: "Introduction to Context API",
        description: "Learn about the React Context API and its use cases",
        type: "text",
        duration: "8 min read",
        completed: true,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000"
      },
      {
        id: "2",
        title: "Creating a Context",
        description: "Learn how to create a context and provide it to your component tree.",
        type: "video", 
        duration: "18:45",
        completed: true,
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000"
      },
      {
        id: "3",
        title: "Context API Best Practices",
        description: "Learn the best practices for using Context API in your React applications",
        type: "text",
        duration: "8 min read",
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000"
      },
      {
        id: "4",
        title: "Consuming Context with useContext",
        description: "How to use the useContext hook to access context values",
        type: "video",
        duration: "10:30", 
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000"
      },
      {
        id: "5",
        title: "Context API vs Redux",
        description: "Understanding when to use Context API versus state management libraries",
        type: "text",
        duration: "5 min read",
        completed: false,
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000"
      }
    ]
  }
};

export function ModuleLessonsView() {
  const { moduleId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const moduleData = moduleLessonsData[moduleId] || moduleLessonsData["2"];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation effect when component mounts
  useEffect(() => {
    const lessonCards = document.querySelectorAll(".lesson-card");
    lessonCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, [isLoading]);

  const filteredLessons = moduleData.lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedLessons = moduleData.lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = Math.round((completedLessons / moduleData.lessons.length) * 100);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/courses/1`}>
            <ChevronLeft size={16} />
            Back to module
          </Link>
        </Button>
        <Badge>Context API</Badge>
      </div>

      {/* Module Info */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          {moduleData.title}
        </h1>
        <p className="text-muted-foreground mb-4 text-lg">
          {moduleData.description}
        </p>
        
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <span className="font-medium">{moduleData.totalLessons} Lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            <span className="font-medium">{moduleData.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            <span className="font-medium">{completedLessons}/{moduleData.totalLessons} Completed ({progressPercentage}%)</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Module Lessons</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search lessons..."
            className="pl-8 w-[200px] rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card opacity-0 transition-all duration-500 ease-in-out">
            <Link to={`/courses/module/${moduleId}/lesson/${lesson.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={lesson.thumbnail} 
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  {lesson.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white/90 rounded-full p-3">
                        <Play size={24} className="text-primary ml-1" />
                      </div>
                    </div>
                  )}
                  <Badge 
                    className="absolute top-2 right-2 bg-black/70"
                    variant="secondary"
                  >
                    {lesson.type === "video" ? "Video" : "Article"}
                  </Badge>
                  {lesson.completed && (
                    <div className="absolute top-2 left-2">
                      <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {lesson.type === "video" ? <Video size={16} /> : <FileText size={16} />}
                    <span className={lesson.completed ? "text-muted-foreground line-through" : ""}>
                      {lesson.title}
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{lesson.duration}</span>
                    </div>
                    <Badge variant={lesson.completed ? "default" : "outline"}>
                      {lesson.completed ? "Completed" : "Not Started"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModuleLessonsView;