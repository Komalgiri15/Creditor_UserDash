import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Mail, BellDot, BookOpen, Loader2, Lock, AlertCircle, Users, User } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationModal from "./NotificationModal";
import InboxModal from "./InboxModal";
import CalendarModal from "./CalendarModal";
import UserDetailsModal from "@/components/UserDetailsModal";
import { search } from "@/services/searchService";
import { fetchUserCourses } from "@/services/courseService";
import { fetchDetailedUserProfile } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardHeader() {
  const { isInstructorOrAdmin } = useAuth();
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [inboxModalOpen, setInboxModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoadingEnrolled, setIsLoadingEnrolled] = useState(true);
  const [showEnrollmentAlert, setShowEnrollmentAlert] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Default count
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch enrolled courses on component mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const courses = await fetchUserCourses();
        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error);
        setEnrolledCourses([]);
      } finally {
        setIsLoadingEnrolled(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const data = await search(searchQuery);
          setSearchResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults({ results: { courses: [] } });
          setShowDropdown(true);
        } finally {
          setIsSearching(false);
        }
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
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

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || !searchResults) return;

    const totalResults = (searchResults.results?.courses?.length || 0) + 
                        (isInstructorOrAdmin() ? (searchResults.results?.users?.length || 0) : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < totalResults - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : totalResults - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0) {
          // Navigate to the selected result
          const courses = searchResults.results?.courses || [];
          const users = searchResults.results?.users || [];
          
          if (selectedResultIndex < courses.length) {
            handleCourseClick(courses[selectedResultIndex].id);
          } else if (isInstructorOrAdmin()) {
            const userIndex = selectedResultIndex - courses.length;
            if (userIndex < users.length) {
              handleUserClick(users[userIndex].id);
            }
          }
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedResultIndex(-1);
        break;
    }
  };

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedResultIndex(-1);
  }, [searchResults]);

  const handleCourseClick = (courseId) => {
    // Check if user is enrolled in this course
    const isEnrolled = enrolledCourses.some(course => course.id === courseId);
    
    if (isEnrolled) {
      setShowDropdown(false);
      setSearchQuery("");
      navigate(`/dashboard/courses/${courseId}/modules`);
    } else {
      // Show enrollment alert
      setSelectedCourseId(courseId);
      setShowEnrollmentAlert(true);
      setShowDropdown(false);
    }
  };

  const handleUserClick = async (userId) => {
    // Only instructors/admins can access user profiles
    if (isInstructorOrAdmin()) {
      setShowDropdown(false);
      setSearchQuery("");
      setUserDetailsError(null);
      setUserDetailsLoading(true);
      setShowUserDetailsModal(true);
      
      try {
        const userData = await fetchDetailedUserProfile(userId);
        setSelectedUser(userData);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setUserDetailsError(error?.message || 'Failed to fetch user details');
      } finally {
        setUserDetailsLoading(false);
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "" && searchResults) {
      setShowDropdown(true);
    }
  };

  const closeEnrollmentAlert = () => {
    setShowEnrollmentAlert(false);
    setSelectedCourseId(null);
  };

  // Handle notification updates
  const handleNotificationUpdate = (newCount) => {
    setUnreadNotifications(newCount);
  };

  return (
    <>
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
              LMS Athena 
            </h1>
          </button>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400">
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search courses and users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-4 py-3 w-full bg-gray-50 border-0 rounded-2xl text-gray-800 text-sm h-12 shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-offset-0 transition-all duration-200"
                style={{ outline: 'none' }}
              />
            </form>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
              >
                {/* Total Results Header */}
                {((searchResults.results?.courses?.length > 0) || (searchResults.results?.users?.length > 0)) && (
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-700">
                      Found {searchResults.results?.courses?.length || 0} course{(searchResults.results?.courses?.length || 0) !== 1 ? 's' : ''}
                      {isInstructorOrAdmin() && searchResults.results?.users?.length > 0 && (
                        <span> and {searchResults.results.users.length} user{(searchResults.results.users.length !== 1) ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Courses Section */}
                {searchResults.results?.courses?.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Courses ({searchResults.results.courses.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.results.courses.map((course, index) => {
                        const isEnrolled = enrolledCourses.some(ec => ec.id === course.id);
                        const isSelected = selectedResultIndex === index;
                        return (
                          <button
                            key={course.id}
                            onClick={() => handleCourseClick(course.id)}
                            onMouseEnter={() => setSelectedResultIndex(index)}
                            onMouseLeave={() => setSelectedResultIndex(-1)}
                            className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${
                              isSelected ? 'bg-blue-50' : ''
                            }`}
                          >
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                Course
                                {isEnrolled ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Enrolled
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Not Enrolled
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Users Section - Only show for instructors/admins */}
                {isInstructorOrAdmin() && searchResults.results?.users?.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Users ({searchResults.results.users.length})
                    </h3>
                    <div className="space-y-2">
                      {searchResults.results.users.map((user, index) => {
                        const userRole = user.user_roles?.[0]?.role || 'user';
                        const roleColor = userRole === 'admin' ? 'bg-red-100 text-red-800' : 
                                        userRole === 'instructor' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-gray-100 text-gray-600';
                        const isSelected = selectedResultIndex === searchResults.results.courses.length + index;
                        
                        return (
                          <button
                            key={user.id}
                            onClick={() => handleUserClick(user.id)}
                            onMouseEnter={() => setSelectedResultIndex(searchResults.results.courses.length + index)}
                            onMouseLeave={() => setSelectedResultIndex(-1)}
                            className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${
                              isSelected ? 'bg-blue-50' : ''
                            }`}
                          >
                            <User className="h-4 w-4 text-green-600" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                {user.email}
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColor}`}>
                                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Show message for non-instructors when users exist in search results */}
                {!isInstructorOrAdmin() && searchResults.results?.users?.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 text-center">
                      <Users className="h-4 w-4 mx-auto mb-2 text-gray-400" />
                      <p>User search results are available for instructors and administrators only.</p>
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {(!searchResults.results?.courses?.length && !searchResults.results?.users?.length) && (
                  <div className="p-4 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 mt-1">Try different keywords or check your spelling</p>
                  </div>
                )}

                {/* Loading State */}
                {isSearching && (
                  <div className="p-4 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin text-blue-500" />
                    <p>Searching...</p>
                  </div>
                )}

                {/* Keyboard Navigation Hints */}
                {showDropdown && searchResults && !isSearching && 
                 ((searchResults.results?.courses?.length > 0) || (searchResults.results?.users?.length > 0)) && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                    <div className="flex items-center justify-center gap-4">
                      <span>↑↓ Navigate</span>
                      <span>Enter Select</span>
                      <span>Esc Close</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Enhanced Icons and Profile */}
          <div className="flex items-center gap-3">
            
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
          onNotificationUpdate={handleNotificationUpdate}
        />
        
        {/* Inbox Modal */}
        <InboxModal 
          open={inboxModalOpen} 
          onOpenChange={setInboxModalOpen} 
        />
        
        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={showUserDetailsModal}
          onClose={() => {
            setShowUserDetailsModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          isLoading={userDetailsLoading}
          error={userDetailsError}
        />
      </header>

      {/* Enrollment Alert Modal */}
      {showEnrollmentAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Course Not Enrolled</h3>
                <p className="text-sm text-gray-600">You need to enroll in this course to access its modules.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/dashboard/catalog')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Browse Catalog
              </Button>
              <Button
                onClick={closeEnrollmentAlert}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardHeader;