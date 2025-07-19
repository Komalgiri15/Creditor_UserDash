import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Clock, Info, GripVertical } from "lucide-react";

const demoQuestions = {
  "Multiple Choice Quiz": {
    id: "mcq-1",
    question: "What is the primary purpose of React hooks?",
    type: "multiple-choice",
    options: [
      "To replace class components entirely",
      "To allow state and lifecycle methods in functional components",
      "To improve application performance",
      "To handle API requests"
    ],
    correctAnswer: "To allow state and lifecycle methods in functional components"
  },
  "True/False Test": {
    id: "tf-1",
    question: "React hooks can only be used in class components.",
    type: "true-false",
    options: ["True", "False"],
    correctAnswer: "False"
  },
  "Fill in the Blanks": {
    id: "fb-1",
    question: "The _____ hook is used for managing state in functional components, while _____ is used for side effects.",
    type: "fill-blank",
    blanks: ["useState", "useEffect"]
  },
  "Matching Pairs": {
    id: "mp-1",
    question: "Match the React hooks with their purposes:",
    type: "matching",
    pairs: [
      { left: "useState", right: "Manage component state" },
      { left: "useEffect", right: "Handle side effects" },
      { left: "useContext", right: "Access context values" }
    ]
  },
  "Dropdown Selection": {
    id: "ds-1",
    question: "Which hook would you use to optimize expensive calculations?",
    type: "dropdown",
    dropdownOptions: ["useState", "useEffect", "useMemo", "useCallback"]
  },
  "Numeric Calculations": {
    id: "nc-1",
    question: "If a component re-renders 3 times per second and each render takes 16ms, how many milliseconds are spent rendering per second?",
    type: "numeric"
  },
  "Short Answer Test": {
    id: "sa-1",
    question: "Explain the difference between useState and useReducer hooks in 2-3 sentences.",
    type: "short-answer"
  },
  "Essay Writing": {
    id: "ew-1",
    question: "Write a comprehensive essay (300-500 words) discussing the impact of React Hooks on modern web development practices.",
    type: "essay"
  },
  "Case Study Analysis": {
    id: "cs-1",
    question: "Analyze the following scenario: A large e-commerce application is experiencing performance issues due to unnecessary re-renders. How would you use React hooks to optimize the application? Provide specific examples and implementation strategies.",
    type: "case-study"
  },
  "Assignment Upload": {
    id: "au-1",
    question: "Upload your completed React Hooks project files (.zip format).",
    type: "assignment"
  },
  "Project Submission": {
    id: "ps-1",
    question: "Submit your final project: Build a complete React application using hooks.",
    type: "project"
  },
  "Drag & Drop Exercise": {
    id: "dd-1",
    question: "Arrange the React component lifecycle phases in the correct order by dragging and dropping:",
    type: "drag-drop",
    dragItems: ["Component Mounting", "Props/State Updates", "Re-rendering", "Component Unmounting"]
  },
  "Hotspot Image Quiz": {
    id: "hi-1",
    question: "Click on the areas in the React DevTools interface where you would find component state information:",
    type: "hotspot"
  },
  "Scenario Simulation": {
    id: "ss-1",
    question: "Interactive Scenario: You are debugging a React application with performance issues. Choose your actions:",
    type: "scenario"
  },
  "Live Proctored Exam": {
    id: "lpe-1",
    question: "This is a comprehensive exam covering all React Hooks concepts. Your session is being monitored.",
    type: "proctored"
  }
};

