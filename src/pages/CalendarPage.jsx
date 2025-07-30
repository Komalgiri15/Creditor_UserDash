import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { getAllEvents, getAllUpcomingEvents } from "@/services/calendarService";

// Utility functions for date handling
const getUserTimezone = () => {
  return localStorage.getItem('userTimezone') || 'America/New_York';
};

const getTodayBounds = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getUpcomingWeekBounds = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setDate(end.getDate() + 7);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const formatDateForDisplay = (date) => {
  return date?.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: getUserTimezone()
  });
};

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [allEvents, setAllEvents] = React.useState([]); // unified event list (expanded)
  const [loading, setLoading] = React.useState({
    all: true
  });
  const [error, setError] = React.useState(null);

  // Fetch all upcoming events (with occurrences) once
  React.useEffect(() => {
    async function fetchAllUpcomingEvents() {
      setError(null);
      setLoading({ all: true });
      try {
        const now = new Date();
        const startDate = now.toISOString();
        const end = new Date();
        end.setDate(end.getDate() + 30); // next 30 days
        end.setHours(23, 59, 59, 999);
        const endDate = end.toISOString();
        const events = await getAllUpcomingEvents({ startDate, endDate });
        const expanded = [];
        events.forEach(event => {
          if (event.isRecurring && Array.isArray(event.occurrences)) {
            event.occurrences.forEach(occ => {
              const occDate = new Date(occ);
              if (occDate >= now) {
                expanded.push({
                  ...event,
                  date: occDate,
                  time: occDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: getUserTimezone() }),
                  isOccurrence: true
                });
              }
            });
          } else if (event.startTime) {
            const eventDate = new Date(event.startTime);
            if (eventDate >= now) {
              expanded.push({
                ...event,
                date: eventDate,
                time: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: getUserTimezone() }),
                isOccurrence: false
              });
            }
          }
        });
        expanded.sort((a, b) => a.date - b.date);
        setAllEvents(expanded);
      } catch (err) {
        setError('Failed to load events');
        setAllEvents([]);
      } finally {
        setLoading({ all: false });
      }
    }
    fetchAllUpcomingEvents();
  }, []);

  // Filter events for the selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    return allEvents.filter(event =>
      event.date &&
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, allEvents]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const handleJoinMeeting = (link) => {
    if (link) window.open(link, '_blank');
  };

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Calendar Events</h1>
        </div>
        <p className="text-muted-foreground">View all your upcoming events, meetings, and important dates</p>
        <Separator className="mt-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={date => {
                if (date) setSelectedDate(date); // Only update if date is not undefined
              }}
              className="w-full border rounded-md"
              showOutsideDays={true}
            />
          </Card>
        </div>
        
        {/* Events List */}
        <div className="lg:col-span-2">
          <p className="text-xs text-muted-foreground mb-2">
            All times shown in your timezone: <b>{getUserTimezone()}</b>
          </p>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              {loading.all ? (
                'Loading events...'
              ) : selectedDateEvents.length > 0 ? (
                `Events for ${formatDateForDisplay(selectedDate)}`
              ) : (
                `No events for ${formatDateForDisplay(selectedDate)}`
              )}
            </h3>
            
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : loading.all ? (
              <div>Loading events...</div>
            ) : selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id + (event.isOccurrence ? event.date.toISOString() : '')} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status || 'upcoming'}
                        </Badge>
                        {event.meetingLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleJoinMeeting(event.meetingLink)}
                            className="flex items-center gap-1"
                          >
                            Join
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-muted-foreground">{event.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card text-card-foreground rounded-lg">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Events Scheduled</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  There are no events scheduled for this date. Check other dates or create new events.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* All Upcoming Events */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">All Upcoming Events</h3>
        {loading.all ? (
          <div>Loading upcoming events...</div>
        ) : allEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allEvents.map((event) => (
              <Card key={event.id + (event.isOccurrence ? event.date.toISOString() : '')} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{event.title}</h4>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={12} />
                    <span>{event.date ? formatDateForDisplay(event.date) : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={12} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {event.description && (
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-card text-card-foreground rounded-lg">
            <p className="text-muted-foreground">No upcoming events found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;