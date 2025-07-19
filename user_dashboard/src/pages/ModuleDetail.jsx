import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import  ModuleCard from "@/components/courses/ModuleCard";
import  LessonCardModule from "@/components/courses/LessonCardModule";
import { QuizCard } from "@/components/courses/QuizCard";
import { AssignmentCard } from "@/components/courses/AssignmentCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, BookText, BookOpen, GraduationCap, FileCheck, Lock, MessageSquare, ClipboardList, PenTool, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AssignmentSubmissionDialog } from "@/components/assignments/AssignmentSubmissionDialog";
import { AssignmentReportDialog } from "@/components/assignments/AssignmentReportDialog";
import { DebateInfoDialog } from "@/components/debates/DebateInfoDialog";
import { SurveyDialog } from "@/components/surveys/SurveyDialog";
import { EssayAssessmentDialog } from "@/components/essays/EssayAssessmentDialog";
import { EssayViewDialog } from "@/components/essays/EssayViewDialog";

// Assessment types data structure
const assessmentSections = [
  {
    id: "objective",
    title: "Objective-Based Assessments",
    description: "Structured questions with predefined answers",
    badgeText: "6 Types",
    badgeColor: "bg-blue-100 text-blue-800",
    headerColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    assessments: [
      { title: "Multiple Choice Quiz", duration: "15 min", questions: "10 Q" },
      { title: "True/False Test", duration: "10 min", questions: "15 Q" },
      { title: "Fill in the Blanks", duration: "20 min", questions: "8 Q" },
      { title: "Matching Pairs", duration: "12 min", questions: "6 Q" },
      { title: "Dropdown Selection", duration: "18 min", questions: "12 Q" },
      { title: "Numeric Calculations", duration: "25 min", questions: "5 Q" }
    ]
  },
  {
    id: "subjective",
    title: "Subjective/Descriptive Assessments",
    description: "Open-ended questions requiring detailed responses",
    badgeText: "3 Types",
    badgeColor: "bg-yellow-100 text-yellow-800",
    headerColor: "bg-gradient-to-r from-amber-600 to-orange-600",
    assessments: [
      { title: "Short Answer Test", duration: "30 min", questions: "8 Q" },
      { title: "Essay Writing", duration: "60 min", questions: "3 Q" },
      { title: "Case Study Analysis", duration: "45 min", questions: "2 Q" }
    ]
  },
  {
    id: "file-based",
    title: "File-Based Submissions",
    description: "Upload assignments and project files",
    badgeText: "2 Types",
    badgeColor: "bg-amber-100 text-amber-800",
    headerColor: "bg-gradient-to-r from-emerald-600 to-teal-600",
    assessments: [
      { title: "Assignment Upload", duration: "No time limit", questions: "1 Q" },
      { title: "Project Submission", duration: "7 days", questions: "1 Q" }
    ]
  },
  {
    id: "interactive",
    title: "Interactive Assessments",
    description: "Engaging multimedia-based questions",
    badgeText: "3 Types",
    badgeColor: "bg-green-100 text-green-800",
    headerColor: "bg-gradient-to-r from-purple-600 to-indigo-600",
    assessments: [
      { title: "Drag & Drop Exercise", duration: "20 min", questions: "5 Q" },
      { title: "Hotspot Image Quiz", duration: "15 min", questions: "4 Q" },
      { title: "Scenario Simulation", duration: "35 min", questions: "3 Q" }
    ]
  },
  {
    id: "proctored",
    title: "Proctored Assessments",
    description: "Monitored examinations with live supervision",
    badgeText: "1 Type",
    badgeColor: "bg-red-100 text-red-800",
    headerColor: "bg-gradient-to-r from-rose-600 to-red-600",
    assessments: [
      { title: "Live Proctored Exam", duration: "120 min", questions: "50 Q" }
    ]
  }
];

// Updated dummy data for lessons with completion requirements
const moduleLessons = [
  {
    id: "1",
    moduleId: "2",
    title: "React Hooks Overview",
    description: "Introduction to React Hooks and their advantages over class components.",
    progress: 100,
    lessonCount: 5,
    quizCount: 2,
    assignmentCount: 1,
    duration: "1h 15m",
    videoCount: 3,
    textCount: 2
  },
  {
    id: "2",
    moduleId: "2",
    title: "useState and useEffect",
    description: "Learn the two most commonly used hooks for state and effects.",
    progress: 100,
    lessonCount: 4,
    quizCount: 2,
    assignmentCount: 1,
    duration: "1h 30m",
    videoCount: 2,
    textCount: 2
  },
  {
    id: "3",
    moduleId: "2",
    title: "Context API & useContext",
    description: "Managing global state with React Context and the useContext hook.",
    progress: 60,
    lessonCount: 6,
    quizCount: 3,
    assignmentCount: 2,
    duration: "1h 45m",
    videoCount: 3,
    textCount: 3
  },
  {
    id: "4",
    moduleId: "2",
    title: "Advanced Hooks & Custom Hooks",
    description: "Explore useReducer, useMemo, useCallback, and build custom hooks.",
    progress: 0,
    lessonCount: 7,
    quizCount: 2,
    assignmentCount: 2,
    duration: "2h",
    videoCount: 4,
    textCount: 3
  }
];

// Enhanced quizzes data with better structure matching the image
const moduleQuizzes = [
  {
    id: "quiz-1",
    moduleId: "2",
    lessonId: "1",
    title: "useState Hook Mastery",
    description: "Advanced quiz on useState hook and state management",
    questionCount: 12,
    duration: "18 min",
    status: "completed",
    passingScore: 75,
    score: 78,
    dueDate: "2024-01-25"
  },
  {
    id: "quiz-2",
    moduleId: "2",
    lessonId: "2",
    title: "useEffect and Side Effects", 
    description: "Test your knowledge of useEffect hook and managing side effects",
    questionCount: 15,
    duration: "20 min",
    status: "in-progress",
    passingScore: 75,
    dueDate: "2024-02-05"
  },
  {
    id: "quiz-3",
    moduleId: "2",
    lessonId: "3",
    title: "Context API Deep Dive",
    description: "Comprehensive assessment on React Context API implementation",
    questionCount: 14,
    duration: "25 min",
    status: "not-started",
    passingScore: 70,
    dueDate: "2024-02-10"
  },
  {
    id: "quiz-4",
    moduleId: "2",
    lessonId: "3",
    title: "useContext Best Practices",
    description: "Quiz on useContext hook usage and performance optimization",
    questionCount: 10,
    duration: "15 min",
    status: "not-started",
    passingScore: 70,
    dueDate: "2024-02-15"
  }
];

// Enhanced assignments data with a "not submitted" assignment
const moduleAssignments = [
  {
    id: "assignment-1",
    moduleId: "2",
    lessonId: "1",
    title: "Hooks Migration Project",
    description: "Convert a class component to use React Hooks",
    dueDate: "2024-02-10",
    status: "submitted",
    estimatedTime: "3 hours",
    score: 88,
    maxScore: 100,
    fileCount: 4
  },
  {
    id: "assignment-2",
    moduleId: "2",
    lessonId: "2",
    title: "Build a Counter App",
    description: "Create a counter application using useState hook with multiple features",
    dueDate: "2024-02-15",
    status: "submitted",
    estimatedTime: "2 hours",
    score: 90,
    maxScore: 100,
    fileCount: 3
  },
  {
    id: "assignment-3",
    moduleId: "2",
    lessonId: "3",
    title: "Context Provider Implementation",
    description: "Build a theme provider using React Context API and implement dark/light mode switching",
    dueDate: "2024-02-20",
    status: "not-started",
    estimatedTime: "4 hours",
    maxScore: 100,
    fileCount: 0
  }
];

// Sample debates data
const moduleDebates = [
  {
    id: "debate-1",
    title: "Hooks vs Class Components: Which is Better?",
    description: "Participate in a structured debate about the advantages and disadvantages of React Hooks versus Class Components",
    participants: 12,
    deadline: "2024-02-20",
    status: "active"
  },
  {
    id: "debate-2",
    title: "Context API vs Redux for State Management",
    description: "Debate the merits of using Context API versus Redux for managing application state",
    participants: 8,
    deadline: "2024-02-25",
    status: "upcoming"
  }
];

