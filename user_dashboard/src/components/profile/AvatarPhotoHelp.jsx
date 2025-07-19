import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarPhotoHelp() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="about">About Avatars</TabsTrigger>
            <TabsTrigger value="when">When They're Used</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">Profile Photo</span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium">Profile Photos</h4>
                <p className="text-sm text-muted-foreground">
                  Your actual photo used in formal contexts like certificates, official communications, and your public profile.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">Avatar</span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium">Avatars</h4>
                <p className="text-sm text-muted-foreground">
                  A fun, customizable representation used in discussions, course activities, leaderboards, and social features.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="when" className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Profile Photos Appear In:</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Your public profile page</li>
                <li>Certificates of completion</li>
                <li>Official communications</li>
                <li>Account management areas</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Avatars Appear In:</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Course discussions and comments</li>
                <li>Team projects and group work</li>
                <li>Chat messages and forums</li>
                <li>Achievement celebrations</li>
                <li>Leaderboards and progress trackers</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default AvatarPhotoHelp;