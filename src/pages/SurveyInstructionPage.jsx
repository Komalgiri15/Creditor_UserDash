import React from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";

export function SurveyInstructionPage() {
  const { surveyId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');

  const surveyInfo = {
    "1": {
      title: "Module Learning Experience Survey",
      description: "Help us improve this module by sharing your learning experience and feedback.",
      estimatedTime: "5-10 minutes",
      questions: 5,
      type: "Module Feedback"
    },
    "2": {
      title: "Course Content Evaluation Survey",
      description: "Evaluate the course content, materials, and overall learning outcomes.",
      estimatedTime: "8-12 minutes", 
      questions: 6,
      type: "Content Evaluation"
    }
  };

  const currentSurvey = surveyInfo[surveyId] || surveyInfo["1"];

  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ChevronLeft size={16} />
            Back to Assessments
          </Link>
        </Button>
        <Badge variant="default" className="bg-orange-600">
          Survey Instructions
        </Badge>
      </div>

      {/* Survey Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              {currentSurvey.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {currentSurvey.description}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
            <Clock size={16} className="text-orange-500" />
            <div>
              <div className="font-medium text-sm">Duration</div>
              <div className="text-xs text-muted-foreground">{currentSurvey.estimatedTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
            <FileText size={16} className="text-blue-500" />
            <div>
              <div className="font-medium text-sm">Questions</div>
              <div className="text-xs text-muted-foreground">{currentSurvey.questions} questions</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
            <CheckCircle size={16} className="text-green-500" />
            <div>
              <div className="font-medium text-sm">Type</div>
              <div className="text-xs text-muted-foreground">{currentSurvey.type}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            Survey Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700">Please Do:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Complete all questions with pure intentions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Provide clear and honest answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Share your genuine learning experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Take your time to think about each question</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-700">Important Notes:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>This is a feedback survey for module improvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>No pressure - answer based on your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Multiple options can be selected for each question</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Additional comments are optional but appreciated</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800 font-medium">
              📋 Your feedback helps us understand what's working well and what can be improved in this module. 
              Please answer honestly to help us create a better learning experience for everyone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Start Button */}
      <div className="flex gap-4">
        <Button variant="outline" asChild className="flex-1">
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ChevronLeft size={16} className="mr-2" />
            Back to Assessments
          </Link>
        </Button>
        <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
          <Link to={`/survey/${moduleId}/${surveyId}`}>
            Agree & Continue
            <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default SurveyInstructionPage;