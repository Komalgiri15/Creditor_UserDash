import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Book, Library, GraduationCap } from "lucide-react";
import { getUserAvatarUrl } from "@/lib/avatar-utils";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, clearUserData } from "@/services/userService";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileDropdown() {
  const [userAvatar, setUserAvatar] = useState(getUserAvatarUrl());
  const { userProfile } = useUser();
  const { logout: logoutAuth } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load avatar from localStorage if available
    setUserAvatar(getUserAvatarUrl());
    
    // Set up event listener for avatar changes
    const handleAvatarChange = () => {
      setUserAvatar(getUserAvatarUrl());
    };
    
    window.addEventListener("storage", handleAvatarChange);
    window.addEventListener("user-avatar-updated", handleAvatarChange);
    window.addEventListener("userProfileUpdated", handleAvatarChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleAvatarChange);
      window.removeEventListener("user-avatar-updated", handleAvatarChange);
      window.removeEventListener("userProfileUpdated", handleAvatarChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear all user data
    clearUserData();
    logoutAuth(); // Use AuthContext logout
    
    // Dispatch event to trigger UserContext refresh
    window.dispatchEvent(new Event('userRoleChanged'));
    
    // Redirect to landing page
    window.location.href = "/";
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          className="relative flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300 hover:bg-accent/60 p-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative group/avatar">
            <Avatar className="h-9 w-9 border border-border shadow-sm transition-all duration-300 group-hover/avatar:border-primary/30">
              <AvatarImage src={userAvatar} alt="User avatar" className="transition-all duration-500 group-hover/avatar:scale-110" />
              <AvatarFallback useSvgFallback={true} initials="AJ" className="bg-gradient-to-tr from-primary/80 to-primary text-white">
                <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}>
                  AJ
                </motion.span>
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-primary/0 rounded-full transition-colors duration-300 group-hover/avatar:bg-primary/10 animate-pulse-subtle"></div>
          </div>
          <div className="hidden md:block text-left group/text">
            <p className="text-sm font-semibold group-hover/text:text-primary transition-colors duration-300">
              {userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'User' : 'User'}
            </p>
            <p className="text-xs text-muted-foreground group-hover/text:text-primary/70 transition-colors duration-300">
              {userProfile?.email || 'Loading...'}
            </p>
          </div>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 shadow-lg border-primary/20 animate-scale-in backdrop-blur-sm bg-background/95" align="end" sideOffset={8}>
        <DropdownMenuLabel className="text-primary/80">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard/profile" className="w-full cursor-pointer transition-colors duration-300 hover:text-primary hover:bg-primary/5 group/menu rounded-md">
              <User className="mr-2 h-4 w-4 transition-all duration-300 group-hover/menu:text-primary group-hover/menu:scale-110" />
              <span className="transition-all duration-200">Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/10" />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 group/logout rounded-md"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4 transition-all duration-300 group-hover/logout:translate-x-1" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;