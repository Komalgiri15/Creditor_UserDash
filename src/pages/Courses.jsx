import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { BookOpen, Clock, Filter, Search, Award, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { fetchUserCourses, fetchCourseModules } from '../services/courseService';

export function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [progressFilter, setProgressFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [courseModules, setCourseModules] = useState({});

  // Helper to format seconds as HH:MM:SS
  function formatTime(secs) {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function parseDuration(durationStr) {
    if (!durationStr) return 0;
    // Format: "60 min"
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (minMatch) return parseInt(minMatch[1], 10);

    // Format: "1h 45m"
    const hourMinMatch = durationStr.match(/(\d+)\s*h(?:ours?)?\s*(\d+)?\s*m?/i);
    if (hourMinMatch) {
      const hours = parseInt(hourMinMatch[1], 10);
      const mins = hourMinMatch[2] ? parseInt(hourMinMatch[2], 10) : 0;
      return hours * 60 + mins;
    }

    // Format: "15:30" (mm:ss or hh:mm)
    const colonMatch = durationStr.match(/(\d+):(\d+)/);
    if (colonMatch) {
      const first = parseInt(colonMatch[1], 10);
      const second = parseInt(colonMatch[2], 10);
      // If first > 10, assume mm:ss, else hh:mm
      if (first > 10) return first; // mm:ss, ignore seconds
      return first * 60 + second; // hh:mm
    }

    // Format: "8 min read"
    const minReadMatch = durationStr.match(/(\d+)\s*min read/);
    if (minReadMatch) return parseInt(minReadMatch[1], 10);

    return 0;
  }
  // Get time spent for all courses from localStorage
  const getCourseTimes = () => {
    const times = {};
    courses.forEach(course => {
      const t = localStorage.getItem(`course_time_${course.id}`);
      times[course.id] = t ? parseInt(t, 10) : 0;
    });
    return times;
  };
  const [courseTimes, setCourseTimes] = useState(getCourseTimes());
  // Update times when component mounts and when tab regains focus
  useEffect(() => {
    const updateTimes = () => setCourseTimes(getCourseTimes());
    window.addEventListener("focus", updateTimes);
    return () => window.removeEventListener("focus", updateTimes);
  }, []);
  // Update times when route changes to /courses
  useEffect(() => {
    if (location.pathname === "/courses") {
      setCourseTimes(getCourseTimes());
    }
  }, [location.pathname]);

  useEffect(() => {
    const courseCards = document.querySelectorAll(".course-card");
    courseCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-fade-in");
        card.classList.remove("opacity-0");
      }, 100 * index);
    });
  }, [filteredCourses]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchUserCourses();
        
        // Fetch modules for each course and add modulesCount and totalDuration
        const coursesWithModules = await Promise.all(
          data.map(async (course) => {
            try {
              const modules = await fetchCourseModules(course.id);
              // Sum durations using 'estimated_duration' (in minutes)
              const totalDurationMins = modules.reduce((sum, m) => sum + (parseInt(m.estimated_duration, 10) || 0), 0);
              // Convert to seconds for formatTime
              const totalDurationSecs = totalDurationMins * 60;
              const courseWithModules = { 
                ...course, 
                modulesCount: modules.length, 
                totalDurationSecs,
                // Ensure image field is set from thumbnail
                image: course.thumbnail || course.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
              };
              return courseWithModules;
            } catch {
              const courseWithDefaults = { 
                ...course, 
                modulesCount: 0, 
                totalDurationSecs: 0,
                image: course.thumbnail || course.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
              };
              return courseWithDefaults;
            }
          })
        );
        setCourses(coursesWithModules);
        setFilteredCourses(coursesWithModules);
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleViewModules = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(courseId);
    
    // Fetch modules if not already loaded
    if (!courseModules[courseId]) {
      try {
        const modules = await fetchCourseModules(courseId);
        setCourseModules(prev => ({
          ...prev,
          [courseId]: modules
        }));
      } catch (err) {
        setCourseModules(prev => ({
          ...prev,
          [courseId]: []
        }));
      }
    }
  };

  useEffect(() => {
    let results = courses;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply progress filter
    if (progressFilter !== "all") {
      results = results.filter(course => {
        const progress = course.progress || 0;
        switch (progressFilter) {
          case "not-started":
            return progress === 0;
          case "in-progress":
            return progress > 0 && progress < 100;
          case "completed":
            return progress === 100;
          default:
            return true;
        }
      });
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      results = results.filter(course => course.category === categoryFilter);
    }

    setFilteredCourses(results);
  }, [courses, searchTerm, progressFilter, categoryFilter]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading courses...</p>
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading courses</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Courses</h1>
            
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </Button> */}
            </div>
          </div>

          {/* Filters */}
          {/* {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                  <select
                    value={progressFilter}
                    onChange={(e) => setProgressFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Progress</option>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Business Law">Business Law</option>
                    <option value="Legal Skills">Legal Skills</option>
                  </select>
                </div>
              </div>
            </div>
          )} */}

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div key={course.id} className="course-card opacity-0">
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={course.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <CardHeader className="pb-3 flex-shrink-0">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 flex-1">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{course.totalDurationSecs ? formatTime(course.totalDurationSecs) : "Duration not specified"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} />
                          <span>{course.modulesCount || 0} modules</span>
                        </div>
                      </div>
                      
                      <Progress value={course.progress || 0} className="h-2" />
                      {/*
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Time spent: {formatTime(courseTimes[course.id] || 0)}</span>
                        <span>{course.category || "Uncategorized"}</span>
                      </div>
                      */}
                    </CardContent>
                    
                    <CardFooter className="pt-2 flex flex-col gap-2 flex-shrink-0">
                      <div className="flex gap-2 w-full">
                        <Link to={`/dashboard/courses/${course.id}/modules`} className="flex-1">
                          <Button variant="default" className="w-full">
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                      
                      {/* {course.progress === 100 && (
                        <Link to={`/certificate/${course.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            <Award size={16} className="mr-2" />
                            View Certificate
                          </Button>
                        </Link>
                      )} */}
                    </CardFooter>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Courses;