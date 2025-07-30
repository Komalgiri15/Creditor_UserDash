import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChevronLeft, Play, BookOpen, Users, Calendar, Award } from "lucide-react";
import { fetchCourseModules, fetchCourseById } from "@/services/courseService";

export function CourseView() {
  const { courseId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState(null);
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [error, setError] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        // Fetch both course details and modules in parallel
        const [courseData, modulesData] = await Promise.all([
          fetchCourseById(courseId),
          fetchCourseModules(courseId)
        ]);
        
        console.log('Fetched course details:', courseData);
        console.log('Fetched modules:', modulesData);
        
        setCourseDetails(courseData);
        setModules(modulesData);
        setFilteredModules(modulesData);
        
        // Calculate total duration from modules
        const total = modulesData.reduce((sum, module) => {
          const duration = parseInt(module.estimated_duration) || 0;
          return sum + duration;
        }, 0);
        setTotalDuration(total);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModules(modules);
    } else {
      const filtered = modules.filter(module =>
        module.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredModules(filtered);
    }
  }, [searchQuery, modules]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading course modules...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <span className="text-4xl">❌</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Failed to load modules</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="flex-1">
        <div className="container py-8 max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/courses">
                <ChevronLeft size={16} />
                Back to courses
              </Link>
            </Button>
          </div>

          {/* Course Details Section */}
          {courseDetails && (
            <div className="mb-8">
              <Card className="overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                  <img 
                    src={courseDetails.thumbnail || courseDetails.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"} 
                    alt={courseDetails.title}
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
                  
                  {/* Category Badge - Positioned at top right if exists */}
                  {courseDetails.category && (
                    <div className="absolute top-4 right-6">
                      <Badge variant="outline" className="text-white border-white/30">
                        {courseDetails.category}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Course Title and Description - Centered vertically */}
                  <div className="absolute inset-0 flex flex-col justify-center left-6 right-6">
                    <h1 className="text-2xl font-bold text-white mb-2">{courseDetails.title}</h1>
                    <p className="text-blue-100 text-sm line-clamp-2">{courseDetails.description}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enrolled Students</p>
                        <p className="font-semibold">{courseDetails.enrolled_students || courseDetails.students_count || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Modules</p>
                        <p className="font-semibold">{modules.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">
                          {totalDuration > 0 ? `${totalDuration} min` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {courseDetails.instructor && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Award className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Instructor</p>
                          <p className="font-semibold">{courseDetails.instructor}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="text-muted-foreground" size={20} />
              <span className="font-medium">Total Modules:</span>
              <span className="font-mono text-lg">{modules.length}</span>
            </div>
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

          {filteredModules.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No modules found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try adjusting your search query" : "This course doesn't have any modules yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                // console.log('Rendering module:', module.title);
                return (
                  <div key={module.id} className="module-card h-full">
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={module.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"} 
                          alt={module.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge 
                            className={`${
                              module.module_status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            } border font-medium px-3 py-1 rounded-full shadow-sm`}
                          >
                            {module.module_status}
                          </Badge>
                        </div>
                      </div>
                      {/* Fixed height for content area, flex-grow to fill space */}
                      <div className="flex flex-col flex-grow min-h-[170px] max-h-[170px] px-6 pt-4 pb-2">
                        <CardHeader className="pb-2 px-0 pt-0">
                          <CardTitle className="text-lg line-clamp-2 min-h-[56px]">{module.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">{module.description}</p>
                        </CardHeader>
                        <CardContent className="space-y-3 px-0 pt-0 pb-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen size={14} />
                              <span>Order: {module.order || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{module.estimated_duration || 0} min</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                      {/* Footer always at the bottom */}
                      <div className="mt-auto px-6 pb-4">
                        <CardFooter className="p-0">
                          {module.resource_url ? (
                            <Link to={`/dashboard/courses/${courseId}/modules/${module.id}/view`} className="w-full">
                              <Button className="w-full">
                                <Play size={16} className="mr-2" />
                                Start Module
                              </Button>
                            </Link>
                          ) : (
                            <Button className="w-full" variant="outline" disabled>
                              No Content Available
                            </Button>
                          )}
                        </CardFooter>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CourseView;