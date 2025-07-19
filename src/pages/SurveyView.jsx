import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Clock, Send, CheckCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

const SurveyView = () => {
  const { moduleId, surveyId } = useParams();
  const navigate = useNavigate();
  
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const surveyInfo = {
    title: `Module ${moduleId} Survey: Learning Experience`,
    description: "Please provide your feedback about this module's content and learning experience",
    totalQuestions: 5,
    timeLimit: "10 minutes"
  };

  const questions = [
    {
      id: "q1",
      question: "How would you rate the overall quality of this module?",
      type: "radio",
      options: ["Excellent", "Good", "Average", "Below Average", "Poor"]
    },
    {
      id: "q2",
      question: "How relevant was the content to your learning goals?",
      type: "radio",
      options: ["Very Relevant", "Relevant", "Somewhat Relevant", "Not Very Relevant", "Not Relevant at All"]
    },
    {
      id: "q3",
      question: "How would you rate the difficulty level of this module?",
      type: "radio",
      options: ["Too Easy", "Easy", "Just Right", "Difficult", "Too Difficult"]
    },
    {
      id: "q4",
      question: "How engaging were the learning materials and activities?",
      type: "radio",
      options: ["Very Engaging", "Engaging", "Somewhat Engaging", "Not Very Engaging", "Not Engaging at All"]
    },
    {
      id: "q5",
      question: "Please provide any additional feedback or suggestions for improving this module:",
      type: "text"
    }
  ];

  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up! Survey will be auto-submitted.");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    
    if (unansweredQuestions.length > 0) {
      toast.warning(`You have ${unansweredQuestions.length} unanswered questions. Please complete all questions.`);
      return;
    }

    setIsSubmitted(true);
    toast.success("Survey submitted successfully!");
  };

  const timeProgress = ((600 - timeRemaining) / 600) * 100;
  const questionProgress = ((currentQuestion + 1) / questions.length) * 100;

  if (isSubmitted) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-600">Survey Completed Successfully!</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Thank you for your valuable feedback! Your responses help us improve the learning experience.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Your contribution matters!</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your feedback helps improve course content</li>
                <li>• Responses are used to enhance learning materials</li>
                <li>• Your input shapes future course development</li>
                <li>• Thank you for being part of our learning community</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/courses/module/${moduleId}/assessments`)}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to Assessments
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} />
          Back
        </Button>
        <Badge variant="outline">Survey in Progress</Badge>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Time Remaining: {formatTime(timeRemaining)}</span>
          <span>{Math.round(timeProgress)}%</span>
        </div>
        <Progress value={timeProgress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{surveyInfo.title}</CardTitle>
              <p className="text-muted-foreground mt-1">{surveyInfo.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{surveyInfo.timeLimit}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(questionProgress)}%</span>
        </div>
        <Progress value={questionProgress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestion + 1}: {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questions[currentQuestion].type === "radio" && (
            <RadioGroup
              value={answers[questions[currentQuestion].id] || ""}
              onValueChange={(value) => handleAnswerChange(questions[currentQuestion].id, value)}
              className="space-y-3"
            >
              {questions[currentQuestion].options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {questions[currentQuestion].type === "text" && (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[questions[currentQuestion].id] || ""}
              onChange={(e) => handleAnswerChange(questions[currentQuestion].id, e.target.value)}
              className="min-h-[150px]"
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" />
              Submit Survey
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SurveyView;