// Sample surveys data
const moduleSurveys = [
  {
    id: "survey-1",
    title: "React Hooks Learning Experience",
    description: "Share your feedback about the React Hooks module and help us improve the course",
    questions: 8,
    deadline: "2024-02-28",
    status: "active"
  },
  {
    id: "survey-2",
    title: "Preferred Learning Methods",
    description: "Tell us about your learning preferences to help us create better content",
    questions: 5,
    deadline: "2024-03-05",
    status: "not-started"
  }
];

// Sample essays data
const moduleEssays = [
  {
    id: "essay-1",
    title: "The Impact of React Hooks on Modern Web Development",
    content: `React Hooks have revolutionized the way developers write React applications. Introduced in React 16.8, hooks provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle.

The most significant impact of hooks is the ability to use state and other React features without writing a class component. This has led to more functional programming patterns in React development and has made components more reusable and easier to test.

useState and useEffect are the most commonly used hooks. useState allows functional components to have local state, while useEffect lets you perform side effects in function components. These hooks have simplified component logic and made it easier to share stateful logic between components.

Custom hooks have emerged as a powerful pattern for sharing logic between components. They allow developers to extract component logic into reusable functions, leading to cleaner and more maintainable code.

The Context API, combined with useContext hook, has also become a popular choice for state management in smaller to medium-sized applications, often replacing the need for external state management libraries like Redux.

In conclusion, React Hooks have made React development more approachable for beginners while providing powerful tools for experienced developers to write more efficient and maintainable code.`,
    status: "submitted",
    submittedAt: "2024-01-20",
    wordCount: 185,
    score: 92,
    maxScore: 100
  },
  {
    id: "essay-2",
    title: "Comparing Class Components vs Functional Components",
    content: `The evolution from class components to functional components with hooks represents one of the most significant shifts in React development patterns.

Class components were the traditional way to create stateful components in React. They provided lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount, which allowed developers to hook into different phases of a component's lifecycle.

However, class components had several drawbacks. They required more boilerplate code, were harder to understand for beginners, and made it difficult to share stateful logic between components. The 'this' keyword could also be confusing, especially for developers coming from other programming backgrounds.

Functional components with hooks address many of these issues. They are more concise, easier to read, and the logic is more straightforward. Hooks like useEffect combine multiple lifecycle methods into a single, more intuitive API.

Performance-wise, functional components can be slightly more efficient due to their simpler nature, though the difference is usually negligible in practice.

While class components are still supported and won't be deprecated, the React team recommends using functional components with hooks for new development.`,
    status: "submitted", 
    submittedAt: "2024-01-15",
    wordCount: 167,
    score: 88,
    maxScore: 100
  },
  {
    id: "essay-3",
    title: "Best Practices for useEffect Hook",
    content: `The useEffect hook is one of the most powerful but also most misunderstood hooks in React. Understanding its proper usage is crucial for writing efficient React applications.

One of the most important concepts is the dependency array. This array tells React when to re-run the effect. An empty dependency array means the effect runs only once after the initial render, similar to componentDidMount. Including variables in the dependency array means the effect will re-run whenever those variables change.

A common mistake is forgetting to include all dependencies in the dependency array, which can lead to stale closures and bugs. The exhaustive-deps ESLint rule helps catch these issues.

Cleanup is another crucial aspect of useEffect. When dealing with subscriptions, timers, or event listeners, it's important to clean them up to prevent memory leaks. This is done by returning a cleanup function from the effect.

For complex state logic, useReducer might be a better choice than useState, especially when the next state depends on the previous one or when you have multiple sub-values.`,
    status: "draft",
    submittedAt: "2024-01-25",
    wordCount: 142,
    maxScore: 100
  }
];

