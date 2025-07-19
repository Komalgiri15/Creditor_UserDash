import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, Video } from "lucide-react";
import { toast } from "sonner";

const upcomingClasses = [
  {
    id: "1",
    title: "Contract Law Fundamentals",
    date: "2025-06-17",
    time: "2:00 PM",
    instructor: "Prof. Sarah Wilson",
    duration: "2h",
    zoomLink: "https://zoom.us/j/demo123",
    isDemo: true
  },
  {
    id: "2",
    title: "Constitutional Rights Review",
    date: "2025-06-18",
    time: "10:00 AM",
    instructor: "Prof. Michael Chen",
    duration: "1h 30m",
    zoomLink: "https://zoom.us/j/demo456",
    isDemo: true
  },
  {
    id: "3",
    title: "Criminal Procedure Workshop",
    date: "2025-06-19",
    time: "3:30 PM",
    instructor: "Prof. Emily Rodriguez",
    duration: "2h 15m",
    zoomLink: "https://zoom.us/j/demo789",
    isDemo: true
  }
];

export function UpcomingClassesSection() {
  const handleJoinClass = (className, zoomLink) => {
    toast.success(`Redirecting to ${className}...`);
    // In a real app, this would open the zoom link
    window.open(zoomLink, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Demo Upcoming Classes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingClasses.map((classItem) => (
            <div 
              key={classItem.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{classItem.title}</h4>
                  <Badge variant="outline" className="text-xs">Demo</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(classItem.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{classItem.time}</span>
                  </div>
                  <span>•</span>
                  <span>{classItem.duration}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Instructor: {classItem.instructor}
                </p>
              </div>
              <Button 
                onClick={() => handleJoinClass(classItem.title, classItem.zoomLink)}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                Join Class
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default UpcomingClassesSection;