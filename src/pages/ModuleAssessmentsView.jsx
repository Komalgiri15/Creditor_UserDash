import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, Clock, GraduationCap, ChevronDown, BookOpen, Loader2, CheckCircle, XCircle } from "lucide-react";
import { fetchCourseModules } from "@/services/courseService";
import { getModuleQuizzes } from "@/services/quizService";

// Assessment sections - only Quiz for now
const assessmentSections = [
  {
    id: "quiz",
    title: "Quiz Section",
    icon: <GraduationCap size={20} className="text-blue-500" />,
    description: "Test your knowledge with various question formats",
    color: "bg-blue-50 border-blue-200"
  }
];

function ModuleAssessmentsView() {
  const { moduleId, courseId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuizType, setSelectedQuizType] = useState("general");
  const [openSections, setOpenSections] = useState({});
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
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOT_ATTEMPTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-muted-foreground">Loading module assessments...</p>
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
                <h3 className="text-lg font-medium mb-2">Failed to load assessments</h3>
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

  console.log("Rendering with quizzes:", quizzes, "filtered:", filteredQuizzes);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="flex-1">
        <div className="container py-8 max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/dashboard/courses/${courseId}/modules`}>
                <ChevronLeft size={16} />
                Back to Module
              </Link>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Module Assessments
            </Button>
          </div>

          {/* Module Info Card */}
          {module && (
            <Card className="mb-8 overflow-hidden shadow-xl border-0">
              <CardContent className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="max-w-4xl">
                  <h1 className="text-3xl font-bold text-purple-900 mb-4 leading-tight">{module.title}</h1>
                  <p className="text-gray-700 text-md leading-relaxed">{module.description}</p>
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
            >
              <CollapsibleTrigger asChild>
                <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${section.color} border-2 border-transparent hover:border-blue-300`}>
                  <CardHeader className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-md">
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                            {section.title}
                          </CardTitle>
                          <p className="text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {section.id === 'quiz' && openSections[section.id] && (
                          <Select value={selectedQuizType} onValueChange={setSelectedQuizType}>
                            <SelectTrigger className="w-32" onClick={(e) => e.stopPropagation()}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Quiz</SelectItem>
                              <SelectItem value="final">Final Quiz</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <ChevronDown 
                          size={20} 
                          className={`transition-transform duration-200 ${
                            openSections[section.id] ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <Card className="mt-2 border-t-0 rounded-t-none">
                  <CardContent className="p-6">
                    {section.id === 'quiz' && (
                      <div>
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700 font-medium">
                            {selectedQuizType === 'general' 
                              ? "📋 General Quizzes: Practice questions that won't affect your performance score." 
                              : "🎯 Final Quizzes: Performance impact quizzes that will affect your progress and grades."
                            }
                          </p>
                        </div>
                        
                        <h3 className="font-semibold mb-6 text-xl">Available Quizzes:</h3>
                        
                        {filteredQuizzes.length === 0 ? (
                          <div className="text-center py-12">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No quizzes available</h3>
                            <p className="text-muted-foreground mt-1">
                              {selectedQuizType === 'general' 
                                ? "No general practice quizzes found for this module." 
                                : "No final assessment quizzes found for this module."
                              }
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredQuizzes.map((quiz, index) => {
                              console.log(`Rendering quiz ${index}:`, quiz);
                              return (
                                <Link 
                                  key={quiz.quizId || quiz.id || index}
                                  to={`/dashboard/quiz/instruction/${quiz.quizId || quiz.id}?module=${moduleId}&category=${selectedQuizType}`}
                                  state={{ quiz }}
                                  className="block"
                                >
                                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                    <CardContent className="p-6">
                                      <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl`}>
                                          <BookOpen size={24} />
                                        </div>
                                        <Badge className={getStatusColor(quiz.status)}>
                                          {quiz.status || 'Available'}
                                        </Badge>
                                      </div>
                                      
                                      <h4 className="font-bold text-lg mb-2">{quiz.title || `Quiz ${quiz.quizId || quiz.id || index}`}</h4>
                                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                        {selectedQuizType === 'general' ? 'Practice Quiz' : 'Assessment Quiz'} - Test your knowledge
                                      </p>
                                      
                                      {/* Quiz Details */}
                                      <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <GraduationCap size={14} />
                                          <span>Max Score: {quiz.maxScore || 100}</span>
                                        </div>
                                        {quiz.score !== null && quiz.score !== undefined && (
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle size={14} />
                                            <span>Your Score: {quiz.score}</span>
                                          </div>
                                        )}
                                        {quiz.attemptDate && (
                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock size={14} />
                                            <span>Attempted: {new Date(quiz.attemptDate).toLocaleDateString()}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                        Start Quiz <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
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