import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Mail, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { professionalAvatars } from "@/lib/avatar-utils";

// Sample members data with professional avatars
const initialMembers = [
  {
    id: 1,
    name: "Sarah Adams",
    email: "sarah.adams@example.com",
    avatar: professionalAvatars.female[0].url,
    joinDate: "Jan 15, 2025",
    isAdmin: true,
    role: "Group Admin"
  },
  {
    id: 2,
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: professionalAvatars.male[0].url,
    joinDate: "Jan 20, 2025",
    isAdmin: false,
    role: "Member"
  },
  {
    id: 3,
    name: "Mike Peterson",
    email: "mike.p@example.com",
    avatar: professionalAvatars.male[2].url,
    joinDate: "Feb 3, 2025",
    isAdmin: false,
    role: "Member"
  },
  {
    id: 4,
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    avatar: professionalAvatars.female[1].url,
    joinDate: "Feb 10, 2025",
    isAdmin: true,
    role: "Moderator"
  },
  {
    id: 5,
    name: "David Smith",
    email: "david.smith@example.com",
    avatar: professionalAvatars.male[1].url,
    joinDate: "Mar 5, 2025",
    isAdmin: false,
    role: "Member"
  }
];

export function MembersPage() {
  const [members] = useState(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter members based on search query
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count admins
  const adminCount = members.filter(member => member.isAdmin).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Members</CardTitle>
          <CardDescription>
            {members.length} members · {adminCount} admins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 pb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={`${member.name}'s avatar`} />
                          <AvatarFallback useSvgFallback={true}>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.isAdmin ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 font-normal">
                          <Shield className="h-3 w-3" />
                          {member.role}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">{member.role}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.joinDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No members found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default MembersPage;