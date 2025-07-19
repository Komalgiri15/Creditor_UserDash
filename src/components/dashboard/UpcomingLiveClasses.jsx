import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Users, ExternalLink, Bell, MapPin } from "lucide-react";
import { toast } from "sonner";

const upcomingClasses = [
  {
    id: "1",
    title: "Constitutional Law Deep Dive",
    instructor: "Prof. Sarah Wilson",
    date: "2025-06-19",
    time: "15:00", // 3:00 PM
    duration: "2h",
    zoomLink: "https://zoom.us/j/constitutional123",
    description: "Comprehensive analysis of constitutional amendments and their modern applications",
    attendees: 45,
    maxAttendees: 60,
    isLive: false,
    canJoin: false
  },
  {
    id: "2",
    title: "Criminal Procedure Workshop",
    instructor: "Prof. Michael Chen",
    date: "2025-06-20",
    time: "10:00", // 10:00 AM
    duration: "1h 30m",
    zoomLink: "https://zoom.us/j/criminal456",
    description: "Interactive workshop on criminal procedure rules and evidence handling",
    attendees: 38,
    maxAttendees: 50,
    isLive: false,
    canJoin: false
  },
  {
    id: "3",
    title: "Contract Law Case Studies",
    instructor: "Prof. Emily Rodriguez",
    date: "2025-06-21",
    time: "14:30", // 2:30 PM
    duration: "2h 15m",
    zoomLink: "https://zoom.us/j/contract789",
    description: "Real-world contract disputes and their legal implications",
    attendees: 52,
    maxAttendees: 65,
    isLive: false,
    canJoin: false
  },
  {
    id: "4",
    title: "Legal Research Methodology",
    instructor: "Prof. David Park",
    date: "2025-06-22",
    time: "11:00", // 11:00 AM
    duration: "1h 45m",
    zoomLink: "https://zoom.us/j/research101",
    description: "Advanced techniques for legal research and citation methods",
    attendees: 29,
    maxAttendees: 40,
    isLive: false,
    canJoin: false
  },
  {
    id: "5",
    title: "Civil Rights and Liberties",
    instructor: "Prof. Lisa Thompson",
    date: "2025-06-23",
    time: "16:00", // 4:00 PM
    duration: "2h",
    zoomLink: "https://zoom.us/j/civilrights202",
    description: "Evolution of civil rights law and contemporary challenges",
    attendees: 41,
    maxAttendees: 55,
    isLive: false,
    canJoin: false
  }
];

export function UpcomingLiveClasses() {
  const [classes, setClasses] = useState(upcomingClasses);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updatedClasses = classes.map(classItem => {
      const classDateTime = new Date(`${classItem.date}T${classItem.time}:00`);
      const classEndTime = new Date(classDateTime.getTime() + (2 * 60 * 60 * 1000)); // Assuming 2 hours max
      const now = currentTime;
      
      // Class is live if current time is within 15 minutes before and during the class
      const canJoinTime = new Date(classDateTime.getTime() - (15 * 60 * 1000)); // 15 minutes before
      const isLive = now >= classDateTime && now <= classEndTime;
      const canJoin = now >= canJoinTime && now <= classEndTime;

      return {
        ...classItem,
        isLive,
        canJoin
      };
    });

    setClasses(updatedClasses);
  }, [currentTime]);

  const handleJoinClass = (classItem) => {
    if (classItem.canJoin) {
      toast.success(`Joining ${classItem.title}...`);
      window.open(classItem.zoomLink, '_blank');
    } else {
      const classDateTime = new Date(`${classItem.date}T${classItem.time}:00`);
      const timeUntilClass = Math.floor((classDateTime.getTime() - currentTime.getTime()) / (1000 * 60));
      
      if (timeUntilClass > 0) {
        toast.info(`Class starts in ${timeUntilClass} minutes. Join button will be active 15 minutes before class.`);
      } else {
        toast.error("This class has already ended.");
      }
    }
  };

  const handleSetReminder = (classItem) => {
    toast.success(`Reminder set for ${classItem.title} on ${new Date(classItem.date).toLocaleDateString()}`);
  };

  const handleViewDetails = (classItem) => {
    toast.info(`${classItem.description}\n\nInstructor: ${classItem.instructor}\nAttendees: ${classItem.attendees}/${classItem.maxAttendees}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusBadge = (classItem) => {
    if (classItem.isLive) {
      return <Badge className="bg-red-500 text-white animate-pulse">LIVE NOW</Badge>;
    } else if (classItem.canJoin) {
      return <Badge className="bg-green-500 text-white">Join Available</Badge>;
    } else {
      return <Badge variant="outline">Scheduled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Upcoming Live Classes</h3>
          <p className="text-gray-600">Join your scheduled classes when they go live</p>
        </div>
        <div className="text-sm text-gray-500">
          Current Time: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      <div className="grid gap-4">
        {classes.map((classItem) => (
          <Card 
            key={classItem.id} 
            className={`transition-all duration-300 hover:shadow-lg border-l-4 ${
              classItem.isLive 
                ? 'border-l-red-500 bg-red-50/30 shadow-red-100' 
                : classItem.canJoin 
                ? 'border-l-green-500 bg-green-50/30 shadow-green-100'
                : 'border-l-blue-500 hover:bg-blue-50/30'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => handleViewDetails(classItem)}>
                        {classItem.title}
                      </h4>
                      <p className="text-sm text-gray-600">with {classItem.instructor}</p>
                    </div>
                    {getStatusBadge(classItem)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{formatDate(classItem.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span>{formatTime(classItem.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span>{classItem.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>{classItem.attendees}/{classItem.maxAttendees}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {classItem.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleJoinClass(classItem)}
                    disabled={!classItem.canJoin}
                    className={`${
                      classItem.isLive 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : classItem.canJoin 
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-400'
                    } text-white transition-all duration-300`}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {classItem.isLive ? 'Join Live' : classItem.canJoin ? 'Join Class' : 'Not Available'}
                    {classItem.canJoin && <ExternalLink className="w-3 h-3 ml-1" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetReminder(classItem)}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <Bell className="w-4 h-4 mr-1" />
                    Remind Me
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default UpcomingLiveClasses;