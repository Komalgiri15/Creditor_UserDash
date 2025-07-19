import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Clock, Brain, AlertTriangle } from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    type: 'mcq',
    question: "Which of the following are programming languages? (Select all that apply)",
    options: ["JavaScript", "HTML", "Python", "CSS", "Java"],
    correctAnswers: ["JavaScript", "Python", "Java"]
  },
  {
    id: 2,
    type: 'scq',
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Text Making Language"],
    correctAnswer: "Hyper Text Markup Language"
  },
  {
    id: 3,
    type: 'truefalse',
    question: "JavaScript is the same as Java programming language.",
    correctAnswer: "false"
  },
  {
    id: 4,
    type: 'fillup',
    question: "CSS stands for Cascading _____ Sheets.",
    correctAnswer: "Style"
  },
  {
    id: 5,
    type: 'matching',
    question: "Match the following technologies with their primary use:",
    leftColumn: ["HTML", "CSS", "JavaScript"],
    rightColumn: ["Styling", "Structure", "Behavior"],
    correctMatches: [["HTML", "Structure"], ["CSS", "Styling"], ["JavaScript", "Behavior"]]
  },
  {
    id: 6,
    type: 'oneword',
    question: "What is the latest version of HTML called?",
    correctAnswer: "HTML5"
  },
  {
    id: 7,
    type: 'descriptive',
    question: "Explain the difference between HTML, CSS, and JavaScript in web development. (Write 100-150 words)",
    correctAnswer: "Sample answer"
  },
  {
    id: 8,
    type: 'mcq',
    question: "Which CSS properties are used for layout? (Select all that apply)",
    options: ["display", "color", "position", "font-size", "margin"],
    correctAnswers: ["display", "position", "margin"]
  },
  {
    id: 9,
    type: 'truefalse',
    question: "CSS can be used to create animations and transitions.",
    correctAnswer: "true"
  },
  {
    id: 10,
    type: 'scq',
    question: "Which method is used to select an element by ID in JavaScript?",
    options: ["getElementById()", "querySelector()", "getElementsByClassName()", "getElementsByTagName()"],
    correctAnswer: "getElementById()"
  }
];

function QuizTakePage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const totalQuestions = sampleQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Calculate score and redirect to results
    const answeredQuestions = Object.keys(answers).length;
    const score = Math.floor(Math.random() * 40) + 60; // Mock score between 60-100
    
    // Redirect to results page with score
    window.location.href = `/quiz-results/${quizId}?module=${moduleId}&category=${category}&score=${score}&answered=${answeredQuestions}`;
  };

  const currentQ = sampleQuestions[currentQuestion];
  const userAnswer = answers[currentQ.id];

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'mcq':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Select all correct answers:</p>
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`mcq-${index}`}
                  checked={userAnswer?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentAnswers = userAnswer || [];
                    if (checked) {
                      handleAnswer(currentQ.id, [...currentAnswers, option]);
                    } else {
                      handleAnswer(currentQ.id, currentAnswers.filter((a) => a !== option));
                    }
                  }}
                />
                <Label htmlFor={`mcq-${index}`} className="cursor-pointer flex-1 py-2 px-3 rounded border hover:bg-muted/50">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'scq':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Select one correct answer:</p>
            <RadioGroup 
              value={userAnswer || ""} 
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`scq-${index}`} />
                  <Label htmlFor={`scq-${index}`} className="cursor-pointer flex-1 py-2 px-3 rounded border hover:bg-muted/50">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'truefalse':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Select True or False:</p>
            <RadioGroup 
              value={userAnswer || ""} 
              onValueChange={(value) => handleAnswer(currentQ.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer py-2 px-4 rounded border hover:bg-muted/50 w-20 text-center">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer py-2 px-4 rounded border hover:bg-muted/50 w-20 text-center">
                  False
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'fillup':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Fill in the blank:</p>
            <Input
              value={userAnswer || ""}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              placeholder="Type your answer here..."
              className="text-lg p-4"
            />
          </div>
        );

      case 'oneword':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Provide a single word answer:</p>
            <Input
              value={userAnswer || ""}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              placeholder="One word answer..."
              className="text-lg p-4"
            />
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Match items from left column with right column:</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-600">Technology</h4>
                {currentQ.leftColumn.map((item, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded mb-2 border text-center font-medium">
                    {item}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-600">Primary Use</h4>
                {currentQ.rightColumn.map((item, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded mb-2 border text-center font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Note: In a full implementation, this would be an interactive drag-and-drop interface.
                For this demo, the matching is automatically recorded.
              </p>
            </div>
          </div>
        );

      case 'descriptive':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Write a detailed answer (100-150 words):</p>
            <Textarea
              value={userAnswer || ""}
              onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
              placeholder="Write your detailed answer here..."
              className="min-h-[150px] text-base"
            />
            <div className="text-sm text-muted-foreground">
              Word count: {userAnswer ? userAnswer.split(' ').filter((word) => word.length > 0).length : 0} words
            </div>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  if (showSubmitConfirm) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Submit Quiz?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Are you sure you want to submit your quiz? You won't be able to change your answers after submission.</p>
            <div className="flex justify-between text-sm">
              <span>Questions Answered: {Object.keys(answers).length}/{totalQuestions}</span>
              <span>Time Remaining: {formatTime(timeRemaining)}</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowSubmitConfirm(false)}>
                Continue Quiz
              </Button>
              <Button onClick={handleSubmit}>
                Submit Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/quiz-instruction/${quizId}?module=${moduleId}&category=${category}`}>
              <ChevronLeft size={16} />
              Back to Instructions
            </Link>
          </Button>
          <Badge variant={category === 'general' ? 'outline' : 'default'}>
            Quiz {quizId} - {category === 'general' ? 'Practice' : 'Assessment'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className={timeRemaining < 300 ? 'text-red-500' : ''} />
            <span className={timeRemaining < 300 ? 'text-red-500 font-bold' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Low time warning */}
      {timeRemaining < 300 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <p className="text-red-800 font-medium">
            Warning: Less than 5 minutes remaining! The quiz will auto-submit when time runs out.
          </p>
        </div>
      )}

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain size={24} />
            Question {currentQuestion + 1}
            <Badge variant="outline" className="ml-2">
              {currentQ.type.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium leading-relaxed">{currentQ.question}</p>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {Object.keys(answers).length}/{totalQuestions} questions answered
        </div>
        
        {currentQuestion === totalQuestions - 1 ? (
          <Button onClick={() => setShowSubmitConfirm(true)}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next Question
            <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuizTakePage;