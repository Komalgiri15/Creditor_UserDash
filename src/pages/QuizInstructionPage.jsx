import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Clock, BookOpen, AlertTriangle, Loader2, CheckCircle, Award, BarChart2 } from "lucide-react";
import { getModuleQuizById, startQuiz } from "@/services/quizService";
import { toast } from "sonner";

function QuizInstructionPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        // Prefer quiz data passed via navigation state
        if (location.state && location.state.quiz) {
          setQuizData(location.state.quiz);
        } else {
          const data = await getModuleQuizById(moduleId, quizId);
          setQuizData(data);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz data');
        toast.error('Failed to load quiz instructions');
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId && moduleId) {
      fetchQuizData();
    }
  }, [quizId, moduleId, location.state]);

  // Consolidated instructions
  const instructions = [
    ` Time Limit: ${quizData?.timeLimit || 25} minutes`,
    ` Questions: ${quizData?.questionCount || 'Multiple'} questions of various types`,
    ` Passing Score: ${quizData?.passingScore || 70}% required`,
    ` Attempts: ${quizData?.maxAttempts || 3} attempts allowed`,
    " Your progress will be saved automatically",
    " No changes allowed after submission"
  ];

  const handleStartQuiz = async () => {
    if (!agreed) {
      toast.error('Please agree to the terms before starting the quiz.');
      return;
    }
    try {
      setIsStarting(true);
      
      // Start the quiz session - this should return quiz data including questions
      const startResponse = await startQuiz(quizId);
      console.log('Quiz started - Full response:', startResponse);
      console.log('Response structure:', {
        hasQuestions: !!startResponse.questions,
        hasQuiz: !!startResponse.quiz,
        hasData: !!startResponse.data,
        keys: Object.keys(startResponse || {}),
        questionsType: typeof startResponse?.questions,
        questionsLength: startResponse?.questions?.length
      });
      
      // Try to get questions from multiple possible sources
      let questions = [];
      
      // 1. Check if questions are in the start response
      if (startResponse.questions && Array.isArray(startResponse.questions)) {
        questions = startResponse.questions;
        console.log('Questions found in start response');
      } else if (startResponse.quiz && startResponse.quiz.questions) {
        questions = startResponse.quiz.questions;
        console.log('Questions found in start response.quiz');
      } else if (startResponse.data && startResponse.data.questions) {
        questions = startResponse.data.questions;
        console.log('Questions found in start response.data');
      }
      
      // 2. If no questions in start response, try to get from existing quiz data
      if (questions.length === 0 && quizData?.questions) {
        questions = quizData.questions;
        console.log('Questions found in existing quiz data');
      }
      
      // 3. If still no questions, try to fetch them from the module quiz endpoint
      if (questions.length === 0) {
        try {
          console.log('Attempting to fetch questions from module quiz endpoint...');
          const moduleQuizData = await getModuleQuizById(moduleId, quizId);
          if (moduleQuizData?.questions) {
            questions = moduleQuizData.questions;
            console.log('Questions found in module quiz data');
          }
        } catch (moduleError) {
          console.log('Module quiz endpoint failed:', moduleError);
        }
      }
      
      // 4. Final check - if we still have no questions, show error
      if (questions.length === 0) {
        console.error('No questions found in any source:', {
          startResponse,
          quizData,
          moduleId,
          quizId
        });
        toast.error('Unable to load quiz questions. Please contact support or try again later.');
        return;
      }
      
      console.log('Quiz questions loaded successfully:', questions.length, 'questions');
      
      // Navigate to quiz take page with questions data
      navigate(`/dashboard/quiz/take/${quizId}?module=${moduleId}&category=${category}`, { 
        state: { 
          questions,
          quizSession: startResponse,
          startedAt: new Date().toISOString()
        } 
      });
    } catch (err) {
      console.error('Error starting quiz:', err);
      toast.error('Failed to start quiz. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto" />
          <p className="text-gray-600 text-lg">Loading quiz instructions...</p>
          <p className="text-sm text-gray-500">Preparing your assessment</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4 mx-auto">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">Failed to load quiz</h3>
          <p className="text-gray-600 mb-6">{error || 'Quiz not found'}</p>
          <div className="space-x-3">
            <Button onClick={() => navigate(-1)}>Go Back</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="border-gray-300">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>
        <Badge variant={category === 'general' ? 'outline' : 'default'} className="px-4 py-1.5">
          {category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}
        </Badge>
      </div>

      {/* Quiz Info Card */}
      <Card className="mb-6 overflow-hidden shadow-sm border border-gray-200">
        <CardContent className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg shadow-sm flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {quizData.title || `Quiz ${quizId}`}
              </h1>
              <p className="text-gray-700 mb-4">
                {quizData.description || 'Test your knowledge with this comprehensive quiz'}
              </p>
              
              {/* Quiz Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold">{quizData.timeLimit || 25} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="font-bold">{quizData.questionCount || 'Multiple'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                  <Award className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Passing</p>
                    <p className="font-bold">{quizData.passingScore || 70}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                  <BarChart2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Attempts</p>
                    <p className="font-bold">{quizData.maxAttempts || 3}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-6 border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Quick Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm">{instruction}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card className="mb-6 border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked)}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              I agree to complete this quiz independently without any external assistance and understand 
              that my answers cannot be changed after submission.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-full md:w-auto">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>
        
        <Button 
          onClick={handleStartQuiz}
          disabled={!agreed || isStarting}
          className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 font-medium shadow-sm"
        >
          {isStarting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Quiz...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Start Quiz Now
            </>
          )}
        </Button>
      </div>

      {/* Warning */}
      {!agreed && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Please agree to the terms before starting the quiz.</span>
        </div>
      )}
    </div>
  );
}

export default QuizInstructionPage;