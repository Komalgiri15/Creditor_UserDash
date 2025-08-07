import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, Clock, GraduationCap, ChevronDown, BookOpen } from "lucide-react";
import { fetchCourseModules } from "@/services/courseService";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModule = async () => {
      setIsLoading(true);
      setError("");
      try {
        const modules = await fetchCourseModules(courseId);
        const foundModule = modules.find(m => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);
        } else {
          setError("Module not found");
        }
      } catch (err) {
        setError("Failed to load module");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId && moduleId) {
      fetchModule();
    }
  }, [courseId, moduleId]);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Failed to load module</h3>
          <p className="text-muted-foreground mb-4">{error || "Module not found"}</p>
          <Button asChild>
            <Link to={`/dashboard/courses/${courseId}`}>
              Back to Course
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <main className="flex-1">
        <div className="container py-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/dashboard/courses/${courseId}`}>
                <ChevronLeft size={16} />
                Back to Module
              </Link>
            </Button>
            <Badge>Module Assessments</Badge>
          </div>

          {/* Module Info */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {module.title}
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              {module.description}
            </p>
            {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock size={16} />
              <span>Estimated time: {module.estimated_duration || 0} minutes</span>
            </div> */}
          </div>

          {/* Assessment Sections */}
          <div className="space-y-4">
            {assessmentSections.map((section) => (
              <div key={section.id} className="assessment-section">
                <Collapsible 
                  open={openSections[section.id]} 
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Card className={`cursor-pointer hover:shadow-md transition-all ${section.color}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {section.icon}
                            <div>
                              <CardTitle className="text-lg">{section.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">{section.description}</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {[1, 2, 3, 4, 5, 6].map((quizNumber) => (
                                <Link 
                                  key={quizNumber}
                                  to={`/dashboard/quiz/instruction/${quizNumber}?module=${moduleId}&category=${selectedQuizType}`}
                                  className="block"
                                >
                                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                    <CardContent className="p-6">
                                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl mb-4`}>
                                        <BookOpen size={24} />
                                      </div>
                                      <h4 className="font-bold text-lg mb-2">Quiz {quizNumber}</h4>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {selectedQuizType === 'general' ? 'Practice Quiz' : 'Assessment Quiz'} - 10 questions covering various topics
                                      </p>
                                      <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                        Start Quiz <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
            {/* <div className="mt-8 text-center text-muted-foreground text-base font-medium">
              More assessment types coming soon...
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModuleAssessmentsView;