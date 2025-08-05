import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Radio } from "lucide-react";
import { getAllUpcomingEvents } from "@/services/calendarService";
import { motion } from "framer-motion";

export function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const apiEvents = await getAllUpcomingEvents();
        const now = new Date();
        const expanded = [];
        
        console.log('Raw events from API:', apiEvents);
        
        apiEvents.forEach(event => {
          // Handle recurring events
          if (event.isRecurring && Array.isArray(event.occurrences)) {
            console.log('Processing recurring event:', event.title, 'with', event.occurrences.length, 'occurrences');
            event.occurrences.forEach(occ => {
              const occDate = new Date(occ);
              if (occDate >= now) {
                // Calculate the end time for this occurrence
                const duration = new Date(event.endTime) - new Date(event.startTime);
                const occEndTime = new Date(occDate.getTime() + duration);
                
                expanded.push({
                  ...event,
                  date: occDate,
                  startTime: occDate.toISOString(), // Use occurrence start time
                  endTime: occEndTime.toISOString(), // Use calculated end time
                  time: `${occDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${occEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                  isOccurrence: true,
                  originalEvent: event
                });
              }
            });
          } else if (event.isRecurring && event.recurrenceRule) {
            // If occurrences array is missing, try to generate them from recurrenceRule
            console.log('Recurring event without occurrences array:', event.title);
            const eventDate = new Date(event.startTime);
            if (eventDate >= now) {
              expanded.push({
                ...event,
                date: eventDate,
                time: `${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                isOccurrence: false
              });
            }
          } else if (event.startTime) {
            // Handle non-recurring events
            const eventDate = new Date(event.startTime);
            if (eventDate >= now) {
              expanded.push({
                ...event,
                date: eventDate,
                time: `${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                isOccurrence: false
              });
            }
          }
        });
        
        console.log('Expanded events:', expanded.length);
        setEvents(expanded);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  // Real-time updates for live events (every 30 seconds) - LIKE LiveClasses
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prevEvents => {
        const now = new Date();
        
        return prevEvents.filter(event => {
          const endTime = new Date(event.endTime);
          const isEnded = now > endTime;
          
          // Remove ended events
          if (isEnded) {
            console.log('Removing ended event:', event.title);
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
    }, 30 * 1000); // refresh every 30s

    return () => clearInterval(interval);
  }, []);
  
  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );
  
  // Highlighted dates for the calendar (dates with events)
  const highlightedDates = events.map(event => event.date);
  
  // Get event status (same as LiveClasses)
  const getEventStatus = (event) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    if (now >= start && now <= end) {
      return { status: 'live', text: 'LIVE', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' };
    } else if (now < start) {
      return { status: 'upcoming', text: 'UPCOMING', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' };
    } else {
      return { status: 'ended', text: 'ENDED', color: 'text-gray-500', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' };
    }
  };

  // Count live events for the selected date
  const liveEventsCount = selectedDateEvents.filter(event => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    return now >= start && now <= end;
  }).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Group Calendar
            {liveEventsCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full animate-pulse">
                {liveEventsCount} Live
              </span>
            )}
          </CardTitle>
          <CardDescription>
            View group events and schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border p-3 pointer-events-auto"
            modifiers={{
              highlighted: highlightedDates
            }}
            modifiersStyles={{
              highlighted: { 
                fontWeight: 'bold', 
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                color: 'hsl(var(--primary))'
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </CardTitle>
          <CardDescription>
            {loading ? 'Loading events...' : 
             selectedDateEvents.length 
              ? `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled` 
              : 'No events scheduled for this day'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2">Loading events...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event) => {
                const eventStatus = getEventStatus(event);
                const isLive = eventStatus.status === 'live';
                
                return (
                  <Card 
                    key={`${event.id}-${event.date?.getTime()}`} 
                    className={`transition-all duration-300 ${
                      isLive ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {isLive && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Radio size={16} className="text-red-500" />
                          </motion.div>
                        )}
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventStatus.bgColor} ${eventStatus.color}`}>
                          {eventStatus.text}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.isOccurrence && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Recurring Event
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <CalendarDays className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No Events</h3>
              <p className="max-w-sm">
                There are no events scheduled for this date. Select a different date to view events.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarPage;