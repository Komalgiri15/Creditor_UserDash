import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationPreferences = () => {
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: true,
    courseUpdates: true,
    newLessons: true,
    reminders: false,
    marketing: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      console.log(`Notification preference updated: ${key} -> ${newState[key]}`);
      return newState;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about your course progress
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationChange("email")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={() => handleNotificationChange("push")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Course Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when courses are updated
              </p>
            </div>
            <Switch
              checked={notifications.courseUpdates}
              onCheckedChange={() => handleNotificationChange("courseUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Lessons</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new lessons are available
              </p>
            </div>
            <Switch
              checked={notifications.newLessons}
              onCheckedChange={() => handleNotificationChange("newLessons")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Learning Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to continue your learning
              </p>
            </div>
            <Switch
              checked={notifications.reminders}
              onCheckedChange={() => handleNotificationChange("reminders")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new courses and features
              </p>
            </div>
            <Switch
              checked={notifications.marketing}
              onCheckedChange={() => handleNotificationChange("marketing")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;