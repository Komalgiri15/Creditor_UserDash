import React from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, PenTool, RefreshCw, ChevronLeft, Trophy, FileText, Target, Timer } from "lucide-react";

export function EssayResultsPage() {
  const { essayId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const score = parseInt(searchParams.get('score') || '85');
  const timeSpent = parseInt(searchParams.get('timeSpent') || '5400');
  const wordCount = parseInt(searchParams.get('wordCount') || '950');

  const essayInfo = {
    title: `Essay ${essayId}: Technology and Society`,
    maxScore: 100,
    timeLimit: "2 hours",
    attempts: 2,
    attemptsUsed: 1
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return { text: "Excellent", color: "bg-green-600" };
    if (score >= 80) return { text: "Good", color: "bg-blue-600" };
    if (score >= 70) return { text: "Satisfactory", color: "bg-yellow-600" };
    return { text: "Needs Improvement", color: "bg-red-600" };
  };

  const scoreBadge = getScoreBadge(score);

  const feedback = [
    {
      category: "Content Quality",
      score: 28,
      maxScore: 30,
      comment: "Excellent analysis of technology's impact on society. Well-researched arguments with relevant examples."
    },
    {
      category: "Structure & Organization",
      score: 22,
      maxScore: 25,
      comment: "Good essay structure with clear introduction and conclusion. Some paragraphs could be better connected."
    },
    {
      category: "Critical Thinking",
      score: 17,
      maxScore: 20,
      comment: "Demonstrates good analytical skills. Consider exploring counterarguments for deeper analysis."
    },
    {
      category: "Language & Grammar",
      score: 13,
      maxScore: 15,
      comment: "Generally well-written with minor grammatical errors. Good vocabulary usage throughout."
    },
    {
      category: "Word Count & Formatting",
      score: 5,
      maxScore: 10,
      comment: "Met word count requirements. Good use of formatting for emphasis."
    }
  ];

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
        <Badge variant="default" className={scoreBadge.color}>
          Essay Results
        </Badge>
      </div>

      {/* Results Header */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Essay Completed!
              </h1>
              <p className="text-muted-foreground text-lg">
                {essayInfo.title}
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-sm text-muted-foreground">out of {essayInfo.maxScore}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <Badge className={`text-lg py-2 px-4 ${scoreBadge.color}`}>
            <CheckCircle size={20} className="mr-2" />
            {scoreBadge.text}
          </Badge>
        </div>
      </div>

      {/* Score Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={24} className="text-purple-500" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.category}</span>
                <span className="text-sm font-bold">
                  {item.score}/{item.maxScore}
                </span>
              </div>
              <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground">{item.comment}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Timer size={32} className="mx-auto text-blue-500 mb-3" />
            <div className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
            <div className="text-xs text-muted-foreground mt-1">
              out of {essayInfo.timeLimit}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText size={32} className="mx-auto text-green-500 mb-3" />
            <div className="text-2xl font-bold text-green-600">{wordCount}</div>
            <div className="text-sm text-muted-foreground">Words Written</div>
            <div className="text-xs text-muted-foreground mt-1">
              Target: 800-1000 words
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <RefreshCw size={32} className="mx-auto text-orange-500 mb-3" />
            <div className="text-2xl font-bold text-orange-600">
              {essayInfo.attempts - essayInfo.attemptsUsed}
            </div>
            <div className="text-sm text-muted-foreground">Attempts Left</div>
            <div className="text-xs text-muted-foreground mt-1">
              out of {essayInfo.attempts} total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Feedback */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool size={24} className="text-green-500" />
            Overall Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
            <p className="text-sm leading-relaxed text-gray-700">
              <strong>Strengths:</strong> Your essay demonstrates a solid understanding of technology's impact on society. 
              You've provided relevant examples and maintained good structure throughout. The arguments are well-developed 
              and show critical thinking.
            </p>
            <p className="text-sm leading-relaxed text-gray-700 mt-3">
              <strong>Areas for Improvement:</strong> Consider strengthening paragraph transitions and exploring 
              counterarguments to provide a more balanced perspective. Minor grammar improvements would enhance readability.
            </p>
            <p className="text-sm leading-relaxed text-gray-700 mt-3">
              <strong>Next Steps:</strong> Great work overall! For future essays, focus on deeper analysis and 
              consider multiple perspectives on complex topics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" asChild className="flex-1">
          <Link to={`/courses/module/${moduleId}/assessments`}>
            <ChevronLeft size={16} className="mr-2" />
            Back to Assessments
          </Link>
        </Button>
        {essayInfo.attemptsUsed < essayInfo.attempts && (
          <Button asChild className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Link to={`/essay-instruction/${essayId}?module=${moduleId}`}>
              <RefreshCw size={16} className="mr-2" />
              Retake Essay
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default EssayResultsPage;