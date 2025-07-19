import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

export function VideoViewerModal({ isOpen, onClose, video }) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{video.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-white">
              <Play size={48} className="mx-auto mb-4" />
              <p>Video player would be displayed here</p>
              <p className="text-sm text-gray-300 mt-2">Duration: {video.duration}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Recorded: {new Date(video.date).toLocaleDateString()}</span>
            <span>Duration: {video.duration}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VideoViewerModal;