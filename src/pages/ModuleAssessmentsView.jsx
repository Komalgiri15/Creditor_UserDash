import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, Clock, FileCheck, PlayCircle, GraduationCap, ChevronDown, MessageSquare, Users, PenTool, FileText, BookOpen } from "lucide-react";

// Sample lesson data for the current module
const lessonData = {
  "1": {
    title: "Introduction to Business Trust",
    description: "Learn the fundamentals of business trusts, their structure, and legal implications in modern business practices.",
    estimatedTime: "2 hours 30 minutes"
  },
  "2": {
    title: "React Hooks & State Management",
    description: "Master React hooks for state and effects. Learn about context API and custom hooks implementation.",
    estimatedTime: "3 hours 15 minutes"
  }
};

// Sample assignment data
const assignmentData = [
  {
    id: "1",
    title: "Assignment 1: Context API Implementation",
    description: "Build a theme provider using React Context API and implement dark/light mode switching functionality.",
    maxScore: 100,
    timeLimit: "2 hours",
    attempts: 3,
    difficulty: "Medium"
  },
  {
    id: "2", 
    title: "Assignment 2: State Management Project",
    description: "Create a task management application using React hooks and state management patterns.",
    maxScore: 150,
    timeLimit: "3 hours",
    attempts: 2,
    difficulty: "Hard"
  },
  {
    id: "3",
    title: "Assignment 3: Component Architecture",
    description: "Design and implement a reusable component library with proper TypeScript types.",
    maxScore: 120,
    timeLimit: "2.5 hours", 
    attempts: 3,
    difficulty: "Medium"
  },
  {
    id: "4",
    title: "Assignment 4: Advanced React Patterns",
    description: "Implement advanced React patterns including HOCs, render props, and compound components.",
    maxScore: 180,
    timeLimit: "4 hours",
    attempts: 2,
    difficulty: "Hard"
  }
];

// Sample essay data
const essayData = [
  {
    id: "1",
    title: "Essay 1: Technology and Society",
    description: "Write a comprehensive essay on the impact of technology on modern society and human relationships.",
    maxScore: 100,
    timeLimit: "2 hours",
    attempts: 2,
    difficulty: "Medium",
    wordLimit: "800-1000 words"
  },
  {
    id: "2",
    title: "Essay 2: Climate Change Solutions",
    description: "Analyze various approaches to addressing climate change and propose innovative solutions.",
    maxScore: 120,
    timeLimit: "2.5 hours",
    attempts: 2,
    difficulty: "Hard",
    wordLimit: "1000-1200 words"
  },
  {
    id: "3",
    title: "Essay 3: Education in Digital Age",
    description: "Discuss the transformation of education in the digital era and its future implications.",
    maxScore: 90,
    timeLimit: "1.5 hours",
    attempts: 3,
    difficulty: "Medium",
    wordLimit: "600-800 words"
  },
  {
    id: "4",
    title: "Essay 4: Economic Inequality",
    description: "Examine the causes and consequences of economic inequality in contemporary society.",
    maxScore: 110,
    timeLimit: "2 hours",
    attempts: 2,
    difficulty: "Hard",
    wordLimit: "900-1100 words"
  }
];

// Sample debate data
const debateData = [
  {
    id: "1",
    title: "Debate 1: Technology's Impact on Society",
    description: "Discuss whether technology has done more harm than good to modern society.",
    topic: "Technology has done more harm than good to society",
    maxScore: 50,
    timeLimit: "1 minute",
    participants: "Class discussion",
    difficulty: "Medium"
  },
  {
    id: "2",
    title: "Debate 2: Climate Change Solutions",
    description: "Debate the effectiveness of individual vs. governmental action on climate change.",
    topic: "Individual actions are more important than government policies for climate change",
    maxScore: 60,
    timeLimit: "1 minute",
    participants: "Open forum",
    difficulty: "Hard"
  },
  {
    id: "3",
    title: "Debate 3: Future of Work",
    description: "Analyze whether remote work is better than traditional office environments.",
    topic: "Remote work is more productive than office-based work",
    maxScore: 45,
    timeLimit: "1 minute",
    participants: "Professional discussion",
    difficulty: "Medium"
  },
  {
    id: "4",
    title: "Debate 4: Education Reform",
    description: "Debate the role of standardized testing in modern education systems.",
    topic: "Standardized testing should be abolished from education",
    maxScore: 55,
    timeLimit: "1 minute",
    participants: "Academic debate",
    difficulty: "Hard"
  }
];

// Sample assessment data
const assessmentSections = [
  {
    id: "quiz",
    title: "Quiz Section",
    icon: <GraduationCap size={20} className="text-blue-500" />,
    description: "Test your knowledge with various question formats",
    color: "bg-blue-50 border-blue-200"
  },
  {
    id: "assignment",
    title: "Assignment Section", 
    icon: <FileCheck size={20} className="text-green-500" />,
    description: "Submit projects and practical assignments",
    color: "bg-green-50 border-green-200"
  },
  {
    id: "essay",
    title: "Essay Section",
    icon: <PenTool size={20} className="text-purple-500" />,
    description: "Write detailed essays and analytical pieces",
    color: "bg-purple-50 border-purple-200"
  },
  {
    id: "survey",
    title: "Survey Section",
    icon: <FileText size={20} className="text-orange-500" />,
    description: "Participate in course feedback and surveys",
    color: "bg-orange-50 border-orange-200"
  },
  {
    id: "debate",
    title: "Debate Section",
    icon: <Users size={20} className="text-red-500" />,
    description: "Engage in structured debates and discussions",
    color: "bg-red-50 border-red-200"
  }
];

