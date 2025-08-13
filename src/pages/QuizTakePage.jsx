import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock, BookOpen, CheckCircle, XCircle, Loader2, AlertTriangle, ChevronLeft } from "lucide-react";
import { submitQuiz, saveAnswer } from "@/services/quizService";
import { toast } from "sonner";

function QuizTakePage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  
  // Get quiz data from navigation state
  const { questions: initialQuestions, quizSession, startedAt } = location.state || {};
  
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

  // Initialize quiz session from passed data
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have the required data from navigation state
        if (!initialQuestions || !quizSession) {
          toast.error('Quiz session not found. Please start the quiz again.');
          navigate(-1);
          return;
        }
        
        // Set quiz data and questions from navigation state
        setQuizData(quizSession);
        setQuestions(initialQuestions);
        
        // Debug logging to see what data we received
        console.log('Quiz initialized with:', {
          quizSession,
          initialQuestions,
          questionsCount: initialQuestions?.length,
          firstQuestion: initialQuestions?.[0],
          allQuestions: initialQuestions
        });
        
        // Set time limit if available
        if (quizSession.timeLimit) {
          setTimeRemaining(quizSession.timeLimit * 60); // Convert minutes to seconds
        } else {
          setTimeRemaining(25 * 60); // Default 25 minutes
        }
        
        setQuizStarted(true);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast.error('Failed to initialize quiz. Please try again.');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      initializeQuiz();
    }
  }, [quizId, navigate, initialQuestions, quizSession]);

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

  const handleAnswer = async (questionId, answer) => {
    // Update local state immediately for responsive UI
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Optionally save answer to backend for auto-save functionality
    // This can help prevent data loss if the user's session expires
    try {
      await saveAnswer(quizId, questionId, answer);
    } catch (error) {
      // Don't show error to user for auto-save, just log it
      console.warn('Failed to auto-save answer:', error);
      // The answer is still saved locally, so it will be sent on final submit
    }
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
      console.log('Submitting quiz with answers:', answers);
      console.log('Answers count:', Object.keys(answers).length);
      console.log('Total questions:', totalQuestions);
      console.log('Quiz ID:', quizId);
      
      // Validate that we have answers for most questions
      const answeredCount = Object.keys(answers).length;
      const unansweredCount = totalQuestions - answeredCount;
      
      if (unansweredCount > 0) {
        console.log(`Warning: ${unansweredCount} questions are unanswered`);
      }
      
      // Call the submit quiz API with user answers
      const result = await submitQuiz(quizId, answers);
      console.log('Quiz submission result:', result);
      console.log('Quiz submission result structure:', {
        hasData: !!result.data,
        hasScore: !!result.score,
        hasGrade: !!result.grade,
        hasRemarks: !!result.remarks,
        hasPassed: !!result.passed,
        fullResult: result
      });
      
      // Extract the response data
      const responseData = result.data || result;
      
      // Validate the response contains scoring information
      if (!responseData.score && responseData.score !== 0) {
        console.warn('Quiz submitted but no score received from backend');
        console.warn('Response data:', responseData);
      }
      
      toast.success('Quiz submitted successfully!');
      
      // Navigate to results page with the data from backend
      const navigationState = { 
        quizResults: responseData,
        answers: answers,
        quizSession: quizData,
        startedAt: startedAt
      };
      
      console.log('Navigating to results page with state:', navigationState);
      
      navigate(`/dashboard/quiz/results/${quizId}?module=${moduleId}&category=${category}`, { 
        state: navigationState
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // Handle specific error cases
      if (error.message?.includes('NO_PENDING_ATTEMPT')) {
        toast.error('No active quiz attempt found. Please start the quiz again.');
      } else if (error.message?.includes('NO_QUESTION_RESPONSES_FOUND')) {
        toast.error('No answers found. Please answer some questions before submitting.');
      } else {
        toast.error('Failed to submit quiz. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (!questions[currentQuestion]) return null;
    
    const question = questions[currentQuestion];
    const userAnswer = answers[question.id];

    // Debug logging to see what the backend is sending
    console.log('Rendering question:', {
      id: question.id,
      type: question.type,
      question: question.question,
      questionText: question.questionText,
      text: question.text,
      content: question.content,
      questionField: question.question,
      allFields: Object.keys(question),
      fullQuestion: question
    });

    // Helper function to render option text
    const renderOptionText = (option) => {
      if (typeof option === 'string') {
        return option;
      } else if (option && typeof option === 'object') {
        return option.text || option.label || option.value || JSON.stringify(option);
      }
      return String(option);
    };

    // Helper function to get option value
    const getOptionValue = (option, index) => {
      if (typeof option === 'string') {
        return option;
      } else if (option && typeof option === 'object') {
        return option.id || option.value || index;
      }
      return index;
    };

    // Handle missing question type
    if (!question.type) {
      console.warn('Question type is missing, defaulting to MCQ');
      // Default to MCQ if type is missing
      if (question.options && Array.isArray(question.options)) {
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={getOptionValue(option, index)}
                  checked={userAnswer === getOptionValue(option, index)}
                  onChange={() => handleAnswer(question.id, getOptionValue(option, index))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{renderOptionText(option)}</span>
              </label>
            ))}
          </div>
        );
      }
    }

    switch (question.type?.toLowerCase()) {
      case 'mcq':
      case 'multiple_choice':
      case 'multiple choice':
      case 'multiplechoice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={getOptionValue(option, index)}
                  checked={userAnswer === getOptionValue(option, index)}
                  onChange={() => handleAnswer(question.id, getOptionValue(option, index))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{renderOptionText(option)}</span>
              </label>
            ))}
          </div>
        );

      case 'scq':
      case 'single_choice':
      case 'single choice':
      case 'singlechoice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={getOptionValue(option, index)}
                  checked={userAnswer === getOptionValue(option, index)}
                  onChange={() => handleAnswer(question.id, getOptionValue(option, index))}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{renderOptionText(option)}</span>
              </label>
            ))}
          </div>
        );

      case 'truefalse':
      case 'true_false':
      case 'true-false':
      case 'true false':
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
      case 'text':
      case 'essay':
      case 'long_answer':
      case 'long answer':
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

      case 'fill_blank':
      case 'fill_blank':
      case 'fill in the blank':
      case 'fillintheblank':
        return (
          <div>
            <input
              type="text"
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      default:
        console.warn('Unsupported question type:', question.type, 'Question data:', question);
        return (
          <div className="text-gray-500 italic p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-800 mb-2">Question type not supported: {question.type}</p>
            <p className="text-sm text-yellow-700">Please contact support. Question ID: {question.id}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-yellow-700">Show question data</summary>
              <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(question, null, 2)}
              </pre>
            </details>
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
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          timeRemaining <= 300 // 5 minutes in seconds
            ? "bg-red-50 border-red-300 animate-pulse"
            : "bg-blue-50 border-blue-200"
        }`}>
          <Clock className={`h-4 w-4 ${
            timeRemaining <= 300 ? "text-red-600" : "text-blue-600"
          }`} />
          <span className={`font-mono font-medium text-sm ${
            timeRemaining <= 300 ? "text-red-700" : "text-blue-700"
          }`}>
            {formatTime(timeRemaining)}
          </span>
          {timeRemaining <= 300 && (
            <span className="ml-1 text-xs font-medium text-red-600">HURRY!</span>
          )}
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
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              {Object.keys(answers).length} answered
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
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
          {/* Question Text - try multiple possible field names */}
          {(() => {
            const questionText = currentQ?.question || currentQ?.questionText || currentQ?.text || currentQ?.content || currentQ?.title;
            if (questionText) {
              return <p className="text-lg font-medium leading-relaxed">{questionText}</p>;
            } else {
              console.warn('No question text found in question object:', currentQ);
              return (
                <div className="text-red-500 italic p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium">Question text is missing</p>
                  <p className="text-sm">Available fields: {Object.keys(currentQ || {}).join(', ')}</p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm">Show full question data</summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
                      {JSON.stringify(currentQ, null, 2)}
                    </pre>
                  </details>
                </div>
              );
            }
          })()}
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