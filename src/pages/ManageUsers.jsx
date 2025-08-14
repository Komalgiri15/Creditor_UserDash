import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import UserDetailsModal from "@/components/UserDetailsModal";
import { getAuthHeader } from "../services/authHeader";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://creditor-backend-9upi.onrender.com";

const ManageUsers = () => {
  const { userRole, hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("user");
  const [apiCallTime, setApiCallTime] = useState(null);
  
  // Clear selected users when filter role changes
  useEffect(() => {
    setSelectedUsers([]);
  }, [filterRole]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [addingToCourse, setAddingToCourse] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ courseTitle: "", addedUsers: [] });
  
  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccessData, setPasswordSuccessData] = useState({ 
    changedUsers: [], 
    newPassword: "", 
    failedUpdates: [] 
  });
  const [showPasswordSuccessModal, setShowPasswordSuccessModal] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [updatingRole, setUpdatingRole] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [enrollmentProgress, setEnrollmentProgress] = useState({ current: 0, total: 0 });
  
  // User details modal state
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  // Sorting state
  const [sortOption, setSortOption] = useState("alpha_asc");

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  // Handle userId from search navigation
  useEffect(() => {
    const userId = searchParams.get('userId');
    console.log('🔍 Search navigation - userId:', userId);
    console.log('🔍 Search navigation - users.length:', users.length);
    
    if (userId && users.length > 0) {
      const user = users.find(u => u.id === userId);
      console.log('🔍 Search navigation - found user:', user);
      
      if (user) {
        // Fetch detailed user profile data before opening modal
        fetchDetailedUserProfile(userId);
        // Clear the query parameter after processing
        setSearchParams({});
      } else {
        console.warn('⚠️ Search navigation - User not found in users array');
        // Try to refresh users list to see if the user appears
        console.log('🔄 Refreshing users list to find the user...');
        fetchUsers();
      }
    } else if (userId && users.length === 0) {
      console.log('🔍 Search navigation - Waiting for users to load...');
    }
  }, [searchParams, users, setSearchParams]);

  // Handle case where user might be found after users list is refreshed
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && users.length > 0 && !showUserDetailsModal) {
      const user = users.find(u => u.id === userId);
      if (user) {
        console.log('🔍 User found after refresh, opening modal...');
        fetchDetailedUserProfile(userId);
        setSearchParams({});
      }
    }
  }, [users, searchParams, showUserDetailsModal, setSearchParams]);

  // Function to fetch detailed user profile and open modal
  const fetchDetailedUserProfile = async (userId) => {
    try {
      setLoadingUserDetails(true);
      console.log('🔍 Searching for user with ID:', userId);
      console.log('🔍 Available users:', users);
      console.log('🔍 User IDs in users array:', users.map(u => u.id));
      
      // Since the users array from /api/user/all should already contain detailed data,
      // we can use that directly. If we need to refresh the data, we can do so here.
      const user = users.find(u => u.id === userId);
      console.log('🔍 Found user:', user);
      
      if (user) {
        console.log('🔍 User data for modal:', {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          website: user.website,
          createdAt: user.createdAt,
          is_active: user.is_active,
          last_login: user.last_login,
          activity_log: user.activity_log
        });
        setSelectedUserForDetails(user);
        setShowUserDetailsModal(true);
      } else {
        console.warn('⚠️ User not found in users array, userId:', userId);
        // If user is not found, we might need to refresh the users list
        // or the user ID from search might not match the user ID from /api/user/all
      }
    } catch (error) {
      console.error('❌ Error processing user profile:', error);
      // Fallback to basic user data if processing fails
      const user = users.find(u => u.id === userId);
      if (user) {
        setSelectedUserForDetails(user);
        setShowUserDetailsModal(true);
      }
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Function to close user details modal and clear search params
  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUserForDetails(null);
    // Clear any remaining search params
    if (searchParams.get('userId')) {
      setSearchParams({});
    }
  };

  // Update time differences every minute to keep them current
  useEffect(() => {
    if (!apiCallTime) return;

    const interval = setInterval(() => {
      // Force a re-render by updating a state that triggers recalculation
      setUsers(prevUsers => [...prevUsers]);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [apiCallTime]);

  // Force refresh when forceUpdate changes
  useEffect(() => {
    if (forceUpdate > 0) {
      fetchUsers();
    }
  }, [forceUpdate]);

  const getAuthConfig = () => ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthHeader() || {}), // getAuthHeader should return { Authorization: 'Bearer ...' }
    },
    credentials: 'include',
    withCredentials: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const currentTime = new Date();
      setApiCallTime(currentTime);

      const response = await axios.get(
        `${API_BASE}/api/user/all`,
        getAuthConfig()
      );

      if (response.data && response.data.code === 200) {
        const fetchedUsers = response.data.data || [];
        setUsers(fetchedUsers);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to load users. Please try again.');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/course/getAllCourses`,
        getAuthConfig()
      );

      if (response.data && response.data.data) {
        const publishedCourses = response.data.data.filter(course => 
          course.course_status === 'PUBLISHED'
        );
        setCourses(publishedCourses);
      } else if (response.data && Array.isArray(response.data)) {
        const publishedCourses = response.data.filter(course => 
          course.course_status === 'PUBLISHED'
        );
        setCourses(publishedCourses);
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      console.error('❌ Courses error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Fallback to dummy courses if API fails (only published courses)
      setCourses([
        { id: "1", title: "Introduction to React", course_status: "PUBLISHED" },
        { id: "2", title: "Advanced JavaScript", course_status: "PUBLISHED" },
        { id: "3", title: "Web Development Fundamentals", course_status: "PUBLISHED" }
      ]);
    }
  };

  // Helper function to get user role from user_roles array
  const getUserRole = (user) => {
    if (user.user_roles && user.user_roles.length > 0) {
      // Priority order: admin > instructor > user (single role system)
      const roles = user.user_roles.map(r => r.role);
      
      if (roles.includes('admin')) {
        return 'admin';
      } else if (roles.includes('instructor')) {
        return 'instructor';
      } else {
        const role = roles[0];
        return role;
      }
    }
    return 'user'; // default role when no role is assigned in backend
  };

  // Helper function to calculate time difference and format it
  const calculateTimeDifference = (lastLoginTime) => {
    if (!apiCallTime || !lastLoginTime) {
      return null;
    }

    const lastLogin = new Date(lastLoginTime);
    const timeDifference = apiCallTime.getTime() - lastLogin.getTime();
    
    // Convert milliseconds to different time units
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    // Format the time difference
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds > 0) {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Helper to get last visited timestamp (ms) for sorting
  const getLastVisitedTimestamp = (user) => {
    if (user?.activity_log && user.activity_log.length > 0) {
      const latest = user.activity_log.reduce((latestLog, log) => {
        const t = new Date(log.createdAt || log.created_at || log.timestamp || log.time).getTime();
        return t > latestLog ? t : latestLog;
      }, 0);
      return latest || null;
    }
    return null;
  };

  // Helper to get createdAt timestamp (ms) for sorting "just added"
  const getCreatedAtTimestamp = (user) => {
    const created = user?.createdAt || user?.created_at || user?.created_on || user?.createdDate;
    if (!created) return null;
    const t = new Date(created).getTime();
    return isNaN(t) ? null : t;
  };

  // Helper to get full name for alphabetical sorting
  const getFullName = (user) => `${user.first_name || ""} ${user.last_name || ""}`.trim().toLowerCase();

  // Helper function to get last visited from activity_log
  const getLastVisited = (user) => {
    if (user.activity_log && user.activity_log.length > 0) {
      // Sort by createdAt and get the latest
      const sortedLogs = user.activity_log.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const lastLoginTime = sortedLogs[0].createdAt;
      
      // Calculate and return the time difference
      return calculateTimeDifference(lastLoginTime);
    }
    return null;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRole = getUserRole(user);
    const matchesRole = userRole === filterRole;
    
    // Debug logging for filtering
    if (user.first_name && user.last_name) {
      // console.log(`🔍 Filtering user: ${user.first_name} ${user.last_name}`, {
      //   id: user.id,
      //   userRole,
      //   filterRole,
      //   matchesRole,
      //   matchesSearch,
      //   user_roles: user.user_roles
      // });
    }
    
    return matchesSearch && matchesRole;
  });

  // Sort users based on selected option (applied after filter, before pagination)
  const sortedUsers = useMemo(() => {
    const arr = [...filteredUsers];
    switch (sortOption) {
      case "alpha_asc":
        arr.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
        break;
      case "alpha_desc":
        arr.sort((a, b) => getFullName(b).localeCompare(getFullName(a)));
        break;
      case "never_visited":
        arr.sort((a, b) => {
          const aVisited = getLastVisitedTimestamp(a);
          const bVisited = getLastVisitedTimestamp(b);
          if (aVisited === null && bVisited !== null) return -1;
          if (aVisited !== null && bVisited === null) return 1;
          // fallback alphabetical
          return getFullName(a).localeCompare(getFullName(b));
        });
        break;
      case "just_added":
        arr.sort((a, b) => {
          const aCreated = getCreatedAtTimestamp(a);
          const bCreated = getCreatedAtTimestamp(b);
          if (aCreated === null && bCreated === null) return 0;
          if (aCreated === null) return 1;
          if (bCreated === null) return -1;
          return bCreated - aCreated; // newest first
        });
        break;
      default:
        break;
    }
    return arr;
  }, [filteredUsers, sortOption]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, sortOption]);

  // Modified handleSelectAll to accumulate selections across pages
  const handleSelectAll = () => {
    const currentPageUserIds = currentUsers.map(user => user.id);
    const allCurrentSelected = currentPageUserIds.every(id => selectedUsers.includes(id));
    if (allCurrentSelected) {
      // Deselect all users on this page only
      setSelectedUsers(selectedUsers.filter(id => !currentPageUserIds.includes(id)));
    } else {
      // Add all users from this page to the selection (accumulate)
      setSelectedUsers(Array.from(new Set([...selectedUsers, ...currentPageUserIds])));
    }
  };

  // Only show the select-all-across-pages button if all users on the current page are selected
  const showSelectAllAcrossPages = () => {
    const currentPageUserIds = currentUsers.map(user => user.id);
    return currentPageUserIds.length > 0 && currentPageUserIds.every(id => selectedUsers.includes(id));
  };

  // handleSelectUser: Deselecting a user removes them from selectedUsers
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // New function to select all users across all pages for the current filter role
  const handleSelectAllUsers = () => {
    // Get all users that match the current filter role
    const allFilteredUsers = users.filter(user => {
      const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const userRole = getUserRole(user);
      const matchesRole = userRole === filterRole;
      
      return matchesSearch && matchesRole;
    });

    // Get all user IDs for the filtered users
    const allFilteredUserIds = allFilteredUsers.map(user => user.id);
    
    // Check if all filtered users are already selected
    const allSelected = allFilteredUserIds.every(id => selectedUsers.includes(id));
    
    if (allSelected) {
      // If all are selected, deselect all
      setSelectedUsers([]);
    } else {
      // If not all are selected, select all
      setSelectedUsers(allFilteredUserIds);
    }
  };

  // Helper function to get total count of users for current filter role
  const getTotalFilteredUsersCount = () => {
    return users.filter(user => {
      const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const userRole = getUserRole(user);
      const matchesRole = userRole === filterRole;
      
      return matchesSearch && matchesRole;
    }).length;
  };

  const handleAddToCourse = async () => {
    if (selectedUsers.length === 0 || !selectedCourse) return;
    
    try {
      setAddingToCourse(true);
      setError("");
      let response;
      const selectedCourseData = courses.find(c => c.id === selectedCourse);
      if (!selectedCourseData) {
        throw new Error(`Course with ID "${selectedCourse}" not found. Available courses: ${courses.map(c => c.id).join(', ')}`);
      }
      response = await axios.post(
        `${API_BASE}/api/course/addLearnerToCourse`,
        {
          course_id: selectedCourse,
          learnerIds: selectedUsers
        },
        getAuthConfig()
      );

      if (response.data && (response.data.success || response.data.code === 200 || response.data.code === 201)) {
        // Get the selected course title
        const selectedCourseData = courses.find(course => course.id === selectedCourse);
        const courseTitle = selectedCourseData ? selectedCourseData.title : selectedCourse;
        
        // Get the selected users data
        const addedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        // Set success data and show success modal
        setSuccessData({
          courseTitle: courseTitle,
          addedUsers: addedUsers
        });
        setShowSuccessModal(true);
        
        // Close course selection modal and reset course selection
        setShowCourseModal(false);
        setSelectedCourse("");
        // Don't clear selectedUsers here - keep them selected for potential "Add to More Courses"
        
        // After successful addition, verify the users are actually in the course
        try {
          const verifyResponse = await axios.get(
            `${API_BASE}/api/course/${selectedCourse}/getAllUsersByCourseId`,
            getAuthConfig()
          );
          
          // console.log('✅ Course users verification response:', verifyResponse.data);
          // console.log('📋 Users in course after addition:', verifyResponse.data?.data || []);
          
          // Check if our added users are actually in the course
          const courseUsers = verifyResponse.data?.data || [];
          const addedUserIds = selectedUsers;
          const foundUsers = courseUsers.filter(cu => addedUserIds.includes(cu.user_id));
          
          // console.log('🔍 Verification results:', {
          //   expectedUsers: addedUserIds,
          //   foundUsers: foundUsers.map(fu => fu.user_id),
          //   missingUsers: addedUserIds.filter(id => !foundUsers.some(fu => fu.user_id === id))
          // });
          
          if (foundUsers.length !== addedUserIds.length) {
            // console.warn('⚠️ Some users were not found in course after addition!');
            // console.warn('📋 Missing users:', addedUserIds.filter(id => !foundUsers.some(fu => fu.user_id === id)));
          } else {
            // console.log('✅ All users successfully verified in course!');
          }
        } catch (verifyError) {
          console.error('❌ Error verifying course users:', verifyError);
        }
        
        // Refresh users list to get updated course information
        await fetchUsers();
        
        // console.log(`${filterRole}s added to course successfully`);
      } else {
        throw new Error(response.data?.message || `Failed to add ${filterRole}s to course`);
      }
    } catch (error) {
      console.error(`Error adding ${filterRole}s to course:`, error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data
      });
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        // 409 means some users are already assigned, but this is not a complete failure
        // console.log('⚠️ 409 Conflict - Some users already assigned to course:', error.response.data);
        // console.log('🔍 Full 409 response analysis:', {
        //   status: error.response.status,
        //   data: error.response.data,
        //   error: error.response.data?.error,
        //   message: error.response.data?.message
        // });
        
        // Get the selected course title
        const selectedCourseData = courses.find(course => course.id === selectedCourse);
        const courseTitle = selectedCourseData ? selectedCourseData.title : selectedCourse;
        
        // Extract error message from backend response
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
        
        // console.log('📋 Backend error message:', errorMessage);
        
        // Parse the error message to extract user IDs if present
        // Backend returns: "Users fc78ddd2-d389-4844-a387-53d257fb04a0 are already instructors for this course"
        const userMatch = errorMessage.match(/Users\s+([^,\s]+(?:\s*,\s*[^,\s]+)*)\s+are already/);
        
        if (userMatch) {
          const existingUserIds = userMatch[1].split(',').map(id => id.trim());
          // console.log('🔍 Found existing user IDs in error message:', existingUserIds);
          
          // Check which users are already assigned vs. which are new
          const alreadyAssignedIds = existingUserIds;
          const newUserIds = selectedUsers.filter(id => !alreadyAssignedIds.includes(id));
          
          // console.log('📋 User analysis:', {
          //   selectedUsers,
          //   alreadyAssignedIds,
          //   newUserIds
          // });
          
          if (newUserIds.length > 0) {
            // Some users are new and should be added
            // console.log('✅ Some users are new, attempting to add them individually...');
            
            // Try to add each new user individually
            const successfulAdds = [];
            const failedAdds = [];
            
            for (const userId of newUserIds) {
              try {
                // console.log(`🔄 Attempting to add user ${userId} individually...`);
                
                const individualResponse = await axios.post(
                  `${API_BASE}/api/course/addInstructor/${selectedCourse}`,
                  {
                    instructorIds: [userId]
                  },
                  getAuthConfig()
                );
                
                if (individualResponse.status >= 200 && individualResponse.status < 300) {
                  successfulAdds.push(userId);
                  // console.log(`✅ Successfully added user ${userId}`);
                }
              } catch (individualError) {
                // console.log(`❌ Failed to add user ${userId}:`, individualError.response?.data);
                failedAdds.push(userId);
              }
            }
            
            // Show results
            if (successfulAdds.length > 0) {
              const addedUsersData = users.filter(user => successfulAdds.includes(user.id));
              
              // console.log('✅ Showing success modal for individually added users:', addedUsersData);
              
              setSuccessData({
                courseTitle: courseTitle,
                addedUsers: addedUsersData
              });
              setShowSuccessModal(true);
              
              // Close course selection modal and reset
              setShowCourseModal(false);
              setSelectedCourse("");
              setSelectedUsers([]);
              
              // Refresh users list to get updated course information
              await fetchUsers();
            } else {
              // All users failed to be added individually
              setError(`All selected ${filterRole}s are already assigned to the course "${courseTitle}".`);
              setShowCourseModal(false);
              setSelectedCourse("");
              setSelectedUsers([]);
            }
          } else {
            // All users are already assigned
            // console.log('ℹ️ All users already assigned, showing info message');
            setError(`All selected ${filterRole}s are already assigned to the course "${courseTitle}".`);
            setShowCourseModal(false);
            setSelectedCourse("");
            setSelectedUsers([]);
          }
        } else {
          // Generic 409 message - couldn't parse user IDs
          // console.log('⚠️ Generic 409 response, showing default message');
          setError(`Some ${filterRole}s are already assigned to this course. This is normal and won't affect their access.`);
          setShowCourseModal(false);
          setSelectedCourse("");
          setSelectedUsers([]);
        }
      } else if (error.response?.status === 400) {
        setError('Invalid request. Please check your selection and try again.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 500) {
        setError(`Server error: ${error.response?.data?.message || 'Internal server error occurred. Please try again.'}`);
      } else {
        setError(`Failed to add ${filterRole}s to course. Please try again.`);
      }
    } finally {
      setAddingToCourse(false);
    }
  };

  const handleMakeInstructor = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setUpdatingRole(true);
      setError("");
      
      // console.log('🔄 Making instructor API call:', {
      //   url: `${API_BASE}/api/user/make-instructors`,
      //   payload: { user_ids: selectedUsers },
      //   selectedUsers
      // });
      
      // Make API call to make users instructors using the correct endpoint and payload
      const response = await axios.post(
        `${API_BASE}/api/user/make-instructors`,
        { user_ids: selectedUsers },
        getAuthConfig()
      );

      // Detailed analysis of the response
      // console.log('🔍 Detailed response analysis:', {
      //   hasData: !!response.data,
      //   dataType: typeof response.data,
      //   dataKeys: response.data ? Object.keys(response.data) : [],
      //   success: response.data?.success,
      //   code: response.data?.code,
      //   message: response.data?.message,
      //   updatedUsers: response.data?.updatedUsers || response.data?.data,
      //   fullResponse: response.data
      // });

      // Check if the request was successful (HTTP 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        // Since backend doesn't return updated user data, we need to manually update local state
        // console.log('🎯 Backend response:', response.data);
        // console.log('📋 Backend updated users count:', response.data?.message);
        
        // Manually update the local state to reflect the role change
        setUsers(prevUsers => {
          const newUsers = prevUsers.map(user => {
            if (selectedUsers.includes(user.id)) {
              // Check if user already has instructor role
              const hasInstructorRole = user.user_roles?.some(role => role.role === 'instructor');
              
              if (!hasInstructorRole) {
                // Replace all roles with instructor role (single role system)
                const updatedUser = {
                  ...user,
                  user_roles: [
                    { role: 'instructor' }
                  ]
                };
                
                return updatedUser;
              } else {
                // console.log('ℹ️ User already has instructor role:', {
                //   id: user.id,
                //   name: `${user.first_name} ${user.last_name}`,
                //   roles: user.user_roles
                // });
                return user;
              }
            }
            return user;
          });
          
          return newUsers;
        });
        
        // Reset selection first
        setSelectedUsers([]);
        
        // Automatically enroll new instructors in all courses
        // console.log('🎓 Automatically enrolling new instructors in all courses...');
        // console.log('📋 Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
        // console.log('👥 New instructors to enroll:', selectedUsers);
        
        try {
          // Set initial enrollment progress
          setEnrollmentProgress({ current: 0, total: courses.length });
          
          // Enroll each new instructor in all courses
          const enrollmentPromises = courses.map(async (course, index) => {
            try {
              // console.log(`🔄 Enrolling instructors in course: ${course.title} (${course.id})`);
              
              const enrollmentResponse = await axios.post(
                `${API_BASE}/api/course/addLearnerToCourse`,
                {
                  course_id: course.id,
                  learnerIds: selectedUsers
                },
                getAuthConfig()
              );
              
              return { course, success: true, response: enrollmentResponse.data };
            } catch (enrollmentError) {
              // console.log(`⚠️ Failed to enroll instructors in course: ${course.title}`, enrollmentError.response?.data);
              return { course, success: false, error: enrollmentError.response?.data };
            }
          });
          
          const enrollmentResults = await Promise.all(enrollmentPromises);
          const successfulEnrollments = enrollmentResults.filter(result => result.success);
          const failedEnrollments = enrollmentResults.filter(result => !result.success);
          
          // Show success message with enrollment information
          const enrollmentMessage = successfulEnrollments.length > 0 
            ? ` and enrolled them in ${successfulEnrollments.length} course(s)`
            : '';
          
        setSuccessData({
          courseTitle: "Role Update",
            addedUsers: updatedUsers,
            enrollmentInfo: {
              successful: successfulEnrollments.length,
              total: courses.length,
              message: enrollmentMessage
            }
        });
        setShowSuccessModal(true);
          
        } catch (enrollmentError) {
          console.error('❌ Error during automatic course enrollment:', enrollmentError);
          // Still show success for role update, but log enrollment error
          setSuccessData({
            courseTitle: "Role Update",
            addedUsers: updatedUsers,
            enrollmentInfo: {
              successful: 0,
              total: courses.length,
              message: ' (course enrollment failed)'
            }
          });
          setShowSuccessModal(true);
        }
        
        // Wait a moment for backend to process, then refresh
        // console.log('🔄 Waiting for backend to process role update...');
        
        setTimeout(async () => {
          // console.log('🔄 Refreshing users list to get updated roles...');
          await fetchUsers();
          
          // Check if the roles were actually updated
          // const refreshedUsers = await fetchUsers();
          // console.log('🔄 Checking if roles were updated in backend...');
          
          // Log the current state of users after refresh
          // console.log('📋 Current users after refresh:', users.map(user => ({
          //   id: user.id,
          //   name: `${user.first_name} ${user.last_name}`,
          //   role: getUserRole(user),
          //   user_roles: u.user_roles
          // })));
        }, 2000);
      } else {
        // console.error('❌ API returned non-success status:', response.status);
        throw new Error(response.data?.message || `API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error making users instructors:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data
      });
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        setError('Invalid request. Please check your selection and try again.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (error.response?.status === 500) {
        setError(`Server error: ${error.response?.data?.message || 'Internal server error occurred. Please try again.'}`);
      } else {
        setError('Failed to update user roles. Please try again.');
      }
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setUpdatingRole(true);
      setError("");
      
      // console.log('🔄 Making admin API call:', {
      //   url: `${API_BASE}/api/user/make-admins`,
      //   payload: { user_ids: selectedUsers },
      //   selectedUsers
      // });
      
      // Make API call to make users admins
      const response = await axios.post(
        `${API_BASE}/api/user/make-admins`,
        { user_ids: selectedUsers },
        getAuthConfig()
      );

      // Check if the request was successful (HTTP 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        // Manually update the local state to reflect the role change
        setUsers(prevUsers => {
          const newUsers = prevUsers.map(user => {
            if (selectedUsers.includes(user.id)) {
              // Check if user already has admin role
              const hasAdminRole = user.user_roles?.some(role => role.role === 'admin');
              
              if (!hasAdminRole) {
                // Replace all roles with admin role (single role system)
                const updatedUser = {
                  ...user,
                  user_roles: [
                    { role: 'admin' }
                  ]
                };
                
                return updatedUser;
              } else {
                // console.log('ℹ️ User already has admin role:', {
                //   id: user.id,
                //   name: `${user.first_name} ${user.last_name}`,
                //   roles: user.user_roles
                // });
                return user;
              }
            }
            return user;
          });
          
          return newUsers;
        });
        
        // Reset selection first
        setSelectedUsers([]);
        
        // Show success message immediately
        setSuccessData({
          courseTitle: "Admin Role Update",
          addedUsers: updatedUsers
        });
        setShowSuccessModal(true);
        
        // Wait a moment for backend to process, then refresh
        setTimeout(async () => {
          // console.log('🔄 Refreshing users list to get updated admin roles...');
          await fetchUsers();
        }, 2000);
      } else {
        // console.error('❌ API returned non-success status:', response.status);
        throw new Error(response.data?.message || `API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error making users admins:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        setError('Invalid request. Please check your selection and try again.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (error.response?.status === 500) {
        setError(`Server error: ${error.response?.data?.message || 'Internal server error occurred. Please try again.'}`);
      } else {
        setError('Failed to update user roles. Please try again.');
      }
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleMakeUser = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      setUpdatingRole(true);
      setError("");
      
      // console.log('🔄 Making user API call:', {
      //   url: `${API_BASE}/api/user/make-users`,
      //   payload: { user_ids: selectedUsers },
      //   selectedUsers },
      //   selectedUsers
      // });
      
      // Make API call to make users regular users
      const response = await axios.post(
        `${API_BASE}/api/user/make-users`,
        { user_ids: selectedUsers },
        getAuthConfig()
      );

      // Check if the request was successful (HTTP 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        // Manually update the local state to reflect the role change
        setUsers(prevUsers => {
          const newUsers = prevUsers.map(user => {
            if (selectedUsers.includes(user.id)) {
              // Check if user already has user role
              const hasUserRole = user.user_roles?.some(role => role.role === 'user');
              
              if (!hasUserRole) {
                // Replace all roles with user role (single role system)
                const updatedUser = {
                  ...user,
                  user_roles: [
                    { role: 'user' }
                  ]
                };
                
                return updatedUser;
              } else {
                // console.log('ℹ️ User already has user role:', {
                //   id: user.id,
                //   name: `${user.first_name} ${user.last_name}`,
                //   roles: user.user_roles
                // });
                return user;
              }
            }
            return user;
          });
          
          return newUsers;
        });
        
        // Reset selection first
        setSelectedUsers([]);
        
        // Show success message immediately
        setSuccessData({
          courseTitle: "User Role Update",
          addedUsers: updatedUsers
        });
        setShowSuccessModal(true);
        
        // Wait a moment for backend to process, then refresh
        setTimeout(async () => {
          // console.log('🔄 Refreshing users list to get updated user roles...');
          await fetchUsers();
        }, 2000);
      } else {
        // console.error('❌ API returned non-success status:', response.status);
        throw new Error(response.data?.message || `API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error making users regular users:', error);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        setError('Invalid request. Please check your selection and try again.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (error.response?.status === 500) {
        setError(`Server error: ${error.response?.data?.message || 'Internal server error occurred. Please try again.'}`);
      } else {
        setError('Failed to update user roles. Please try again.');
      }
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeletingUser(true);
      setError("");
      
      // console.log('🗑️ Deleting user:', {
      //   userId: userToDelete.id,
      //   userName: `${userToDelete.first_name} ${userToDelete.last_name}`,
      //   userRole: getUserRole(userToDelete),
      //   apiUrl: `${API_BASE}/api/user/${userToDelete.id}`
      // });
      
      // Make API call to delete user using the correct endpoint format
      const response = await axios.delete(
        `${API_BASE}/api/user/${userToDelete.id}`,
        getAuthConfig()
      );

      if (response.data && (response.data.success || response.data.code === 200 || response.data.code === 201)) {
        // console.log('✅ User deleted successfully');
        
        // Close delete modal
        setShowDeleteModal(false);
        setUserToDelete(null);
        
        // Show temporary success message
        setError(""); // Clear any existing errors
        setSuccessMessage(`User ${userToDelete.first_name} ${userToDelete.last_name} has been successfully deleted.`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        
        // Refresh users list to get updated data
        await fetchUsers();
      } else {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        setError('Invalid request. Please check your selection and try again.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to perform this action.');
      } else if (error.response?.status === 404) {
        setError('User not found or already deleted.');
      } else if (error.response?.status === 500) {
        setError(`Server error: ${error.response?.data?.message || 'Internal server error occurred. Please try again.'}`);
      } else {
        setError('Failed to delete user. Please try again.');
      }
    } finally {
      setDeletingUser(false);
    }
  };

  const handleDeleteClick = (user) => {
    // Check if current user is admin
    if (!hasRole('admin')) {
      setError('Only administrators can delete users, instructors, and admins.');
      return;
    }
    
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleUserDetailsClick = (user) => {
    setSelectedUserForDetails(user);
    setShowUserDetailsModal(true);
  };

  const handleAddToMoreCourses = () => {
    // Close the success modal
    setShowSuccessModal(false);
    
    // Show the course selection modal again
    setShowCourseModal(true);
    
    // Keep the selected users (they're already selected)
    // Reset the course selection
    setSelectedCourse("");
    
    // console.log('🔄 Opening course selection modal for additional enrollments');
    // console.log('📋 Selected users for additional courses:', selectedUsers);
  };

  // Function to manually check course users
  const checkCourseUsers = async (courseId) => {
    try {
      // console.log('🔍 Manually checking course users for course:', courseId);
      
      const response = await axios.get(
        `${API_BASE}/api/course/${courseId}/getAllUsersByCourseId`,
        getAuthConfig()
      );
      
      // console.log('✅ Course users check response:', response.data);
      // console.log('📋 All users in course:', response.data?.data || []);
      
      // Show the results in an alert for easy viewing
      const courseUsers = response.data?.data || [];
      const userList = courseUsers.map(cu => {
        let roleDisplay = 'No role';
        if (cu.user?.user_roles && cu.user.user_roles.length > 0) {
          const roles = cu.user.user_roles.map(r => r.role);
          const priorityRoles = ['admin', 'instructor', 'user'];
          const highestRole = priorityRoles.find(role => roles.includes(role)) || 'user';
          roleDisplay = highestRole;
        }
        return `${cu.user?.first_name} ${cu.user?.last_name} (${cu.user?.email}) - Role: ${roleDisplay}`;
      }).join('\n');
      
      alert(`Course Users for ${courseId}:\n\n${userList || 'No users found'}`);
      
    } catch (error) {
      console.error('❌ Error checking course users:', error);
      alert(`Error checking course users: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please try again.');
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError("");
      
      // console.log('🔄 Changing password API call:', {
      //   url: `${API_BASE}/api/user/change-password`,
      //   payload: { user_ids: selectedUsers, new_password: newPassword },
      //   selectedUsers
      // });
      
      // Make API call to change password for users
      const response = await axios.post(
        `${API_BASE}/api/user/change-password`,
        { user_ids: selectedUsers, new_password: newPassword },
        getAuthConfig()
      );

      if (response.data && (response.data.success || response.data.code === 200 || response.data.code === 201)) {
        // console.log('✅ Password changed successfully');
        
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        // Set success data and show success modal
        setPasswordSuccessData({
          changedUsers: updatedUsers,
          newPassword: newPassword,
          failedUpdates: []
        });
        setShowPasswordSuccessModal(true);
        
        // Close password change modal and reset
        setShowPasswordModal(false);
        setNewPassword("");
        setConfirmPassword("");
        
        // Send email to users with new password information
        // console.log('📨 Sending email to users with new password information...');
        try {
          const emailResponse = await axios.post(
            `${API_BASE}/api/user/send-password-email`,
            { user_ids: selectedUsers, new_password: newPassword },
            getAuthConfig()
          );
          
          // console.log('✅ Email sent successfully:', emailResponse.data);
        } catch (emailError) {
          console.error('❌ Error sending email:', emailError);
          // console.error('❌ Email error details:', {
          //   status: emailError.response?.status,
          //   statusText: emailError.response?.statusText,
          //   data: emailError.response?.data,
          //   message: emailError.message,
          //   url: emailError.config?.url,
          //   method: emailError.config?.method,
          //   payload: emailError.config?.data
          // });
        }
      } else {
        throw new Error(response.data?.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        payload: error.config?.data
      });
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        setPasswordError('Invalid request. Please check your selection and try again.');
      } else if (error.response?.status === 401) {
        setPasswordError('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        setPasswordError('You do not have permission to perform this action.');
      } else if (error.response?.status === 500) {
        setPasswordError(`Server error: ${error.response?.data?.message || 'Internal server error occurred. Please try again.'}`);
      } else {
        setPasswordError('Failed to change password. Please try again.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Admin Notice */}
      {!hasRole('admin') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-700">
              Only administrators can delete users, instructors, and admins. You are currently logged in as a {userRole}.
            </span>
          </div>
        </div>
      )}

      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          {apiCallTime && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 sm:mb-0">
              <span>Last updated: {apiCallTime.toLocaleTimeString()}</span>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRole("user")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterRole === "user"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setFilterRole("instructor")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterRole === "instructor"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setFilterRole("admin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterRole === "admin"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admin
            </button>
            {/* Sort dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Sort users"
            >
              <option value="alpha_asc">Alphabetical (A → Z)</option>
              <option value="alpha_desc">Alphabetical (Z → A)</option>
              <option value="never_visited">Never Visited (Top)</option>
              <option value="just_added">Just Added (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add to Course Action */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedUsers.length} {filterRole}(s) selected
              {selectedUsers.length > currentUsers.length && (
                <span className="text-xs text-blue-600 ml-2">
                  (across all pages)
                </span>
              )}
              {selectedUsers.length > 0 && selectedUsers.length <= currentUsers.length && (
                <span className="text-xs text-gray-500 ml-2">
                  (current page only)
                </span>
              )}
            </span>
            <div className="flex gap-2">
              {/* Role Management Buttons */}
              {filterRole === "user" && (
                <button
                  onClick={handleMakeInstructor}
                  disabled={updatingRole}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Promote to Instructor (replaces all existing roles)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {updatingRole 
                    ? enrollmentProgress.total > 0 
                      ? `Updating & Enrolling... (${enrollmentProgress.current}/${enrollmentProgress.total})`
                      : 'Updating & Enrolling...'
                    : 'Make Instructor'
                  }
                </button>
              )}
              {filterRole === "instructor" && (
                <div className="flex gap-2">
                  {/* <button
                    onClick={handleMakeAdmin}
                    disabled={updatingRole}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Promote to Admin (replaces all existing roles)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {updatingRole ? 'Updating...' : 'Make Admin'}
                  </button>
                  <button
                    onClick={handleMakeUser}
                    disabled={updatingRole}
                    className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Demote to User (replaces all existing roles)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {updatingRole ? 'Updating...' : 'Make User'}
                  </button> */}
                </div>
              )}
              {/* {filterRole === "admin" && (
                <button
                  onClick={handleMakeUser}
                  disabled={updatingRole}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Demote to User (replaces all existing roles)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {updatingRole ? 'Updating...' : 'Make User'}
                </button>
              )} */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                title="Change Password"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                </svg>
                Change Password
              </button>
              <button
                onClick={() => setShowCourseModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Selection Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add {filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}s to Course</h3>
              <button
                onClick={() => {
                  setShowCourseModal(false);
                  setError("");
                  // Clear selected users when manually closing
                  setSelectedUsers([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCourseModal(false);
                  setError("");
                  // Clear selected users when manually canceling
                  setSelectedUsers([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCourse}
                disabled={!selectedCourse || addingToCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCourse ? 'Adding...' : 'Add to Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Successfully Added!
              </h3>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Clear selected users when closing the modal
                  setSelectedUsers([]);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                {successData.courseTitle === "Role Update" 
                  ? <>You have successfully updated <span className="font-semibold text-gray-800">{successData.addedUsers.length} user(s)</span> to instructor role{successData.enrollmentInfo?.message || ''}. They will now appear in the Instructor section.</>
                  : successData.courseTitle === "User Deleted"
                  ? <>You have successfully deleted {getUserRole(successData.addedUsers[0])} <span className="font-semibold text-gray-800">{successData.addedUsers[0]?.first_name} {successData.addedUsers[0]?.last_name}</span> from the system.</>
                  : <>You have successfully added <span className="font-semibold text-gray-800">{successData.addedUsers.length} {filterRole}(s)</span> to the course:</>
                }
              </p>
              {successData.courseTitle !== "Role Update" && successData.courseTitle !== "User Deleted" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-blue-800">{successData.courseTitle}</p>
                </div>
              )}
              
              {/* Course Enrollment Information */}
              {successData.courseTitle === "Role Update" && successData.enrollmentInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-sm font-medium text-green-800">Course Enrollment Status</p>
                  </div>
                  <p className="text-sm text-green-700">
                    Successfully enrolled in <span className="font-semibold">{successData.enrollmentInfo.successful}</span> out of <span className="font-semibold">{successData.enrollmentInfo.total}</span> courses.
                  </p>
                  {successData.enrollmentInfo.successful < successData.enrollmentInfo.total && (
                    <p className="text-xs text-green-600 mt-1">
                      Some courses may have failed due to existing enrollments or permissions.
                    </p>
                  )}
                </div>
              )}
              
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {successData.courseTitle === "Role Update" ? "Updated users:" : 
                   successData.courseTitle === "User Deleted" ? "Deleted member:" : 
                   `Added ${filterRole}s:`}
                </p>
                <div className="space-y-2">
                  {successData.addedUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              {/* Show "Add to More Courses" button only for course addition operations */}
              {successData.courseTitle !== "Role Update" && successData.courseTitle !== "User Deleted" && (
                <button
                  onClick={handleAddToMoreCourses}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">Add to More Courses</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  // Clear selected users when closing the modal
                  setSelectedUsers([]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Change Password for {selectedUsers.length} User(s)</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> An email will be sent to the selected users with their new password information.
              </p>
            </div>
            
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={!newPassword || !confirmPassword || changingPassword}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Success Modal */}
      {showPasswordSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {passwordSuccessData.failedUpdates.length === 0 
                  ? 'Password Changed Successfully!'
                  : 'Password Update Completed'
                }
              </h3>
              <button
                onClick={() => {
                  setShowPasswordSuccessModal(false);
                  setPasswordSuccessData({ changedUsers: [], newPassword: "", failedUpdates: [] });
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              {/* Summary Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {passwordSuccessData.changedUsers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-800">✅ Success:</span>
                        <span className="text-sm text-blue-700">{passwordSuccessData.changedUsers.length} user(s)</span>
                      </div>
                    )}
                    {passwordSuccessData.failedUpdates.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-red-800">❌ Failed:</span>
                        <span className="text-sm text-red-700">{passwordSuccessData.failedUpdates.length} user(s)</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-blue-600">
                    Total: {passwordSuccessData.changedUsers.length + passwordSuccessData.failedUpdates.length} user(s)
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {passwordSuccessData.failedUpdates.length === 0 
                  ? `You have successfully changed the password for ${passwordSuccessData.changedUsers.length} user(s).`
                  : `Password update completed with some issues.`
                }
              </p>
              
              {/* Show successful updates */}
              {passwordSuccessData.changedUsers.length > 0 && (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-green-800">New Password Set</p>
                    <p className="text-sm text-green-700 font-mono bg-green-100 px-2 py-1 rounded mt-1">{passwordSuccessData.newPassword}</p>
                    <p className="text-xs text-green-600 mt-2">
                      An email has been sent to each user with their new password information.
                    </p>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      ✅ Successfully updated passwords for:
                    </p>
                    <div className="space-y-2">
                      {passwordSuccessData.changedUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200">
                          <div className="h-8 w-8 rounded-full bg-green-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {/* Show failed updates */}
              {passwordSuccessData.failedUpdates.length > 0 && (
                <div className="max-h-48 overflow-y-auto mb-4">
                  <p className="text-sm font-medium text-red-700 mb-2">
                    ❌ Failed to update passwords for:
                  </p>
                  <div className="space-y-2">
                    {passwordSuccessData.failedUpdates.map((failedUpdate) => (
                      <div key={failedUpdate.user.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-200">
                        <div className="h-8 w-8 rounded-full bg-red-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-red-700">
                            {failedUpdate.user.first_name?.[0]}{failedUpdate.user.last_name?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {failedUpdate.user.first_name} {failedUpdate.user.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{failedUpdate.user.email}</p>
                          <p className="text-xs text-red-600 mt-1">
                            Error: {failedUpdate.error}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowPasswordSuccessModal(false);
                  setPasswordSuccessData({ changedUsers: [], newPassword: "", failedUpdates: [] });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {passwordSuccessData.failedUpdates.length === 0 ? 'Close' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentUsers.length > 0 && currentUsers.every(user => selectedUsers.includes(user.id))}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {/* Show Select All [Role]s (X) button only if all users on this page are selected */}
                    {showSelectAllAcrossPages() && (
                      filterRole === "user" ? (
                        <button
                          onClick={handleSelectAllUsers}
                          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                            selectedUsers.length === getTotalFilteredUsersCount() && getTotalFilteredUsersCount() > 0
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                          title={`Select all ${getTotalFilteredUsersCount()} users across all pages`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          All Users ({getTotalFilteredUsersCount()})
                          {selectedUsers.length === getTotalFilteredUsersCount() && getTotalFilteredUsersCount() > 0 && (
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ) : filterRole === "instructor" ? (
                        <button
                          onClick={handleSelectAllUsers}
                          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                            selectedUsers.length === getTotalFilteredUsersCount() && getTotalFilteredUsersCount() > 0
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                          title={`Select all ${getTotalFilteredUsersCount()} instructors across all pages`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          All Instructors ({getTotalFilteredUsersCount()})
                          {selectedUsers.length === getTotalFilteredUsersCount() && getTotalFilteredUsersCount() > 0 && (
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ) : filterRole === "admin" && (
                        <button
                          onClick={handleSelectAllUsers}
                          className={`px-2 py-1 text-xs rounded transition-colors flex items-center gap-1 ${
                            selectedUsers.length === getTotalFilteredUsersCount() && getTotalFilteredUsersCount() > 0
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                          title={`Select all ${getTotalFilteredUsersCount()} admins across all pages`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          All Admins ({getTotalFilteredUsersCount()})
                          {selectedUsers.length === getTotalFilteredUsersCount() && getTotalFilteredUsersCount() > 0 && (
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      )
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visited
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {hasRole('admin') ? 'Actions' : 'Actions (Admin Only)'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                          onClick={() => handleUserDetailsClick(user)}
                          title="Click to view user details"
                        >
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getUserRole(user) === 'admin' ? 'bg-purple-100 text-purple-800' :
                      getUserRole(user) === 'instructor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getUserRole(user)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getLastVisited(user) || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {hasRole('admin') && (
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-900"
                        title={`Delete ${getUserRole(user)}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {currentUsers.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search.' 
                : `No ${filterRole}s found.`}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-center border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete {getUserRole(userToDelete)} <span className="font-semibold text-gray-800">{userToDelete.first_name} {userToDelete.last_name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deletingUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingUser ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={handleCloseUserDetailsModal}
        user={selectedUserForDetails}
        isLoading={loadingUserDetails}
      />
    </div>
  );
};

export default ManageUsers;