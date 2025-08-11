import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock, BookOpen, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { startQuiz, submitQuiz, getQuizQuestions, getQuizById } from "@/services/quizService";
import { toast } from "sonner";

function QuizTakePage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  // Initialize quiz session
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setIsLoading(true);
        
        // Start the quiz session
        const startResponse = await startQuiz(quizId);
        setQuizData(startResponse);
        
        // Get quiz questions
        const questionsData = await getQuizQuestions(quizId);
        setQuestions(questionsData);
        
        // Set time limit if available
        if (startResponse.timeLimit) {
          setTimeRemaining(startResponse.timeLimit * 60); // Convert minutes to seconds
        } else {
          setTimeRemaining(25 * 60); // Default 25 minutes
        }
        
        setQuizStarted(true);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast.error('Failed to start quiz. Please try again.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      initializeQuiz();
    }
  }, [quizId, navigate]);

  // Timer effect
  useEffect(() => {
    if (!quizStarted || timeRemaining <= 0) return;

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
  }, [quizStarted, timeRemaining]);

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

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      toast.error('Please answer at least one question before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitQuiz(quizId, answers);
      
      toast.success('Quiz submitted successfully!');
      
      // Redirect to results page
      navigate(`/dashboard/quiz/results/${quizId}?module=${moduleId}&category=${category}&score=${result.score || 0}&answered=${Object.keys(answers).length}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (!questions[currentQuestion]) return null;
    
    const question = questions[currentQuestion];
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'mcq':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'scq':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'truefalse':
        return (
          <div className="space-y-3">
            {['true', 'false'].map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 capitalize">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'descriptive':
        return (
          <div>
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            Question type not supported: {question.type}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Starting quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Quiz not available</h3>
          <p className="text-gray-600 mb-4">Unable to load quiz data.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} />
            Back
          </Button>
          <Badge variant={category === 'general' ? 'outline' : 'default'}>
            {category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}
          </Badge>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
          <Clock className="h-5 w-5 text-red-600" />
          <span className="font-mono font-bold text-red-700">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{quizData.title || 'Quiz'}</h1>
            <p className="text-muted-foreground">{quizData.description || 'Test your knowledge'}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <BookOpen size={24} />
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium leading-relaxed">{currentQ?.question}</p>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-3">
          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={() => setShowSubmitConfirm(true)}
              disabled={Object.keys(answers).length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
              <br /><br />
              <strong>Answered Questions:</strong> {Object.keys(answers).length} / {totalQuestions}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default QuizTakePage;