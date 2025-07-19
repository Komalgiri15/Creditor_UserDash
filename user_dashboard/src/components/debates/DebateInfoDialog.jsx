import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MessageSquare, Calendar, Award } from "lucide-react";

export function DebateInfoDialog({ open, onOpenChange, debate }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Debate Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Debate Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{debate.title}</CardTitle>
                <Badge variant={debate.status === "active" ? "default" : "outline"}>
                  {debate.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{debate.description}</p>
            </CardContent>
          </Card>

          {/* Debate Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar size={20} />
                Schedule & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {debate.startTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm">Start Time: {debate.startTime}</span>
                </div>
              )}
              {debate.endTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm">End Time: {debate.endTime}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm">{debate.participants} participants joined</span>
              </div>
            </CardContent>
          </Card>

          {/* Debate Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} />
                Debate Rules & Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Choose a side (FOR or AGAINST) before posting arguments</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Support your arguments with evidence and examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Be respectful to other participants</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Vote on arguments using the like/dislike buttons</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Quality of arguments matters more than quantity</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Scoring System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award size={20} />
                Scoring & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Participation:</span>
                  <span className="font-medium">10 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality argument:</span>
                  <span className="font-medium">5-15 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Peer votes (likes):</span>
                  <span className="font-medium">1 point each</span>
                </div>
                <div className="flex justify-between">
                  <span>Best argument award:</span>
                  <span className="font-medium">25 points</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DebateInfoDialog;