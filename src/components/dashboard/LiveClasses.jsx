import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Play, Video, Clock, Calendar, Users, X } from "lucide-react";
import { AttendanceViewerModal } from "./AttendanceViewerModal";
import { getCancelledEvents, getTodayEvents } from "@/services/calendarService";

export function LiveClasses() {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todayEvents, setTodayEvents] = useState([]);
  const [cancelledEvents, setCancelledEvents] = useState([]);
  const [courses, setCourses] = useState([]);

  const userTimezone = localStorage.getItem('userTimezone') || 'America/Los_Angeles';

  // Fetch courses to map course IDs to course names
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await response.json();
        setCourses(data.data || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch today's events using the calendarService
  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        setLoading(true);
        const events = await getTodayEvents();
        setTodayEvents(events);
      } catch (error) {
        console.error('Failed to fetch today\'s events:', error);
        setTodayEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayEvents();
  }, []);

  // Fetch cancelled events
  useEffect(() => {
    const fetchCancelledEvents = async () => {
      try {
        const cancelledData = await getCancelledEvents(userTimezone);
        setCancelledEvents(cancelledData);
      } catch (error) {
        console.error('Failed to fetch cancelled events:', error);
      }
    };

    fetchCancelledEvents();
  }, [userTimezone]);

  // Filter out events that have ended
  const activeEvents = todayEvents.filter(event => {
    const now = new Date();
    const end = new Date(event.endTime);
    const isEnded = now > end;
    
    if (isEnded) {
      return false;
    }
    
    return true;
  });

  // Calculate live events count
  const liveEventsCount = activeEvents.filter(event => {
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
              <p className="text-sm text-muted-foreground mt-2">Loading events...</p>
            </div>
          ) : activeEvents.length === 0 && cancelledEvents.length === 0 ? (
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No classes scheduled</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for upcoming classes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeEvents
                .filter(event => {
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
                          ? 'border-purple-300 bg-purple-50 shadow-lg'
                          : isUpcoming
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{event.title}</h3>
                            {isLive && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full animate-pulse">
                                LIVE
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>
                                {formatTimeInUserTimezone(event.startTime, userTimezone)} - 
                                {formatTimeInUserTimezone(event.endTime, userTimezone)}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.instructor && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{event.instructor}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {event.description && event.description.includes('meet.google.com') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(event.description, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsAttendanceModalOpen(true)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {/* Cancelled Events Section */}
              {cancelledEvents.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <X className="w-4 h-4 mr-2 text-red-500" />
                    Cancelled Classes
                  </h4>
                  <div className="space-y-3">
                    {cancelledEvents.map((event, index) => (
                      <div
                        key={event.id || index}
                        className="p-4 rounded-lg border border-red-200 bg-red-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 line-through">{event.title}</h3>
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                                CANCELLED
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mb-3 line-through">{event.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>
                                  {formatTimeInUserTimezone(event.startTime, userTimezone)} - 
                                  {formatTimeInUserTimezone(event.endTime, userTimezone)}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.instructor && (
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  <span>{event.instructor}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-red-600">
                              Cancelled on {new Date(event.cancelledAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AttendanceViewerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
      />
    </div>
  );
}

// Helper functions
function getEventStatus(event) {
  const now = new Date();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  
  if (now >= start && now <= end) {
    return { status: 'live', text: 'Live Now' };
  } else if (now < start) {
    return { status: 'upcoming', text: 'Upcoming' };
  } else {
    return { status: 'ended', text: 'Ended' };
  }
}

function formatTimeInUserTimezone(utcTime, userTimezone) {
  if (!utcTime) return '';
  
  try {
    const date = new Date(utcTime);
    return date.toLocaleString('en-US', {
      timeZone: userTimezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return utcTime;
  }
}