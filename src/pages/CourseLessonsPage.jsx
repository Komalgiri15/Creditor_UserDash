import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import { createModule, fetchAllCourses, fetchCourseModules } from "@/services/courseService";
import { CreateModuleDialog } from "@/components/courses/CreateModuleDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChevronLeft, Play, Eye, Upload, Trash2, FileText, Plus, List, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

const COURSES_PER_PAGE = 6;

const CourseLessonsPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [showCreateModuleDialog, setShowCreateModuleDialog] = useState(false);
  const [selectedCourseForModule, setSelectedCourseForModule] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(null);
  const [moduleDialogMode, setModuleDialogMode] = useState("create");
  const [editModuleData, setEditModuleData] = useState(null);
  const navigate = useNavigate();

  const isAllowed = allowedScormUserIds.includes(currentUserId);

  useEffect(() => {
    if (!isAllowed) return;
    const fetchCoursesData = async () => {
      try {
        const coursesData = await fetchAllCourses();
        const coursesWithModules = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const modules = await fetchCourseModules(course.id);
              // Only add dummy lessons to 'Introduction machine learning' module
              const modulesWithLessons = modules.map(module => {
                if (module.title === 'Introduction machine learning') {
                  return {
                    ...module,
                    lessons: [
                      {
                        id: `lesson-${module.id}-1`,
                        title: `Intro: What is Machine Learning?`,
                        description: 'A beginner-friendly introduction to ML concepts.',
                        status: 'PUBLISHED',
                        duration: 20,
                        order: 1,
                        createdAt: new Date().toISOString()
                      },
                      {
                        id: `lesson-${module.id}-2`,
                        title: `Supervised vs Unsupervised Learning`,
                        description: 'Understanding the two main types of ML.',
                        status: 'DRAFT',
                        duration: 25,
                        order: 2,
                        createdAt: new Date().toISOString()
                      }
                    ]
                  };
                } else {
                  return { ...module, lessons: [] };
                }
              });
              return { ...course, modules: modulesWithLessons };
            } catch (err) {
              console.error(`Error fetching modules for course ${course.id}:`, err);
              return { ...course, modules: [] };
            }
          })
        );
        setCourses(coursesWithModules);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCoursesData();
  }, [isAllowed]);

  // Filtered and paginated courses
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    const lower = searchTerm.toLowerCase();
    return courses.filter(course =>
      course.title.toLowerCase().includes(lower) ||
      course.modules.some(mod => mod.title.toLowerCase().includes(lower))
    );
  }, [courses, searchTerm]);

  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE) || 1;
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * COURSES_PER_PAGE,
    currentPage * COURSES_PER_PAGE
  );

  // Reset to page 1 if search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleExpandCourse = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const handleCreateModuleClick = (courseId) => {
    setSelectedCourseForModule(courseId);
    setEditModuleData(null);
    setModuleDialogMode("create");
    setShowCreateModuleDialog(true);
  };

  const handleEditModuleClick = (courseId, module) => {
    setSelectedCourseForModule(courseId);
    setEditModuleData(module);
    setModuleDialogMode("edit");
    setShowCreateModuleDialog(true);
  };

  // Use the same logic as Course Management for saving modules
  const handleModuleSaved = async (moduleData) => {
    try {
      if (moduleDialogMode === "edit" && editModuleData) {
        // Optionally implement updateModule logic here
        // await updateModule(selectedCourseForModule, editModuleData.id, moduleData);
      } else {
        await createModule(selectedCourseForModule, moduleData);
      }
      // Refresh modules after creation
      const updatedModules = await fetchCourseModules(selectedCourseForModule);
      const modulesWithLessons = updatedModules.map(module => {
        if (module.title === 'Introduction machine learning') {
          return {
            ...module,
            lessons: [
              {
                id: `lesson-${module.id}-1`,
                title: `Intro: What is Machine Learning?`,
                description: 'A beginner-friendly introduction to ML concepts.',
                status: 'PUBLISHED',
                duration: 20,
                order: 1,
                createdAt: new Date().toISOString()
              },
              {
                id: `lesson-${module.id}-2`,
                title: `Supervised vs Unsupervised Learning`,
                description: 'Understanding the two main types of ML.',
                status: 'DRAFT',
                duration: 25,
                order: 2,
                createdAt: new Date().toISOString()
              }
            ]
          };
        } else {
          return { ...module, lessons: [] };
        }
      });
      setCourses(prev => prev.map(course =>
        course.id === selectedCourseForModule
          ? { ...course, modules: modulesWithLessons }
          : course
      ));
      setShowCreateModuleDialog(false);
    } catch (err) {
      alert('Failed to save module: ' + err.message);
    }
  };

  const handleAddLesson = (courseId, moduleId) => {
    // Navigate to add lesson page
    navigate(`/instructor/add-lesson/${courseId}/${moduleId}`);
  };

  const handleEditLesson = (lessonId) => {
    // Navigate to edit lesson page
    navigate(`/instructor/edit-lesson/${lessonId}`);
  };

  const handleDeleteLesson = (lesson) => {
    setShowDeleteDialog(lesson);
  };

  const confirmDelete = async () => {
    if (!showDeleteDialog) return;

    try {
      // Simulate API call to delete lesson
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove lesson from local state
      setCourses(prev => prev.map(course => ({
        ...course,
        modules: course.modules.map(module => ({
          ...module,
          lessons: module.lessons.filter(lesson => lesson.id !== showDeleteDialog.id)
        }))
      })));

      setShowDeleteDialog(null);
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  // Helper function to format duration
  const formatDuration = (minutes) => {
    if (!minutes) return '00:00:00';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
  };

  if (!isAllowed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access Course Lessons Management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Lessons Management</h1>
        <p className="text-gray-600">Manage lesson content for your course modules</p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search by course or module title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {paginatedCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="space-y-4">
              {/* Course Card */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="flex">
                  {/* Course Image */}
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={course.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Course Content */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                        
                        {/* Course Stats */}
                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(course.estimated_duration || 60)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.modules?.length || 0} modules</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* View Modules Button */}
                      <Button
                        onClick={() => navigate(`/instructor/courses/${course.id}/modules`)}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                      >
                        View Modules
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Modules Section */}
              {expandedCourseId === course.id && (
                <div className="ml-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">Course Modules</h4>
                    <Button
                      onClick={() => handleCreateModuleClick(course.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <Plus size={16} className="mr-2" />
                      Create Module
                    </Button>
                  </div>
                  
                  {course.modules?.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h5 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h5>
                      <p className="text-gray-500 mb-4">Start building your course by creating the first module.</p>
                      <Button
                        onClick={() => handleCreateModuleClick(course.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                      >
                        <Plus size={16} className="mr-2" />
                        Create First Module
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {course.modules.map((module) => (
                        <Card key={module.id} className="hover:shadow-md transition-shadow duration-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base font-semibold text-gray-900 mb-2">{module.title}</CardTitle>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{module.description}</p>
                                
                                {/* Module Stats */}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Duration: {module.estimated_duration || 0} min</span>
                                  <span>Order: {module.order || 'N/A'}</span>
                                </div>
                                
                                {/* Module Status */}
                                <div className="mt-3">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    module.module_status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                    module.module_status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {module.module_status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditModuleClick(course.id, module)}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Eye size={14} className="mr-2" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleAddLesson(course.id, module.id)}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                <Plus size={14} className="mr-2" />
                                Add Lesson
                              </Button>
                            </div>
                            
                            {/* Lessons Count */}
                            {module.lessons && module.lessons.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                                  >
                                    View Lessons
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      <CreateModuleDialog
        isOpen={showCreateModuleDialog}
        onClose={() => setShowCreateModuleDialog(false)}
        courseId={selectedCourseForModule}
        onModuleCreated={() => {}}
        existingModules={courses.find(c => c.id === selectedCourseForModule)?.modules || []}
        initialData={editModuleData}
        mode={moduleDialogMode}
        onSave={handleModuleSaved}
      />

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the lesson "{showDeleteDialog.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLessonsPage;
