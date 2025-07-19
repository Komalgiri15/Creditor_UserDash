import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Clock, AlertTriangle, CheckCircle, PenTool, Info, Trophy, Users, FileText } from "lucide-react";

export function EssayInstructionPage() {
  const { essayId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const essayInfo = {
    title: `Essay ${essayId}: Technology and Society`,
    maxScore: 100,
    timeLimit: "2 hours",
    attempts: 2,
    difficulty: "Medium",
    wordLimit: "800-1000 words",
    description: "Write a comprehensive essay analyzing the impact of technology on modern society and human relationships."
  };

  const instructions = [
    "Read the essay topic carefully before starting to write.",
    "You have 2 hours to complete this essay once you begin.",
    "Write between 800-1000 words as specified in the word limit.",
    "Use the provided text editor to format your essay properly.",
    "Structure your essay with clear introduction, body, and conclusion.",
    "Support your arguments with relevant examples and evidence.",
    "Use proper grammar, spelling, and punctuation throughout.",
    "You can use formatting options like bold and italic for emphasis.",
    "Save your work frequently to avoid losing progress.",
    "Review your essay before submitting to ensure quality.",
    "Once submitted, you cannot edit your essay anymore.",
    "You can attempt this essay up to 2 times maximum.",
    "Your highest score will be considered for final grading.",
    "Late submissions will result in point deductions."
  ];

  const requirements = [
    "Write a well-structured essay with clear thesis statement",
    "Include relevant examples and evidence to support arguments", 
    "Maintain proper academic writing style and tone",
    "Meet the specified word count requirement (800-1000 words)",
    "Use proper citations if referencing external sources",
    "Ensure logical flow and coherent paragraph structure",
    "Demonstrate critical thinking and analytical skills",
    "Proofread for grammar, spelling, and punctuation errors"
  ];

  const gradingCriteria = [
    "Content Quality & Relevance (30%)",
    "Structure & Organization (25%)",
    "Critical Thinking & Analysis (20%)",
    "Language & Grammar (15%)",
    "Word Count & Formatting (10%)"
  ];

  const handleStartEssay = () => {
    if (!agreed) {
      return;
    }
    navigate(`/essay-take/${essayId}?module=${moduleId}`);
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/module/${moduleId}/assessments`)}>
          <ChevronLeft size={16} />
          Back to Assessments
        </Button>
        <Badge variant="default" className="bg-purple-600">
          Essay Instructions
        </Badge>
      </div>

      {/* Essay Info Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
            <PenTool size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {essayInfo.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {essayInfo.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{essayInfo.maxScore}</div>
            <div className="text-sm text-muted-foreground">Max Points</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{essayInfo.timeLimit}</div>
            <div className="text-sm text-muted-foreground">Time Limit</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{essayInfo.wordLimit}</div>
            <div className="text-sm text-muted-foreground">Word Limit</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{essayInfo.attempts}</div>
            <div className="text-sm text-muted-foreground">Attempts</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Badge variant="outline" className="text-lg py-1">
              {essayInfo.difficulty}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">Difficulty</div>
          </div>
        </div>
      </div>

      {/* Requirements Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Trophy size={24} className="text-yellow-500" />
            Essay Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed">{requirement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grading Criteria Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText size={24} className="text-green-500" />
            Grading Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gradingCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">
                  ✓
                </div>
                <p className="text-sm leading-relaxed font-medium">{criteria}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Info size={24} className="text-blue-500" />
            Essay Instructions
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
            <p className="font-medium text-amber-800">Important Guidelines</p>
            <ul className="text-sm text-amber-700 mt-2 space-y-1">
              <li>• Ensure you have a stable internet connection</li>
              <li>• Do not refresh the page during the essay writing</li>
              <li>• Your timer will start immediately after clicking "Start Essay"</li>
              <li>• Use the text editor's save functionality frequently</li>
              <li>• Review your essay thoroughly before final submission</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
          <Users className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-purple-800">Academic Integrity</p>
            <p className="text-sm text-purple-700 mt-1">
              This essay must be your original work. Plagiarism will result in automatic failure. 
              If you use external sources, ensure proper citation and attribution.
            </p>
          </div>
        </div>
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
                I have read and understood all the essay requirements and instructions, and I agree to follow the academic integrity guidelines.
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              You must agree to the instructions before starting the essay
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => navigate(`/courses/module/${moduleId}/assessments`)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStartEssay}
                disabled={!agreed}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle size={16} className="mr-2" />
                Start Essay
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EssayInstructionPage;