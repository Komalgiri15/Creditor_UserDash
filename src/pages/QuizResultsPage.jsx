import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, BookOpen, Trophy, AlertTriangle, Loader2 } from "lucide-react";
import { getQuizResults, getQuizById } from "@/services/quizService";
import { toast } from "sonner";

function QuizResultsPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  const score = parseInt(searchParams.get('score') || '0');
  const answered = parseInt(searchParams.get('answered') || '0');
  
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        
        // Fetch quiz data and results in parallel
        const [quizResponse, resultsResponse] = await Promise.all([
          getQuizById(quizId),
          getQuizResults(quizId)
        ]);
        
        setQuizData(quizResponse);
        setResults(resultsResponse);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load quiz results');
        toast.error('Failed to load quiz results');
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      fetchResults();
    }
  }, [quizId]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Trophy className="h-8 w-8 text-yellow-500" />;
    if (score >= 80) return <CheckCircle className="h-8 w-8 text-green-500" />;
    if (score >= 70) return <CheckCircle className="h-8 w-8 text-blue-500" />;
    return <XCircle className="h-8 w-8 text-red-500" />;
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Excellent! Outstanding performance!";
    if (score >= 80) return "Great job! Well done!";
    if (score >= 70) return "Good work! You passed!";
    return "Keep practicing! You'll do better next time.";
  };

  const isPassed = score >= (quizData?.passingScore || 70);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load results</h3>
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
          <BookOpen size={16} />
          Back to Quiz
        </Button>
        <Badge variant={category === 'general' ? 'outline' : 'default'}>
          {category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}
        </Badge>
      </div>

      {/* Results Header */}
      <Card className="mb-8 overflow-hidden shadow-xl border-0">
        <CardContent className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getScoreIcon(score)}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Quiz Results
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              {getScoreMessage(score)}
            </p>
            
            {/* Score Display */}
            <div className="inline-block bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
              <div className="text-6xl font-bold mb-2">
                <span className={getScoreColor(score)}>{score}%</span>
              </div>
              <div className="text-lg text-gray-600">
                {isPassed ? 'PASSED' : 'NOT PASSED'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Quiz Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Quiz Title</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.title || `Quiz ${quizId}`}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.timeLimit || 25} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Passing Score</p>
                  <p className="text-lg font-semibold text-gray-900">{quizData.passingScore || 70}%</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                  <p className="text-lg font-semibold text-gray-900">{answered}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Your Score</p>
                  <p className={`text-lg font-semibold ${getScoreColor(score)}`}>{score}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isPassed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className={`text-lg font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {isPassed ? 'PASSED' : 'FAILED'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      {results && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Score Breakdown */}
              <div>
                <h4 className="font-semibold mb-3">Score Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((score / 100) * answered)} / {answered}
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              </div>
              
              {/* Time Analysis */}
              {results.timeSpent && (
                <div>
                  <h4 className="font-semibold mb-3">Time Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Time Spent</p>
                      <p className="text-lg font-semibold text-blue-800">{results.timeSpent}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Time Remaining</p>
                      <p className="text-lg font-semibold text-green-800">{results.timeRemaining || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Attempt History */}
              {results.attempts && (
                <div>
                  <h4 className="font-semibold mb-3">Attempt History</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">This was attempt #{results.attempts.current} of {results.attempts.max}</p>
                    {results.attempts.previous && (
                      <p className="text-sm text-gray-600 mt-1">
                        Previous best: {results.attempts.previous}%
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <BookOpen className="mr-2 h-4 w-4" />
          Back to Quiz
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate(`/dashboard/courses/${moduleId}/modules/${moduleId}/assessments`)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View All Assessments
          </Button>
          
          <Button 
            onClick={() => navigate(`/dashboard/quiz/take/${quizId}?module=${moduleId}&category=${category}`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </div>

      {/* Congratulations or Encouragement */}
      {isPassed ? (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <Trophy className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
          <p className="text-green-700">
            You've successfully completed this quiz. Keep up the great work and continue learning!
          </p>
        </div>
      ) : (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Keep Learning!</h3>
          <p className="text-yellow-700">
            Don't worry about this attempt. Review the material and try again. Every attempt is a learning opportunity!
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizResultsPage;