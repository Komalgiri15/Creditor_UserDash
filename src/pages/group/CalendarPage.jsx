import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from "lucide-react";

// Sample events data
const events = [
  {
    id: 1,
    title: "Web Dev Workshop",
    description: "Introduction to React hooks and state management",
    date: new Date(2025, 3, 25), // April 25, 2025
    time: "14:00 - 16:00",
    location: "Virtual Meeting Room 1"
  },
  {
    id: 2,
    title: "Group Project Kickoff",
    description: "Discuss our upcoming group project and assign roles",
    date: new Date(2025, 3, 28), // April 28, 2025
    time: "10:00 - 11:30",
    location: "Main Campus, Building B, Room 203"
  }
];

export function CalendarPage() {
  const [date, setDate] = useState(new Date());
  
  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );
  
  // Highlighted dates for the calendar (dates with events)
  const highlightedDates = events.map(event => event.date);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Group Calendar
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
            {selectedDateEvents.length 
              ? `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? 's' : ''} scheduled` 
              : 'No events scheduled for this day'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
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
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <CalendarDays className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No Events</h3>
                <p className="max-w-sm">
                  There are no events scheduled for this date. Select a different date to view events.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarPage;