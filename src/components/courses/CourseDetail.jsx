import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Play, Lock, CheckCircle, Clock, BookOpen, FileText, Video } from "lucide-react";
import { fetchCourseModules } from "@/services/courseService";

export function CourseDetail() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [expandedModule, setExpandedModule] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchCourseModules(courseId);
        setModules(data);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError("Failed to load course modules");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course details...</p>
            </div>
          </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FileText size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">Failed to load course</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
      
  return (
      <div className="container py-6 max-w-7xl mx-auto flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="content" onClick={() => setActiveTab("content")}>
              Course Content
            </TabsTrigger>
            <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="resources" onClick={() => setActiveTab("resources")}>
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No modules available</h3>
                <p className="text-muted-foreground mt-1">
                  This course doesn't have any modules yet
                </p>
              </div>
            ) : (
              modules.map((module) => (
                <div key={module.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/40 p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {module.lessonCount || 0} Lessons
                      </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleModule(module.id)}
                        >
                          {expandedModule === module.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Collapsible open={expandedModule === module.id}>
                    <CollapsibleContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {module.duration || "Duration not specified"}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {module.lessonCount || 0} lessons
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4 mr-1" />
                              Start Module
                            </Button>
                          </div>
                        </div>
                        
                        {/* Module content would go here */}
                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-sm text-gray-600">
                            Module content and lessons would be displayed here.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))
            )}
            </div>
          </TabsContent>
          
          <TabsContent value="overview" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This course contains {modules.length} modules covering various topics.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
                  <div className="text-sm text-blue-600">Total Modules</div>
            </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {modules.reduce((total, module) => total + (module.lessonCount || 0), 0)}
                  </div>
                  <div className="text-sm text-green-600">Total Lessons</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Additional resources and materials for this course.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Course Syllabus</span>
                  </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Video className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Video Tutorials</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Reading Materials</span>
                </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}

export default CourseDetail;