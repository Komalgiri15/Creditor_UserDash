import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function Privacy() {
  const [privacySettings, setPrivacySettings] = useState({
    seeOnlineLearners: true,
    appearToOnlineLearners: true,
    allowChatRequests: true
  });

  const handleSettingChange = (setting) => {
    setPrivacySettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      
      // Show toast notification
      toast.success(`Privacy setting updated`, {
        description: `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is now ${newSettings[setting] ? 'enabled' : 'disabled'}`
      });
      
      return newSettings;
    });
  };

  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>
      
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-muted/40">
          <CardTitle>Feature</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Switch 
                id="see-online-learners" 
                checked={privacySettings.seeOnlineLearners}
                onCheckedChange={() => handleSettingChange('seeOnlineLearners')}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="see-online-learners" className="text-base font-normal">
                See online learners
              </Label>
            </div>
            
            <div className="flex items-center space-x-4">
              <Switch 
                id="appear-to-online-learners" 
                checked={privacySettings.appearToOnlineLearners}
                onCheckedChange={() => handleSettingChange('appearToOnlineLearners')}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="appear-to-online-learners" className="text-base font-normal">
                Appear to online learners
              </Label>
            </div>
            
            <div className="flex items-center space-x-4">
              <Switch 
                id="allow-chat-requests" 
                checked={privacySettings.allowChatRequests}
                onCheckedChange={() => handleSettingChange('allowChatRequests')}
                className="data-[state=checked]:bg-primary"
              />
              <Label htmlFor="allow-chat-requests" className="text-base font-normal">
                Allow chat requests
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Privacy;