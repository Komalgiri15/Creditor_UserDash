import React from "react";
import { Outlet, useLocation, useParams, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageSquare, CalendarDays, Bell, MessageCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GroupLayout() {
  const location = useLocation();
  const { groupId } = useParams();
  const currentPath = location.pathname;
  
  // Get group name based on groupId
  const getGroupName = (id) => {
    const groupNames = {
      '1': 'Web Development',
      '2': 'Data Science',
      '3': 'Mobile App Development',
      '4': 'UI/UX Design'
    };
    return groupNames[id] || `Group ${id}`;
  };
  
  const tabs = [
    { 
      label: "News", 
      icon: MessageSquare, 
      path: `/groups/${groupId}/news` 
    },
    { 
      label: "Chat", 
      icon: MessageCircle, 
      path: `/groups/${groupId}/chat` 
    },
    { 
      label: "Calendar", 
      icon: CalendarDays, 
      path: `/groups/${groupId}/calendar` 
    },
    { 
      label: "Announcements", 
      icon: Bell, 
      path: `/groups/${groupId}/announcements` 
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b">
        <div className="container py-4">
          <h1 className="text-2xl font-bold">{getGroupName(groupId || '1')}</h1>
        </div>
      </div>
      
      <div className="container py-4">
        {/* Sub navigation tabs */}
        <Tabs defaultValue="news" className="mb-6">
          <TabsList className="w-full grid grid-cols-4 gap-2">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.path}
                value={tab.path.split('/').pop() || ''}
                className={cn(
                  "flex items-center gap-2",
                  currentPath === tab.path ? "bg-primary text-primary-foreground" : ""
                )}
                asChild
              >
                <Link to={tab.path}>
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Content area */}
        <div className="bg-card rounded-lg p-4 shadow-sm min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default GroupLayout;