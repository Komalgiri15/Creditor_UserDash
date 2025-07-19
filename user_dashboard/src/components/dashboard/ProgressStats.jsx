import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, BookOpen, Clock, Trophy } from "lucide-react";

export function ProgressStats() {
  return (
    <Card className="h-full">
      <CardContent className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Courses</span>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Complete</span>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 this month</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Hours</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">24.5</div>
            <p className="text-xs text-muted-foreground">+5.5 this week</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProgressStats;