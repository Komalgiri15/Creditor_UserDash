import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Mail, BellDot } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationModal from "./NotificationModal";
import InboxModal from "./InboxModal";
import CalendarModal from "./CalendarModal";

export function DashboardHeader() {
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [inboxModalOpen, setInboxModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mock data for demonstration
  const mockData = {
    courses: [
      { id: 1, name: "React Basics", type: "Course", link: "/courses/1" },
      { id: 2, name: "Advanced JavaScript", type: "Course", link: "/courses/2" },
    ],
    catalogs: [
      { id: 1, name: "Web Development", type: "Catalog", link: "/catalogs/web" },
      { id: 2, name: "Data Science", type: "Catalog", link: "/catalogs/data" },
    ],
    faqs: [
      { id: 1, name: "How to enroll?", type: "FAQ", link: "/faqs#enroll" },
      { id: 2, name: "Payment methods", type: "FAQ", link: "/faqs#payment" },
    ],
    users: [
      { id: 1, name: "John Doe", type: "User", link: "/profile/1" },
      { id: 2, name: "Jane Smith", type: "Instructor", link: "/profile/2" },
    ],
  };

  // Aggregate all data for search
  const allData = [
    ...mockData.courses,
    ...mockData.catalogs,
    ...mockData.faqs,
    ...mockData.users,
  ];

  // Search logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = allData.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setSearchResults(results);
    setShowDropdown(results.length > 0);
  }, [searchQuery]);

  // Hide dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Group results by type
  const groupedResults = searchResults.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  // Handle search submit (icon click or Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setShowDropdown(searchResults.length > 0);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-md bg-white/95">
      <div className="container h-16 flex items-center justify-between px-6">
        {/* Logo/Brand */}
        <button
          className="flex items-center focus:outline-none"
          onClick={() => {
            if (window.location.pathname === '/dashboard') {
              window.location.reload();
            } else {
              window.location.href = '/dashboard';
            }
          }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Athena LMS
          </h1>
        </button>
        
        {/* Editable Search Bar (no dropdown, no search logic) */}
        <div className="flex-1 max-w-md mx-8 relative">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Search courses, lessons, or topics..."
              className="pl-12 pr-4 py-3 w-full bg-gray-50 border-0 rounded-2xl text-gray-800 text-sm h-12 shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-offset-0 transition-all duration-200"
              style={{ outline: 'none' }}
            />
          </div>
        </div>

        {/* Right - Enhanced Icons and Profile */}
        <div className="flex items-center gap-3">
          {/* Calendar Icon */}
          {/* <Button 
            size="icon" 
            variant="ghost" 
            className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-10 w-10 rounded-xl"
            onClick={() => setCalendarModalOpen(true)}
          >
            <Calendar className="h-5 w-5" />
          </Button> */}

          {/* Messages Icon */}
          {/* <Button 
            size="icon" 
            variant="ghost" 
            className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-10 w-10 rounded-xl"
            onClick={() => setInboxModalOpen(true)}
          >
            <Mail className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
          </Button> */}
          
          {/* Notifications */}
          {/* <Button 
            size="icon" 
            variant="ghost" 
            className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 h-10 w-10 rounded-xl"
            onClick={() => setNotificationModalOpen(true)}
          >
            <BellDot className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow-sm animate-pulse"></div>
          </Button> */}
          
          {/* Profile Dropdown */}
          <div className="ml-2">
            <ProfileDropdown />
          </div>
        </div>
      </div>
      
      {/* Calendar Modal */}
      <CalendarModal 
        open={calendarModalOpen} 
        onOpenChange={setCalendarModalOpen} 
      />
      
      {/* Notification Modal */}
      <NotificationModal 
        open={notificationModalOpen} 
        onOpenChange={setNotificationModalOpen} 
      />
      
      {/* Inbox Modal */}
      <InboxModal 
        open={inboxModalOpen} 
        onOpenChange={setInboxModalOpen} 
      />
    </header>
  );
}

export default DashboardHeader;