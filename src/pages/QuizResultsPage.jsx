import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, BookOpen, Trophy, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

function QuizResultsPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  
  // Get results data from navigation state
  const { quizResults, answers, quizSession, startedAt } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const initializeResults = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have results data from navigation state
        if (!quizResults) {
          console.error('No quiz results found in navigation state');
          setError('No quiz results found. Please complete the quiz first.');
          return;
        }
        
        // Set the data from navigation state
        setQuizData(quizSession);
        setResults(quizResults);
        
        console.log('Quiz results loaded:', {
          quizResults,
          answers,
          quizSession,
          startedAt
        });
        
        // Validate that we have the expected data
        if (!quizResults.score && !quizResults.data?.score) {
          console.warn('Quiz results missing score data:', quizResults);
        }
        
      } catch (err) {
        console.error('Error initializing results:', err);
        setError('Failed to load quiz results');
        toast.error('Failed to load quiz results');
      } finally {
        setIsLoading(false);
      }
    };

    initializeResults();
  }, [quizResults, quizSession, answers, startedAt]);

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

  // Extract score and other data from results
  let score = 0;
  let grade = 'N/A';
  
  if (results?.score) {
    // Backend returns score as "85 (B)" format
    const scoreMatch = results.score.toString().match(/(\d+)\s*\(([A-Z])\)/);
    if (scoreMatch) {
      score = parseInt(scoreMatch[1]);
      grade = scoreMatch[2];
    } else {
      // Try to extract just the number
      const numMatch = results.score.toString().match(/(\d+)/);
      if (numMatch) {
        score = parseInt(numMatch[1]);
      }
    }
  }
  
  const remarks = results?.remarks || '';
  const passed = results?.passed || false;
  const answered = Object.keys(answers || {}).length;
  
  // Debug logging to see what we received
  console.log('Quiz Results Page - Data received:', {
    quizResults: results,
    answers: answers,
    quizSession: quizData,
    startedAt: startedAt,
    extractedData: {
      score,
      grade,
      remarks,
      passed,
      answered
    }
  });
  
  const isPassed = passed || score >= (quizData?.passingScore || 70);

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
    <div className="container py-6 max-w-6xl mx-auto">
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

      {/* Main Results Card - Quiz Info Left, Score Right */}
      <Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
            {/* Left Side - Quiz Information */}
            <div className="p-8 border-r border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
                  <p className="text-lg text-gray-600">{getScoreMessage(score)}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Quiz Title</p>
                      <p className="text-lg font-semibold text-gray-900">{quizData?.quiz?.title || quizData?.title || `Quiz ${quizId}`}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <Clock className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{quizData?.quiz?.time_limit || quizData?.timeLimit || 25} minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Passing Score</p>
                      <p className="text-lg font-semibold text-gray-900">{quizData?.quiz?.min_score || quizData?.passingScore || 70}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                      <p className="text-lg font-semibold text-gray-900">{answered}</p>
                    </div>
                  </div>
                </div>

                {/* Remarks Display */}
                {remarks && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-lg font-medium text-blue-800">
                      {remarks}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Score Display */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center">
              <div className="text-center">
                {/* Score Circle */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 rounded-full bg-white shadow-xl border-8 border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}>
                        {score}%
                      </div>
                      <div className="text-lg text-gray-600 font-medium">
                        {isPassed ? 'PASSED' : 'NOT PASSED'}
                      </div>
                    </div>
                  </div>
                  {/* Status Icon Overlay */}
                  
                </div>

                {/* Grade Display */}
                {grade && grade !== 'N/A' && (
                  <div className="mb-4">
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-xl">
                      Grade: {grade}
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="mb-4">
                  <Badge 
                    variant={isPassed ? "default" : "destructive"}
                    className={`text-lg px-6 py-2 ${isPassed ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                  >
                    {isPassed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((score / 100) * answered)} / {answered}
                    </span>
                  </div>
                  <Progress value={score} className="h-3" />
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
              {/* Question Review */}
              {quizData?.questions && (
                <div>
                  <h4 className="font-semibold mb-3">Question Review</h4>
                  <div className="space-y-4">
                    {quizData.questions.map((question, index) => {
                      const userAnswer = answers?.[question.id];
                      const isCorrect = score > 0; // This is simplified - you might want to add correct answer tracking
                      
                      return (
                        <div key={question.id} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                              isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-2">{question.text}</p>
                              <div className="space-y-2">
                                {question.options?.map((option) => (
                                  <div key={option.id} className={`flex items-center gap-2 p-2 rounded ${
                                    userAnswer === option.id ? 'bg-blue-50 border border-blue-200' : ''
                                  }`}>
                                    <input
                                      type="radio"
                                      checked={userAnswer === option.id}
                                      disabled
                                      className="w-4 h-4"
                                    />
                                    <span className={userAnswer === option.id ? 'font-medium' : ''}>
                                      {option.text}
                                    </span>
                                    {userAnswer === option.id && (
                                      <span className="text-sm text-gray-500">(Your answer)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
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