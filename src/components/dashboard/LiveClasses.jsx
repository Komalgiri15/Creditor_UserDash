import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Play, Video, Clock, Calendar, Users, FileVideo } from "lucide-react";
import { AttendanceViewerModal } from "./AttendanceViewerModal";
import ClassRecording from "./ClassRecording";
import { getAuthHeader } from '../../services/authHeader'; // adjust path as needed
// Empty array - no recordings exist yet
const recordedSessions = [];

// Helper function to convert UTC time to user's timezone
const convertUTCToUserTimezone = (utcTime, userTimezone) => {
  if (!utcTime) return null;
  const date = new Date(utcTime);
  return new Date(date.toLocaleString("en-US", { timeZone: userTimezone }));
};

// Helper function to check if a date is today in user's timezone
const isTodayInUserTimezone = (dateString, userTimezone) => {
  const eventDate = convertUTCToUserTimezone(dateString, userTimezone);
  const now = convertUTCToUserTimezone(new Date().toISOString(), userTimezone);
  
  if (!eventDate || !now) return false;
  
  return (
    eventDate.getFullYear() === now.getFullYear() &&
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getDate() === now.getDate()
  );
};

// Helper function to format time in user's timezone
const formatTimeInUserTimezone = (utcTime, userTimezone) => {
  if (!utcTime) return '';
  const date = new Date(utcTime);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: userTimezone
  });
};

// Helper function to process events and expand recurring events
const processEvents = (events, userTimezone) => {
  const processedEvents = [];
  
  events.forEach(event => {
    if (event.isRecurring && Array.isArray(event.occurrences)) {
      // Handle recurring events - check each occurrence
      event.occurrences.forEach((occurrence, index) => {
        // Check if this occurrence is today in user's timezone
        if (isTodayInUserTimezone(occurrence.startTime, userTimezone)) {
          // Create a new event object for this occurrence
          const occurrenceEvent = {
            ...event,
            id: `${event.id}_occurrence_${index}`,
            startTime: occurrence.startTime,
            endTime: occurrence.endTime,
            isRecurring: true,
            originalEventId: event.id,
            occurrenceIndex: index
          };
          processedEvents.push(occurrenceEvent);
        }
      });
    } else if (event.startTime && event.endTime) {
      // Handle regular events
      if (isTodayInUserTimezone(event.startTime, userTimezone)) {
        processedEvents.push({
          ...event,
          isRecurring: false
        });
      }
    }
  });
  
  return processedEvents;
};

