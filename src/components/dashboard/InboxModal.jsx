import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";

const messages = [
  {
    id: "1",
    title: "Course Enrollment Confirmation",
    from: "Admin Team",
    content: "Your enrollment in Advanced Credit Analysis has been confirmed.",
    timestamp: "2h ago",
    color: "border-l-blue-500 bg-blue-50"
  },
  {
    id: "2",
    title: "Assignment Submitted",
    from: "System",
    content: "Your assignment for Module 3 has been successfully submitted.",
    timestamp: "1d ago",
    color: "border-l-green-500 bg-green-50"
  },
  {
    id: "3",
    title: "Upcoming Deadline",
    from: "Course Instructor",
    content: "Reminder: Final project due in 3 days.",
    timestamp: "2d ago",
    color: "border-l-yellow-500 bg-yellow-50"
  }
];

export function InboxModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 bg-white rounded-xl shadow-lg">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Mail className="h-5 w-5 text-gray-700" />
            Inbox Messages
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border-l-4 ${message.color} transition-all duration-200 hover:shadow-sm cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {message.title}
                </h4>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {message.timestamp}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">
                From: {message.from}
              </p>
              <p className="text-sm text-gray-700">
                {message.content}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InboxModal;