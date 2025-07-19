import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Settings, UserPlus, MoreVertical, UserMinus, UserCog, Bell } from "lucide-react";
import { toast } from "sonner";

// Sample admins data
const initialAdmins = [
  {
    id: 1,
    name: "Sarah Adams",
    email: "sarah.adams@example.com",
    avatar: "",
    role: "Group Admin",
    permissions: ["manage_members", "manage_content", "manage_settings"]
  },
  {
    id: 2,
    name: "Lisa Wong",
    email: "lisa.wong@example.com",
    avatar: "",
    role: "Moderator",
    permissions: ["manage_content"]
  }
];

export function AdminPage() {
  const [admins] = useState(initialAdmins);
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("admins");
  
  // Functions for admin management
  const handleAddAdmin = () => {
    // In a real app, this would add a new admin 
    setIsAddAdminDialogOpen(false);
    toast.success("Admin added successfully!");
  };
  
  return (
    <Tabs defaultValue="admins" onValueChange={setSelectedTab}>
      <TabsList className="mb-6 grid w-full grid-cols-3 gap-4">
        <TabsTrigger value="admins" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Administrators
        </TabsTrigger>
        <TabsTrigger value="invitations" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invitations & Access
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Group Settings
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="admins" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Group Administrators</h2>
          <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Administrator
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Grant administrative privileges to an existing member
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="member">Select Member</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alex">Alex Johnson</SelectItem>
                      <SelectItem value="mike">Mike Peterson</SelectItem>
                      <SelectItem value="david">David Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Admin Role</Label>
                  <Select defaultValue="moderator">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Group Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAdminDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>Add Administrator</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {admins.map((admin) => (
                <div key={admin.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                      {admin.avatar && <AvatarImage src={admin.avatar} />}
                    </Avatar>
                    <div>
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-sm text-muted-foreground">{admin.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {admin.role}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <UserCog className="h-4 w-4" />
                          Edit Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <UserMinus className="h-4 w-4" />
                          Remove Admin Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="invitations" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite Members</CardTitle>
            <CardDescription>
              Invite new members to join this group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="Enter email address" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="member">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-2">
                <Bell className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
            <CardDescription>
              Manage your group's settings and configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="group-name">Group Name</Label>
                <Input id="group-name" defaultValue="Web Development" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="group-description">Group Description</Label>
                <Input id="group-description" defaultValue="Learn modern web development techniques together" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="privacy">Privacy Settings</Label>
                <Select defaultValue="private">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can join</SelectItem>
                    <SelectItem value="private">Private - Invitation only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default AdminPage;