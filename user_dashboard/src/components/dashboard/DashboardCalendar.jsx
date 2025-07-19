import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";

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
    status: 'upcoming'
  },
  {
    id: 2,
    title: "Legal Research Workshop",
    date: today,
    status: 'ongoing'
  },
  {
    id: 3,
    title: "Bar Exam Study Group",
    date: nextWeek,
    status: 'upcoming'
  },
  {
    id: 4,
    title: "Contract Law Webinar",
    date: threedays,
    status: 'upcoming'
  }
];

export function DashboardCalendar() {
  const [date, setDate] = React.useState(today);
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
  
  const selectedDateEvents = React.useMemo(() => {
    if (!date) return [];
    
    return calendarEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  }, [date]);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/50';
      case 'ongoing': return 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50';
      case 'completed': return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/50';
      default: return 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800/30 dark:text-gray-400 dark:hover:bg-gray-700/50';
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
            <Link to="/calendar">View all</Link>
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
              onSelect={setDate}
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
                day: "h-7 w-full p-0 text-xs aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground pointer-events-auto transition-all duration-200 hover:scale-110",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground hover:scale-100",
                day_today: "bg-accent text-accent-foreground ring-1 ring-primary",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-30",
                nav_button: "h-6 w-6 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-accent flex items-center justify-center transition-all duration-200 hover:text-primary",
                nav_button_previous: "ml-1",
                nav_button_next: "mr-1",
              }}
            />
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="px-3 py-2">
        <div className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
          {selectedDateEvents.length > 0 
            ? `Events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` 
            : `No events for ${date?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
        </div>
      </div>
      
      <ScrollArea className="h-[120px] px-3 pb-3">
        <div className="space-y-2 pr-3">
          {selectedDateEvents.map((event, index) => (
            <motion.div 
              key={event.id} 
              custom={index}
              variants={eventVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, x: 3 }}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-accent/70 transition-all duration-300 cursor-pointer group/event"
            >
              <span className="text-xs line-clamp-1 group-hover/event:text-primary transition-colors duration-300">{event.title}</span>
              <Badge className={`${getStatusColor(event.status)} text-xs py-0 px-2 transition-all duration-300 group-hover/event:scale-105`}>
                {event.status}
              </Badge>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

export default DashboardCalendar;