export function LiveClasses() {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todayEvents, setTodayEvents] = useState([]);
  const [cancelledEvents, setCancelledEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const userTimezone = localStorage.getItem('userTimezone') || 'America/Los_Angeles';

  // Fetch cancelled events
  const fetchCancelledEvents = async () => {
    try {
      // Get current time in UTC (API fetching time)
      const startTime = new Date().toISOString();
      
      // Get user's timezone end-of-day time converted to UTC
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Convert end-of-day to UTC
      const endTime = endOfDay.toISOString();
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/calendar/events/cancelledevents?startTime=${startTime}&endTime=${endTime}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch cancelled events: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        setCancelledEvents(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch cancelled events", err);
    }
  };

  // Fetch courses to map course IDs to course names
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          credentials: 'include',
        });
        const data = await response.json();
        if (data && data.data) {
          setCourses(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch live class events
  useEffect(() => {
    const fetchLiveClass = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();
        const params = new URLSearchParams({ startDate: start, endDate: end });

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          credentials: 'include',
        });
        const data = await response.json();

        if (data?.data?.length > 0) {
          // Process events to handle recurring events properly
          const processedEvents = processEvents(data.data, userTimezone);
          
          console.log('Processed events:', processedEvents);
          // Filter events for today in user's timezone
          const todayEvents = data.data.filter(event => {
            if (!event.startTime || !event.endTime) {
              return false;
            }

            const isToday = isTodayInUserTimezone(event.startTime, userTimezone);

            return isToday;
          });

          // Sort events by start time
          processedEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
          setTodayEvents(processedEvents);
        } else {
          setTodayEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setTodayEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClass();
    fetchCancelledEvents();
  }, [userTimezone]);

  // Update current time every second for smooth countdown
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the live status of events and remove ended events every second for smoother countdown
      setTodayEvents(prevEvents => {
        const now = currentTime; // Use current time state
        
        return prevEvents.filter(event => {
          const endTime = new Date(event.endTime);
          const isEnded = now > endTime;
          
          // Remove ended events
          if (isEnded) {
            return false;
          }
          
          return true;
        }).map(event => {
          const startTime = new Date(event.startTime);
          const endTime = new Date(event.endTime);
          const isLive = now >= startTime && now <= endTime;
          
          return {
            ...event,
            isLive
          };
        });
      });
    }, 1000); // refresh every 1 second for smoother countdown

    return () => clearInterval(interval);
  }, [currentTime]);

  const getEventStatus = (event) => {
    const now = new Date(); // Use current UTC time
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    if (now >= start && now <= end) {
      return { status: 'live', text: 'LIVE NOW', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' };
    } else if (now < start) {
      return { status: 'upcoming', text: 'UPCOMING', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    } else {
      return { status: 'ended', text: 'ENDED', color: 'text-gray-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const handleJoinClass = (event) => {
    const joinLink = event.description || event.zoomLink || "";
    if (joinLink) {
      window.open(joinLink, '_blank');
    }
  };

  const handleViewAllRecordings = () => {
    window.open(import.meta.env.VITE_RECORDINGS_DRIVE_URL, '_blank');
  };

  const liveEventsCount = todayEvents.filter(event => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return now >= start && now <= end;
  }).length;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className={`h-6 w-6 ${liveEventsCount > 0 ? 'text-purple-500 animate-pulse' : 'text-primary'}`} />
            Today's Live Classes
            {liveEventsCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                {liveEventsCount} Live
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading today's classes...</p>
            </div>
          ) : todayEvents.filter(event => {
            // Only show events that have not ended
            const now = new Date();
            const end = new Date(event.endTime);
            return now <= end;
          }).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No classes scheduled for today</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for upcoming classes</p>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Current timezone: {userTimezone}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Events are filtered based on your timezone preference
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {todayEvents
                .filter(event => {
                  // Only show events that have not ended
                  const now = new Date();
                  const end = new Date(event.endTime);
                  return now <= end;
                })
                .map((event, index) => {
                  const eventStatus = getEventStatus(event);
                  const isLive = eventStatus.status === 'live';
                  const isUpcoming = eventStatus.status === 'upcoming';
                  return (
                    <div
                      key={event.id || index}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        isLive 
                          ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 shadow-sm' 
                          : 'border-blue-200 bg-blue-50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              isLive ? 'bg-purple-500 animate-pulse' : 'bg-blue-500'
                            }`}></div>
                            <h4 className="font-semibold text-gray-800">{event.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isLive ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {eventStatus.text}
                            </span>
                            {event.isRecurring && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
                                Recurring
                              </span>
                            )}
                          </div>
                          {/* Show course name if available */}
                          {(event.courseName || event.courseId || event.course_id) && (
                            <span className="inline-block mb-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {event.courseName || courses.find(c => c.id === (event.courseId || event.course_id))?.title || (event.courseId || event.course_id)}
                            </span>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTimeInUserTimezone(event.startTime, userTimezone)} - {formatTimeInUserTimezone(event.endTime, userTimezone)}
                              </span>
                            </div>
                            {event.instructor && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{event.instructor}</span>
                              </div>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleJoinClass(event)}
                            disabled={!isLive}
                            className={`${
                              isLive 
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 animate-pulse' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            } text-white transition-all duration-300`}
                            size="sm"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            {isLive ? 'Join Now' : 'Class Not Started'}
                            {isLive && <ExternalLink className="w-3 h-3 ml-1" />}
                          </Button>
                          {isUpcoming && (
                            <div className="text-xs text-blue-600 text-center">
                              Starts in {(() => {
                                const timeDiff = new Date(event.startTime).getTime() - currentTime.getTime();
                                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                                
                                if (hours > 0) {
                                  return `${hours}h ${minutes}m ${seconds}s`;
                                } else if (minutes > 0) {
                                  return `${minutes}m ${seconds}s`;
                                } else {
                                  return `${seconds}s`;
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancelled Events Section - Only show if there are cancelled events */}
      {cancelledEvents && cancelledEvents.length > 0 && (
  <Card className="border border-red-100 bg-white hover:shadow-md transition-all duration-300">
    <CardHeader>
      <CardTitle className="flex items-center gap-3">
        <div className="p-2 bg-red-50 rounded-lg text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728" />
          </svg>
        </div>
        <div>
          <span className="text-lg font-semibold text-gray-800">Cancelled Classes</span>
          <div className="text-sm text-gray-500 font-medium">
            {cancelledEvents.length} cancelled session{cancelledEvents.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {cancelledEvents.map((cancelledEvent, i) => (
          <div key={cancelledEvent.id || i} className="group relative border-l-4 border-red-300 rounded-r-lg p-4 bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-800">
                    {cancelledEvent.event?.title || 'Untitled Event'}
                  </h4>
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-md">
                    Cancelled
                  </span>
                </div>
                
                {cancelledEvent.event?.course && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{cancelledEvent.event.course.title}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(cancelledEvent.occurrence_date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        timeZone: userTimezone 
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {new Date(cancelledEvent.occurrence_date).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        timeZone: userTimezone 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              

            </div>
            
            {cancelledEvent.reason && (
              <div className="mt-3 p-3 bg-red-50 rounded-md text-sm text-red-700">
                <div className="font-medium">Cancellation reason:</div>
                <div>{cancelledEvent.reason}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
    
  </Card>
)}
<ClassRecording/>
      <AttendanceViewerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />
      
    </div>
  );
}

export default LiveClasses;