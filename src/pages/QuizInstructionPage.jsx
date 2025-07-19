import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Clock, AlertTriangle, CheckCircle, BookOpen, Info } from "lucide-react";

function QuizInstructionPage() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const category = searchParams.get('category');
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const quizInfo = {
    title: `Quiz ${quizId}`,
    totalQuestions: 10,
    duration: "25 minutes",
    passingScore: 70,
    attempts: 3,
    description: "This quiz contains various types of questions including Multiple Choice, True/False, Fill-ups, Matching, One Word, and Descriptive questions."
  };

  const instructions = [
    "Read each question carefully before selecting your answer.",
    "You have 25 minutes to complete all 10 questions.",
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
    "You must score at least 70% to pass this quiz.",
    "You have 3 attempts to complete this quiz successfully."
  ];

  const handleStartQuiz = () => {
    if (!agreed) {
      return;
    }
    navigate(`/quiz-take/${quizId}?module=${moduleId}&category=${category}`);
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/module/${moduleId}/assessments`)}>
          <ChevronLeft size={16} />
          Back to Assessments
        </Button>
        <Badge variant={category === 'general' ? 'outline' : 'default'}>
          {category === 'general' ? 'Practice Quiz' : 'Assessment Quiz'}
        </Badge>
      </div>

      {/* Quiz Info Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {quizInfo.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {quizInfo.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{quizInfo.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{quizInfo.duration}</div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{quizInfo.passingScore}%</div>
            <div className="text-sm text-muted-foreground">Pass Score</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{quizInfo.attempts}</div>
            <div className="text-sm text-muted-foreground">Attempts</div>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Info size={24} className="text-blue-500" />
            Quiz Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed">{instruction}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <div className="mb-6 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Important Notes</p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1">
              <li>•  Ensure you have a stable internet connection</li>
              <li>• Do not refresh the page during the quiz</li>
              <li>• Your timer will start immediately after clicking "Start Quiz"</li>
              <li>• Late submissions will not be accepted</li>
            </ul>
          </div>
        </div>

        {category === 'final' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Assessment Quiz Warning</p>
              <p className="text-sm text-red-700 mt-1">
                This is a graded assessment that will impact your final course grade. Make sure you are well-prepared before starting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Agreement and Start */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="agree" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
              />
              <label 
                htmlFor="agree" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I have read and understood all the instructions above, and I agree to follow the quiz rules and regulations.
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              You must agree to the instructions before starting the quiz
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate(`/courses/module/${moduleId}/assessments`)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStartQuiz}
                disabled={!agreed}
                className="flex-1"
              >
                <CheckCircle size={16} className="mr-2" />
                Start Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuizInstructionPage;