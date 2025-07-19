import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Send,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User
} from "lucide-react";
import { toast } from "sonner";

export function DebateTakePage() {
  const { debateId } = useParams();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("module");
  const navigate = useNavigate();

  const [currentPost, setCurrentPost] = useState("");
  const [posts, setPosts] = useState([
    {
      id: "1",
      author: "Sarah Johnson",
      content:
        "Technology has revolutionized communication, allowing us to connect with people worldwide instantly. This has broken down geographical barriers and created global communities that share knowledge and support each other.",
      side: "for",
      timestamp: "2 hours ago",
      likes: 12,
      dislikes: 3
    },
    {
      id: "2",
      author: "Alex Rodriguez",
      content:
        "While technology connects us globally, it has also led to decreased face-to-face interactions and weakened local community bonds. Many people now prefer virtual relationships over real-world connections.",
      side: "against",
      timestamp: "1 hour ago",
      likes: 8,
      dislikes: 5
    },
    {
      id: "3",
      author: "Emily Davis",
      content:
        "Technology has democratized education and information access. Online learning platforms and digital libraries have made quality education available to people regardless of their economic status or location.",
      side: "for",
      timestamp: "45 minutes ago",
      likes: 15,
      dislikes: 2
    }
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // User is assigned to participate "FOR" the topic by instructor
  const userSide = "for";

  const debateInfo = {
    title: `Debate ${debateId}: Technology's Impact on Society`,
    topic: "Technology has done more harm than good to society",
    description:
      "Discuss whether technology has had a more positive or negative impact on modern society, considering factors like social relationships, mental health, privacy, and economic inequality.",
    totalMarks: 50
  };

  const handlePostSubmit = () => {
    if (currentPost.trim() && !isSubmitted) {
      const newPost = {
        id: Date.now().toString(),
        author: "You",
        content: currentPost.trim(),
        side: userSide,
        timestamp: "Just now",
        likes: 0,
        dislikes: 0
      };

      setPosts((prev) => [newPost, ...prev]);
      setCurrentPost("");
      toast.success("Your argument has been posted!");
    }
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes,
              isLiked: !post.isLiked,
              isDisliked: false
            }
          : post
      )
    );
  };

  const handleDislike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes + 1,
              likes: post.isLiked ? post.likes - 1 : post.likes,
              isDisliked: !post.isDisliked,
              isLiked: false
            }
          : post
      )
    );
  };

  const handleSubmitDebate = () => {
    setIsSubmitted(true);
    toast.success("Debate submitted successfully!");
  };

  /* -------------------------------------------------------------------- */
  /* -------------------------- SUBMITTED VIEW --------------------------- */
  /* -------------------------------------------------------------------- */
  if (isSubmitted) {
    return (
      <div className="container py-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-600">
              Debate Completed Successfully!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              You have completed the debate and your response is in the
              evaluation phase. We will get back to you with your result
              shortly.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Evaluation in Progress
                </span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your arguments are being reviewed</li>
                <li>• Participation quality is being assessed</li>
                <li>• Results will be available soon</li>
                <li>• Check your dashboard for updates</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() =>
                navigate(`/courses/module/${moduleId}/assessments`)
              }
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to Assessments
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------- */
  /* ------------------------- ACTIVE DEBATE VIEW ------------------------ */
  /* -------------------------------------------------------------------- */
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} />
          Back
        </Button>
        <Badge variant="outline">Debate in Progress</Badge>
        <Badge variant="default" className="bg-green-600">
          You are arguing: FOR
        </Badge>
      </div>

      {/* Debate Topic */}
      <Card className="mb-6 border-2 border-red-200 bg-red-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 text-red-800">
                {debateInfo.title}
              </CardTitle>
              <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
                <p className="font-semibold text-red-800 mb-1">
                  Debate Topic:
                </p>
                <p className="text-red-700 italic text-lg">
                  "{debateInfo.topic}"
                </p>
              </div>
              <p className="text-red-700">{debateInfo.description}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-white">
                {debateInfo.totalMarks} marks
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Post Your Thoughts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            Post Your Thoughts on the Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Share your supporting argument here..."
              value={currentPost}
              onChange={(e) => setCurrentPost(e.target.value)}
              className="min-h-[120px]"
              disabled={isSubmitted}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Keep your arguments clear and well-structured (max 200 words)
              </p>
              <Button
                onClick={handlePostSubmit}
                disabled={!currentPost.trim() || isSubmitted}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                Post Argument
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debate Discussion */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">
          Debate Discussion ({posts.length} posts)
        </h3>

        {posts.map((post) => (
          <Card
            key={post.id}
            className={`border-l-4 ${
              post.side === "for" ? "border-l-green-500" : "border-l-red-500"
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{post.author}</span>
                    <Badge
                      variant={post.side === "for" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {post.side === "for" ? "FOR" : "AGAINST"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.timestamp}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{post.content}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`h-8 ${post.isLiked ? "text-green-600" : ""}`}
                    >
                      <ThumbsUp size={14} className="mr-1" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDislike(post.id)}
                      className={`h-8 ${post.isDisliked ? "text-red-600" : ""}`}
                    >
                      <ThumbsDown size={14} className="mr-1" />
                      {post.dislikes}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmitDebate}
          className="bg-green-600 hover:bg-green-700 px-8"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Submit Debate
        </Button>
      </div>
    </div>
  );
}

export default DebateTakePage;