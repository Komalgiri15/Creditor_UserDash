// Service for user profile API calls

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
  localStorage.setItem('userRole', role);
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
}

// Utility function to set all user roles
export function setUserRoles(roles) {
  if (Array.isArray(roles) && roles.length > 0) {
    localStorage.setItem('userRoles', JSON.stringify(roles));
    // Set the first role as the primary role for backward compatibility
    localStorage.setItem('userRole', roles[0]);
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

// Utility function to clear user data on logout
export function clearUserData() {
  localStorage.removeItem('userRole');
  localStorage.removeItem('userRoles');
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
}

export async function fetchUserProfile() {
  try {
    console.log("🔍 userService: Fetching profile from:", `${import.meta.env.VITE_API_BASE_URL}/api/user/getUserProfile`);
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getUserProfile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    console.log("🔍 userService: Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ userService: Fetch profile failed:", response.status, errorText);
      throw new Error(`Failed to fetch user profile: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("✅ userService: Fetch profile success:", result);
    return result.data; // Return only the user object
  } catch (error) {
    console.error("❌ userService: Fetch profile error:", error);
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    console.log("📤 userService: Updating profile to:", `${import.meta.env.VITE_API_BASE_URL}/api/user/updateUserProfile`);
    console.log("📤 userService: Update data:", profileData);
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/updateUserProfile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    
    console.log("🔍 userService: Update response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ userService: Update profile failed:", response.status, errorText);
      throw new Error(`Failed to update user profile: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("✅ userService: Update profile success:", result);
    return result;
  } catch (error) {
    console.error("❌ userService: Update profile error:", error);
    throw error;
  }
}