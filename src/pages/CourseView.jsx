import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc, BookOpen, FileCheck, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Sample modules data structure for courses
const courseModules = [
  {
    id: "1",
    title: "Introduction to Business Trust",
    description: "Understanding the fundamentals of business trust structures and their applications in modern commerce.",
    lessonCount: 3,
    assessmentCount: 1,
    duration: "2 hours",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000",
    status: "available"
  },
  {
    id: "2", 
    title: "Kick-off: Why Digital Marketing Matters for Your Side Hustle",
    description: "Get an engaging, image-rich overview of how digital marketing fuels a side hustle's growth.",
    lessonCount: 7,
    assessmentCount: 2,
    duration: "4 hours",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
    status: "available"
  },
  {
    id: "3",
    title: "Creating Magnetic Content and Social Presence", 
    description: "Using storyboard exercises and visual templates, you'll practice crafting on-brand content.",
    lessonCount: 5,
    assessmentCount: 1,
    duration: "3 hours",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000",
    status: "available"
  },
  {
    id: "4",
    title: "Advanced Analytics and Performance Tracking",
    description: "Master the art of measuring and optimizing your digital marketing efforts for maximum ROI.",
    lessonCount: 6,
    assessmentCount: 3,
    duration: "5 hours", 
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000",
    status: "locked"
  }
];

export function CourseView() {
  const { courseId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredModules, setFilteredModules] = useState(courseModules);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter modules based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModules(courseModules);
    } else {
      const filtered = courseModules.filter(module =>
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModules(filtered);
    }
  }, [searchQuery]);

  // Animation effect when component mounts or search results change
  useEffect(() => {
    const moduleCards = document.querySelectorAll(".module-card");
    moduleCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, [isLoading, filteredModules]);

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/courses">
                    ← Back to Courses
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Course Modules</h1>
                  <p className="text-muted-foreground mt-1">
                    Access modules in any order
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search modules..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {filteredModules.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No modules found</h3>
                  <p className="text-muted-foreground mt-1">
                    Try adjusting your search query
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map((module) => (
                    <div key={module.id} className="module-card opacity-0 transition-all duration-500 ease-in-out">
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src={module.image} 
                            alt={module.title}
                            className="w-full h-full object-cover"
                          />
                          {module.status === "locked" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                  🔒
                                </div>
                                <p className="text-sm">Module Locked</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg line-clamp-2">{module.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 pb-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen size={14} />
                              <span>{module.lessonCount} lessons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileCheck size={14} />
                              <span>{module.assessmentCount} assessments</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="pt-0 pb-4 flex flex-col gap-2">
                          <Button 
                            asChild 
                            className="w-full" 
                            disabled={module.status === "locked"}
                          >
                            <Link to={`/scorm/${module.id}`}> Open Lesson</Link>
                          </Button>


                          <Button 
                            asChild 
                            variant="outline" 
                            className="w-full"
                            disabled={module.status === "locked"}
                          >
                            <Link to={`/courses/module/${module.id}/assessments`}>
                              📋 View Assessments
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseView;