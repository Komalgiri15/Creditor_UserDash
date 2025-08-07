import React, { useRef, useState, useEffect, useMemo } from 'react';
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import { fetchAllCourses, fetchCourseModules } from "@/services/courseService";
import { CreateModuleDialog } from "@/components/courses/CreateModuleDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChevronLeft, Play, Eye, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const COURSES_PER_PAGE = 5;

const CreateQuizPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [courseModules, setCourseModules] = useState({});
  const [showCreateModuleDialog, setShowCreateModuleDialog] = useState(false);
  const [selectedCourseForModule, setSelectedCourseForModule] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewModule, setPreviewModule] = useState(null);

  const isAllowed = allowedScormUserIds.includes(currentUserId);

  useEffect(() => {
    if (!isAllowed) {
      return;
    }
    const fetchCoursesData = async () => {
      try {
        const coursesData = await fetchAllCourses();
        const coursesWithModules = await Promise.all(
          coursesData.map(async (course) => {
            try {
              const modules = await fetchCourseModules(course.id);
              return { ...course, modules };
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
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const handleExpandCourse = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const handleCreateModule = (courseId) => {
    setSelectedCourseForModule(courseId);
    setShowCreateModuleDialog(true);
  };

  const handleModuleCreated = async (newModule) => {
    if (selectedCourseForModule) {
      try {
        const updatedModules = await fetchCourseModules(selectedCourseForModule);
        setCourses(prev => prev.map(course => 
          course.id === selectedCourseForModule 
            ? { ...course, modules: updatedModules }
            : course
        ));
      } catch (err) {
        console.error('Error refreshing modules:', err);
      }
    }
  };

  const handleCreateQuiz = (moduleId) => {
    // Implement quiz creation logic here
    alert(`Create quiz for module ${moduleId}`);
  };

  const handlePreviewQuiz = (module) => {
    setPreviewModule(module);
    setShowPreviewDialog(true);
  };

  const handleDeleteQuiz = async (module) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }
    alert(`Delete quiz for module ${module.id}`);
    // Implement actual delete logic here
  };

  if (!isAllowed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access Quiz Management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
        <p className="text-gray-600">Create and manage quizzes for your course modules</p>
      </div>

      {/* Search input */}
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
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExpandCourse(course.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {expandedCourseId === course.id ? 'Hide Modules' : 'View Modules'}
                    </button>
                  </div>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="space-y-4">
                    {course.modules.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No modules found for this course</p>
                      </div>
                    ) : (
                      course.modules.map((mod) => {
                        const hasQuiz = false; // Replace with actual quiz check
                        
                        return (
                          <div key={mod.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{mod.title}</h3>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    mod.module_status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                    mod.module_status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {mod.module_status}
                                  </span>
                                  {hasQuiz && (
                                    <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                      Quiz Created
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{mod.description}</p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Module ID</span>
                                    <span className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded border truncate">
                                      {mod.id}
                                    </span>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order</span>
                                    <span className="text-sm text-gray-700">{mod.order || 'N/A'}</span>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</span>
                                    <span className="text-sm text-gray-700">{mod.estimated_duration || 0} min</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2 ml-4">
                                {hasQuiz ? (
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      onClick={() => handlePreviewQuiz(mod)}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                    >
                                      <Eye size={16} className="mr-2" />
                                      Preview
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteQuiz(mod)}
                                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                    >
                                      <Trash2 size={16} className="mr-2" />
                                      Delete Quiz
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => handleCreateQuiz(mod.id)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                  >
                                    <Plus size={16} className="mr-2" />
                                    Create Quiz
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
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

      {/* Create Module Dialog */}
      <CreateModuleDialog
        isOpen={showCreateModuleDialog}
        onClose={() => setShowCreateModuleDialog(false)}
        courseId={selectedCourseForModule}
        onModuleCreated={handleModuleCreated}
        existingModules={courses.find(c => c.id === selectedCourseForModule)?.modules || []}
      />

      {/* Preview Dialog */}
      {showPreviewDialog && previewModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">{previewModule.title}</h2>
                <p className="text-sm text-gray-600">{previewModule.description}</p>
              </div>
              <Button
                onClick={() => setShowPreviewDialog(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
            <div className="flex-1 p-6">
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-300">
                <p className="text-lg text-gray-500">Quiz Preview Content Would Appear Here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuizPage;