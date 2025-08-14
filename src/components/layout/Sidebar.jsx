import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Book,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  BookText,
  BarChart,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  Contact,
  ChevronDown,
  Gamepad2,
  GraduationCap,
  Library,
  School
} from "lucide-react";
import { allowedScormUserIds } from "@/data/allowedScormUsers";
import { currentUserId } from "@/data/currentUser";
import { getUserRole } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const SidebarItem = ({ icon: Icon, label, href, active, collapsed, dropdownContent, onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  if (dropdownContent) {
    return (
      <Link
        to={href}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
          active
            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500 shadow-sm font-medium"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        <Icon size={collapsed ? 24 : 20} />
        {!collapsed && <span className="font-medium">{label}</span>}
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileTap={{ scale: 0.98 }}>
            <Link
              to={href}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-4 px-4 py-3 mx-2 rounded-xl transition-all duration-200 relative group",
                collapsed ? "justify-center px-2" : "",
                active
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md border-l-4 border-blue-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm"
              )}
            >
              <Icon size={collapsed ? 24 : 20} className={cn(
                "transition-all duration-200",
                active ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
              )} />
              {!collapsed && (
                <span className={cn(
                  "transition-colors duration-200",
                  active ? "font-semibold text-blue-700" : "text-gray-700 group-hover:text-gray-900"
                )}>
                  {label}
                </span>
              )}
            </Link>
          </motion.div>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent 
            side="right" 
            className="bg-gray-900 border-gray-700 text-white shadow-xl"
          >
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, isInstructorOrAdmin } = useAuth();

  const isActive = (path) => {
    if (path === "/dashboard") {
      // Only active on the dashboard root, not on subpages
      return location.pathname === "/dashboard";
    }
    return location.pathname === path;
  };

  const handleNavigate = (path) => {
    // Keep sidebar collapsed when on instructor portal
    if (collapsed && path !== "/instructor") {
      setCollapsed(false);
    }
    // Collapse sidebar when navigating to instructor portal
    if (path === "/instructor") {
      setCollapsed(true);
    }
  };

  const handleLogoClick = () => {
    if (window.location.pathname === '/dashboard') {
      window.location.reload();
    } else {
      navigate('/dashboard');
    }
    if (collapsed) {
      setCollapsed(false);
    }
  };

  // Replace localStorage logic with a constant for testing
  const isScormAllowed = allowedScormUserIds.includes(currentUserId);

  // Help section navigation items
  const helpItems = [
    // { icon: FileQuestion, label: "FAQs", path: "/dashboard/faqs" },
    // { icon: MessageSquare, label: "Contact Support", path: "/dashboard/support" },
    // { icon: BookOpen, label: "User Guides", path: "/dashboard/guides" },
    { icon: Contact, label: "Create Ticket", path: "/dashboard/support/ticket" },
    { icon: FileQuestion, label: "My Tickets", path: "/dashboard/support/tickets" }
  ];

  // Animation variants with smooth transition
  const sidebarVariants = {
    expanded: { 
      width: "17rem",
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    collapsed: { 
      width: "4.5rem",
      transition: { type: "spring", stiffness: 400, damping: 40 }
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div
      className="h-screen sticky top-0 flex flex-col bg-white border-r border-gray-200 shadow-lg z-20 overflow-hidden"
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      initial={false}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-gray-200 p-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-md",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <motion.button
            onClick={handleLogoClick}
            className="font-bold text-xl flex items-center gap-3 text-white hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={22} className="text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-base leading-tight font-bold">Creditor</span>
              <span className="text-blue-100 text-sm leading-tight font-medium">Academy</span>
            </div>
          </motion.button>
        )}
        
        {collapsed && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={handleLogoClick}
                  className="cursor-pointer"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen size={22} className="text-blue-600" />
                  </div>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white shadow-xl">
                Creditor Academy
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {!collapsed && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-white/20 border-none rounded-lg"
            >
              <ChevronLeft size={18} />
            </Button>
          </motion.div>
        )}
        
        {collapsed && (
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(false)}
                className="h-8 w-8 bg-white text-blue-600 hover:bg-gray-50 border border-gray-200 rounded-full shadow-lg"
              >
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-hidden py-6 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <motion.div 
          className="space-y-2 overflow-hidden px-2"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <SidebarItem
              icon={Home}
              label="Dashboard"
              href="/dashboard"
              active={isActive("/dashboard")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <SidebarItem
              icon={Book}
              label="My Courses"
              href="/dashboard/courses"
              active={isActive("/dashboard/courses")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div>

          {/* <motion.div variants={itemVariants}>
            <SidebarItem
              icon={Users}
              label="Study Groups"
              href="/groups"
              active={isActive("/groups")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div> */}

          <motion.div variants={itemVariants}>
            <SidebarItem
              icon={Library}
              label="Course Catalog"
              href="/dashboard/catalog"
              active={isActive("/dashboard/catalog")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div>

          {/* <motion.div variants={itemVariants}>
            <SidebarItem
              icon={BarChart}
              label="My Progress"
              href="/progress"
              active={isActive("/progress")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div> */}

          {/* <motion.div variants={itemVariants}>
            <SidebarItem
              icon={MessageSquare}
              label="Messages"
              href="/messages"
              active={isActive("/messages")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div> */}

          {/* <motion.div variants={itemVariants}>
            <SidebarItem
              icon={Gamepad2}
              label="Games"
              href="/games"
              active={isActive("/games")}
              collapsed={collapsed}
              onNavigate={handleNavigate}
            />
          </motion.div> */}

          {/* Instructor Portal - only for admin or instructor */}
          {isInstructorOrAdmin() && (
            <motion.div variants={itemVariants}>
              <SidebarItem
                icon={GraduationCap}
                label="Instructor Portal"
                href="/instructor"
                active={isActive("/instructor")}
                collapsed={collapsed}
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}


        </motion.div>
      </div>

      {/* Help & Support Footer  */}
      <motion.div 
        className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-gray-100"
        variants={itemVariants}
      >
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button 
                      className="w-full flex justify-center p-3 hover:bg-gray-200 rounded-xl transition-all duration-200 text-gray-600 group shadow-sm"
                      whileTap={{ scale: 0.98 }}
                    >
                      <HelpCircle size={24} />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    side="right" 
                    align="start" 
                    className="w-56 bg-white border-gray-200 shadow-xl rounded-xl"
                  >
                    {helpItems.map((item, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <Link to={item.path} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 text-gray-700 rounded-lg p-2">
                          <item.icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-900 text-white shadow-xl">Help & Support</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                className="w-full justify-start px-4 py-3 text-sm font-semibold bg-white hover:bg-gray-100 rounded-xl flex items-center gap-3 group transition-all duration-200 text-gray-700 shadow-sm border border-gray-200"
                whileTap={{ y: 0 }}
              >
                <HelpCircle size={18} />
                <span>Help & Support</span>
                <ChevronDown size={14} className="ml-auto transition-transform duration-200 group-hover:rotate-180" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white border-gray-200 shadow-xl rounded-xl"
            >
              {helpItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <DropdownMenuItem asChild>
                    <Link to={item.path} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 text-gray-700 rounded-lg p-2">
                      <item.icon size={16} className="text-gray-500" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </motion.div> 
    </motion.div>
  );
}

export default Sidebar;