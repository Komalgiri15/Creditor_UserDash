// Service for user profile API calls
import Cookies from 'js-cookie';
import apiClient from '@/utils/apiClient';

// Utility function to get token from both cookies and localStorage
export function getAuthToken() {
  // Try cookies first, then localStorage
  return Cookies.get("token") || localStorage.getItem("token");
}

// Utility function to get user role (for backward compatibility)
export function getUserRole() {
  return localStorage.getItem('userRole') || 'user';
}

// Utility function to get all user roles
export function getUserRoles() {
  const roles = localStorage.getItem('userRoles');
  return roles ? JSON.parse(roles) : ['user'];
}

// Utility function to set user role (for backward compatibility)
export function setUserRole(role) {
  // Enforce single role - replace all roles with this one
  localStorage.setItem('userRole', role);
  localStorage.setItem('userRoles', JSON.stringify([role]));
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
}

// Utility function to set all user roles (enforces single role)
export function setUserRoles(roles) {
  if (Array.isArray(roles) && roles.length > 0) {
    // Enforce single role - take only the first role
    const singleRole = roles[0];
    localStorage.setItem('userRoles', JSON.stringify([singleRole]));
    localStorage.setItem('userRole', singleRole);
  } else {
    localStorage.setItem('userRoles', JSON.stringify(['user']));
    localStorage.setItem('userRole', 'user');
  }
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
}

// Utility function to check if user is instructor or admin
export function isInstructorOrAdmin() {
  const roles = getUserRoles();
  return roles.some(role => role === 'instructor' || role === 'admin');
}

// Utility function to check if user has a specific role
export function hasRole(roleToCheck) {
  const roles = getUserRoles();
  return roles.includes(roleToCheck);
}

// Utility function to set a single role and replace all existing roles
export function setSingleRole(role) {
  if (!role) {
    console.warn('setSingleRole: No role provided, defaulting to user');
    role = 'user';
  }
  
  // Validate role
  const validRoles = ['user', 'instructor', 'admin'];
  if (!validRoles.includes(role)) {
    console.warn(`setSingleRole: Invalid role "${role}", defaulting to user`);
    role = 'user';
  }
  
  // Set single role - replace all existing roles
  localStorage.setItem('userRole', role);
  localStorage.setItem('userRoles', JSON.stringify([role]));
  
  console.log(`setSingleRole: User role set to "${role}" (replaced all existing roles)`);
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
}

// Utility function to clear user data on logout
export function clearUserData() {
  // Clear tokens from both cookies and localStorage
  Cookies.remove("token");
  localStorage.removeItem("token");
  localStorage.removeItem('userRole');
  localStorage.removeItem('userRoles');
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
}

export async function fetchUserProfile(retryCount = 0) {
  try {
    console.log("🔍 userService: Fetching profile from:", `/api/user/getUserProfile`);
    
    const response = await apiClient.get('/api/user/getUserProfile');
    
    console.log("✅ userService: Fetch profile success:", response.data);
    return response.data.data; // Return only the user object
  } catch (error) {
    console.error("❌ userService: Fetch profile error:", error);
    
    // If unauthorized and we haven't retried yet, try once more after a small delay
    if (error.response?.status === 401 && retryCount < 1) {
      console.log("🔄 userService: Retrying profile fetch due to 401 error");
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
      return fetchUserProfile(retryCount + 1);
    }
    
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    console.log("📤 userService: Updating profile to:", `/api/user/updateUserProfile`);
    console.log("📤 userService: Update data:", profileData);
    
    const response = await apiClient.put('/api/user/updateUserProfile', profileData);
    
    console.log("✅ userService: Update profile success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ userService: Update profile error:", error);
    throw error;
  }
}