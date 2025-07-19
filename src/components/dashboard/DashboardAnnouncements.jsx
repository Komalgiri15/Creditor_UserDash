import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardAnnouncements() {
  // Sample announcements data with actual items 
  const announcements = [
    {
      id: 1,
      title: "New Course Available",
      content: "Constitutional Law Advanced Topics is now available",
      date: "Today",
      priority: "high",
      isNew: true,
    },
    {
      id: 2,
      title: "System Maintenance",
      content: "Platform will be down for maintenance this weekend",
      date: "Yesterday",
      priority: "medium",
      isNew: true,
    },
    {
      id: 3,
      title: "Holiday Schedule",
      content: "Check updated course schedule for the holidays",
      date: "3 days ago",
      priority: "low",
      isNew: false,
    }
  ];
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'low': 
      default: return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <Card className="border shadow bg-card text-card-foreground h-full overflow-hidden">
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bell size={14} className="text-primary" />
          Recent Announcements
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
          <Link to="/announcements" className="flex items-center gap-1 hover:text-primary">
            View All
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-3">
        {announcements.length > 0 ? (
          <motion.div 
            className="space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {announcements.map((announcement) => (
              <motion.div 
                key={announcement.id} 
                className={cn(
                  "text-sm p-2 relative overflow-hidden rounded-md",
                  "transition-all duration-300",
                  getPriorityColor(announcement.priority)
                )}
                variants={item}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {announcement.isNew && (
                      <span className="h-2 w-2 bg-primary rounded-full" />
                    )}
                    <span className="font-medium line-clamp-1">{announcement.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{announcement.date}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {announcement.content}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-4">
            <span className="text-sm text-muted-foreground">No announcements</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardAnnouncements;