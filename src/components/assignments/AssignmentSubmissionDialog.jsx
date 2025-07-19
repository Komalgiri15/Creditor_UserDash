import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, Send } from "lucide-react";
import { toast } from "sonner";

export function AssignmentSubmissionDialog({ open, onOpenChange, assignment }) {
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: "q1",
      question: "What is the main advantage of using React Context API over prop drilling?",
      type: "multiple-choice",
      options: [
        "Better performance",
        "Avoids passing props through intermediate components",
        "Easier debugging",
        "Smaller bundle size"
      ],
      points: 20
    },
    {
      id: "q2",
      question: "Explain how you would implement a theme provider using React Context. Include code examples.",
      type: "text",
      points: 40
    },
    {
      id: "q3",
      question: "What are the potential drawbacks of using Context API for state management?",
      type: "multiple-choice",
      options: [
        "Poor performance with frequent updates",
        "Difficult to test",
        "Limited browser support",
        "Requires additional libraries"
      ],
      points: 20
    },
    {
      id: "q4",
      question: "Describe the difference between createContext and useContext. Provide a practical example of their usage.",
      type: "text",
      points: 20
    }
  ];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions. ${unanswered.length} questions remaining.`);
      return;
    }

    toast.success("Assignment submitted successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{assignment.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{assignment.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{assignment.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={16} />
                  <span>Max Score: {assignment.maxScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Question {index + 1} ({question.points} points)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{question.question}</p>
                  
                  {question.type === "multiple-choice" ? (
                    <RadioGroup
                      value={answers[question.id] || ""}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                          <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Textarea
                      placeholder="Enter your answer..."
                      value={answers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="min-h-[120px]"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex items-center gap-2">
              <Send size={16} />
              Submit Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
