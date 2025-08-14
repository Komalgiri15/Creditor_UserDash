import React, { useRef, useState, useEffect, useMemo } from 'react';
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import { fetchAllCourses, fetchCourseModules } from "@/services/courseService";
import { CreateModuleDialog } from "@/components/courses/CreateModuleDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, ChevronLeft, Play, Eye, Plus, Trash2, Trophy, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import QuizModal from '@/components/courses/QuizModal';
import QuizScoresModal from '@/components/courses/QuizScoresModal';
import EditQuestionModal from '@/components/courses/EditQuestionModal';
import { fetchQuizzesByModule, fetchAllQuizzes, getQuizById, deleteQuiz, updateQuiz } from '@/services/quizServices';
import { toast } from "sonner";

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
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState(null);
  const [moduleQuizzes, setModuleQuizzes] = useState({}); // { [moduleId]: [quiz, ...] }
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [previewQuizData, setPreviewQuizData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [showScoresModal, setShowScoresModal] = useState(false);
  const [selectedQuizForScores, setSelectedQuizForScores] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isAddingQuestions, setIsAddingQuestions] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [selectedQuestionForEdit, setSelectedQuestionForEdit] = useState(null);

  const isAllowed = allowedScormUserIds.includes(currentUserId);

  const fetchAndSetModuleQuizzes = async (moduleId) => {
    try {
      const quizzes = await fetchQuizzesByModule(moduleId);
      setModuleQuizzes(prev => ({ ...prev, [moduleId]: quizzes }));
    } catch (err) {
      setModuleQuizzes(prev => ({ ...prev, [moduleId]: [] }));
    }
  };

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

  useEffect(() => {
    if (!isAllowed) return;
    const fetchAllQuizzes = async () => {
      try {
        const coursesData = await fetchAllCourses();
        await Promise.all(
          coursesData.flatMap(course =>
            course.modules?.map(async (mod) => {
              if (mod?.id) await fetchAndSetModuleQuizzes(mod.id);
            }) || []
          )
        );
      } catch {}
    };
    fetchAllQuizzes();
  }, [courses, isAllowed]);

  // Fetch all quizzes once
  useEffect(() => {
    if (!isAllowed) return;
    const fetchQuizzes = async () => {
      try {
        const quizzes = await fetchAllQuizzes();
        setAllQuizzes(Array.isArray(quizzes) ? quizzes : quizzes.data || []);
      } catch {
        setAllQuizzes([]);
      }
    };
    fetchQuizzes();
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
    setSelectedModuleForQuiz(moduleId);
    setShowQuizModal(true);
  };

  const handlePreviewQuiz = async (quiz) => {
    setPreviewLoading(true);
    setPreviewError(null);
    setShowPreviewDialog(true);
    try {
      const data = await getQuizById(quiz.id);
      setPreviewQuizData(data);
    } catch (err) {
      setPreviewError('Failed to load quiz details.');
      setPreviewQuizData(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDeleteQuiz = async (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteConfirmation(true);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setSelectedModuleForQuiz(quiz.module_id);
    setIsAddingQuestions(false);
    setShowQuizModal(true);
  };

  const handleAddQuestions = (quiz) => {
    setEditingQuiz(quiz);
    setSelectedModuleForQuiz(quiz.module_id);
    setIsAddingQuestions(true);
    setShowQuizModal(true);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestionForEdit(question);
    setShowEditQuestionModal(true);
  };

  const handleQuestionUpdated = () => {
    // Refresh the preview data if it's currently open
    if (previewQuizData) {
      handlePreviewQuiz(previewQuizData);
    }
  };

  const handleViewScores = (quiz, courseId) => {
    setSelectedQuizForScores(quiz);
    setShowScoresModal(true);
  };

  const handleQuizCreatedOrUpdated = async () => {
    // Refresh all quizzes after creation or update
    if (isAllowed) {
      try {
        console.log('Refreshing quiz data after creation/update...');
        // Add a small delay to ensure backend has processed the update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const quizzes = await fetchAllQuizzes();
        console.log('Fetched quizzes:', quizzes);
        setAllQuizzes(Array.isArray(quizzes) ? quizzes : quizzes.data || []);
        
        // Also refresh module-specific quizzes for the selected module
        if (selectedModuleForQuiz) {
          console.log('Refreshing module quizzes for module:', selectedModuleForQuiz);
          await fetchAndSetModuleQuizzes(selectedModuleForQuiz);
        }
        
        // Refresh all module quizzes to ensure consistency
        const coursesData = await fetchAllCourses();
        await Promise.all(
          coursesData.flatMap(course =>
            course.modules?.map(async (mod) => {
              if (mod?.id) await fetchAndSetModuleQuizzes(mod.id);
            }) || []
          )
        );
        console.log('Quiz data refresh completed');
      } catch (error) {
        console.error('Error refreshing quiz data:', error);
        setAllQuizzes([]);
      }
    }
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

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold">{allQuizzes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Plus className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold">
                  {courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Quizzes with Questions</p>
                <p className="text-2xl font-bold">
                  {allQuizzes.filter(q => (q.questions?.length || q.question_count || 0) > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                        // Get all quizzes for this module
                        const quizzes = allQuizzes.filter(q => q.module_id === mod.id);
                        console.log(`Module ${mod.id} quizzes:`, quizzes);
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
                                <Button onClick={() => handleCreateQuiz(mod.id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                                  <Plus size={16} className="mr-2" /> Create Quiz
                                </Button>
                              </div>
                            </div>
                            {/* List all quizzes for this module */}
                            {quizzes.length > 0 && (
                              <div className="mt-4 space-y-4">
                                {quizzes.map((quiz) => (
                                  <div key={quiz.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50">
                                    <div>
                                      <div className="font-semibold text-gray-900">{quiz.title}</div>
                                      <div className="text-xs text-gray-500 mb-1">Type: {quiz.type} | Max Attempts: {quiz.maxAttempts}</div>
                                      <div className="text-xs text-gray-500 mb-1">Score: {quiz.min_score} - {quiz.max_score} | Time: {quiz.time_estimate} min</div>
                                      <div className="text-xs text-gray-500 mb-1">Questions: {quiz.questions?.length || quiz.question_count || 0}</div>
                                    </div>
                                                                          <div className="flex gap-2 mt-2 md:mt-0">
                                        <Button
                                          onClick={() => handlePreviewQuiz(quiz)}
                                          className="p-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md shadow-sm transition duration-200"
                                          title="Preview Quiz"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>

                                        <Button
                                          onClick={() => handleViewScores(quiz, course.id)}
                                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition duration-200"
                                          title="View Scores"
                                        >
                                          <Trophy className="w-4 h-4" />
                                        </Button>

                                        <Button
                                          onClick={() => handleEditQuiz(quiz)}
                                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition duration-200"
                                          title="Edit Quiz"
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>

                                        <Button
                                          onClick={() => handleDeleteQuiz(quiz)}
                                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition duration-200"
                                          title="Delete Quiz"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>

                                        <Button
                                          onClick={() => handleAddQuestions(quiz)}
                                          className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow-sm transition duration-200"
                                          title="Add Questions"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </div>


                                  </div>
                                ))}
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
      {showPreviewDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">{previewQuizData?.title || 'Quiz Preview'}</h2>
                <p className="text-sm text-gray-600">{previewQuizData?.description}</p>
              </div>
              <Button
                onClick={() => { setShowPreviewDialog(false); setPreviewQuizData(null); setPreviewError(null); }}
                variant="outline"
              >
                Close
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {previewLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-300">
                  <p className="text-lg text-gray-500">Loading quiz...</p>
                </div>
              ) : previewError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-300">
                  <p className="text-lg text-red-500">{previewError}</p>
                </div>
              ) : previewQuizData && previewQuizData.questions && previewQuizData.questions.length > 0 ? (
                <div className="space-y-8">
                  {previewQuizData.questions.map((q, idx) => {
                    const options = q.question_options && q.question_options.length > 0 ? q.question_options : (q.options || []);
                    return (
                      <div key={q.id} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{idx + 1}. {q.question}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuestion(q)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        {options.length > 0 && (
                          <div className="space-y-2 ml-4">
                            {options.map(opt => (
                              <div key={opt.id || opt.text} className="flex items-center">
                                <input type="radio" disabled className="mr-2" name={`preview-q-${q.id}`} checked={opt.isCorrect || false} readOnly />
                                <span className="text-gray-800">{opt.text || opt}</span>
                                {opt.isCorrect && <span className="ml-2 text-green-600 text-xs font-semibold">(Correct)</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-300">
                  <p className="text-lg text-gray-500">No questions found for this quiz.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <QuizModal
        isOpen={showQuizModal}
        onClose={() => {
          setShowQuizModal(false);
          setEditingQuiz(null);
          setIsAddingQuestions(false);
          // Refresh quizzes for all modules when modal closes
          if (isAllowed && selectedModuleForQuiz) {
            fetchAndSetModuleQuizzes(selectedModuleForQuiz);
          }
        }}
        moduleId={selectedModuleForQuiz}
        onQuizCreated={handleQuizCreatedOrUpdated}
        editingQuiz={editingQuiz}
        onQuizUpdated={handleQuizCreatedOrUpdated}
        isAddingQuestions={isAddingQuestions}
      />

      <QuizScoresModal
        isOpen={showScoresModal}
        onClose={() => {
          setShowScoresModal(false);
          setSelectedQuizForScores(null);
        }}
        quiz={selectedQuizForScores}
        courseId={courses.find(c => c.modules?.some(m => m.id === selectedQuizForScores?.module_id))?.id}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && quizToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the quiz "{quizToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
              <Button variant="destructive" onClick={async () => {
                try {
                  await deleteQuiz(quizToDelete.id);
                  setAllQuizzes(prev => prev.filter(q => q.id !== quizToDelete.id));
                  setModuleQuizzes(prev => {
                    const moduleId = quizToDelete.module_id;
                    return {
                      ...prev,
                      [moduleId]: prev[moduleId]?.filter(q => q.id !== quizToDelete.id) || []
                    };
                  });
                  setShowDeleteConfirmation(false);
                  setQuizToDelete(null);
                  toast.success('Quiz deleted successfully!');
                } catch (err) {
                  console.error('Error deleting quiz:', err);
                  toast.error('Failed to delete quiz.');
                }
              }}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      <EditQuestionModal
        isOpen={showEditQuestionModal}
        onClose={() => {
          setShowEditQuestionModal(false);
          setSelectedQuestionForEdit(null);
        }}
        question={selectedQuestionForEdit}
        quizId={previewQuizData?.id}
        onQuestionUpdated={handleQuestionUpdated}
      />
    </div>
  );
};

export default CreateQuizPage;