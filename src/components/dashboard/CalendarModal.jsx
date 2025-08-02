import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function CalendarModal({ open, onOpenChange }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();
        const params = new URLSearchParams({ startDate: start, endDate: end });

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events?${params}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (data?.data?.length > 0) {
          // Process events and add live status
          const processedEvents = data.data.map(event => {
            const now = new Date();
            const start = new Date(event.startTime);
            const end = new Date(event.endTime);
            const isLive = now >= start && now <= end;
            const isUpcoming = now < start;
            const isEnded = now > end;
            
            return {
              ...event,
              isLive,
              isUpcoming,
              isEnded,
              status: isLive ? 'live' : isUpcoming ? 'upcoming' : isEnded ? 'ended' : 'unknown',
              time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          });

          // Filter for today's events and sort by time
          const todayEvents = processedEvents
            .filter(event => {
              const eventDate = new Date(event.startTime);
              const today = new Date();
              return (
                eventDate.getDate() === today.getDate() &&
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getFullYear() === today.getFullYear()
              );
            })
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

          setEvents(todayEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchEvents();
    }
  }, [open]);

  const handleJoinMeeting = (event) => {
    if (event.isLive && event.description) {
      window.open(event.description, '_blank');
    } else if (event.meetingLink) {
      window.open(event.meetingLink, '_blank');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'live': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'upcoming': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'ended': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'live': return 'LIVE NOW';
      case 'upcoming': return 'UPCOMING';
      case 'ended': return 'ENDED';
      default: return 'UNKNOWN';
    }
  };

  const liveEventsCount = events.filter(event => event.isLive).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-white rounded-xl shadow-lg">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="h-5 w-5 text-gray-700" />
            Calendar & Events
            {liveEventsCount > 0 && (
              <Badge className="bg-purple-100 text-purple-600 text-xs px-2 py-0 ml-2">
                {liveEventsCount} Live
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600">No events today</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event, index) => (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${
                    event.isLive 
                      ? 'bg-purple-50 border-purple-200 hover:bg-purple-100' 
                      : 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {event.isLive && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Play size={12} className="text-purple-600" />
                        </motion.div>
                      )}
                      <span className="text-sm text-gray-700 font-medium">
                        {event.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${
                        event.isLive ? 'text-purple-600' : 'text-blue-600'
                      }`}>
                        {event.time}
                      </span>
                      <Badge className={`text-xs px-2 py-0 ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </Badge>
                      {event.isLive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs border-purple-300 text-purple-600 hover:bg-purple-100"
                          onClick={() => handleJoinMeeting(event)}
                        >
                          Join
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CalendarModal;