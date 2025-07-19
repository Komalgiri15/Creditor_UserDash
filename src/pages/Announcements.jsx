import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export function Announcements() {
  // Use the same sample announcements as DashboardAnnouncements for now
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

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-0">
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
          <Bell className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
        <p className="text-muted-foreground">Stay updated with the latest news and information</p>
        <Separator className="mt-4" />
      </div>
      
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <Card key={index} className="p-4 bg-card text-card-foreground">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                <span className="text-sm text-muted-foreground">{announcement.date}</span>
              </div>
              <p className="text-muted-foreground">{announcement.content}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card text-card-foreground rounded-lg">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Announcements</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            There are no announcements at this time. Check back later for updates and important information.
          </p>
        </div>
      )}
    </div>
  );
}

export default Announcements;