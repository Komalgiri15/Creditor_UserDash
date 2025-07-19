import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search, Shield, User } from "lucide-react";
import { professionalAvatars } from "@/lib/avatar-utils";

const participants = [
  {
    id: 1,
    name: "Sarah Adams",
    email: "sarah.adams@example.com",
    avatar: professionalAvatars.female[0].url,
    role: "Admin",
    joinedDate: "2024-01-15",
    isAdmin: true
  },
  {
    id: 2,
    name: "Kate Johnson",
    email: "kate.johnson@example.com",
    avatar: professionalAvatars.male[1].url,
    role: "Learner",
    joinedDate: "2024-02-20",
    isAdmin: false
  },
  {
    id: 3,
    name: "Evan Scott",
    email: "evan.scott@example.com",
    avatar: professionalAvatars.male[0].url,
    role: "Learner",
    joinedDate: "2024-03-10",
    isAdmin: false
  },
  {
    id: 4,
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    avatar: professionalAvatars.female[1].url,
    role: "Instructor",
    joinedDate: "2024-01-20",
    isAdmin: true
  },
  {
    id: 5,
    name: "David Smith",
    email: "david.smith@example.com",
    avatar: professionalAvatars.male[2].url,
    role: "Learner",
    joinedDate: "2024-04-05",
    isAdmin: false
  }
];

export function ParticipantsPanel({ participantCount }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4" />;
      case 'Instructor':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return "bg-red-100 text-red-700 border-red-200";
      case 'Instructor':
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
          <Users className="h-4 w-4 mr-1" />
          View ({participantCount})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Participants ({participants.length})
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 flex flex-col h-full">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Participants List with proper scrolling */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-4 pr-4">
                {filteredParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-semibold">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {participant.name}
                          </h3>
                          <Badge className={`${getRoleBadgeColor(participant.role)} text-xs`}>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(participant.role)}
                              {participant.role}
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate mb-2">
                          {participant.email}
                        </p>
                        
                        <p className="text-xs text-gray-500">
                          Joined {formatDate(participant.joinedDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredParticipants.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No participants found matching your search.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ParticipantsPanel;