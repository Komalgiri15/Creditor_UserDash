import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Users, MessageSquare, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";

export function DebateInstructionPage() {
  const { debateId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const navigate = useNavigate();
  const [agreedToInstructions, setAgreedToInstructions] = useState(false);

  const debateInfo = {
    title: `Debate ${debateId}: Technology's Impact on Society`,
    description: "Engage in a structured debate about whether technology has more positive or negative impacts on modern society.",
    topic: "Technology has done more harm than good to society",
    totalMarks: 50,
    participants: "Class participants",
    rules: [
      "Arguments must be presented in clear, formal English",
      "Keep statements concise and well-structured (max 200 words per post)",
      "Support your arguments with logical reasoning or examples",
      "Respect opposing viewpoints and maintain professional discourse",
      "Stay focused on the debate topic at all times",
      "No personal attacks or inappropriate language",
      "Each participant can post multiple arguments",
      "You can like/dislike and comment on other participants' statements"
    ]
  };

  const handleStartDebate = () => {
    if (!agreedToInstructions) {
      return;
    }
    navigate(`/debate-take/${debateId}?module=${moduleId}`);
  };

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} />
          Back
        </Button>
        <Badge variant="outline">Debate Instructions</Badge>
      </div>

      <div className="space-y-6">
        {/* Debate Header */}
        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2 text-red-800">{debateInfo.title}</CardTitle>
                <p className="text-red-700 text-lg font-medium mb-2">{debateInfo.description}</p>
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <p className="font-semibold text-red-800 mb-1">Debate Topic:</p>
                  <p className="text-red-700 italic">"{debateInfo.topic}"</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Debate Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">Total Marks</span>
              </div>
              <p className="text-2xl font-bold text-primary">{debateInfo.totalMarks}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="font-medium">Participants</span>
              </div>
              <p className="text-sm font-medium text-green-500">{debateInfo.participants}</p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Debate Rules & Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Important Guidelines</span>
              </div>
              <ul className="space-y-2">
                {debateInfo.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="font-medium text-blue-600 mt-0.5">{index + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">How to Participate:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Choose your stance: FOR or AGAINST the topic</li>
                <li>• Post your arguments in the discussion area</li>
                <li>• Engage with other participants by liking/disliking their posts</li>
                <li>• Add thoughtful comments to build on the discussion</li>
                <li>• Submit your debate when you're ready</li>
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
                  I agree to all the above instructions and rules
                </label>
                <p className="text-xs text-muted-foreground">
                  You must agree to the instructions before starting the debate
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
            onClick={handleStartDebate}
            disabled={!agreedToInstructions}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Debate
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DebateInstructionPage;