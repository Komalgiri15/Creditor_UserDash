import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://creditor-backend-bh52.onrender.com";

const ManageUsers = () => {
  const { userRole, hasRole } = useAuth();
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

  const [updatingRole, setUpdatingRole] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [enrollmentProgress, setEnrollmentProgress] = useState({ current: 0, total: 0 });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

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
      console.log('🔄 Force update triggered, refreshing users...');
      fetchUsers();
    }
  }, [forceUpdate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Record the API call time
      const currentTime = new Date();
      setApiCallTime(currentTime);
      
      // Enhanced token retrieval with debugging
      let token = localStorage.getItem('token');
      if (!token) {
        token = document.cookie.split('token=')[1]?.split(';')[0];
      }
      
      console.log('🔍 Token debug:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 20) + '...',
        localStorage: localStorage.getItem('token') ? 'exists' : 'not found',
        cookies: document.cookie.includes('token=') ? 'exists' : 'not found'
      });
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('📡 Making API call to:', `${API_BASE}/api/user/all`);
      
      const response = await axios.get(`${API_BASE}/api/user/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include cookies in the request
      });

      console.log('✅ API Response:', response.data);

      if (response.data && response.data.code === 200) {
        const fetchedUsers = response.data.data || [];
        console.log('📋 Fetched users with roles:', fetchedUsers.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          role: getUserRole(user),
          user_roles: user.user_roles
        })));
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
      } else if (error.message.includes('No authentication token')) {
        setError('No authentication token found. Please log in again.');
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
      // Enhanced token retrieval with debugging
      let token = localStorage.getItem('token');
      if (!token) {
        token = document.cookie.split('token=')[1]?.split(';')[0];
      }
      
      console.log('🔍 Courses - Token debug:', {
        hasToken: !!token,
        tokenLength: token?.length,
        tokenStart: token?.substring(0, 20) + '...'
      });
      
      if (!token) {
        console.warn(' No token found for courses API call');
        // Still try to fetch courses without token
      }
      
      console.log(' Making courses API call to:', `${API_BASE}/api/course/getAllCourses`);
      
      const response = await axios.get(`${API_BASE}/api/course/getAllCourses`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include cookies in the request
      });

      console.log('✅ Courses API Response:', response.data);

      if (response.data && response.data.data) {
        // Filter to only show published courses
        const publishedCourses = response.data.data.filter(course => 
          course.course_status === 'PUBLISHED'
        );
        console.log('📋 Filtered courses - showing only published:', publishedCourses.map(c => ({ id: c.id, title: c.title, status: c.course_status })));
        setCourses(publishedCourses);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where response.data is directly an array
        // Filter to only show published courses
        const publishedCourses = response.data.filter(course => 
          course.course_status === 'PUBLISHED'
        );
        console.log('📋 Filtered courses - showing only published:', publishedCourses.map(c => ({ id: c.id, title: c.title, status: c.course_status })));
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
    console.log('🔍 Getting role for user:', {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      user_roles: user.user_roles,
      hasRoles: !!user.user_roles,
      rolesLength: user.user_roles?.length
    });
    
    if (user.user_roles && user.user_roles.length > 0) {
      // Priority order: admin > instructor > user (single role system)
      const roles = user.user_roles.map(r => r.role);
      
      if (roles.includes('admin')) {
        console.log('✅ User role found: admin');
        return 'admin';
      } else if (roles.includes('instructor')) {
        console.log('✅ User role found: instructor');
        return 'instructor';
      } else {
        const role = roles[0];
        console.log('✅ User role found:', role);
        return role;
      }
    }
    console.log('⚠️ No user roles found, defaulting to "user"');
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
      console.log(`🔍 Filtering user: ${user.first_name} ${user.last_name}`, {
        id: user.id,
        userRole,
        filterRole,
        matchesRole,
        matchesSearch,
        user_roles: user.user_roles
      });
    }
    
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  const handleAddToCourse = async () => {
    if (selectedUsers.length === 0 || !selectedCourse) return;
    
    try {
      setAddingToCourse(true);
      setError("");
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      let response;
      
      // Different API endpoints based on the current filter role
      if (filterRole === "user") {
        // Add learners to course
        console.log('🔄 Adding learners to course:', { course_id: selectedCourse, learnerIds: selectedUsers });
        console.log('📋 Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
        console.log('🎯 Selected course details:', courses.find(c => c.id === selectedCourse));
        
        // Check if the selected course actually exists
        const selectedCourseData = courses.find(c => c.id === selectedCourse);
        if (!selectedCourseData) {
          throw new Error(`Course with ID "${selectedCourse}" not found. Available courses: ${courses.map(c => c.id).join(', ')}`);
        }
        
        response = await axios.post(`${API_BASE}/api/course/addLearnerToCourse`, {
          course_id: selectedCourse,
          learnerIds: selectedUsers
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
      } else if (filterRole === "instructor") {
        // Add instructors to course
        console.log('🔄 Adding instructors to course:', { course_id: selectedCourse, learnerIds: selectedUsers });
        console.log('📋 Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
        console.log('🎯 Selected course details:', courses.find(c => c.id === selectedCourse));
        
        // Check if the selected course actually exists
        const selectedCourseData = courses.find(c => c.id === selectedCourse);
        if (!selectedCourseData) {
          throw new Error(`Course with ID "${selectedCourse}" not found. Available courses: ${courses.map(c => c.id).join(', ')}`);
        }
        
        response = await axios.post(`${API_BASE}/api/course/addLearnerToCourse`, {
          course_id: selectedCourse,
          learnerIds: selectedUsers
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
      }
    
       else if (filterRole === "admin") {
        // Add admins to course
        console.log('🔄 Adding admins to course:', { course_id: selectedCourse, learnerIds: selectedUsers });
        console.log('📋 Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
        console.log('🎯 Selected course details:', courses.find(c => c.id === selectedCourse));
        
        // Check if the selected course actually exists
        const selectedCourseData = courses.find(c => c.id === selectedCourse);
        if (!selectedCourseData) {
          throw new Error(`Course with ID "${selectedCourse}" not found. Available courses: ${courses.map(c => c.id).join(', ')}`);
        }
        
        response = await axios.post(`${API_BASE}/api/course/addLearnerToCourse`, {
          course_id: selectedCourse,
          learnerIds: selectedUsers
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
      }

      console.log('✅ API Response:', response.data);
      console.log('✅ Response status:', response.status);
      console.log('✅ Response headers:', response.headers);

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
        console.log('🔄 Verifying course users after addition...');
        try {
          const verifyResponse = await axios.get(`${API_BASE}/api/course/${selectedCourse}/getAllUsersByCourseId`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
          
          console.log('✅ Course users verification response:', verifyResponse.data);
          console.log('📋 Users in course after addition:', verifyResponse.data?.data || []);
          
          // Check if our added users are actually in the course
          const courseUsers = verifyResponse.data?.data || [];
          const addedUserIds = selectedUsers;
          const foundUsers = courseUsers.filter(cu => addedUserIds.includes(cu.user_id));
          
          console.log('🔍 Verification results:', {
            expectedUsers: addedUserIds,
            foundUsers: foundUsers.map(fu => fu.user_id),
            missingUsers: addedUserIds.filter(id => !foundUsers.some(fu => fu.user_id === id))
          });
          
          if (foundUsers.length !== addedUserIds.length) {
            console.warn('⚠️ Some users were not found in course after addition!');
            console.warn('📋 Missing users:', addedUserIds.filter(id => !foundUsers.some(fu => fu.user_id === id)));
          } else {
            console.log('✅ All users successfully verified in course!');
          }
        } catch (verifyError) {
          console.error('❌ Error verifying course users:', verifyError);
        }
        
        // Refresh users list to get updated course information
        await fetchUsers();
        
        console.log(`${filterRole}s added to course successfully`);
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
        console.log('⚠️ 409 Conflict - Some users already assigned to course:', error.response.data);
        console.log('🔍 Full 409 response analysis:', {
          status: error.response.status,
          data: error.response.data,
          error: error.response.data?.error,
          message: error.response.data?.message
        });
        
        // Get the selected course title
        const selectedCourseData = courses.find(course => course.id === selectedCourse);
        const courseTitle = selectedCourseData ? selectedCourseData.title : selectedCourse;
        
        // Extract error message from backend response
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Unknown error';
        
        console.log('📋 Backend error message:', errorMessage);
        
        // Parse the error message to extract user IDs if present
        // Backend returns: "Users fc78ddd2-d389-4844-a387-53d257fb04a0 are already instructors for this course"
        const userMatch = errorMessage.match(/Users\s+([^,\s]+(?:\s*,\s*[^,\s]+)*)\s+are already/);
        
        if (userMatch) {
          const existingUserIds = userMatch[1].split(',').map(id => id.trim());
          console.log('🔍 Found existing user IDs in error message:', existingUserIds);
          
          // Check which users are already assigned vs. which are new
          const alreadyAssignedIds = existingUserIds;
          const newUserIds = selectedUsers.filter(id => !alreadyAssignedIds.includes(id));
          
          console.log('📋 User analysis:', {
            selectedUsers,
            alreadyAssignedIds,
            newUserIds
          });
          
          if (newUserIds.length > 0) {
            // Some users are new and should be added
            console.log('✅ Some users are new, attempting to add them individually...');
            
            // Try to add each new user individually
            const successfulAdds = [];
            const failedAdds = [];
            
            for (const userId of newUserIds) {
              try {
                console.log(`🔄 Attempting to add user ${userId} individually...`);
                
                const individualResponse = await axios.post(`${API_BASE}/api/course/addInstructor/${selectedCourse}`, {
                  instructorIds: [userId]
                }, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  withCredentials: true,
                });
                
                if (individualResponse.status >= 200 && individualResponse.status < 300) {
                  successfulAdds.push(userId);
                  console.log(`✅ Successfully added user ${userId}`);
                }
              } catch (individualError) {
                console.log(`❌ Failed to add user ${userId}:`, individualError.response?.data);
                failedAdds.push(userId);
              }
            }
            
            // Show results
            if (successfulAdds.length > 0) {
              const addedUsersData = users.filter(user => successfulAdds.includes(user.id));
              
              console.log('✅ Showing success modal for individually added users:', addedUsersData);
              
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
            console.log('ℹ️ All users already assigned, showing info message');
            setError(`All selected ${filterRole}s are already assigned to the course "${courseTitle}".`);
            setShowCourseModal(false);
            setSelectedCourse("");
            setSelectedUsers([]);
          }
        } else {
          // Generic 409 message - couldn't parse user IDs
          console.log('⚠️ Generic 409 response, showing default message');
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
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('🔄 Making instructor API call:', {
        url: `${API_BASE}/api/user/make-instructors`,
        payload: { user_ids: selectedUsers },
        selectedUsers
      });
      
      // Make API call to make users instructors using the correct endpoint and payload
      const response = await axios.post(`${API_BASE}/api/user/make-instructors`, {
        user_ids: selectedUsers
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('✅ Make instructor API response:', response.data);
      console.log('✅ Response status:', response.status);
      console.log('✅ Response headers:', response.headers);
      
      // Detailed analysis of the response
      console.log('🔍 Detailed response analysis:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        success: response.data?.success,
        code: response.data?.code,
        message: response.data?.message,
        updatedUsers: response.data?.updatedUsers || response.data?.data,
        fullResponse: response.data
      });

      // Check if the request was successful (HTTP 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        console.log('✅ Success! Users to be updated:', updatedUsers.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, currentRole: getUserRole(u) })));
        
        // Since backend doesn't return updated user data, we need to manually update local state
        console.log('🎯 Backend response:', response.data);
        console.log('📋 Backend updated users count:', response.data?.message);
        
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
                
                console.log('🔄 Manually updating user role to instructor (single role system):', {
                  id: user.id,
                  name: `${user.first_name} ${user.last_name}`,
                  oldRoles: user.user_roles,
                  newRoles: updatedUser.user_roles,
                  message: 'All previous roles replaced with instructor role'
                });
                
                return updatedUser;
              } else {
                console.log('ℹ️ User already has instructor role:', {
                  id: user.id,
                  name: `${user.first_name} ${user.last_name}`,
                  roles: user.user_roles
                });
                return user;
              }
            }
            return user;
          });
          
          console.log('🔄 Updated users state after manual update:', newUsers.map(u => ({
            id: u.id,
            name: `${u.first_name} ${u.last_name}`,
            role: getUserRole(u),
            user_roles: u.user_roles
          })));
          
          return newUsers;
        });
        
        // Reset selection first
        setSelectedUsers([]);
        
        // Automatically enroll new instructors in all courses
        console.log('🎓 Automatically enrolling new instructors in all courses...');
        console.log('📋 Available courses:', courses.map(c => ({ id: c.id, title: c.title })));
        console.log('👥 New instructors to enroll:', selectedUsers);
        
        try {
          // Set initial enrollment progress
          setEnrollmentProgress({ current: 0, total: courses.length });
          
          // Enroll each new instructor in all courses
          const enrollmentPromises = courses.map(async (course, index) => {
            try {
              console.log(`🔄 Enrolling instructors in course: ${course.title} (${course.id})`);
              
              const enrollmentResponse = await axios.post(`${API_BASE}/api/course/addLearnerToCourse`, {
                course_id: course.id,
                learnerIds: selectedUsers
              }, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              });
              
              console.log(`✅ Successfully enrolled instructors in course: ${course.title}`, enrollmentResponse.data);
              setEnrollmentProgress(prev => ({ ...prev, current: prev.current + 1 }));
              return { course, success: true, response: enrollmentResponse.data };
            } catch (enrollmentError) {
              console.log(`⚠️ Failed to enroll instructors in course: ${course.title}`, enrollmentError.response?.data);
              setEnrollmentProgress(prev => ({ ...prev, current: prev.current + 1 }));
              return { course, success: false, error: enrollmentError.response?.data };
            }
          });
          
          const enrollmentResults = await Promise.all(enrollmentPromises);
          const successfulEnrollments = enrollmentResults.filter(result => result.success);
          const failedEnrollments = enrollmentResults.filter(result => !result.success);
          
          console.log('📊 Enrollment results:', {
            totalCourses: courses.length,
            successfulEnrollments: successfulEnrollments.length,
            failedEnrollments: failedEnrollments.length,
            successfulCourses: successfulEnrollments.map(r => r.course.title),
            failedCourses: failedEnrollments.map(r => r.course.title)
          });
          
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
        console.log('🔄 Waiting for backend to process role update...');
        
        setTimeout(async () => {
          console.log('🔄 Refreshing users list to get updated roles...');
          await fetchUsers();
          
          // Check if the roles were actually updated
          const refreshedUsers = await fetchUsers();
          console.log('🔄 Checking if roles were updated in backend...');
          
          // Log the current state of users after refresh
          console.log('📋 Current users after refresh:', users.map(user => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            role: getUserRole(user),
            user_roles: u.user_roles
          })));
        }, 2000);
      } else {
        console.error('❌ API returned non-success status:', response.status);
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
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('🔄 Making admin API call:', {
        url: `${API_BASE}/api/user/make-admins`,
        payload: { user_ids: selectedUsers },
        selectedUsers
      });
      
      // Make API call to make users admins
      const response = await axios.post(`${API_BASE}/api/user/make-admins`, {
        user_ids: selectedUsers
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('✅ Make admin API response:', response.data);

      // Check if the request was successful (HTTP 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        console.log('✅ Success! Users to be updated to admin:', updatedUsers.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, currentRole: getUserRole(u) })));
        
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
                
                console.log('🔄 Manually updating user role to admin (single role system):', {
                  id: user.id,
                  name: `${user.first_name} ${user.last_name}`,
                  oldRoles: user.user_roles,
                  newRoles: updatedUser.user_roles,
                  message: 'All previous roles replaced with admin role'
                });
                
                return updatedUser;
              } else {
                console.log('ℹ️ User already has admin role:', {
                  id: user.id,
                  name: `${user.first_name} ${user.last_name}`,
                  roles: user.user_roles
                });
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
          console.log('🔄 Refreshing users list to get updated admin roles...');
          await fetchUsers();
        }, 2000);
      } else {
        console.error('❌ API returned non-success status:', response.status);
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
      setUpdatingRole(true); // Reuse the same loading state
      setError("");
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('🔄 Making user API call:', {
        url: `${API_BASE}/api/user/make-users`,
        payload: { user_ids: selectedUsers },
        selectedUsers
      });
      
      // Make API call to make users regular users
      const response = await axios.post(`${API_BASE}/api/user/make-users`, {
        user_ids: selectedUsers
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('✅ Make user API response:', response.data);

      // Check if the request was successful (HTTP 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Get the selected users data
        const updatedUsers = users.filter(user => selectedUsers.includes(user.id));
        
        console.log('✅ Success! Users to be updated to regular user:', updatedUsers.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}`, currentRole: getUserRole(u) })));
        
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
                
                console.log('🔄 Manually updating user role to regular user (single role system):', {
                  id: user.id,
                  name: `${user.first_name} ${user.last_name}`,
                  oldRoles: user.user_roles,
                  newRoles: updatedUser.user_roles,
                  message: 'All previous roles replaced with user role'
                });
                
                return updatedUser;
              } else {
                console.log('ℹ️ User already has user role:', {
                  id: user.id,
                  name: `${user.first_name} ${user.last_name}`,
                  roles: user.user_roles
                });
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
          console.log('🔄 Refreshing users list to get updated user roles...');
          await fetchUsers();
        }, 2000);
      } else {
        console.error('❌ API returned non-success status:', response.status);
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
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('🗑️ Deleting user:', {
        userId: userToDelete.id,
        userName: `${userToDelete.first_name} ${userToDelete.last_name}`,
        userRole: getUserRole(userToDelete),
        apiUrl: `${API_BASE}/api/user/${userToDelete.id}`
      });
      
      // Make API call to delete user using the correct endpoint format
      const response = await axios.delete(`${API_BASE}/api/user/${userToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('✅ Delete API response:', response.data);
      console.log('✅ Response status:', response.status);

      if (response.data && (response.data.success || response.data.code === 200 || response.data.code === 201)) {
        console.log('✅ User deleted successfully');
        
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

  const handleAddToMoreCourses = () => {
    // Close the success modal
    setShowSuccessModal(false);
    
    // Show the course selection modal again
    setShowCourseModal(true);
    
    // Keep the selected users (they're already selected)
    // Reset the course selection
    setSelectedCourse("");
    
    console.log('🔄 Opening course selection modal for additional enrollments');
    console.log('📋 Selected users for additional courses:', selectedUsers);
  };

  // Function to manually check course users
  const checkCourseUsers = async (courseId) => {
    try {
      console.log('🔍 Manually checking course users for course:', courseId);
      
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await axios.get(`${API_BASE}/api/course/${courseId}/getAllUsersByCourseId`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      console.log('✅ Course users check response:', response.data);
      console.log('📋 All users in course:', response.data?.data || []);
      
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
          </div>
        </div>
      </div>

      {/* Add to Course Action */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              {selectedUsers.length} {filterRole}(s) selected
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
                <div className="text-sm text-gray-500 italic">
                  {/* No role changes available for instructors */}
                </div>
              )}
              {/* {filterRole === "admin" && (
                <button
                  onClick={handleMakeInstructor}
                  disabled={updatingRole}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Demote to Instructor (replaces all existing roles)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {updatingRole ? 'Updating...' : 'Make Instructor'}
                </button>
              )} */}
              <button
                onClick={() => setShowCourseModal(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
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
                        <div className="text-sm font-medium text-gray-900">
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
    </div>
  );
};

export default ManageUsers; 