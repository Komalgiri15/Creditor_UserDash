import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Clock, FileCheck, Send, AlertTriangle, Link as LinkIcon, CheckCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function AssignmentTakePage() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const navigate = useNavigate();
  
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [projectLink, setProjectLink] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const assignmentInfo = {
    title: `Assignment ${assignmentId}: Context API Implementation`,
    maxScore: 100,
    timeLimit: "2 hours"
  };

  const questions = [
    {
      id: "q1",
      question: "Create a ThemeContext that manages light and dark theme states. Provide the complete TypeScript interface definition for your theme context value.",
      points: 15,
      type: "code"
    },
    {
      id: "q2", 
      question: "Implement a ThemeProvider component that wraps your application and provides theme functionality to child components. Include proper error handling.",
      points: 20,
      type: "implementation"
    },
    {
      id: "q3",
      question: "Create a custom hook (useTheme) that consumes the theme context and provides theme values and toggle functionality to components.",
      points: 15,
      type: "code"
    },
    {
      id: "q4",
      question: "Implement at least 5 styled components that respond to theme changes. Show how these components adapt their appearance based on the current theme.",
      points: 25,
      type: "implementation"
    },
    {
      id: "q5",
      question: "Add theme persistence functionality so that the user's theme preference is saved and restored when they return to the application.",
      points: 15,
      type: "feature"
    },
    {
      id: "q6",
      question: "Explain your approach to handling theme context errors and provide examples of how you would test your theme implementation.",
      points: 10,
      type: "explanation"
    }
  ];

  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up! Assignment will be auto-submitted.");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (!projectLink.trim()) {
      toast.error("Please provide a link to your assignment answers.");
      return;
    }

    // Show submission confirmation instead of navigating to results
    setIsSubmitted(true);
    toast.success("Assignment submitted successfully!");
  };

  const timeProgress = ((7200 - timeRemaining) / 7200) * 100;

  if (isSubmitted) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-600">Assignment Submitted Successfully!</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your assignment has been submitted and is now in the evaluation phase. 
              Our instructors will review your work and provide detailed feedback.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">What happens next?</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your submission will be reviewed within 24-48 hours</li>
                <li>• You'll receive detailed feedback on your work</li>
                <li>• Results will be available in your dashboard</li>
                <li>• You'll be notified via email when ready</li>
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
    <div className="container py-6 max-w-5xl mx-auto">
      {/* Header with Timer */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} />
            Back
          </Button>
          <Badge variant="default" className="bg-green-600">
            Assignment in Progress
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Time Remaining</div>
            <div className={`text-lg font-bold ${timeRemaining < 600 ? 'text-red-600' : 'text-green-600'}`}>
              <Clock size={16} className="inline mr-1" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Time Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Time Progress</span>
          <span>{Math.round(timeProgress)}%</span>
        </div>
        <Progress value={timeProgress} className="h-2" />
      </div>

      {/* Assignment Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{assignmentInfo.title}</CardTitle>
              <p className="text-muted-foreground mt-1">Review all questions and submit your answers via drive link</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{assignmentInfo.maxScore}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Questions Display Only */}
      <div className="space-y-6 mb-8">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {index + 1} ({question.points} points)
                </CardTitle>
                <Badge variant="outline" className="capitalize">
                  {question.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-gray-700">{question.question}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assignment Submission */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon size={20} />
            Assignment Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-link">Drive Link to Your Assignment Answers *</Label>
            <Input
              id="project-link"
              placeholder="https://drive.google.com/file/d/your-assignment-answers"
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Provide a shareable Google Drive link or similar cloud storage link containing all your assignment answers
            </p>
          </div>
          
          <div>
            <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
            <Textarea
              id="additional-notes"
              placeholder="Any additional information about your submission..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Before Submitting</p>
          <ul className="text-sm text-amber-700 mt-1 space-y-1">
            <li>• Ensure your drive link is publicly accessible</li>
            <li>• Include answers to all questions in your submission</li>
            <li>• Double-check your work before submitting</li>
            <li>• Once submitted, you cannot modify your answers</li>
            <li>• Make sure your file is properly formatted and readable</li>
          </ul>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={() => toast.success("Assignment saved as draft")}>
          Save Draft
        </Button>
        <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
          <Send size={16} className="mr-2" />
          Submit Assignment
        </Button>
      </div>
    </div>
  );
}

export default AssignmentTakePage;