export function DemoQuizDialog({ open, onOpenChange, assessmentTitle, assessmentType }) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [numericAnswer, setNumericAnswer] = useState("");
  const [currentQuestion] = useState(1);
  const [totalQuestions] = useState(5);
  const [draggedItems, setDraggedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const demoQuestion = demoQuestions[assessmentTitle];

  // Initialize drag items
  useEffect(() => {
    if (demoQuestion?.type === "drag-drop" && demoQuestion.dragItems) {
      setDraggedItems([...demoQuestion.dragItems]);
    }
  }, [demoQuestion]);

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
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const renderQuestionContent = () => {
    if (!demoQuestion) return null;

    switch (demoQuestion.type) {
      case "multiple-choice":
        return (
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {demoQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer w-full">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "true-false":
        return (
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            {demoQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option} id={`tf-${index}`} />
                <Label htmlFor={`tf-${index}`} className="cursor-pointer w-full">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "fill-blank":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Fill in the blanks with appropriate answers:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="First blank" />
              <Input placeholder="Second blank" />
            </div>
          </div>
        );

      case "matching":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Drag items from the left to match with items on the right:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Hooks</h4>
                {demoQuestion.pairs?.map((pair, index) => (
                  <div key={index} className="p-2 border rounded cursor-move bg-muted">
                    {pair.left}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Purposes</h4>
                {demoQuestion.pairs?.map((pair, index) => (
                  <div key={index} className="p-2 border rounded min-h-[40px] bg-background">
                    <span className="text-muted-foreground text-sm">Drop here</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select the correct hook" />
              </SelectTrigger>
              <SelectContent>
                {demoQuestion.dropdownOptions?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "numeric":
        return (
          <div className="space-y-4">
            <Input 
              type="number" 
              placeholder="Enter your numerical answer"
              value={numericAnswer}
              onChange={(e) => setNumericAnswer(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Show your calculation steps if needed.</p>
          </div>
        );

      case "short-answer":
        return (
          <Textarea 
            placeholder="Enter your short answer (2-3 sentences)..."
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="min-h-[100px]"
          />
        );

      case "essay":
        return (
          <div className="space-y-4">
            <Textarea 
              placeholder="Write your essay here (300-500 words)..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="text-sm text-muted-foreground">
              Word count: {textAnswer.split(' ').filter(word => word.length > 0).length} words
            </div>
          </div>
        );

      case "case-study":
        return (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Case Study Context</h4>
              <p className="text-sm">You are working on a large-scale React application with multiple developers...</p>
            </div>
            <Textarea 
              placeholder="Provide your detailed analysis and solution..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        );

      case "assignment":
      case "project":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <div className="text-muted-foreground mb-2">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm">Drag and drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supported formats: .zip, .pdf, .doc, .docx</p>
            </div>
          </div>
        );

      case "drag-drop":
        return (
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
        );

      case "hotspot":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Click on the hotspots in the image below:</p>
            <div className="relative border rounded-lg bg-muted aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Interactive Image Placeholder</p>
              <div className="absolute top-4 left-4 w-4 h-4 border-2 border-blue-500 rounded-full bg-blue-100"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-2 border-blue-500 rounded-full bg-blue-100"></div>
            </div>
          </div>
        );

      case "scenario":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Scenario</h4>
              <p className="text-blue-800 text-sm">Your React app is rendering slowly. What's your first step?</p>
            </div>
            <div className="space-y-2">
              {[
                "Use React DevTools Profiler",
                "Rewrite everything in Redux",
                "Add more useEffect hooks",
                "Remove all console.logs"
              ].map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`scenario-${index}`} />
                  <Label htmlFor={`scenario-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "proctored":
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Live Proctoring Active</span>
              </div>
              <p className="text-red-700 text-sm">Your exam session is being monitored. Please ensure you follow all exam guidelines.</p>
            </div>
            <div className="space-y-4">
              <p className="font-medium">Question: {demoQuestion.question}</p>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="proctored-1" />
                  <Label htmlFor="proctored-1">Sample option A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="proctored-2" />
                  <Label htmlFor="proctored-2">Sample option B</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return <p>Question type not implemented in demo.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <ArrowLeft size={16} />
                Back
              </Button>
              <div>
                <DialogTitle className="text-xl">{assessmentTitle}</DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Question {currentQuestion} of {totalQuestions}</span>
                  <Badge variant="outline">Demo Mode</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} />
              <span>15:00</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{demoQuestion?.question}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderQuestionContent()}
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Demo Mode:</p>
                <p className="text-blue-800 text-sm">
                  {demoQuestion?.type === "drag-drop" 
                    ? "Drag and drop interactions are fully functional in this demo. Try dragging the items to reorder them!"
                    : "Answer recorded. In a real assessment, your response would be automatically saved."
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info size={14} />
              <span>Auto-save enabled</span>
            </div>
            <Button>Next</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}