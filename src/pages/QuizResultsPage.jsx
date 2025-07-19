import React from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft, Target, Clock, BookOpen } from "lucide-react";

function QuizResultsPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  const score = parseInt(searchParams.get('score') || '0');
  const answered = parseInt(searchParams.get('answered') || '0');

  const totalQuestions = 10;
  const passingScore = 70;
  const passed = score >= passingScore;
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getGradeInfo = () => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { grade: 'F', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const gradeInfo = getGradeInfo();

  const getEncouragementMessage = () => {
    if (score >= 90) return "Outstanding performance! You've mastered the material exceptionally well.";
    if (score >= 80) return "Excellent work! Your understanding of the concepts is very strong.";
    if (score >= 70) return "Good job! You've successfully demonstrated your knowledge.";
    if (score >= 60) return "You're on the right track, but there's room for improvement.";
    return "Don't give up! Review the material and try again to strengthen your understanding.";
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ArrowLeft size={16} />
            Back to Assessments
          </Link>
        </Button>
        <Badge variant={category === 'general' ? 'outline' : 'default'}>
          Quiz {quizId} Results
        </Badge>
      </div>

      {/* Results Header */}
      <div className="text-center mb-8">
        <div className={`w-24 h-24 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mx-auto mb-4`}>
          {passed ? (
            <Trophy size={48} className="text-green-600" />
          ) : (
            <Target size={48} className="text-red-600" />
          )}
        </div>
        
        <h1 className="text-3xl font-bold mb-2">
          {passed ? 'Congratulations! 🎉' : 'Keep Learning! 📚'}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-4">
          {getEncouragementMessage()}
        </p>

        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${gradeInfo.bgColor} ${gradeInfo.color} font-bold text-2xl`}>
          <span>Grade: {gradeInfo.grade}</span>
          <span className="text-3xl">{score}%</span>
        </div>
      </div>

      {/* Score Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" />
              Correct Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-muted-foreground">out of {totalQuestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle size={20} className="text-red-500" />
              Incorrect Answers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{incorrectAnswers}</div>
            <div className="text-sm text-muted-foreground">out of {totalQuestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen size={20} className="text-blue-500" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{Math.round((answered / totalQuestions) * 100)}%</div>
            <div className="text-sm text-muted-foreground">{answered} of {totalQuestions} answered</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <span className="text-sm font-bold">{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Passing Threshold</span>
              <span className="text-sm">{passingScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-400 h-2 rounded-full" 
                style={{ width: `${passingScore}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quiz Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Quiz Type:</span>
                <span>{category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Total Questions:</span>
                <span>{totalQuestions}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Questions Answered:</span>
                <span>{answered}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Your Score:</span>
                <span className="font-bold">{score}%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Passing Score:</span>
                <span>{passingScore}%</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Status:</span>
                <Badge variant={passed ? "default" : "destructive"}>
                  {passed ? "Passed" : "Failed"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" asChild>
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ArrowLeft size={16} />
            Return to Assessments
          </Link>
        </Button>
        
        <Button asChild>
          <Link to={`/quiz-instruction/${quizId}?module=${moduleId}&category=${category}`}>
            <RotateCcw size={16} />
            Retake Quiz
          </Link>
        </Button>

        {passed && category === 'general' && (
          <Button asChild>
            <Link to={`/quiz-instruction/${quizId}?module=${moduleId}&category=final`}>
              <Trophy size={16} />
              Take Assessment Quiz
            </Link>
          </Button>
        )}
      </div>

      {/* Additional Information */}
      {!passed && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Suggestions for Improvement</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Review the course materials and focus on areas where you struggled</li>
            <li>• Practice with similar questions to strengthen your understanding</li>
            <li>• Take notes on key concepts and definitions</li>
            <li>• Seek help from instructors or classmates if needed</li>
            <li>• Use additional resources like textbooks or online tutorials</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuizResultsPage;