import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notifications = [
  {
    id: "1",
    title: "New Course Available",
    description: "Introduction to American Constitutional Law is now available. Start learning today!",
    time: "10 minutes ago",
    read: false,
    type: 'info'
  },
  {
    id: "2",
    title: "Assignment Due",
    description: "Your Case Brief for Civil Litigation is due tomorrow. Don't forget to submit!",
    time: "1 hour ago",
    read: false,
    type: 'alert'
  },
  {
    id: "3",
    title: "Quiz Completed",
    description: "You scored 92% on Criminal Law Procedure Quiz. Great job!",
    time: "3 hours ago",
    read: true,
    type: 'success'
  },
  {
    id: "4",
    title: "Webinar Reminder",
    description: "Legal Ethics and Professional Responsibility webinar starts in 2 hours.",
    time: "2 hours ago",
    read: false,
    type: 'info'
  },
  {
    id: "5",
    title: "Profile Update",
    description: "Please update your professional interests to get better course recommendations.",
    time: "1 day ago",
    read: true,
    type: 'info'
  }
];

export function NotificationCenter({ trigger }) {
  const [notificationState, setNotificationState] = useState(notifications);
  const [open, setOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    assignmentReminders: true,
    systemAnnouncements: true,
    groupActivities: false
  });

  const unreadCount = notificationState.filter(n => !n.read).length;
  
  const markAsRead = (id) => {
    setNotificationState(
      notificationState.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotificationState(
      notificationState.map(n => ({ ...n, read: true }))
    );
    toast.success("All notifications marked as read");
  };
  
  const removeNotification = (id) => {
    setNotificationState(
      notificationState.filter(n => n.id !== id)
    );
    toast.success("Notification removed");
  };
  
  const getTypeStyles = (type) => {
    switch(type) {
      case 'alert':
        return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500/70";
      case 'success':
        return "border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500/70";
      default:
        return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500/70";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="relative" size="icon">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0 bg-popover text-popover-foreground dark:border-muted" align="end">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between border-b p-3">
            <h4 className="font-medium">Notifications</h4>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="p-0 focus:outline-none">
            <div className="flex items-center justify-between p-3 bg-muted/50">
              <span className="text-sm text-muted-foreground">Recent notifications</span>
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                Mark all as read
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-0">
                {notificationState.map((notification) => (
                  <div key={notification.id} className={`${getTypeStyles(notification.type)} p-3 relative ${notification.read ? 'opacity-70' : ''}`}>
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{notification.title}</h5>
                      <div className="flex space-x-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <span className="sr-only">Mark as read</span>
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <span className="sr-only">Clear notification</span>
                          <span className="text-xs">×</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    {!notification.read && (
                      <div className="absolute top-0 right-0 h-0 w-0 border-t-8 border-r-8 border-blue-500 border-solid"></div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="p-0 focus:outline-none">
            <div className="flex items-center justify-between p-3 bg-muted/50">
              <span className="text-sm text-muted-foreground">Unread notifications</span>
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
                Mark all as read
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-0">
                {notificationState.filter(n => !n.read).length > 0 ? (
                  notificationState
                    .filter(n => !n.read)
                    .map((notification) => (
                      <div key={notification.id} className={`${getTypeStyles(notification.type)} p-3 relative`}>
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{notification.title}</h5>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <span className="sr-only">Mark as read</span>
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <span className="sr-only">Clear notification</span>
                              <span className="text-xs">×</span>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        <div className="absolute top-0 right-0 h-0 w-0 border-t-8 border-r-8 border-blue-500 border-solid"></div>
                      </div>
                    ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No unread notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 space-y-4 focus:outline-none bg-card text-card-foreground">
            <h4 className="font-medium">Notification Settings</h4>
            <Separator />
            
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Notification Methods</h5>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex flex-col">
                  <span>Email Notifications</span>
                  <span className="text-xs text-muted-foreground">Receive notifications via email</span>
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({...notificationSettings, email: checked});
                    toast.success("Email notification settings updated");
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex flex-col">
                  <span>Push Notifications</span>
                  <span className="text-xs text-muted-foreground">Receive push notifications in-app</span>
                </Label>
                <Switch 
                  id="push-notifications" 
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({...notificationSettings, push: checked});
                    toast.success("Push notification settings updated");
                  }}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Notification Types</h5>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="course-updates" className="flex flex-col">
                  <span>Course Updates</span>
                  <span className="text-xs text-muted-foreground">New content, assignments, and feedback</span>
                </Label>
                <Switch 
                  id="course-updates" 
                  checked={notificationSettings.courseUpdates}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({...notificationSettings, courseUpdates: checked});
                    toast.success("Course update settings updated");
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="assignment-reminders" className="flex flex-col">
                  <span>Assignment Reminders</span>
                  <span className="text-xs text-muted-foreground">Deadlines and due date notifications</span>
                </Label>
                <Switch 
                  id="assignment-reminders" 
                  checked={notificationSettings.assignmentReminders}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({...notificationSettings, assignmentReminders: checked});
                    toast.success("Assignment reminder settings updated");
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="system-announcements" className="flex flex-col">
                  <span>System Announcements</span>
                  <span className="text-xs text-muted-foreground">Platform updates and maintenance notices</span>
                </Label>
                <Switch 
                  id="system-announcements" 
                  checked={notificationSettings.systemAnnouncements}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({...notificationSettings, systemAnnouncements: checked});
                    toast.success("System announcement settings updated");
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="group-activities" className="flex flex-col">
                  <span>Group Activities</span>
                  <span className="text-xs text-muted-foreground">Updates from groups and study circles</span>
                </Label>
                <Switch 
                  id="group-activities" 
                  checked={notificationSettings.groupActivities}
                  onCheckedChange={(checked) => {
                    setNotificationSettings({...notificationSettings, groupActivities: checked});
                    toast.success("Group activity settings updated");
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationCenter;