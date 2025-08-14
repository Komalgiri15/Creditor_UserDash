import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCourseById, fetchCourseModules, createModule } from "@/services/courseService";
import { CreateModuleDialog } from "@/components/courses/CreateModuleDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, BookOpen, Clock, ArrowLeft, Eye, Trash2 } from "lucide-react";

const InstructorCourseModulesPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { isInstructorOrAdmin } = useAuth();
  const isAllowed = isInstructorOrAdmin();

  const [collapsed, setCollapsed] = useState(true);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModuleDialog, setShowCreateModuleDialog] = useState(false);
  const [moduleDialogMode, setModuleDialogMode] = useState("create");
  const [editModuleData, setEditModuleData] = useState(null);

  // Lessons expansion state
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [moduleIdToLessons, setModuleIdToLessons] = useState({});
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  useEffect(() => {
    if (!isAllowed) return;
    const init = async () => {
      try {
        setLoading(true);
        const [courseData, modulesData] = await Promise.all([
          fetchCourseById(courseId),
          fetchCourseModules(courseId),
        ]);
        setCourse(courseData);
        setModules(Array.isArray(modulesData) ? modulesData : []);
      } catch (err) {
        console.error("Error loading course/modules:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [courseId, isAllowed]);

  const handleCreateModuleClick = () => {
    setEditModuleData(null);
    setModuleDialogMode("create");
    setShowCreateModuleDialog(true);
  };

  const handleModuleSaved = async (moduleData) => {
    try {
      if (moduleDialogMode === "create") {
        await createModule(courseId, moduleData);
      }
      const updated = await fetchCourseModules(courseId);
      setModules(updated || []);
      setShowCreateModuleDialog(false);
    } catch (err) {
      alert("Failed to save module: " + err.message);
    }
  };

  const filteredModules = modules.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDuration = (minutes) => {
    const m = Number(minutes) || 0;
    const h = Math.floor(m / 60);
    const rem = m % 60;
    if (!h) return `${rem} min`;
    if (!rem) return `${h} hr`;
    return `${h} hr ${rem} min`;
  };

  const toggleViewLessons = async (module) => {
    if (expandedModuleId === module.id) {
      setExpandedModuleId(null);
      return;
    }
    setExpandedModuleId(module.id);

    // Load lessons if not loaded
    if (!moduleIdToLessons[module.id]) {
      setLessonsLoading(true);
      try {
        // Dummy lessons only for a specific module title; others start empty
        let lessons = [];
        if ((module.title || '').toLowerCase() === 'introduction machine learning' || (module.title || '').toLowerCase() === 'introduction to machine learning') {
          lessons = [
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
          ];
        }
        setModuleIdToLessons(prev => ({ ...prev, [module.id]: lessons }));
      } finally {
        setLessonsLoading(false);
      }
    }
  };

  const handleAddLesson = (moduleId) => {
    navigate(`/instructor/add-lesson/${courseId}/${moduleId}`);
  };

  const handleEditLesson = (lessonId) => {
    navigate(`/instructor/edit-lesson/${lessonId}`);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;
    // Simulate delete and remove from state
    setModuleIdToLessons(prev => ({
      ...prev,
      [lessonToDelete.moduleId]: (prev[lessonToDelete.moduleId] || []).filter(l => l.id !== lessonToDelete.id)
    }));
    setLessonToDelete(null);
  };

  if (!isAllowed) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      {/* Main Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Sub Sidebar placeholder spacing */}
      <div
        className="fixed top-0 h-screen z-20 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 overflow-y-auto w-52"
        style={{ left: collapsed ? "4.5rem" : "17rem" }}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Instructor Tools</h2>
          <p className="text-xs text-gray-500">Manage your content</p>
        </div>
        <div className="p-4 text-sm text-gray-600">
          Course Lessons
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? "calc(4.5rem + 13rem)" : "calc(17rem + 13rem)" }}
      >
        <header
          className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 h-16 transition-all duration-300"
          style={{ marginLeft: collapsed ? "calc(4.5rem + 13rem)" : "calc(17rem + 13rem)" }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <DashboardHeader sidebarCollapsed={collapsed} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pt-16">
          <div className="max-w-7xl mx-auto w-full px-6 pb-14 pt-6">
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {course ? course.title : "Course"} — Modules
                  </h1>
                </div>
                <Button onClick={handleCreateModuleClick} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Module
                </Button>
              </div>
              <p className="text-gray-600">View and manage all modules of this course.</p>
            </section>

            <div className="mb-4 flex items-center gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules..."
                className="max-w-md"
              />
            </div>

            {/* Modules List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
              {loading ? (
                <div className="p-6 text-gray-600">Loading modules...</div>
              ) : filteredModules.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No modules found.</div>
              ) : (
                filteredModules.map((mod) => (
                  <div key={mod.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{mod.title}</h3>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              mod.module_status === "PUBLISHED"
                                ? "bg-green-100 text-green-800"
                                : mod.module_status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {mod.module_status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{mod.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {formatDuration(mod.estimated_duration)}
                          </span>
                          <span>Order: {mod.order || "N/A"}</span>
                          {moduleIdToLessons[mod.id]?.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <BookOpen className="h-4 w-4" /> {moduleIdToLessons[mod.id].length} lessons
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => toggleViewLessons(mod)}
                        >
                          {expandedModuleId === mod.id ? 'Hide Lessons' : 'View Lessons'}
                        </Button>
                      </div>
                    </div>

                    {/* Lessons dropdown section */}
                    {expandedModuleId === mod.id && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-800">Lessons</h4>
                          <Button onClick={() => handleAddLesson(mod.id)} className="bg-green-600 hover:bg-green-700" size="sm">
                            <Plus className="mr-2 h-4 w-4" /> { (moduleIdToLessons[mod.id] || []).length ? 'Add Lesson' : 'Add First Lesson' }
                          </Button>
                        </div>

                        {lessonsLoading && (
                          <div className="text-gray-500 text-sm">Loading lessons...</div>
                        )}

                        {!lessonsLoading && (moduleIdToLessons[mod.id] || []).length === 0 && (
                          <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <BookOpen className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-gray-600 text-sm mb-2">No lessons yet</p>
                            <Button onClick={() => handleAddLesson(mod.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Plus className="mr-2 h-4 w-4" /> Add First Lesson
                            </Button>
                          </div>
                        )}

                        {(moduleIdToLessons[mod.id] || []).length > 0 && (
                          <div className="space-y-3">
                            {(moduleIdToLessons[mod.id] || []).map((lesson) => (
                              <div key={lesson.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <h5 className="text-md font-semibold text-gray-900">{lesson.title}</h5>
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        lesson.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                                        lesson.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                        {lesson.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                      <span>Duration: {lesson.duration} min</span>
                                      <span>Order: {lesson.order}</span>
                                      <span>Created: {new Date(lesson.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleEditLesson(lesson.id)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Eye size={14} className="mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={() => setLessonToDelete({ moduleId: mod.id, id: lesson.id, title: lesson.title })}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 size={14} className="mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateModuleDialog
        isOpen={showCreateModuleDialog}
        onClose={() => setShowCreateModuleDialog(false)}
        courseId={courseId}
        onModuleCreated={() => {}}
        existingModules={modules}
        initialData={editModuleData}
        mode={moduleDialogMode}
        onSave={handleModuleSaved}
      />

      {lessonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete the lesson "{lessonToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setLessonToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteLesson}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseModulesPage;