function ModuleAssessmentsView() {
  const { moduleId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [selectedQuizType, setSelectedQuizType] = useState("general");
  const [openSections, setOpenSections] = useState({});

  const currentLesson = lessonData[moduleId] || lessonData["2"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
    setActiveSection(activeSection === sectionId ? "" : sectionId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/courses/react-2023`}>
            <ChevronLeft size={16} />
            Back to module
          </Link>
        </Button>
        <Badge>Assessments</Badge>
      </div>

      {/* Lesson Info */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          {currentLesson.title}
        </h1>
        <p className="text-muted-foreground mb-4 text-lg">
          {currentLesson.description}
        </p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>Estimated time: {currentLesson.estimatedTime}</span>
        </div>
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
                              to={`/quiz-instruction/${quizNumber}?module=${moduleId}&category=${selectedQuizType}`}
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
                    
                    {section.id === 'assignment' && (
                      <div>
                        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700 font-medium">
                            📝 Assignments: Complete practical projects to demonstrate your skills and understanding.
                          </p>
                        </div>
                        
                        <h3 className="font-semibold mb-6 text-xl">Available Assignments:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {assignmentData.map((assignment) => (
                            <Link 
                              key={assignment.id}
                              to={`/assignment-instruction/${assignment.id}?module=${moduleId}`}
                              className="block"
                            >
                              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                <CardContent className="p-6">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mb-4">
                                    <FileCheck size={24} />
                                  </div>
                                  <h4 className="font-bold text-lg mb-2">{assignment.title}</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {assignment.description}
                                  </p>
                                  <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                      <span>Max Score:</span>
                                      <span className="font-medium">{assignment.maxScore} points</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Time Limit:</span>
                                      <span className="font-medium">{assignment.timeLimit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Attempts:</span>
                                      <span className="font-medium">{assignment.attempts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Difficulty:</span>
                                      <Badge variant="outline" className="text-xs">
                                        {assignment.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                    Start Assignment <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {section.id === 'essay' && (
                      <div>
                        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-700 font-medium">
                            ✍️ Essays: Write detailed essays and analytical pieces to demonstrate your understanding and critical thinking skills.
                          </p>
                        </div>
                        
                        <h3 className="font-semibold mb-6 text-xl">Available Essays:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {essayData.map((essay) => (
                            <Link 
                              key={essay.id}
                              to={`/essay-instruction/${essay.id}?module=${moduleId}`}
                              className="block"
                            >
                              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                <CardContent className="p-6">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white mb-4">
                                    <PenTool size={24} />
                                  </div>
                                  <h4 className="font-bold text-lg mb-2">{essay.title}</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {essay.description}
                                  </p>
                                  <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                      <span>Max Score:</span>
                                      <span className="font-medium">{essay.maxScore} points</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Time Limit:</span>
                                      <span className="font-medium">{essay.timeLimit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Word Limit:</span>
                                      <span className="font-medium">{essay.wordLimit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Attempts:</span>
                                      <span className="font-medium">{essay.attempts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Difficulty:</span>
                                      <Badge variant="outline" className="text-xs">
                                        {essay.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                    Start Essay <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {section.id === 'survey' && (
                      <div>
                        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-700 font-medium">
                            📋 Surveys: Share your feedback and help us improve the learning experience by participating in module surveys.
                          </p>
                        </div>
                        
                        <h3 className="font-semibold mb-6 text-xl">Available Surveys:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2].map((surveyNumber) => (
                            <Link 
                              key={surveyNumber}
                              to={`/survey-instruction/${surveyNumber}?module=${moduleId}`}
                              className="block"
                            >
                              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                <CardContent className="p-6">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white mb-4">
                                    <FileText size={24} />
                                  </div>
                                  <h4 className="font-bold text-lg mb-2">Survey {surveyNumber}</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {surveyNumber === 1 
                                      ? "Module Learning Experience - Share your feedback about this module's content and structure"
                                      : "Course Content Evaluation - Help us evaluate the overall course materials and learning outcomes"
                                    }
                                  </p>
                                  <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                      <span>Duration:</span>
                                      <span className="font-medium">
                                        {surveyNumber === 1 ? "5-10 minutes" : "8-12 minutes"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Questions:</span>
                                      <span className="font-medium">
                                        {surveyNumber === 1 ? "5 questions" : "6 questions"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Type:</span>
                                      <Badge variant="outline" className="text-xs">
                                        {surveyNumber === 1 ? "Module Feedback" : "Content Evaluation"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                    Start Survey <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {section.id === 'debate' && (
                      <div>
                        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-700 font-medium">
                            🗣️ Debates: Engage in structured debates and discussions to develop critical thinking and argumentation skills.
                          </p>
                        </div>
                        
                        <h3 className="font-semibold mb-6 text-xl">Available Debates:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {debateData.map((debate) => (
                            <Link 
                              key={debate.id}
                              to={`/debate-instruction/${debate.id}?module=${moduleId}`}
                              className="block"
                            >
                              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20">
                                <CardContent className="p-6">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white mb-4">
                                    <MessageSquare size={24} />
                                  </div>
                                  <h4 className="font-bold text-lg mb-2">{debate.title}</h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                    {debate.description}
                                  </p>
                                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Topic:</p>
                                    <p className="text-sm italic text-gray-800">"{debate.topic}"</p>
                                  </div>
                                  <div className="space-y-2 text-xs text-muted-foreground">
                                    <div className="flex justify-between">
                                      <span>Max Score:</span>
                                      <span className="font-medium">{debate.maxScore} points</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Time Limit:</span>
                                      <span className="font-medium">{debate.timeLimit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Format:</span>
                                      <span className="font-medium">{debate.participants}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Difficulty:</span>
                                      <Badge variant="outline" className="text-xs">
                                        {debate.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                    Start Debate <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
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
      </div>
    </div>
  );
}

export default ModuleAssessmentsView;