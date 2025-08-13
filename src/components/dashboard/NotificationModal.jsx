import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function NotificationModal({ open, onOpenChange, onNotificationUpdate }) {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "info",
      title: "New course available",
      description: "Advanced Risk Assessment is now open for enrollment",
      time: "5 minutes ago",
      color: "bg-blue-100",
      dotColor: "bg-blue-500",
      read: false
    },
    {
      id: "2",
      type: "success",
      title: "Assignment graded",
      description: "Your Module 4 assignment received a score of 95%",
      time: "1 hour ago",
      color: "bg-green-100",
      dotColor: "bg-green-500",
      read: false
    },
    {
      id: "3",
      type: "warning",
      title: "Reminder",
      description: "Live session starts in 30 minutes",
      time: "30 minutes ago",
      color: "bg-orange-100",
      dotColor: "bg-orange-500",
      read: true
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    assignmentReminders: true,
    systemAnnouncements: true,
    groupActivities: false
  });

  // Initialize unread count when modal opens
  useEffect(() => {
    if (open && onNotificationUpdate) {
      const unreadCount = notifications.filter(n => !n.read).length;
      onNotificationUpdate(unreadCount);
    }
  }, [open, notifications, onNotificationUpdate]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    
    // Update unread count
    const newUnreadCount = notifications.filter(n => !n.read && n.id !== id).length;
    if (onNotificationUpdate) {
      onNotificationUpdate(newUnreadCount);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
    
    // Update unread count to 0
    if (onNotificationUpdate) {
      onNotificationUpdate(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 bg-white rounded-xl shadow-lg">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Bell className="h-4 w-4 text-gray-700" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-4 pb-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-3 h-8 bg-gray-100 rounded-lg p-1">
              <TabsTrigger 
                value="all" 
                className="text-xs font-medium rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="text-xs font-medium rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              >
                Unread
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="text-xs font-medium rounded-md px-2 py-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600"
              >
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-2 mt-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${notification.color} border border-gray-100 ${notification.read ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full ${notification.dotColor} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs">
                        {notification.title}
                      </h4>
                      <p className="text-gray-700 text-xs mt-1">
                        {notification.description}
                      </p>
                      <p className="text-blue-600 text-xs mt-1.5">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full mt-4 h-8 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                onClick={handleMarkAllAsRead}
              >
                Mark All as Read
              </Button>
            </TabsContent>
            
            <TabsContent value="unread" className="space-y-2 mt-3">
              {notifications.filter(n => !n.read).length > 0 ? (
                notifications
                  .filter(n => !n.read)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${notification.color} border border-gray-100`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full ${notification.dotColor} mt-1.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-xs">
                            {notification.title}
                          </h4>
                          <p className="text-gray-700 text-xs mt-1">
                            {notification.description}
                          </p>
                          <p className="text-blue-600 text-xs mt-1.5">
                            {notification.time}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500 text-xs">No unread notifications</p>
                </div>
              )}
              
              {notifications.filter(n => !n.read).length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-4 h-8 border-gray-300 text-gray-700 hover:bg-gray-50 text-xs"
                  onClick={handleMarkAllAsRead}
                >
                  Mark All as Read
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-3 mt-3">
              <h4 className="font-medium text-gray-900 text-sm">Notification Settings</h4>
              <Separator />
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-900">Notification Methods</h5>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex flex-col">
                    <span className="text-xs text-gray-900">Email Notifications</span>
                    <span className="text-xs text-gray-500">Receive notifications via email</span>
                  </Label>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, email: checked});
                      toast.success("Email notification settings updated");
                    }}
                    className="scale-75"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex flex-col">
                    <span className="text-xs text-gray-900">Push Notifications</span>
                    <span className="text-xs text-gray-500">Receive push notifications in-app</span>
                  </Label>
                  <Switch 
                    id="push-notifications" 
                    checked={notificationSettings.push}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, push: checked});
                      toast.success("Push notification settings updated");
                    }}
                    className="scale-75"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-900">Notification Types</h5>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="course-updates" className="flex flex-col">
                    <span className="text-xs text-gray-900">Course Updates</span>
                    <span className="text-xs text-gray-500">New content, assignments, and feedback</span>
                  </Label>
                  <Switch 
                    id="course-updates" 
                    checked={notificationSettings.courseUpdates}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, courseUpdates: checked});
                      toast.success("Course update settings updated");
                    }}
                    className="scale-75"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="assignment-reminders" className="flex flex-col">
                    <span className="text-xs text-gray-900">Assignment Reminders</span>
                    <span className="text-xs text-gray-500">Deadlines and due date notifications</span>
                  </Label>
                  <Switch 
                    id="assignment-reminders" 
                    checked={notificationSettings.assignmentReminders}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, assignmentReminders: checked});
                      toast.success("Assignment reminder settings updated");
                    }}
                    className="scale-75"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-announcements" className="flex flex-col">
                    <span className="text-xs text-gray-900">System Announcements</span>
                    <span className="text-xs text-gray-500">Platform updates and maintenance notices</span>
                  </Label>
                  <Switch 
                    id="system-announcements" 
                    checked={notificationSettings.systemAnnouncements}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, systemAnnouncements: checked});
                      toast.success("System announcement settings updated");
                    }}
                    className="scale-75"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="group-activities" className="flex flex-col">
                    <span className="text-xs text-gray-900">Group Activities</span>
                    <span className="text-xs text-gray-500">Updates from groups and study circles</span>
                  </Label>
                  <Switch 
                    id="group-activities" 
                    checked={notificationSettings.groupActivities}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, groupActivities: checked});
                      toast.success("Group activity settings updated");
                    }}
                    className="scale-75"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NotificationModal;