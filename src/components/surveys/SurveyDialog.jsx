import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Sample survey questions for popup
const popupSurveyQuestions = [
  {
    id: "p1",
    question: "How confident do you feel about React Hooks?",
    type: "rating",
    options: [
      { id: "p1-1", text: "Very Confident" },
      { id: "p1-2", text: "Confident" },
      { id: "p1-3", text: "Neutral" },
      { id: "p1-4", text: "Not Confident" },
      { id: "p1-5", text: "Very Unsure" }
    ]
  },
  {
    id: "p2",
    question: "Which format do you prefer for learning new concepts?",
    type: "multiple-choice",
    options: [
      { id: "p2-1", text: "Interactive tutorials" },
      { id: "p2-2", text: "Video demonstrations" },
      { id: "p2-3", text: "Written documentation" },
      { id: "p2-4", text: "Hands-on projects" }
    ]
  }
];

export function SurveyDialog({ open, onOpenChange, survey }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  
  const totalQuestions = popupSurveyQuestions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmitSurvey = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setSurveyCompleted(true);
      setIsSubmitting(false);
      toast.success("Survey submitted successfully!");
    }, 1000);
  };
  
  const handleClose = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSurveyCompleted(false);
    setIsSubmitting(false);
    onOpenChange(false);
  };
  
  const currentQuestionData = popupSurveyQuestions[currentQuestion];
  const allQuestionsAnswered = popupSurveyQuestions.every(q => answers[q.id]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{survey.title}</DialogTitle>
        </DialogHeader>
        
        {!surveyCompleted ? (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Question {currentQuestion + 1} of {totalQuestions}</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {currentQuestionData.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentQuestionData.type === "text" ? (
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={answers[currentQuestionData.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                    className="min-h-[100px]"
                  />
                ) : (
                  <RadioGroup
                    value={answers[currentQuestionData.id]}
                    onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                  >
                    {currentQuestionData.options?.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 py-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="cursor-pointer w-full">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft size={16} className="mr-2" />
                  Previous
                </Button>
                
                {currentQuestion < totalQuestions - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestionData.id]}
                  >
                    Next
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitSurvey} 
                    disabled={!allQuestionsAnswered || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Survey"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Survey Completed!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your valuable feedback. Your responses help us improve the learning experience.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SurveyDialog;