// Function to check if a lesson should be locked
const isLessonLocked = (lessonIndex, lessons) => {
  if (lessonIndex === 0) return false; // First lesson is always unlocked
  
  // Check if previous lesson is completed
  const previousLesson = lessons[lessonIndex - 1];
  return previousLesson.progress < 100;
};

function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("lessons");
  const [activeAssessment, setActiveAssessment] = useState("quiz");
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [debateInfoDialogOpen, setDebateInfoDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [essayDialogOpen, setEssayDialogOpen] = useState(false);
  const [essayViewDialogOpen, setEssayViewDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedDebate, setSelectedDebate] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedEssay, setSelectedEssay] = useState(null);
  const [selectedDemoAssessment, setSelectedDemoAssessment] = useState({title: "", type: ""});
  const [openSections, setOpenSections] = useState({
    objective: true,
    subjective: false,
    "file-based": false,
    interactive: false,
    proctored: false
  });
  
  // Check URL hash to set active tab
  useEffect(() => {
    const hash = location.hash;
    if (hash === '#assessment') {
      setActiveTab('assessment');
    }
  }, [location.hash]);
  
  // Animation effect when component mounts
  useEffect(() => {
    // Header animation
    const header = document.querySelector(".module-header");
    setTimeout(() => {
      header?.classList.add("animate-fade-in");
      header?.classList.remove("opacity-0");
    }, 100);
  }, []);

  // Fixed: Re-trigger animation when any tab changes
  useEffect(() => {
    // Remove existing animations first
    const allCards = document.querySelectorAll(".content-card, .unit-card");
    allCards.forEach((card) => {
      card.classList.remove("animate-fade-in");
      card.classList.add("opacity-0");
    });
    
    // Add animation with delay
    setTimeout(() => {
      const currentCards = document.querySelectorAll(".content-card, .unit-card");
      currentCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("animate-fade-in");
          card.classList.remove("opacity-0");
        }, 100 * index);
      });
    }, 50);
  }, [activeTab, activeAssessment]);
  
  // Calculate module progress
  const moduleProgress = Math.floor(
    moduleLessons.reduce((acc, lesson) => acc + lesson.progress, 0) / moduleLessons.length
  );

  const handleAssessmentClick = (type) => {
    setActiveAssessment(type);
    console.log(`${type} clicked`);
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionDialogOpen(true);
  };

  const handleViewSubmission = (assignment) => {
    const submissionData = {
      title: assignment.title,
      score: assignment.score || 88,
      maxScore: assignment.maxScore,
      submittedAt: "2024-01-20 14:30",
      gradedAt: "2024-01-22 09:15",
      feedback: "Good implementation of Context API. Could improve error handling in edge cases."
    };
    setSelectedAssignment(submissionData);
    setReportDialogOpen(true);
  };

  const handleJoinDebate = (debate) => {
    navigate(`/debate/${debate.id}`);
  };

  const handleViewDebate = (debate) => {
    const debateWithTiming = {
      ...debate,
      startTime: "2024-02-20 10:00 AM",
      endTime: "2024-02-25 11:59 PM"
    };
    setSelectedDebate(debateWithTiming);
    setDebateInfoDialogOpen(true);
  };

  const handleContinueSurvey = (survey) => {
    navigate(`/survey/${moduleId}/${survey.id}`);
  };

  const handleStartSurvey = (survey) => {
    setSelectedSurvey(survey);
    setSurveyDialogOpen(true);
  };

  const handleWriteEssay = () => {
    setEssayDialogOpen(true);
  };

  const handleViewEssay = (essay) => {
    setSelectedEssay(essay);
    setEssayViewDialogOpen(true);
  };

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleTryDemo = (assessmentTitle, assessmentType) => {
    console.log(`Trying demo for: ${assessmentTitle}`);
    navigate(`/demo-quiz/${encodeURIComponent(assessmentTitle)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses/1">
                <ChevronLeft size={16} />
                Back to modules
              </Link>
            </Button>
            <Badge>React</Badge>
          </div>
          
          <div className="module-header opacity-0 transition-all duration-500 ease-in-out">
            <div className="flex md:flex-row flex-col gap-6 mb-8">
              <div className="md:w-1/3 w-full">
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000"
                    alt="React Hooks & State Management"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3 w-full">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  React Hooks & State Management
                </h1>
                <p className="text-muted-foreground mb-4">
                  Master React hooks for state and effects. Learn about context API and custom hooks.
                </p>
                
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>4 Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookText size={16} />
                    <span>22 Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap size={16} />
                    <span>{moduleQuizzes.length} Quizzes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCheck size={16} />
                    <span>{moduleAssignments.length} Assignments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 hours</span>
                  </div>
                </div>
                
                <div className="mt-4 mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Module Progress</span>
                    <span className="font-medium">{moduleProgress}%</span>
                  </div>
                  <Progress value={moduleProgress} className="h-2" />
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button>Continue Learning</Button>
                  <Button variant="outline">Download Resources</Button>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>Lessons</span>
              </TabsTrigger>
              <TabsTrigger value="assessment" className="flex items-center gap-2">
                <GraduationCap size={16} />
                <span>Assessment</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lessons" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Module Lessons</h2>
                
                <div className="space-y-4">
                  {moduleLessons.map((lesson, index) => {
                    const isLocked = isLessonLocked(index, moduleLessons);
                    
                    return (
                      <div key={lesson.id} className="unit-card opacity-0 transition-all duration-500 ease-in-out">
                        <div className="relative">
                          {isLocked && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                              <div className="bg-card border rounded-lg p-4 shadow-lg text-center">
                                <Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm font-medium">Lesson Locked</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Complete the previous lesson to unlock
                                </p>
                              </div>
                            </div>
                          )}
                          <LessonCardModule lesson={lesson} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Assessment Types</h2>
                
                <div className="space-y-4">
                  {assessmentSections.map((section) => (
                    <div key={section.id} className="content-card opacity-0 transition-all duration-500 ease-in-out">
                      <Collapsible 
                        open={openSections[section.id]} 
                        onOpenChange={() => toggleSection(section.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className={`${section.headerColor} text-white p-4 rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <ChevronLeft 
                                  size={20} 
                                  className={`transition-transform duration-200 ${
                                    openSections[section.id] ? 'rotate-[-90deg]' : ''
                                  }`}
                                />
                                <div>
                                  <h3 className="text-lg font-semibold">{section.title}</h3>
                                  <p className="text-sm opacity-90">{section.description}</p>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${section.badgeColor}`}>
                                {section.badgeText}
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="bg-card border border-t-0 rounded-b-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {section.assessments.map((assessment, idx) => (
                                <div key={idx} className="bg-accent/20 rounded-lg p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                                     onClick={() => handleTryDemo(assessment.title, section.id)}>
                                  <h4 className="font-medium mb-2">{assessment.title}</h4>
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{assessment.duration}</span>
                                    <span>{assessment.questions}</span>
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full mt-3">
                                    Try Demo
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialogs */}
      {selectedAssignment && (
        <>
          <AssignmentSubmissionDialog
            open={submissionDialogOpen}
            onOpenChange={setSubmissionDialogOpen}
            assignment={selectedAssignment}
          />
          <AssignmentReportDialog
            open={reportDialogOpen}
            onOpenChange={setReportDialogOpen}
            assignment={selectedAssignment}
          />
        </>
      )}

      {selectedDebate && (
        <DebateInfoDialog
          open={debateInfoDialogOpen}
          onOpenChange={setDebateInfoDialogOpen}
          debate={selectedDebate}
        />
      )}

      {selectedSurvey && (
        <SurveyDialog
          open={surveyDialogOpen}
          onOpenChange={setSurveyDialogOpen}
          survey={selectedSurvey}
        />
      )}

      <EssayAssessmentDialog
        open={essayDialogOpen}
        onOpenChange={setEssayDialogOpen}
      />

      <EssayViewDialog
        open={essayViewDialogOpen}
        onOpenChange={setEssayViewDialogOpen}
        essay={selectedEssay}
      />
    </div>
  );
}

export default ModuleDetail;