import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Clock, FileCheck, AlertTriangle, CheckCircle, Trophy, Users, Info } from "lucide-react";

export function AssignmentInstructionPage() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const navigate = useNavigate();
  const [agreedToInstructions, setAgreedToInstructions] = useState(false);

  const assignmentInfo = {
    title: `Assignment ${assignmentId}: Context API Implementation`,
    description: "Build a theme provider using React Context API and implement dark/light mode switching functionality.",
    maxScore: 100,
    timeLimit: "2 hours",
    attempts: 3,
    difficulty: "Medium",
    instructions: [
      "Read the assignment requirements carefully before starting.",
      "You have 2 hours to complete this assignment once you begin.",
      "Submit your code files and documentation as required.",
      "Use proper coding standards and best practices.",
      "Test your implementation thoroughly before submission.",
      "Include comments to explain your code logic.",
      "Follow the project structure guidelines provided.",
      "You can attempt this assignment up to 3 times maximum.",
      "Late submissions will result in point deductions.",
      "Ensure all required files are included in your submission."
    ]
  };

  const handleStartAssignment = () => {
    if (!agreedToInstructions) {
      return;
    }
    navigate(`/assignment-take/${assignmentId}?module=${moduleId}`);
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} />
          Back
        </Button>
        <Badge variant="outline">Assignment Instructions</Badge>
      </div>

      <div className="space-y-6">
        {/* Assignment Header */}
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-green-800">{assignmentInfo.title}</CardTitle>
                <p className="text-green-700 text-lg font-medium mb-2">{assignmentInfo.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Assignment Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-medium">Max Score</span>
              </div>
              <p className="text-2xl font-bold text-primary">{assignmentInfo.maxScore}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Time Limit</span>
              </div>
              <p className="text-2xl font-bold text-orange-500">{assignmentInfo.timeLimit}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="font-medium">Attempts</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{assignmentInfo.attempts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Difficulty</span>
              </div>
              <Badge variant="outline" className="text-lg py-1">
                {assignmentInfo.difficulty}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-6 w-6 text-primary" />
              Assignment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Important Guidelines</span>
              </div>
              <ul className="space-y-2">
                {assignmentInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="font-medium text-blue-600 mt-0.5">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Submission Requirements:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Complete implementation of the required functionality</li>
                <li>• Well-documented code with proper comments</li>
                <li>• All necessary files included in submission</li>
                <li>• Testing evidence or documentation</li>
                <li>• Follow the specified coding standards</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Checkbox */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="agree-instructions"
                checked={agreedToInstructions}
                onCheckedChange={(checked) => setAgreedToInstructions(checked)}
              />
              <div className="space-y-2">
                <label 
                  htmlFor="agree-instructions" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I agree to all the above instructions and assignment requirements
                </label>
                <p className="text-xs text-muted-foreground">
                  You must agree to the instructions before starting the assignment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStartAssignment}
            disabled={!agreedToInstructions}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Start Assignment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AssignmentInstructionPage;