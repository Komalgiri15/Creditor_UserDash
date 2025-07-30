import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import ProfileSecurity from "@/components/profile/ProfileSecurity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Camera } from "lucide-react";
import { getUserAvatarUrl } from "@/lib/avatar-utils";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { fetchUserProfile, updateUserProfile } from "@/services/userService";

function Profile() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      bio: "Learning enthusiast and software developer",
      title: "Software Developer",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      timezone: "America/New_York" // Default to EST
    }
  });

  // Fetch user profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        console.log("🔍 Fetching user profile from /api/user/getUserProfile...");
        const data = await fetchUserProfile();
        console.log("✅ GET /api/user/getUserProfile - Response Data:", data);
        
        setUserRole(
          Array.isArray(data.user_roles) && data.user_roles.length > 0
            ? data.user_roles.map(r => r.role).join(', ')
            : 'User'
        );
        
        // Store all roles in localStorage for proper access control
        if (Array.isArray(data.user_roles) && data.user_roles.length > 0) {
          const roles = data.user_roles.map(roleObj => roleObj.role);
          localStorage.setItem('userRoles', JSON.stringify(roles));
          localStorage.setItem('userRole', roles[0]); // Keep first role for backward compatibility
        } else {
          localStorage.setItem('userRoles', JSON.stringify(['user']));
          localStorage.setItem('userRole', 'user');
        }
        
        // Store timezone in localStorage for use in other components
        const userTimezone = data.timezone || 'America/New_York';
        localStorage.setItem('userTimezone', userTimezone);
        
        const formData = {
          fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email: data.email || 'Not Provided',
          bio: data.bio || '',
          title: data.title || '',
          phone: data.phone || '',
          location: data.location || '',
          timezone: userTimezone,
        };
        
        console.log("📝 Setting form data with timezone:", formData);
        form.reset(formData);
        
        console.log("📝 Form populated with user data:", {
          fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          email: data.email,
          timezone: userTimezone,
          user_roles: data.user_roles
        });
        
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
        toast.error("Failed to load profile data");
      }
    }
    loadProfile();
  }, [form]);

  // Update user profile on submit
  const onSubmit = async (values) => {
    setIsUpdating(true);
    try {
      // Split fullName into first and last name
      const [first_name, ...rest] = values.fullName.split(" ");
      const last_name = rest.join(" ");
      
      const updateData = {
        first_name,
        last_name,
        bio: values.bio,
        title: values.title,
        phone: values.phone,
        location: values.location,
        timezone: values.timezone,
      };
      
      console.log("📤 POST /api/user/updateUserProfile - Request Data:", updateData);
      console.log("🕐 Timezone being sent:", values.timezone);
      
      const response = await updateUserProfile(updateData);
      console.log("✅ POST /api/user/updateUserProfile - Response:", response);
      
      // Check if the response contains the updated timezone
      if (response.data && response.data.timezone) {
        console.log("✅ Timezone updated in response:", response.data.timezone);
      } else {
        console.warn("⚠️ No timezone found in response data:", response);
      }
      
      // Update timezone in localStorage after successful profile update
      localStorage.setItem('userTimezone', values.timezone);
      console.log("💾 Timezone saved to localStorage:", values.timezone);
      
      toast.success("Profile updated successfully");
      
      // Instead of reloading, let's refetch the profile to confirm the update
      console.log("🔄 Refetching profile to confirm timezone update...");
      const updatedProfile = await fetchUserProfile();
      console.log("✅ Refetched profile data:", updatedProfile);
      console.log("🕐 Current timezone in profile:", updatedProfile.timezone);
      
      // Update the form with the latest data
      const updatedFormData = {
        fullName: `${updatedProfile.first_name || ''} ${updatedProfile.last_name || ''}`.trim(),
        email: updatedProfile.email || 'Not Provided',
        bio: updatedProfile.bio || '',
        title: updatedProfile.title || '',
        phone: updatedProfile.phone || '',
        location: updatedProfile.location || '',
        timezone: updatedProfile.timezone || 'America/New_York',
      };
      
      console.log("📝 Resetting form with updated data:", updatedFormData);
      form.reset(updatedFormData);
      
      // Update localStorage with the confirmed timezone
      localStorage.setItem('userTimezone', updatedProfile.timezone || 'America/New_York');
      
      // Force a re-render by updating the form state
      setTimeout(() => {
        console.log("🔄 Form state after reset:", form.getValues());
        console.log("🕐 Current timezone in form:", form.getValues('timezone'));
      }, 100);
      
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      console.error("❌ Error details:", {
        message: err.message,
        stack: err.stack
      });
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarClick = () => {
    navigate('/avatar-picker?redirect=/profile');
  };

  useEffect(() => {
    const updateAvatar = () => {
      // This useEffect is no longer needed as avatarUrl is removed.
      // Keeping it for now in case it's re-added or for future context.
    };
    
    window.addEventListener("storage", updateAvatar);
    window.addEventListener("user-avatar-updated", updateAvatar);
    updateAvatar();
    
    return () => {
      window.removeEventListener("storage", updateAvatar);
      window.removeEventListener("user-avatar-updated", updateAvatar);
    };
  }, []);

  return (
    <div className="container max-w-4xl py-6 space-y-8 animate-fade-in">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src="/default-avatar.png" alt="Profile avatar" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-purple-400 text-white">AJ</AvatarFallback>
          </Avatar>
          
          {/* <Button 
            size="icon"
            variant="secondary" 
            className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleAvatarClick}
          >
            <Camera size={15} />
            <span className="sr-only">Change avatar</span>
          </Button> */}
        </div>

        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex flex-row items-center gap-2 sm:gap-4">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Profile Settings</h1>
            {userRole && (
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 capitalize">
                {userRole}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 w-full">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          {/* <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="w-full transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              {/* Removed user role display from here */}
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" readOnly disabled className="bg-gray-100 cursor-not-allowed" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    {/* <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>

                  {/* <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  {/* Timezone selection */}
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={(value) => {
                            console.log("🕐 Timezone field changed to:", value);
                            field.onChange(value);
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/Los_Angeles">PST (Pacific Time US & Canada)</SelectItem>
                              <SelectItem value="America/Denver">MST (Mountain Time US & Canada)</SelectItem>
                              <SelectItem value="America/New_York">EST (Eastern Time US & Canada)</SelectItem>
                              <SelectItem value="Europe/London">GMT (Greenwich Mean Time)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        {/* Debug info */}
                        <div className="text-xs text-gray-500 mt-1">
                          Current value: {field.value || 'Not set'}
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-primary to-purple-400 transition-all duration-300 hover:opacity-90"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <ProfileSecurity />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;