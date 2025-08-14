import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, Clock, GraduationCap, ChevronDown, BookOpen, Loader2, CheckCircle, XCircle, Award, BarChart2, HelpCircle } from "lucide-react";
import { fetchCourseModules } from "@/services/courseService";
import { getModuleQuizzes } from "@/services/quizService";

// Assessment sections - only Quiz for now
const assessmentSections = [
  {
    id: "quiz",
    title: "Module Assessments",
    icon: <GraduationCap size={20} className="text-indigo-600" />,
    description: "Test your knowledge with quizzes and track your progress",
    color: "bg-indigo-50 border-indigo-200"
  }
];

function ModuleAssessmentsView() {
  const { moduleId, courseId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuizType, setSelectedQuizType] = useState("general");
  // Set quiz section to be open by default
  const [openSections, setOpenSections] = useState({ quiz: true });
  const [module, setModule] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        console.log("Fetching data for module:", moduleId, "course:", courseId);
        
        // Fetch both module and quizzes in parallel
        const [modules, quizzesResponse] = await Promise.all([
          fetchCourseModules(courseId),
          getModuleQuizzes(moduleId)
        ]);
        
        console.log("Modules response:", modules);
        console.log("Quizzes response:", quizzesResponse);
        
        const foundModule = modules.find(m => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);
          console.log("Found module:", foundModule);
        } else {
          setError("Module not found");
          console.log("Module not found for ID:", moduleId);
        }
        
        // quizzesResponse is now always an array
        if (Array.isArray(quizzesResponse)) {
          setQuizzes(quizzesResponse);
          setFilteredQuizzes(quizzesResponse);
        } else {
          setQuizzes([]);
          setFilteredQuizzes([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load module and quizzes");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId && moduleId) {
      fetchData();
    }
  }, [courseId, moduleId]);

  // Filter quizzes based on selected type (for now, show all quizzes)
  useEffect(() => {
    if (quizzes.length > 0) {
      console.log("Filtering quizzes:", quizzes);
      // For now, show all quizzes regardless of type
      // You can implement filtering logic here based on your requirements
      setFilteredQuizzes(quizzes);
    }
  }, [selectedQuizType, quizzes]);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'NOT_ATTEMPTED':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'NOT_ATTEMPTED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
                <p className="text-muted-foreground text-lg">Loading module assessments...</p>
                <p className="text-sm text-gray-500">Preparing your learning materials</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Failed to load assessments</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <div className="space-x-3">
                  <Button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700">
                    Try Again
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/dashboard/courses/${courseId}/modules`}>
                      Back to Modules
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  console.log("Rendering with quizzes:", quizzes, "filtered:", filteredQuizzes);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1">
        <div className="container py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild className="border-gray-300 hover:bg-gray-100">
              <Link to={`/dashboard/courses/${courseId}/modules`} className="flex items-center gap-1">
                <ChevronLeft size={16} />
                <span>Back to Module</span>
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Module Assessments</h1>
              <p className="text-sm text-gray-500">Test your knowledge and track your progress</p>
            </div>
          </div>

          {/* Module Info Card */}
          {module && (
            <Card className="mb-8 overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="max-w-4xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                      <BookOpen size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{module.title}</h1>
                      <p className="text-gray-700 leading-relaxed">{module.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <Award size={16} className="text-indigo-500" />
                        <span>Complete all assessments to finish this module</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assessment Sections */}
          {assessmentSections.map((section) => (
            <Collapsible
              key={section.id}
              open={openSections[section.id]}
              onOpenChange={() => toggleSection(section.id)}
              className="mb-8"
            >
              <CollapsibleTrigger asChild>
                <Card className={`cursor-pointer transition-all duration-300 ${section.color} border-2 ${openSections[section.id] ? 'border-indigo-300 shadow-md' : 'border-transparent hover:border-indigo-200'}`}>
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-800 mb-1">
                            {section.title}
                          </CardTitle>
                          <p className="text-gray-600 text-sm">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {section.id === 'quiz' && openSections[section.id] && (
                          <Select value={selectedQuizType} onValueChange={setSelectedQuizType}>
                            <SelectTrigger className="w-32 bg-white" onClick={(e) => e.stopPropagation()}>
                              <SelectValue placeholder="Quiz type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general" className="flex items-center gap-2">
                                <HelpCircle size={14} /> General Quiz
                              </SelectItem>
                              <SelectItem value="final" className="flex items-center gap-2">
                                <BarChart2 size={14} /> Final Quiz
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <ChevronDown 
                          size={20} 
                          className={`transition-transform duration-200 text-gray-500 ${
                            openSections[section.id] ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <Card className="mt-0 border-t-0 rounded-t-none shadow-sm border border-gray-200">
                  <CardContent className="p-6">
                    {section.id === 'quiz' && (
                      <div className="space-y-6">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-start gap-3">
                          <div className="mt-1">
                            <HelpCircle size={18} className="text-indigo-600" />
                          </div>
                          <p className="text-sm text-indigo-800">
                            {selectedQuizType === 'general' 
                              ? "Practice with these quizzes to reinforce your learning. Your scores won't affect your overall progress." 
                              : "These assessment quizzes will evaluate your understanding and contribute to your course completion."
                            }
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-gray-800">Available Quizzes</h3>
                          <span className="text-sm text-gray-500">
                            {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'} available
                          </span>
                        </div>
                        
                        {filteredQuizzes.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No quizzes available</h3>
                            <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                              {selectedQuizType === 'general' 
                                ? "Check back later for practice quizzes or contact your instructor." 
                                : "Final assessment quizzes will be made available as you progress through the module."
                              }
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuizzes.map((quiz, index) => {
                              console.log(`Rendering quiz ${index}:`, quiz);
                              return (
                                <Link 
                                  key={quiz.quizId || quiz.id || index}
                                  to={`/dashboard/quiz/instruction/${quiz.quizId || quiz.id}?module=${moduleId}&category=${selectedQuizType}`}
                                  state={{ quiz }}
                                  className="block group"
                                >
                                  <Card className="h-full transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-200 group-hover:border-indigo-300 overflow-hidden">
                                    <CardContent className="p-6">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600`}>
                                          {quiz.status === 'COMPLETED' ? (
                                            <CheckCircle size={24} />
                                          ) : quiz.status === 'IN_PROGRESS' ? (
                                            <Clock size={24} />
                                          ) : (
                                            <BookOpen size={24} />
                                          )}
                                        </div>
                                        <Badge className={`${getStatusColor(quiz.status)} transition-colors`}>
                                          {quiz.status === 'COMPLETED' ? 'Completed' : 
                                           quiz.status === 'IN_PROGRESS' ? 'In Progress' : 
                                           'Not Attempted'}
                                        </Badge>
                                      </div>
                                      
                                      <h4 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
                                        {quiz.title || `Quiz ${quiz.quizId || quiz.id || index}`}
                                      </h4>
                                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        {selectedQuizType === 'general' ? 'Practice Quiz' : 'Assessment Quiz'} - {quiz.description || 'Test your knowledge on this topic'}
                                      </p>
                                      
                                      {/* Quiz Details */}
                                      <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                          <Award size={14} className="text-indigo-500" />
                                          <span>Max Score: {quiz.maxScore || 100}</span>
                                        </div>
                                        {quiz.score !== null && quiz.score !== undefined && (
                                          <div className="flex items-center gap-2 text-gray-600">
                                            <BarChart2 size={14} className="text-indigo-500" />
                                            <span>Your Score: {quiz.score}</span>
                                          </div>
                                        )}
                                        {quiz.attemptDate && (
                                          <div className="flex items-center gap-2 text-gray-600">
                                            <Clock size={14} className="text-indigo-500" />
                                            <span>Attempted: {new Date(quiz.attemptDate).toLocaleDateString()}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700 transition-colors">
                                        <span>Start Quiz</span>
                                        <ChevronLeft className="w-4 h-4 ml-1 rotate-180 transition-transform group-hover:translate-x-1" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ModuleAssessmentsView;