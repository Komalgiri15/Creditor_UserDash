import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const todaysEvents = [
  {
    id: "1",
    title: "Team Meeting",
    time: "10:00 AM",
    meetingLink: "https://zoom.us/j/teammeeting123"
  },
  {
    id: "2",
    title: "Course Review",
    time: "2:00 PM",
    meetingLink: "https://zoom.us/j/coursereview456"
  }
];

const upcomingEvents = [
  {
    id: "1",
    title: "Project Deadline",
    day: "Friday",
    meetingLink: "https://zoom.us/j/projectdeadline789"
  },
  {
    id: "2",
    title: "Monthly Report",
    day: "Next Monday",
    meetingLink: "https://zoom.us/j/monthlyreport012"
  }
];

export function CalendarModal({ open, onOpenChange }) {
  const handleJoinMeeting = (link) => {
    window.open(link, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-white rounded-xl shadow-lg">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="h-5 w-5 text-gray-700" />
            Calendar & Events
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Today's Events */}
          <div>
            <h3 className="text-base font-medium text-blue-600 mb-3">Today's Events</h3>
            <div className="space-y-3">
              {todaysEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 font-medium">
                      {event.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-blue-600 font-medium">
                        {event.time}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleJoinMeeting(event.meetingLink)}
                      >
                        Join
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming This Week */}
          <div>
            <h3 className="text-base font-medium text-green-600 mb-3">Upcoming This Week</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-100"
                >
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 font-medium">
                      {event.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-green-600 font-medium">
                        {event.day}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleJoinMeeting(event.meetingLink)}
                      >
                        Join
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CalendarModal;