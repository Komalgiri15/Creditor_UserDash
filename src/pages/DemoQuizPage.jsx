import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, ChevronLeft, ChevronRight, RotateCcw, ArrowLeft, AlertCircle, Camera, Mic, Monitor, Eye, Shield, Wifi, CheckCircle, Upload, FileText, Image, MousePointer, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const getQuestions = (assessmentType) => {
  const questionSets = {
    'Multiple Choice Quiz': [
      {
        id: 1,
        question: "What is the primary purpose of React hooks?",
        options: ["To replace class components", "To manage state in functional components", "To style components", "To handle routing"],
        type: 'multiple-choice',
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        type: 'multiple-choice',
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What does the dependency array in useEffect control?",
        options: ["Component styling", "When the effect runs", "State updates", "Component rendering"],
        type: 'multiple-choice',
        correctAnswer: 1
      }
    ],
    'True/False Test': [
      {
        id: 1,
        question: "React hooks can only be used in functional components.",
        options: ["True", "False"],
        type: 'true-false',
        correctAnswer: 0
      },
      {
        id: 2,
        question: "You can use hooks inside loops and conditions.",
        options: ["True", "False"],
        type: 'true-false',
        correctAnswer: 1
      }
    ],
    'Fill in the Blanks': [
      {
        id: 1,
        question: "The _____ hook is used to manage component state.",
        type: 'fill-blank',
        correctAnswer: "useState"
      },
      {
        id: 2,
        question: "React _____ allow you to use state and lifecycle features in functional components.",
        type: 'fill-blank',
        correctAnswer: "hooks"
      }
    ],
    'Matching Pairs': [
      {
        id: 1,
        question: "Match the React hooks with their primary purposes:",
        type: 'matching-pairs',
        pairs: {
          left: ["useState", "useEffect", "useContext", "useReducer"],
          right: ["Managing component state", "Handling side effects", "Accessing context values", "Complex state logic"]
        },
        correctAnswer: {
          "useState": "Managing component state",
          "useEffect": "Handling side effects",
          "useContext": "Accessing context values",
          "useReducer": "Complex state logic"
        }
      }
    ],
    'Dropdown Selection': [
      {
        id: 1,
        question: "Which HTTP status code indicates a successful request?",
        type: 'dropdown',
        options: ["200", "404", "500", "302"],
        correctAnswer: "200"
      },
      {
        id: 2,
        question: "Which React hook is used for managing component state?",
        type: 'dropdown',
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: "useState"
      }
    ],
    'Numeric Calculations': [
      {
        id: 1,
        question: "Calculate the area of a rectangle with length 15 units and width 8 units.",
        type: 'numeric',
        correctAnswer: 120,
        unit: "square units"
      },
      {
        id: 2,
        question: "If a circle has a radius of 5 units, what is its area? (Use π = 3.14)",
        type: 'numeric',
        correctAnswer: 78.5,
        unit: "square units"
      }
    ],
    'Short Answer Test': [
      {
        id: 1,
        question: "Explain the difference between useState and useReducer hooks.",
        type: 'text',
        correctAnswer: "useState is for simple state, useReducer is for complex state logic"
      }
    ],
    'Essay Writing': [
      {
        id: 1,
        question: "The Future of Web Development",
        type: 'essay',
        correctAnswer: "Essay on web development trends",
        wordRange: { min: 300, max: 800 },
        instructions: "Write an essay discussing the current trends in web development and how you think the field will evolve over the next 5-10 years. Consider topics such as emerging technologies, changing user expectations, and the impact of AI on web development. Support your arguments with examples and personal insights."
      }
    ],
    'Case Study Analysis': [
      {
        id: 1,
        question: "Analyze the following case study: A startup needs to choose between React and Vue.js for their new application. Consider factors like team expertise, project timeline, and long-term maintenance.",
        type: 'essay',
        correctAnswer: "Case study analysis",
        wordRange: { min: 400, max: 600 },
        instructions: "Provide a detailed analysis considering technical, business, and strategic factors. Support your recommendation with specific examples and reasoning."
      }
    ],
    'Assignment Upload': [
      {
        id: 1,
        question: "Upload your React Hooks implementation project",
        type: 'file-upload',
        correctAnswer: "Project files uploaded",
        instructions: "Upload all project files including source code, documentation, and any additional resources. Accepted formats: .zip, .rar, .tar.gz",
        fileTypes: [".zip", ".rar", ".tar.gz", ".js", ".jsx", ".ts", ".tsx", ".md"]
      }
    ],
    'Project Submission': [
      {
        id: 1,
        question: "Submit your final capstone project",
        type: 'file-upload',
        correctAnswer: "Project submitted",
        instructions: "Upload your complete project including source code, documentation, presentation slides, and demo video. Maximum file size: 100MB",
        fileTypes: [".zip", ".rar", ".tar.gz", ".mp4", ".pptx", ".pdf"]
      }
    ],
    'Drag & Drop Exercise': [
      {
        id: 1,
        question: "Arrange the React component lifecycle phases in the correct order by dragging and dropping:",
        type: 'drag-drop',
        correctAnswer: ["Component Mounting", "Props/State Updates", "Re-rendering", "Component Unmounting"],
        dragItems: ["Component Mounting", "Props/State Updates", "Re-rendering", "Component Unmounting"]
      }
    ],
    'Hotspot Image Quiz': [
      {
        id: 1,
        question: "Click on the React component in the code structure below:",
        type: 'hotspot',
        correctAnswer: "Component identified",
        imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
        hotspots: [
          { x: 25, y: 30, label: "App.jsx" },
          { x: 45, y: 50, label: "Component.jsx" },
          { x: 65, y: 40, label: "styles.css" },
          { x: 85, y: 60, label: "package.json" }
        ],
        instructions: "Identify and click on the React component file in the project structure."
      }
    ],
    'Scenario Simulation': [
      {
        id: 1,
        question: "You're debugging a React application that has performance issues. What would be your first step?",
        type: 'scenario',
        correctAnswer: "Use React DevTools Profiler",
        scenarios: [
          {
            situation: "The application renders slowly on initial load",
            options: ["Use React DevTools Profiler", "Rewrite all components", "Add more servers", "Remove all CSS"],
            outcome: "React DevTools Profiler helps identify performance bottlenecks"
          }
        ],
        instructions: "Choose the most appropriate debugging approach for this performance scenario."
      }
    ]
  };

  return questionSets[assessmentType] || questionSets['Multiple Choice Quiz'];
};

const getProctoredExamQuestions = () => [
  {
    id: 1,
    question: "What is the primary advantage of using microservices architecture?",
    options: ["Reduced development time", "Better scalability and maintainability", "Lower infrastructure costs", "Simplified deployment process"],
    type: 'multiple-choice',
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which design pattern is commonly used in React applications?",
    options: ["Singleton", "Observer", "Component Pattern", "Factory"],
    type: 'multiple-choice',
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is the main benefit of using TypeScript over JavaScript?",
    options: ["Better performance", "Type safety and better tooling", "Smaller bundle size", "Native mobile support"],
    type: 'multiple-choice',
    correctAnswer: 1
  }
];

const getDurationInMinutes = (assessmentType) => {
  const durations = {
    'Multiple Choice Quiz': 15,
    'True/False Test': 10,
    'Fill in the Blanks': 20,
    'Short Answer Test': 30,
    'Essay Writing': 60,
    'Case Study Analysis': 45,
    'Assignment Upload': 0,
    'Project Submission': 0,
    'Drag & Drop Exercise': 20,
    'Hotspot Image Quiz': 15,
    'Scenario Simulation': 35,
    'Live Proctored Exam': 120,
    'Numeric Calculations': 25
  };
  return durations[assessmentType] || 15;
};

function DemoQuizPage() {
  const { assessmentTitle } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [questions] = useState(
    assessmentTitle === 'Live Proctored Exam' ? getProctoredExamQuestions() : getQuestions(assessmentTitle || '')
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(getDurationInMinutes(assessmentTitle || '') * 60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [matchingPairs, setMatchingPairs] = useState({});
  const [isProctoredExamStarted, setIsProctoredExamStarted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [draggedItems, setDraggedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Initialize matching pairs for matching-pairs questions
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.type === 'matching-pairs' && currentQuestion.pairs) {
      const existingAnswer = answers[currentQuestion.id];
      if (existingAnswer) {
        setMatchingPairs(existingAnswer);
      } else {
        setMatchingPairs({});
      }
      setSelectedTechnology(null);
    }
  }, [currentQuestionIndex, questions, answers]);

  // Initialize drag items for drag-drop questions
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.type === 'drag-drop' && currentQuestion.dragItems) {
      const existingAnswer = answers[currentQuestion.id];
      if (existingAnswer) {
        setDraggedItems(existingAnswer);
      } else {
        setDraggedItems([...currentQuestion.dragItems]);
      }
    }
  }, [currentQuestionIndex, questions, answers]);

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedItem) return;

    const newItems = [...draggedItems];
    const draggedIndex = newItems.indexOf(draggedItem);
    
    if (draggedIndex !== -1) {
      // Remove the item from its current position
      newItems.splice(draggedIndex, 1);
      // Insert it at the target position
      newItems.splice(targetIndex, 0, draggedItem);
      setDraggedItems(newItems);
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: newItems
      }));
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isCompleted && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimeUp(true);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isCompleted, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleTechnologyClick = (technology) => {
    setSelectedTechnology(technology);
  };

  const handleDescriptionClick = (description) => {
    if (selectedTechnology) {
      const newPairs = { ...matchingPairs };
      
      // Remove any existing mapping for this technology
      if (newPairs[selectedTechnology]) {
        delete newPairs[selectedTechnology];
      }
      
      // Remove any existing mapping for this description
      Object.keys(newPairs).forEach(key => {
        if (newPairs[key] === description) {
          delete newPairs[key];
        }
      });
      
      // Add new mapping
      newPairs[selectedTechnology] = description;
      setMatchingPairs(newPairs);
      
      // Update answers
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: newPairs
      }));
      
      setSelectedTechnology(null);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(files);
    handleAnswer(files);
  };

  const handleHotspotClick = (hotspot) => {
    handleAnswer(hotspot.label);
    toast({
      title: "Hotspot Selected",
      description: `You selected: ${hotspot.label}`,
    });
  };

  const handleScenarioAnswer = (option) => {
    handleAnswer(option);
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.type === 'matching-pairs') {
      const pairs = answer;
      return pairs && Object.keys(pairs).length === currentQuestion.pairs?.left.length;
    }
    
    if (currentQuestion.type === 'essay') {
      const essayText = answer;
      if (!essayText || essayText.trim().length === 0) return false;
      
      const wordCount = getWordCount(essayText);
      const minWords = currentQuestion.wordRange?.min || 0;
      return wordCount >= minWords;
    }
    
    return answer !== undefined && answer !== '';
  };

  const nextQuestion = () => {
    if (!isCurrentQuestionAnswered()) {
      toast({
        title: "Answer Required",
        description: "Please answer the current question before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    // Check if current question is answered
    if (!isCurrentQuestionAnswered()) {
      toast({
        title: "Answer Required", 
        description: "Please answer the current question before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'matching-pairs') {
        const userPairs = userAnswer;
        const correctPairs = question.correctAnswer;
        if (userPairs && correctPairs) {
          let pairMatches = 0;
          Object.keys(correctPairs).forEach(key => {
            if (userPairs[key] === correctPairs[key]) {
              pairMatches++;
            }
          });
          if (pairMatches === Object.keys(correctPairs).length) {
            correct++;
          }
        }
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMatchingPairs({});
    setSelectedTechnology(null);
    setTimeLeft(getDurationInMinutes(assessmentTitle || '') * 60);
    setIsCompleted(false);
    setIsTimeUp(false);
    setShowResults(false);
  };

  const returnToAssessments = () => {
    navigate("/courses/module/2#assessment");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const score = calculateScore();

  if (showResults) {
    const totalTime = getDurationInMinutes(assessmentTitle || '') * 60;
    const timeTaken = totalTime - timeLeft;
    
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        
        <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container py-8 max-w-4xl">
            <Card className="shadow-xl">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">
                  {isTimeUp ? "⏳ Time's Up!" : "🎉 Quiz Completed!"}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-xl text-gray-600">
                    Score: {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Time Taken</div>
                    <div className="text-2xl font-semibold text-blue-600">
                      {formatTime(timeTaken)}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Questions Answered</div>
                    <div className="text-2xl font-semibold text-green-600">
                      {Object.keys(answers).length}/{questions.length}
                    </div>
                  </div>
                </div>
                
                {score === questions.length && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                    <p className="text-yellow-800 font-medium">🏆 Perfect Score! Excellent work!</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={restartQuiz}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Try Again
                  </Button>
                  
                  <Button 
                    onClick={returnToAssessments}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    Return to Assessments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Special rendering for Live Proctored Exam
  if (assessmentTitle === 'Live Proctored Exam' && !isProctoredExamStarted) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        
        <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Live Proctored Exam</h1>
              <p className="text-gray-600">Demo Assessment</p>
            </div>

            {/* Proctored Examination Setup */}
            <Card className="shadow-lg mb-6">
              <CardHeader className="bg-blue-50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="text-blue-600" size={20} />
                  Proctored Examination Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Exam Details */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Exam Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Duration:</span>
                      <p className="font-medium">120 minutes</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Questions:</span>
                      <p className="font-medium">50 Questions</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium">Multiple Choice</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Attempts:</span>
                      <p className="font-medium">1 attempt only</p>
                    </div>
                  </div>
                </div>

                {/* System Requirements Check */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} />
                    System Requirements Check
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Camera size={18} className="text-gray-600" />
                        <span className="text-sm">Camera Access</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle size={14} className="mr-1" />
                        Enabled
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mic size={18} className="text-gray-600" />
                        <span className="text-sm">Microphone Access</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle size={14} className="mr-1" />
                        Enabled
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Monitor size={18} className="text-gray-600" />
                        <span className="text-sm">Screen Sharing</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle size={14} className="mr-1" />
                        Enabled
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye size={18} className="text-gray-600" />
                        <span className="text-sm">Face Detection</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-gray-600" />
                        <span className="text-sm">Browser Security</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle size={14} className="mr-1" />
                        Verified
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi size={18} className="text-gray-600" />
                        <span className="text-sm">Network Stability</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        Good
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Examination Rules & Guidelines */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Examination Rules & Guidelines</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>You must remain visible in the camera frame throughout the exam</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Do not switch tabs, minimize the browser, or open other applications</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>No communication with others is allowed during the exam</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>External materials, books, or notes are not permitted</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Your screen activity will be recorded and monitored</span>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                    <div>
                      <p className="font-medium text-yellow-800">Important:</p>
                      <p className="text-yellow-700 text-sm">
                        This is a demo of the proctored examination system. In a real exam, live proctoring would be actively supervising your session.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Start Exam Button */}
                <div className="text-center">
                  <Button 
                    onClick={() => setIsProctoredExamStarted(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                  >
                    Start Proctored Exam
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => navigate("/courses/module/2#assessment")}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle size={14} />
                <span>Auto-save enabled</span>
              </div>
              
              <Button
                onClick={() => setIsProctoredExamStarted(true)}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Special rendering for Live Proctored Exam in progress
  if (assessmentTitle === 'Live Proctored Exam' && isProctoredExamStarted) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        
        <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container py-6 max-w-4xl">
            {/* Proctoring Status Header */}
            <div className="mb-6">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-red-800">Proctored Exam in Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600 text-white hover:bg-red-700">
                        LIVE MONITORING
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock size={16} />
                        <span>28:11</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Camera size={16} className="text-green-600" />
                      <span className="text-green-700">Camera Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mic size={16} className="text-green-600" />
                      <span className="text-green-700">Audio Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor size={16} className="text-green-600" />
                      <span className="text-green-700">Screen Shared</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Eye size={16} className="text-green-600" />
                      <span className="text-green-700">Face Detected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Question {currentQuestionIndex + 1} of {questions.length}</h1>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline">
                    Multiple Choice
                  </Badge>
                </div>
              </div>
              
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
            </div>
            
            {/* Question Card */}
            <Card className="shadow-lg mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium mb-6">{currentQuestion.question}</h2>
                
                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <label 
                      key={index}
                      className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={() => handleAnswer(index)}
                        className="mr-4 w-4 h-4"
                      />
                      <span className="text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demo Notice */}
            <div className="mb-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                    <div>
                      <p className="font-medium text-blue-900">Demo Mode:</p>
                      <p className="text-blue-800 text-sm">
                        This simulation shows how a proctored exam works with real-time monitoring, activity detection, and secure browser environment. In actual implementation, this would connect to proctoring services like ProctorU, Examity, or custom AI monitoring solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                Previous
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
              </div>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={submitQuiz}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container py-6 max-w-4xl">
          {/* Header with timer and progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{assessmentTitle}</h1>
                <p className="text-gray-600">Demo Assessment</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock size={16} />
                  {formatTime(timeLeft)}
                </Badge>
                
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Question Card */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
                {!isCurrentQuestionAnswered() && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                    <AlertCircle size={16} />
                    Answer required to continue
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-lg">{currentQuestion.question}</p>
              
              {/* Multiple Choice / True-False */}
              {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false') && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label 
                      key={index}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={() => handleAnswer(index)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {/* Dropdown Selection */}
              {currentQuestion.type === 'dropdown' && currentQuestion.options && (
                <div className="space-y-4">
                  <Select 
                    value={answers[currentQuestion.id] || ""} 
                    onValueChange={(value) => handleAnswer(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your answer..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {currentQuestion.options.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Numeric Calculations */}
              {currentQuestion.type === 'numeric' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 font-medium">Enter your answer</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Enter numerical value..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="flex-1 p-3 border rounded-lg"
                    />
                    {currentQuestion.unit && (
                      <span className="text-gray-600 font-medium">
                        {currentQuestion.unit}
                      </span>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Instructions:</strong> Enter only the numerical value. Units are already specified.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Fill in the Blanks */}
              {currentQuestion.type === 'fill-blank' && (
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              )}
              
              {/* Text Answer */}
              {currentQuestion.type === 'text' && (
                <textarea
                  placeholder="Type your detailed answer here..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-3 border rounded-lg h-32 resize-none"
                />
              )}

              {/* Essay Writing */}
              {currentQuestion.type === 'essay' && (
                <div className="space-y-4">
                  {currentQuestion.instructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        {currentQuestion.instructions}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Your essay ({currentQuestion.wordRange?.min}-{currentQuestion.wordRange?.max} words)
                    </p>
                    <Textarea
                      placeholder="Begin writing your essay here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="min-h-[300px] resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-blue-600">
                      Progress to minimum word count
                    </div>
                    <div className="text-gray-600">
                      {getWordCount(answers[currentQuestion.id] || '')} / {currentQuestion.wordRange?.min} words
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <div>Characters: {(answers[currentQuestion.id] || '').length}</div>
                    <div>Max words: {currentQuestion.wordRange?.max}</div>
                  </div>
                  
                  {currentQuestion.instructions && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800 text-sm font-medium">Instructions:</p>
                      <p className="text-gray-700 text-sm mt-1">
                        Write a well-structured essay with clear introduction, body paragraphs, and conclusion. Use specific examples to support your arguments.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload */}
              {currentQuestion.type === 'file-upload' && (
                <div className="space-y-4">
                  {currentQuestion.instructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        {currentQuestion.instructions}
                      </p>
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-lg font-medium text-gray-700">Click to upload files</span>
                      <p className="text-sm text-gray-500 mt-2">
                        Accepted formats: {currentQuestion.fileTypes?.join(', ')}
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept={currentQuestion.fileTypes?.join(',')}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium">Uploaded Files:</p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                          <FileText size={16} className="text-green-600" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hotspot Image Quiz */}
              {currentQuestion.type === 'hotspot' && (
                <div className="space-y-4">
                  {currentQuestion.instructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        {currentQuestion.instructions}
                      </p>
                    </div>
                  )}
                  
                  <div className="relative inline-block">
                    <img 
                      src={currentQuestion.imageSrc} 
                      alt="Interactive image"
                      className="max-w-full h-auto border rounded-lg"
                    />
                    {currentQuestion.hotspots?.map((hotspot, index) => (
                      <button
                        key={index}
                        onClick={() => handleHotspotClick(hotspot)}
                        className={`absolute w-6 h-6 rounded-full border-2 transition-all ${
                          answers[currentQuestion.id] === hotspot.label
                            ? 'bg-green-500 border-green-600'
                            : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
                        }`}
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <MousePointer size={12} className="text-white ml-0.5" />
                      </button>
                    ))}
                  </div>
                  
                  {answers[currentQuestion.id] && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-800 text-sm">
                        Selected: <strong>{answers[currentQuestion.id]}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario Simulation */}
              {currentQuestion.type === 'scenario' && currentQuestion.scenarios && (
                <div className="space-y-4">
                  {currentQuestion.instructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        {currentQuestion.instructions}
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Scenario:</h4>
                    <p className="text-gray-700">{currentQuestion.scenarios[0].situation}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Choose your approach:</h4>
                    {currentQuestion.scenarios[0].options.map((option, index) => (
                      <label 
                        key={index}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`scenario-${currentQuestion.id}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={() => handleScenarioAnswer(option)}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  
                  {answers[currentQuestion.id] && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Expected Outcome:</strong> {currentQuestion.scenarios[0].outcome}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Drag & Drop Exercise */}
              {currentQuestion.type === 'drag-drop' && currentQuestion.dragItems && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Drag the items to arrange them in the correct order:</p>
                  <div className="space-y-2">
                    {draggedItems.map((item, index) => (
                      <div 
                        key={`${item}-${index}`}
                        className={`
                          p-3 border rounded cursor-move bg-muted flex items-center transition-all duration-200 
                          ${draggedItem === item ? 'opacity-50 scale-95 rotate-2' : 'hover:bg-muted/80'} 
                          ${dragOverIndex === index ? 'border-primary border-2 bg-primary/10' : ''}
                        `}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                      >
                        <GripVertical className="mr-3 text-muted-foreground" size={16} />
                        <span className="flex-1">{item}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Instructions:</strong> Drag and drop the items above to arrange them in the correct chronological order of React component lifecycle.
                    </p>
                  </div>
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    <strong>Correct order:</strong> Component Mounting → Props/State Updates → Re-rendering → Component Unmounting
                  </div>
                </div>
              )}

              {/* Matching Pairs - Updated UI to match the image */}
              {currentQuestion.type === 'matching-pairs' && currentQuestion.pairs && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-4 text-gray-800">Technologies</h4>
                        <div className="space-y-3">
                          {currentQuestion.pairs.left.map((item, index) => (
                            <div
                              key={index}
                              onClick={() => handleTechnologyClick(item)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedTechnology === item
                                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                  : matchingPairs[item]
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              <div className="font-medium">{item}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-4 text-gray-800">Descriptions</h4>
                        <div className="space-y-3">
                          {currentQuestion.pairs.right.map((item, index) => (
                            <div
                              key={index}
                              onClick={() => handleDescriptionClick(item)}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all min-h-[60px] flex items-center ${
                                Object.values(matchingPairs).includes(item)
                                  ? 'border-green-500 bg-green-50'
                                  : selectedTechnology
                                  ? 'border-blue-300 bg-blue-50 hover:border-blue-500'
                                  : 'border-gray-300 bg-white hover:border-gray-400'
                              }`}
                            >
                              <div className="w-full">
                                {item}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Instructions:</strong> Click on a technology from the left column, then click on its matching description from the right column.
                      </p>
                    </div>
                    
                    {selectedTechnology && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-800 text-sm">
                          <strong>{selectedTechnology}</strong> is selected. Now click on its matching description.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[questions[index].id] !== undefined
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={submitQuiz}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DemoQuizPage;