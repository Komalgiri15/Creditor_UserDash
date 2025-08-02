import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { getAllUpcomingEvents } from "@/services/calendarService";

export function DashboardCalendar() {
  const today = new Date();
  const [date, setDate] = React.useState(today);
  const [allEvents, setAllEvents] = React.useState([]); // store all expanded events/occurrences
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Fetch all upcoming events (with occurrences) once
  React.useEffect(() => {
    async function fetchAllUpcoming() {
      setLoading(true);
      setError(null);
      try {
        const events = await getAllUpcomingEvents();
        const now = new Date();
        const expanded = [];
        events.forEach(event => {
          if (event.isRecurring && Array.isArray(event.occurrences)) {
            event.occurrences.forEach(occ => {
              const occDate = new Date(occ);
              if (occDate >= now) {
                expanded.push({
                  ...event,
                  date: occDate,
                  time: occDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
                time: eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOccurrence: false
              });
            }
          }
        });
        setAllEvents(expanded);
      } catch (err) {
        setError('Failed to load events');
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAllUpcoming();
  }, []);

  // Filter events for the selected date and add live status
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return [];
    const filteredEvents = allEvents.filter(event =>
      event.date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
    
    // Add live status to events
    return filteredEvents.map(event => {
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
        status: isLive ? 'live' : isUpcoming ? 'upcoming' : isEnded ? 'ended' : 'unknown'
      };
    });
  }, [date, allEvents]);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'live': return 'bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-800/50';
      case 'upcoming': return 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50';
      case 'ongoing': return 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50';
      case 'completed': return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/50';
      case 'ended': return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/50';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/50';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'live': return 'LIVE';
      case 'upcoming': return 'UPCOMING';
      case 'ongoing': return 'ONGOING';
      case 'completed': return 'COMPLETED';
      case 'ended': return 'ENDED';
      default: return 'UNKNOWN';
    }
  };

  const handleJoinLiveClass = (event) => {
    if (event.isLive && event.description) {
      window.open(event.description, '_blank');
    }
  };

  const eventVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    })
  };

  // Count live events for today
  const liveEventsCount = selectedDateEvents.filter(event => event.isLive).length;

  return (
    <Card className="border shadow hover:shadow-lg transition-all duration-300 hover:border-primary/20 group w-full max-w-sm">
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <CalendarIcon size={18} className="text-primary" />
          </motion.div>
          <h3 className="font-medium text-sm group-hover:text-primary transition-colors duration-300">Calendar</h3>
          {liveEventsCount > 0 && (
            <Badge className="bg-purple-100 text-purple-600 text-xs px-2 py-0 ml-1">
              {liveEventsCount} Live
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 mr-1 transition-transform hover:bg-primary/10"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </motion.div>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-6 px-2 transition-colors duration-300 hover:text-primary" asChild>
            <Link to="/dashboard/calendar">View all</Link>
          </Button>
        </div>
      </div>

      <Collapsible open={!isCollapsed} className="w-full">
        <CollapsibleContent className="w-full">
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 border-b"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={d => { if (d) setDate(d); }}
              className="w-full border rounded-md pointer-events-auto transition-all duration-300 hover:border-primary/30"
              showOutsideDays={true}
              classNames={{
                months: "w-full flex flex-col space-y-4",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.7rem] px-1",
                row: "flex w-full mt-2",
                cell: "h-7 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-7 w-full p-0 text-xs aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground pointer-events-auto transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground hover:scale-100",
                day_today: "bg-accent text-accent-foreground ring-1 ring-primary",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-30",
                nav_button: "h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent flex items-center justify-center transition-all duration-200 hover:text-primary",
                nav_button_previous: "ml-1",
                nav_button_next: "mr-1",
              }}
              renderDay={(day) => {
                const dayEvents = allEvents.filter(event =>
                  event.date &&
                  event.date.getDate() === day.getDate() &&
                  event.date.getMonth() === day.getMonth() &&
                  event.date.getFullYear() === day.getFullYear()
                );
                const hasEvent = dayEvents.length > 0;
                const hasLiveEvent = dayEvents.some(event => {
                  const now = new Date();
                  const start = new Date(event.startTime);
                  const end = new Date(event.endTime);
                  return now >= start && now <= end;
                });
                
                return (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span>{day.getDate()}</span>
                    {hasEvent && (
                      <span className={`w-1.5 h-1.5 mt-0.5 rounded-full inline-block ${
                        hasLiveEvent ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></span>
                    )}
                  </div>
                );
              }}
            />
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="px-3 py-2">
        <div className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
          {loading ? (
            'Loading events...'
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : selectedDateEvents.length > 0
            ? `Events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
            : `No events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
        </div>
      </div>
      <ScrollArea className="h-[120px] px-3 pb-3">
        <div className="space-y-2 pr-3">
          {loading ? (
            <div className="text-xs text-muted-foreground">Loading events...</div>
          ) : error ? (
            <div className="text-xs text-red-500">{error}</div>
          ) : selectedDateEvents.map((event, index) => (
            <motion.div 
              key={event.id} 
              custom={index}
              variants={eventVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, x: 3 }}
              className={`flex items-center justify-between p-2 rounded-md transition-all duration-300 cursor-pointer group/event ${
                event.isLive 
                  ? 'bg-purple-50 hover:bg-purple-100 border border-purple-200' 
                  : 'bg-muted/50 hover:bg-accent/70'
              }`}
              onClick={() => event.isLive && handleJoinLiveClass(event)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {event.isLive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Play size={12} className="text-purple-600" />
                  </motion.div>
                )}
                <span className="text-xs line-clamp-1 group-hover/event:text-primary transition-colors duration-300">
                  {event.title}
                </span>
              </div>
              <Badge className={`${getStatusColor(event.status)} text-xs py-0 px-2 transition-all duration-300 group-hover/event:scale-105`}>
                {getStatusText(event.status)}
              </Badge>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export default DashboardCalendar;