import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, UserCheck, UserX, Calendar, Play, Eye, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { AttendanceViewerModal } from "./AttendanceViewerModal";
import { UpcomingLiveClasses } from "./UpcomingLiveClasses";

// Mock data for attendance and recordings
const attendanceData = [
  { date: "2025-06-08", status: "present", topic: "Constitutional Rights" },
  { date: "2025-06-05", status: "absent", topic: "Civil Procedure" },
  { date: "2025-06-03", status: "present", topic: "Criminal Law Basics" },
  { date: "2025-06-01", status: "present", topic: "Legal Research Methods" },
];

const recordedSessions = [
  {
    id: "1",
    title: "Constitutional Rights Deep Dive",
    date: "2025-06-08",
    duration: "1h 45m",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=400",
    driveLink: "https://drive.google.com/file/d/1ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "2",
    title: "Civil Procedure Fundamentals",
    date: "2025-06-05",
    duration: "2h 15m",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400",
    driveLink: "https://drive.google.com/file/d/2ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
  {
    id: "3",
    title: "Criminal Law Case Studies",
    date: "2025-06-03",
    duration: "1h 30m",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400",
    driveLink: "https://drive.google.com/file/d/3ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg/view"
  },
];

export function LiveClasses() {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const isClassActive = false; // This will be controlled later

  const handleVideoClick = (driveLink) => {
    window.open(driveLink, '_blank');
  };

  const handleCheckAttendance = () => {
    setIsAttendanceModalOpen(true);
  };

  const handleViewAllRecordings = () => {
    // Redirect to main Google Drive folder containing all recordings
    window.open('https://drive.google.com/drive/folders/1ABCDEFGHIJKLMNOPQRSTUVWXYZ_recordings', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Join Class Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary animate-pulse" />
            Live Class Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {isClassActive ? "Class is now in session" : "No active class right now"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Next class: Today at 3:00 PM - Constitutional Law Deep Dive
              </p>
            </div>
            <Button 
              disabled={!isClassActive}
              className={isClassActive ? "bg-green-600 hover:bg-green-700 animate-pulse" : ""}
              size="lg"
            >
              <Video className="h-4 w-4 mr-2" />
              {isClassActive ? "Join Live Class" : "No Active Class"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Upcoming Classes
        </button>
        <button
          onClick={() => setActiveTab('recordings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'recordings'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Play className="w-4 h-4 inline mr-2" />
          Class Recordings
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'upcoming' ? (
        <UpcomingLiveClasses />
      ) : (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Class Recordings
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleViewAllRecordings}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recordedSessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-all cursor-pointer group"
                  onClick={() => handleVideoClick(session.driveLink)}
                >
                  <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={session.thumbnail} 
                      alt={session.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                      <ExternalLink className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {session.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <AttendanceViewerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />
    </div>
  );
}

export default LiveClasses;