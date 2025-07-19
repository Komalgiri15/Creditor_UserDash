import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

export function EssayViewDialog({ open, onOpenChange, essay }) {
  if (!essay) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold mb-2">{essay.title}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{essay.submittedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{essay.wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>John Doe</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={essay.status === "submitted" ? "default" : "outline"}>
                {essay.status}
              </Badge>
              {essay.score && (
                <Badge variant="secondary">
                  {essay.score}/{essay.maxScore}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {essay.content}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EssayViewDialog;