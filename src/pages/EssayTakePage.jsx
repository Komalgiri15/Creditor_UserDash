import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Clock, PenTool, Send, AlertTriangle, Bold, Italic, Underline, Save, CheckCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function EssayTakePage() {
  const { essayId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('module');
  const navigate = useNavigate();
  
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [essayContent, setEssayContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const editorRef = useRef(null);

  const essayInfo = {
    title: `Essay ${essayId}: Technology and Society`,
    topic: "Write a comprehensive essay on the impact of technology on modern society and human relationships.",
    maxScore: 100,
    timeLimit: "2 hours",
    wordLimit: "800-1000 words"
  };

  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Time's up! Essay will be auto-submitted.");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  useEffect(() => {
    // Count words in the essay content
    const text = essayContent.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [essayContent]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFormatting = (command) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      setEssayContent(editorRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setEssayContent(editorRef.current.innerHTML);
    }
  };

  const handleSave = () => {
    toast.success("Essay saved as draft");
  };

  const handleSubmit = () => {
    if (essayContent.trim().length === 0) {
      toast.error("Please write your essay before submitting.");
      return;
    }

    if (wordCount < 800) {
      toast.error("Essay must be at least 800 words long.");
      return;
    }

    if (wordCount > 1000) {
      toast.error("Essay exceeds the maximum word limit of 1000 words.");
      return;
    }

    // Show submission confirmation instead of navigating to results
    setIsSubmitted(true);
    toast.success("Essay submitted successfully!");
  };

  const timeProgress = ((7200 - timeRemaining) / 7200) * 100;
  const wordProgress = (wordCount / 1000) * 100;

  if (isSubmitted) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-purple-600" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-purple-600">Essay Submitted Successfully!</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Your essay has been submitted and is now in the evaluation phase. 
              Our instructors will review your work and provide detailed feedback on your writing.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <PenTool className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">What happens next?</span>
              </div>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Your essay will be reviewed within 24-48 hours</li>
                <li>• You'll receive detailed feedback on your writing</li>
                <li>• Results will be available in your dashboard</li>
                <li>• You'll be notified via email when ready</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-w-sm mx-auto">
              <div className="text-sm text-gray-600">
                <p><strong>Word Count:</strong> {wordCount} words</p>
                <p><strong>Time Taken:</strong> {formatTime(7200 - timeRemaining)}</p>
              </div>
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
              className="bg-purple-600 hover:bg-purple-700"
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
          <Badge variant="default" className="bg-purple-600">
            Essay in Progress
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Time Remaining</div>
            <div className={`text-lg font-bold ${timeRemaining < 600 ? 'text-red-600' : 'text-purple-600'}`}>
              <Clock size={16} className="inline mr-1" />
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Time Progress</span>
            <span>{Math.round(timeProgress)}%</span>
          </div>
          <Progress value={timeProgress} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Word Count: {wordCount}/1000</span>
            <span className={wordCount >= 800 && wordCount <= 1000 ? 'text-green-600' : 'text-orange-600'}>
              {wordCount >= 800 && wordCount <= 1000 ? 'Perfect' : wordCount < 800 ? 'Too Short' : 'Too Long'}
            </span>
          </div>
          <Progress value={Math.min(wordProgress, 100)} className="h-2" />
        </div>
      </div>

      {/* Essay Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{essayInfo.title}</CardTitle>
              <p className="text-muted-foreground mt-1">Word Limit: {essayInfo.wordLimit}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{essayInfo.maxScore}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Essay Topic */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PenTool size={24} className="text-purple-500" />
            Essay Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
            <p className="text-lg leading-relaxed text-gray-700 font-medium">
              {essayInfo.topic}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Text Editor */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Write Your Essay</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleFormatting('bold')}>
                <Bold size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFormatting('italic')}>
                <Italic size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFormatting('underline')}>
                <Underline size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[400px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{ 
              lineHeight: '1.6',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
            onInput={handleContentChange}
            suppressContentEditableWarning={true}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Use the formatting buttons above to bold, italicize, or underline text. Current word count: {wordCount}
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Before Submitting</p>
          <ul className="text-sm text-amber-700 mt-1 space-y-1">
            <li>• Ensure your essay meets the word count requirement (800-1000 words)</li>
            <li>• Review your essay for grammar and spelling errors</li>
            <li>• Check that your arguments are well-supported with examples</li>
            <li>• Once submitted, you cannot modify your essay</li>
            <li>• Make sure your essay has a clear introduction, body, and conclusion</li>
          </ul>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1" onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit} className="flex-1 bg-purple-600 hover:bg-purple-700">
          <Send size={16} className="mr-2" />
          Submit Essay
        </Button>
      </div>
    </div>
  );
}

export default EssayTakePage;