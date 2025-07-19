import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  MessageSquare,
  Users,
  Clock,
  Send,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { toast } from "sonner";

export function DebateView() {
  const { debateId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [selectedSide, setSelectedSide] = useState("for"); // "for" | "against"

  /* ------------------------------------------------------------------ */
  /* ---------------------------- SAMPLE DATA -------------------------- */
  /* ------------------------------------------------------------------ */
  const debate = {
    id: debateId,
    title: "Hooks vs Class Components: Which is Better?",
    description:
      "Participate in a structured debate about the advantages and disadvantages of React Hooks versus Class Components",
    startTime: "2024-02-15 10:00 AM",
    endTime: "2024-02-20 11:59 PM",
    participants: 12,
    status: "active"
  };

  const [messages] = useState([
    {
      id: "1",
      author: "Sarah Johnson",
      message:
        "React Hooks provide a more functional approach to React development. They eliminate the need for class components and make code more reusable through custom hooks.",
      timestamp: "2024-02-15 10:30 AM",
      side: "for",
      likes: 8,
      dislikes: 2
    },
    {
      id: "2",
      author: "Mike Chen",
      message:
        "While hooks are useful, class components provide better lifecycle control and are more familiar to developers coming from OOP backgrounds. The learning curve for hooks can be steep.",
      timestamp: "2024-02-15 11:15 AM",
      side: "against",
      likes: 5,
      dislikes: 4
    },
    {
      id: "3",
      author: "Emily Davis",
      message:
        "Custom hooks allow for incredible code reusability. You can extract stateful logic and share it between components easily, which is much harder with class components.",
      timestamp: "2024-02-15 02:45 PM",
      side: "for",
      likes: 12,
      dislikes: 1
    }
  ]);

  /* ------------------------------------------------------------------ */
  /* ------------------------- HANDLER FUNCTIONS ----------------------- */
  /* ------------------------------------------------------------------ */
  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success("Message posted to debate!");
    setNewMessage("");
  };

  const handleVote = (messageId, type) => {
    toast.success(`${type === "like" ? "Liked" : "Disliked"} message`);
  };

  /* ------------------------------------------------------------------ */
  const forMessages = messages.filter((m) => m.side === "for");
  const againstMessages = messages.filter((m) => m.side === "against");

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1">
        <div className="container py-6 max-w-7xl">
          {/* Back button */}
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeft size={16} />
              Back
            </Button>
          </div>

          <div className="space-y-6">
            {/* --------------------------- HEADER ------------------------- */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{debate.title}</CardTitle>
                    <p className="text-muted-foreground">{debate.description}</p>
                  </div>
                  <Badge variant="default">Active Debate</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Started: {debate.startTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Ends: {debate.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{debate.participants} Participants</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* ----------------------- ARGUMENT COLUMNS ------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FOR side */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                    Arguments FOR Hooks ({forMessages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {forMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg"
                    >
                      <MessageItem
                        message={msg}
                        onVote={(type) => handleVote(msg.id, type)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AGAINST side */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    Arguments AGAINST Hooks ({againstMessages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {againstMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg"
                    >
                      <MessageItem
                        message={msg}
                        onVote={(type) => handleVote(msg.id, type)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* --------------------- POST NEW ARGUMENT -------------------- */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  Join the Debate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedSide === "for" ? "default" : "outline"}
                    onClick={() => setSelectedSide("for")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    Argue FOR Hooks
                  </Button>
                  <Button
                    variant={selectedSide === "against" ? "default" : "outline"}
                    onClick={() => setSelectedSide("against")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    Argue AGAINST Hooks
                  </Button>
                </div>

                <div className="space-y-3">
                  <Textarea
                    placeholder={`Share your argument ${
                      selectedSide === "for" ? "supporting" : "opposing"
                    } React Hooks...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSendMessage} className="flex items-center gap-2">
                      <Send size={16} />
                      Post Argument
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* ----------------------- MESSAGE ITEM SUBCOMPONENT ------------------ */
/* -------------------------------------------------------------------- */
function MessageItem({ message, onVote }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>
          {message.author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{message.author}</span>
          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
        </div>
        <p className="text-sm mb-2">{message.message}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote("like")}
            className="h-6 px-2"
          >
            <ThumbsUp size={12} />
            <span className="ml-1 text-xs">{message.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote("dislike")}
            className="h-6 px-2"
          >
            <ThumbsDown size={12} />
            <span className="ml-1 text-xs">{message.dislikes}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DebateView;