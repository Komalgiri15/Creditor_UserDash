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
  
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event('userRoleChanged'));
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
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getUserProfile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ userService: Fetch profile failed:", response.status, errorText);
      throw new Error(`Failed to fetch user profile: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    return result.data; // Return only the user object
  } catch (error) {
    console.error("❌ userService: Fetch profile error:", error);
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/updateUserProfile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ userService: Update profile failed:", response.status, errorText);
      throw new Error(`Failed to update user profile: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ userService: Update profile error:", error);
    throw error;
  }
}