import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { professionalAvatars } from "@/lib/avatar-utils";

// Sample announcements data
const announcements = [
  {
    id: 1,
    title: "Weekly Group Meeting Scheduled",
    content: "Our weekly group meeting is scheduled for this Friday at 2:00 PM. We'll be discussing the upcoming project deadlines and reviewing progress on current assignments.",
    author: {
      name: "Sarah Adams",
      avatar: professionalAvatars.female[0].url,
      isAdmin: true
    },
    timestamp: "2 days ago",
    priority: 'high'
  },
  {
    id: 2,
    title: "New Learning Resources Available",
    content: "We've added new learning materials to our resource library. Check out the latest tutorials on React hooks and advanced JavaScript concepts.",
    author: {
      name: "Mike Johnson",
      avatar: professionalAvatars.male[1].url,
      isAdmin: true
    },
    timestamp: "1 week ago",
    priority: 'medium'
  },
  {
    id: 3,
    title: "Study Group Session Tomorrow",
    content: "Don't forget about our study group session tomorrow at 6:00 PM. We'll be covering the material from the last two modules.",
    author: {
      name: "Lisa Wong",
      avatar: professionalAvatars.female[1].url,
      isAdmin: true
    },
    timestamp: "3 days ago",
    priority: 'high'
  }
];

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'high': return 'bg-red-100 text-red-600 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'low': return 'bg-blue-100 text-blue-600 border-blue-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export function AnnouncementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Group Announcements</h2>
          <p className="text-muted-foreground">Stay updated with important group information</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={announcement.author.avatar} />
                      <AvatarFallback>{announcement.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{announcement.author.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {announcement.timestamp}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority} priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{announcement.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-muted-foreground">No Announcements</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              There are no announcements for this group yet. Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnouncementPage;