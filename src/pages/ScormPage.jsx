import React, { useRef, useState, useEffect, useMemo } from 'react';
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import { fetchAllCourses, fetchCourseModules } from "@/services/courseService";
import { CreateModuleDialog } from "@/components/courses/CreateModuleDialog";
import ScormService from '@/services/scormService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChevronLeft, Play, Eye, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

const COURSES_PER_PAGE = 5;

const ScormPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [courseModules, setCourseModules] = useState({});
  const [scormUploadState, setScormUploadState] = useState({});
  const [showCreateModuleDialog, setShowCreateModuleDialog] = useState(false);
  const [selectedCourseForModule, setSelectedCourseForModule] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewModule, setPreviewModule] = useState(null);
  const fileInputRef = useRef();

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
    // Refresh modules for the specific course
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

  const handleAddScormClick = (courseId, moduleId) => {
    setScormUploadState(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], active: true }
    }));
  };

  const handleFileChange = (moduleId, event) => {
    const file = event.target.files[0];
    if (file) {
      setScormUploadState(prev => ({
      ...prev,
        [moduleId]: { ...prev[moduleId], file, uploading: false, uploaded: false, error: '' }
      }));
    }
  };

  const handleUpload = async (moduleId) => {
    const uploadState = scormUploadState[moduleId];
    if (!uploadState?.file) return;

    setScormUploadState((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], uploading: true, error: '' }
    }));

    try {
      const description = 'Dummy SCORM test file';
      const result = await ScormService.uploadScorm({
        moduleId,
        file: uploadState.file,
        uploadedBy: currentUserId,
        description,
      });
      
      const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${result.data.url}`;
      
      setScormUploadState((prev) => ({
        ...prev,
        [moduleId]: { 
          ...prev[moduleId], 
          uploading: false,
          uploaded: true,
          previewUrl: fullUrl,
          scormUrl: result.data.url,
          error: ''
        }
      }));
    } catch (error) {
      setScormUploadState((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          uploading: false,
          error: 'Upload failed. Please try again.'
        }
      }));
    }
  };

  const handlePreviewModule = (module) => {
    setPreviewModule(module);
    setShowPreviewDialog(true);
  };

  if (!isAllowed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access SCORM Content Management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SCORM Content Management</h1>
        <p className="text-gray-600">Upload and manage SCORM packages for your course modules</p>
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
                      const uploadState = scormUploadState[mod.id] || {};
                        const isActive = uploadState.active;
                        const hasExistingContent = mod.resource_url;
                        
                      return (
                        <div key={mod.id} className="bg-gray-50 rounded-md p-4 border border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-800">{mod.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{mod.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded">
                                Module ID: {mod.id}
                              </span>
                                  <span className="text-xs text-gray-500">Order: {mod.order || 'N/A'}</span>
                                  <span className="text-xs text-gray-500">Duration: {mod.estimated_duration || 0} min</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    mod.module_status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                    mod.module_status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {mod.module_status}
                                  </span>
                                  {hasExistingContent && (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                      SCORM Uploaded
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {hasExistingContent ? (
                                  <Button
                                    onClick={() => handlePreviewModule(mod)}
                                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                                  >
                                    <Eye size={14} className="mr-1" />
                                    Preview
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => handleAddScormClick(course.id, mod.id)}
                                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                  >
                                    <Upload size={14} className="mr-1" />
                                    Add SCORM
                                  </Button>
                                )}
                              </div>
                              </div>

                            {isActive && !hasExistingContent && (
                              <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Upload SCORM Package
                                    </label>
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept=".zip"
                                      onChange={(e) => handleFileChange(mod.id, e)}
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                              </div>

                                  {uploadState.file && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        onClick={() => handleUpload(mod.id)}
                                        disabled={uploadState.uploading}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                      >
                                        {uploadState.uploading ? 'Uploading...' : 'Upload'}
                                      </Button>
                                      <span className="text-sm text-gray-600">
                                        {uploadState.file.name}
                                      </span>
                                </div>
                              )}

                                  {uploadState.error && (
                                    <div className="text-red-600 text-sm">{uploadState.error}</div>
                                  )}

                                  {uploadState.uploaded && uploadState.previewUrl && (
                                <div className="mt-4">
                                      <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                  <iframe
                                        src={uploadState.previewUrl}
                                        className="w-full h-64 border border-gray-300 rounded-md"
                                    title="SCORM Preview"
                                      />
                                      <div className="mt-2">
                                        <h5 className="text-sm font-medium text-gray-700 mb-1">SCORM URL:</h5>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={uploadState.scormUrl || ''}
                                            readOnly
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
                                          />
                                          <Button
                                            onClick={() => navigator.clipboard.writeText(uploadState.scormUrl)}
                                            className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                          >
                                            Copy
                                          </Button>
                                        </div>
                                      </div>
                                </div>
                              )}
                                </div>
                            </div>
                          )}
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
              <iframe
                src={`${import.meta.env.VITE_API_BASE_URL}${previewModule.resource_url}`}
                className="w-full h-full border border-gray-300 rounded-md"
                title={previewModule.title}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScormPage;