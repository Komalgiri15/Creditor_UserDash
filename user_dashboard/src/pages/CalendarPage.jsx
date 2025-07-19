import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const threedays = new Date(today);
threedays.setDate(threedays.getDate() + 3);

const calendarEvents = [
  {
    id: 1,
    title: "Mock Trial Competition",
    date: tomorrow,
    time: "10:00 AM - 12:00 PM",
    location: "Virtual Court Room",
    status: 'upcoming',
    description: "Practice trial simulation with real case scenarios",
    meetingLink: "https://zoom.us/j/mocktrial123"
  },
  {
    id: 2,
    title: "Legal Research Workshop",
    date: today,
    time: "2:00 PM - 4:00 PM",
    location: "Online",
    status: 'ongoing',
    description: "Learn advanced legal research techniques and databases",
    meetingLink: "https://zoom.us/j/legalresearch456"
  },
  {
    id: 3,
    title: "Bar Exam Study Group",
    date: nextWeek,
    time: "7:00 PM - 9:00 PM",
    location: "Study Hall",
    status: 'upcoming',
    description: "Collaborative study session for bar exam preparation",
    meetingLink: "https://zoom.us/j/barexam789"
  },
  {
    id: 4,
    title: "Contract Law Webinar",
    date: threedays,
    time: "1:00 PM - 2:30 PM",
    location: "Zoom Meeting",
    status: 'upcoming',
    description: "Advanced contract drafting and negotiation strategies",
    meetingLink: "https://zoom.us/j/contractlaw012"
  },
  {
    id: 5,
    title: "Constitutional Law Lecture",
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    time: "11:00 AM - 12:30 PM",
    location: "Lecture Hall A",
    status: 'upcoming',
    description: "Supreme Court case analysis and constitutional interpretation",
    meetingLink: "https://zoom.us/j/constitutional345"
  }
];

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState(today);

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ongoing': return 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return [];
    
    return calendarEvents.filter(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate]);

  const handleJoinMeeting = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="container max-w-6xl py-8 px-4 md:px-0">
      <div className="flex items-center justify-between mb-6">
        <Link to="/">
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
              onSelect={setSelectedDate}
              className="w-full border rounded-md"
              showOutsideDays={true}
            />
          </Card>
        </div>
        
        {/* Events List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              {selectedDateEvents.length > 0 
                ? `Events for ${selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}` 
                : `No events for ${selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calendarEvents
            .filter(event => event.status === 'upcoming')
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((event) => (
              <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    {event.meetingLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleJoinMeeting(event.meetingLink)}
                        className="flex items-center gap-1 h-6 px-2 text-xs"
                      >
                        Join
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={12} />
                    <span>{event.date.toLocaleDateString()}</span>
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
      </div>
    </div>
  );
}

export default CalendarPage;