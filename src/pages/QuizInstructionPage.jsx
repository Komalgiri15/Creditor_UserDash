import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Clock, BookOpen, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { getModuleQuizById, getModuleQuizQuestions } from "@/services/quizService";
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

  const instructions = [
    "Read each question carefully before selecting your answer.",
    `You have ${quizData?.timeLimit || 25} minutes to complete all ${quizData?.questionCount || 'questions'}.`,
    "Each question has different scoring based on its type and difficulty.",
    "Multiple Choice Questions (MCQ) - Select the best answer from given options.",
    "Single Choice Questions (SCQ) - Choose only one correct answer.",
    "True/False Questions - Determine if the statement is correct or incorrect.",
    "Fill-up Questions - Complete the sentence with appropriate words.",
    "Matching Questions - Connect related items from two columns.",
    "One Word Questions - Provide a single word answer.",
    "Descriptive Questions - Write detailed explanations in your own words.",
    "You can navigate between questions using Next/Previous buttons.",
    "Your progress will be saved automatically.",
    "Once submitted, you cannot change your answers.",
    `You must score at least ${quizData?.passingScore || 70}% to pass this quiz.`,
    `You have ${quizData?.maxAttempts || 3} attempts to complete this quiz successfully.`
  ];

  const handleStartQuiz = async () => {
    if (!agreed) {
      toast.error('Please agree to the terms before starting the quiz.');
      return;
    }
    try {
      // Fetch quiz questions for this module/quiz
      const questions = await getModuleQuizQuestions(moduleId, quizId);
      // Optionally: pass questions to the quiz page via state/context, or just navigate
      navigate(`/dashboard/quiz/take/${quizId}?module=${moduleId}&category=${category}`, { state: { questions } });
    } catch (err) {
      toast.error('Failed to load quiz questions.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz instructions...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load quiz</h3>
          <p className="text-gray-600 mb-4">{error || 'Quiz not found'}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} />
          Back to Assessments
        </Button>
        <Badge variant={category === 'general' ? 'outline' : 'default'}>
          {category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}
        </Badge>
      </div>

      {/* Quiz Info Card */}
      <Card className="mb-8 overflow-hidden shadow-xl border-0">
        <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {quizData.title || `Quiz ${quizId}`}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                {quizData.description || 'Test your knowledge with this comprehensive quiz'}
              </p>
              
              {/* Quiz Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-lg font-bold text-gray-900">{quizData.timeLimit || 25} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Questions</p>
                    <p className="text-lg font-bold text-gray-900">{quizData.questionCount || 'Multiple'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/70 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Passing Score</p>
                    <p className="text-lg font-bold text-gray-900">{quizData.passingScore || 70}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Quiz Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              I have read and understood all the instructions above. I agree to follow the quiz rules and understand that 
              once submitted, I cannot change my answers. I also confirm that I will complete this quiz independently 
              without any external assistance.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Assessments
        </Button>
        
        <Button 
          onClick={handleStartQuiz}
          disabled={!agreed}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Start Quiz Now
        </Button>
      </div>

      {/* Warning */}
      {!agreed && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Please read and agree to the terms before starting the quiz.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizInstructionPage;