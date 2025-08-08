import React, { useRef, useState, useEffect, useMemo } from 'react';
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import { fetchAllCourses, fetchCourseModules } from "@/services/courseService";
import { CreateModuleDialog } from "@/components/courses/CreateModuleDialog";
import ScormService from '@/services/scormService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChevronLeft, Play, Eye, Upload, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const COURSES_PER_PAGE = 5;

const ScormPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [scormUploadState, setScormUploadState] = useState({});
  const [showCreateModuleDialog, setShowCreateModuleDialog] = useState(false);
  const [selectedCourseForModule, setSelectedCourseForModule] = useState(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewModule, setPreviewModule] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(null); // Added for custom delete dialog
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
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const handleAddScormClick = (courseId, moduleId) => {
    setScormUploadState(prev => ({
      ...prev,
      [moduleId]: {
        active: true,
        file: null,
        uploading: false,
        uploaded: false,
        error: '',
        progress: 0,
        cancelUpload: null,
        previewUrl: '',
        scormUrl: ''
      }
    }));
  };

  const handleFileChange = (moduleId, event) => {
    const file = event.target.files[0];
    if (file) {
      setScormUploadState(prev => ({
        ...prev,
        [moduleId]: {
          active: true, // Ensure active is true when a file is selected
          file,
          uploading: false,
          uploaded: false,
          error: '',
          progress: 0,
          cancelUpload: null,
          previewUrl: '',
          scormUrl: ''
        }
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    }
  };

  const handleUpload = async (moduleId) => {
    const uploadState = scormUploadState[moduleId] || {};
    if (!uploadState.file) return;

    setScormUploadState((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], uploading: true, error: '', progress: 0 }
    }));

    try {
      const description = 'Dummy SCORM test file';
      const result = await ScormService.uploadScorm({
        moduleId,
        file: uploadState.file,
        uploadedBy: currentUserId,
        description,
        onProgress: (progress) => {
          setScormUploadState((prev) => ({
            ...prev,
            [moduleId]: { ...prev[moduleId], progress }
          }));
        },
        onCancel: (cancelFn) => {
          setScormUploadState((prev) => ({
            ...prev,
            [moduleId]: { ...prev[moduleId], cancelUpload: cancelFn }
          }));
        }
      });

      const fullUrl = `${import.meta.env.VITE_API_BASE_URL || ''}${result.data.url}`;

      setScormUploadState((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          uploading: false,
          uploaded: true,
          progress: 100,
          previewUrl: fullUrl,
          scormUrl: result.data.url,
          error: '',
          cancelUpload: null
        }
      }));
    } catch (error) {
      setScormUploadState((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          uploading: false,
          progress: 0,
          error: error.message === 'Upload cancelled' ? 'Upload cancelled' : 'Upload failed. Please try again.',
          cancelUpload: null
        }
      }));
    }
  };

  const handleCancelUpload = (moduleId) => {
    const uploadState = scormUploadState[moduleId] || {};
    if (uploadState.cancelUpload && typeof uploadState.cancelUpload === 'function') {
      uploadState.cancelUpload();
    }
    setScormUploadState(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        uploading: false,
        progress: 0,
        error: 'Upload cancelled',
        cancelUpload: null
      }
    }));
  };

  const handlePreviewModule = (module) => {
    setPreviewModule(module);
    setShowPreviewDialog(true);
  };

  const handleDeleteScorm = (module) => {
    setShowDeleteDialog(module);
  };

  const confirmDelete = async () => {
    if (!showDeleteDialog?.resource_id) {
      console.error('No resource ID found for module');
      setShowDeleteDialog(null);
      return;
    }

    try {
      await ScormService.deleteScorm(showDeleteDialog.resource_id);
      const updatedModules = await fetchCourseModules(showDeleteDialog.course_id);
      setCourses(prev => prev.map(course =>
        course.id === showDeleteDialog.course_id
          ? { ...course, modules: updatedModules }
          : course
      ));
      setScormUploadState(prev => {
        const newState = { ...prev };
        delete newState[showDeleteDialog.id];
        return newState;
      });
    } catch (error) {
      console.error('Error deleting SCORM content:', error);
      alert('Failed to delete SCORM content. Please try again.');
    } finally {
      setShowDeleteDialog(null);
    }
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
                    <Button
                      onClick={() => handleExpandCourse(course.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {expandedCourseId === course.id ? 'Hide Modules' : 'View Modules'}
                    </Button>
                    <Button
                      onClick={() => handleCreateModule(course.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                    >
                      Create Module
                    </Button>
                  </div>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                    {course.modules.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No modules found for this course</p>
                      </div>
                    ) : (
                      course.modules.map((mod) => {
                        const uploadState = scormUploadState[mod.id] || {};
                        const isActive = uploadState.active || false;
                        const hasExistingContent = !!mod.resource_url;

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
                                  {hasExistingContent && (
                                    <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                      SCORM Uploaded
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

                                  {mod.resource_id && (
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resource ID</span>
                                      <span className="text-sm font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded border truncate">
                                        {mod.resource_id}
                                      </span>
                                    </div>
                                  )}

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
                                {hasExistingContent ? (
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      onClick={() => handlePreviewModule(mod)}
                                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                    >
                                      <Eye size={16} className="mr-2" />
                                      Preview
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteScorm(mod)}
                                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                    >
                                      <Trash2 size={16} className="mr-2" />
                                      Delete SCORM
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => handleAddScormClick(course.id, mod.id)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                  >
                                    <Upload size={16} className="mr-2" />
                                    Add SCORM
                                  </Button>
                                )}
                              </div>
                            </div>

                            {isActive && !hasExistingContent && (
                              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="space-y-6">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                      Upload SCORM Package
                                    </label>
                                    <div className="relative">
                                      <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".zip"
                                        onChange={(e) => handleFileChange(mod.id, e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors duration-200"
                                      />
                                    </div>
                                  </div>

                                  {uploadState.file && (
                                    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                                      <div className="flex items-center gap-4">
                                        {uploadState.uploading ? (
                                          <>
                                            <Button
                                              onClick={() => handleCancelUpload(mod.id)}
                                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                              Cancel Upload
                                            </Button>
                                            <div className="flex items-center gap-2">
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                              <span className="text-sm text-emerald-600 font-medium">Uploading...</span>
                                            </div>
                                          </>
                                        ) : (
                                          <Button
                                            onClick={() => handleUpload(mod.id)}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                          >
                                            Upload
                                          </Button>
                                        )}
                                        <div className="flex-1">
                                          <span className="text-sm font-medium text-gray-700">{uploadState.file.name}</span>
                                          <span className="text-xs text-gray-500 ml-2">({(uploadState.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                      </div>

                                      {uploadState.uploading && (
                                        <div className="space-y-2">
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                                            <span className="text-sm text-gray-500">{uploadState.progress || 0}%</span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                              style={{ width: `${uploadState.progress || 0}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {uploadState.error && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                        <div className="ml-3">
                                          <p className="text-sm text-red-800">{uploadState.error}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {uploadState.uploaded && uploadState.previewUrl && (
                                    <div className="space-y-4">
                                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">Preview:</h4>
                                        <iframe
                                          src={uploadState.previewUrl}
                                          className="w-full h-80 border border-gray-300 rounded-lg shadow-sm"
                                          title="SCORM Preview"
                                        />
                                      </div>
                                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                                        <h5 className="text-sm font-semibold text-gray-800 mb-3">SCORM URL:</h5>
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="text"
                                            value={uploadState.scormUrl || ''}
                                            readOnly
                                            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg bg-gray-50 font-mono"
                                          />
                                          <Button
                                            onClick={() => navigator.clipboard.writeText(uploadState.scormUrl)}
                                            className="px-4 py-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
                                          >
                                            Copy URL
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
        onModuleCreated={handleModuleCreated}
        existingModules={courses.find(c => c.id === selectedCourseForModule)?.modules || []}
      />

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
                src={`${import.meta.env.VITE_API_BASE_URL || ''}${previewModule.resource_url}`}
                className="w-full h-full border border-gray-300 rounded-md"
                title={previewModule.title}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the SCORM content for "{showDeleteDialog.title}"? This action cannot be undone.
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

export default ScormPage;