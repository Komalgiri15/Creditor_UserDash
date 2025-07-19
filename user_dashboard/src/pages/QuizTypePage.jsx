import React, { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, CheckCircle, Clock, Brain } from "lucide-react";

const quizData = {
  mcq: {
    name: "Multiple Choice Questions",
    description: "Select one or more correct answers from given options",
    icon: "📝",
    color: "from-blue-500 to-blue-600",
    questions: [
      {
        id: 1,
        question: "Which of the following are React hooks?",
        options: ["useState", "useEffect", "componentDidMount", "useContext"],
        type: "multiple",
        correctAnswers: ["useState", "useEffect", "useContext"]
      },
      {
        id: 2,
        question: "What are the benefits of using React hooks?",
        options: ["Simpler code", "Better performance", "Easier testing", "All of the above"],
        type: "multiple",
        correctAnswers: ["Simpler code", "Better performance", "Easier testing"]
      }
    ]
  },
  scq: {
    name: "Single Choice Questions",
    description: "Select only one correct answer from given options",
    icon: "☑️",
    color: "from-green-500 to-green-600",
    questions: [
      {
        id: 1,
        question: "What is the correct way to declare a functional component in React?",
        options: ["function MyComponent() {}", "const MyComponent = () => {}", "class MyComponent extends Component", "Both A and B"],
        type: "single",
        correctAnswer: "Both A and B"
      },
      {
        id: 2,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        type: "single",
        correctAnswer: "useEffect"
      }
    ]
  },
  truefalse: {
    name: "True/False Questions",
    description: "Determine if the statement is true or false",
    icon: "✅",
    color: "from-purple-500 to-purple-600",
    questions: [
      {
        id: 1,
        question: "React hooks can only be used in functional components.",
        type: "boolean",
        correctAnswer: true
      },
      {
        id: 2,
        question: "useEffect runs after every render by default.",
        type: "boolean",
        correctAnswer: true
      }
    ]
  },
  oneword: {
    name: "One Word Questions",
    description: "Provide a single word answer",
    icon: "✏️",
    color: "from-orange-500 to-orange-600",
    questions: [
      {
        id: 1,
        question: "What hook is used for managing state in functional components?",
        type: "text",
        correctAnswer: "useState"
      },
      {
        id: 2,
        question: "What is the name of the React hook for context consumption?",
        type: "text",
        correctAnswer: "useContext"
      }
    ]
  },
  fillups: {
    name: "Fill-ups Questions",
    description: "Fill in the missing words or phrases",
    icon: "📋",
    color: "from-teal-500 to-teal-600",
    questions: [
      {
        id: 1,
        question: "The _____ hook allows you to perform side effects in functional components.",
        type: "fillup",
        correctAnswer: "useEffect"
      },
      {
        id: 2,
        question: "React components must return a single _____ element.",
        type: "fillup",
        correctAnswer: "JSX"
      }
    ]
  },
  matching: {
    name: "Matching Questions",
    description: "Match items from two columns",
    icon: "🔗",
    color: "from-pink-500 to-pink-600",
    questions: [
      {
        id: 1,
        question: "Match the hooks with their purposes:",
        type: "matching",
        leftColumn: ["useState", "useEffect", "useContext"],
        rightColumn: ["Side effects", "State management", "Context consumption"],
        correctMatches: [
          ["useState", "State management"],
          ["useEffect", "Side effects"],
          ["useContext", "Context consumption"]
        ]
      }
    ]
  },
  descriptive: {
    name: "Descriptive Questions",
    description: "Provide detailed written answers",
    icon: "📄",
    color: "from-indigo-500 to-indigo-600",
    questions: [
      {
        id: 1,
        question: "Explain the difference between controlled and uncontrolled components in React with examples.",
        type: "essay",
        expectedLength: "200-300 words"
      },
      {
        id: 2,
        question: "Describe the React component lifecycle and explain when you would use each phase.",
        type: "essay",
        expectedLength: "250-350 words"
      }
    ]
  }
};

function QuizTypePage() {
  const { quizType } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const quizInfo = quizData[quizType];
  
  if (!quizInfo) {
    return <div>Quiz type not found</div>;
  }

  const currentQ = quizInfo.questions[currentQuestion];
  const totalQuestions = quizInfo.questions.length;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderQuestion = () => {
    const questionId = currentQ.id;
    const userAnswer = answers[questionId];

    switch (currentQ.type) {
      case 'multiple':
        return (
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`option-${index}`}
                  checked={userAnswer?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentAnswers = userAnswer || [];
                    if (checked) {
                      handleAnswer(questionId, [...currentAnswers, option]);
                    } else {
                      handleAnswer(questionId, currentAnswers.filter((a) => a !== option));
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 py-2">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'single':
        return (
          <RadioGroup 
            value={userAnswer || ""} 
            onValueChange={(value) => handleAnswer(questionId, value)}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 py-2">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'boolean':
        return (
          <RadioGroup 
            value={userAnswer?.toString() || ""} 
            onValueChange={(value) => handleAnswer(questionId, value === 'true')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer py-2">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer py-2">False</Label>
            </div>
          </RadioGroup>
        );

      case 'text':
      case 'fillup':
        return (
          <Input
            value={userAnswer || ""}
            onChange={(e) => handleAnswer(questionId, e.target.value)}
            placeholder="Type your answer here..."
            className="text-lg p-4"
          />
        );

      case 'essay':
        return (
          <div className="space-y-4">
            <Textarea
              value={userAnswer || ""}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Write your detailed answer here..."
              className="min-h-[200px] text-base"
            />
            <p className="text-sm text-muted-foreground">
              Expected length: {currentQ.expectedLength}
            </p>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-4">
            <p className="text-base font-medium">Match items from left column with right column:</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Left Column</h4>
                {currentQ.leftColumn.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded mb-2 border">
                    {item}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-3">Right Column</h4>
                {currentQ.rightColumn.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded mb-2 border">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: In a real implementation, this would be an interactive drag-and-drop interface.
            </p>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  if (showResults) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${quizInfo.color} flex items-center justify-center text-white text-4xl mx-auto`}>
            <CheckCircle size={48} />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-xl text-muted-foreground">{quizInfo.name}</p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Questions Completed:</span>
                  <span className="font-bold">{totalQuestions}/{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quiz Type:</span>
                  <span className="font-bold">{category === 'general' ? 'Practice' : 'Assessment'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to={`/courses/module/${moduleId}/assessments`}>
                Return to Assessments
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/quiz/${quizType}?module=${moduleId}&category=${category}`}>
                Retake Quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ChevronLeft size={16} />
            Back to Assessments
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="text-sm">Question {currentQuestion + 1} of {totalQuestions}</span>
        </div>
      </div>

      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${quizInfo.color} flex items-center justify-center text-white text-xl`}>
            {quizInfo.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{quizInfo.name}</h1>
            <p className="text-muted-foreground">{quizInfo.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={category === 'general' ? 'outline' : 'default'}>
            {category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${quizInfo.color}`}
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Brain size={24} />
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium leading-relaxed">{currentQ.question}</p>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft size={16} />
          Previous
        </Button>
        
        <Button onClick={handleNext}>
          {currentQuestion === totalQuestions - 1 ? 'Complete Quiz' : 'Next Question'}
          {currentQuestion < totalQuestions - 1 && <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />}
        </Button>
      </div>
    </div>
  );
}

export default QuizTypePage;