import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, getUserRoles, setUserRole as setUserRoleUtil, setUserRoles as setUserRolesUtil, setSingleRole, clearUserData, isInstructorOrAdmin as checkInstructorOrAdmin, logoutUser } from '@/services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRoleState] = useState('user');
  const [userRoles, setUserRolesState] = useState(['user']);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for token on initial load
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    // Initialize user roles on mount
    const role = getUserRole();
    const roles = getUserRoles();
    const hasToken = !!localStorage.getItem('token');
    
    setUserRoleState(role);
    setUserRolesState(roles);
    setIsAuthenticated(hasToken);
    setIsLoading(false);

    // Listen for role changes
    const handleRoleChange = () => {
      const newRole = getUserRole();
      const newRoles = getUserRoles();
      setUserRoleState(newRole);
      setUserRolesState(newRoles);
    };

    window.addEventListener('userRoleChanged', handleRoleChange);

    return () => {
      window.removeEventListener('userRoleChanged', handleRoleChange);
    };
  }, []);

  const setUserRole = (role) => {
    setUserRoleUtil(role);
    setUserRoleState(role);
  };

  const setUserRoles = (roles) => {
    setUserRolesUtil(roles);
    setUserRolesState(roles);
    // Update primary role as well
    if (Array.isArray(roles) && roles.length > 0) {
      setUserRoleState(roles[0]);
    }
  };

  const setSingleRole = (role) => {
    setSingleRole(role);
    setUserRoleState(role);
    setUserRolesState([role]);
  };

  const setAuth = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      // Call the logout API
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear all local data
      clearUserData();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      Cookies.remove('token');
      Cookies.remove('userId');
      
      // Reset state
      setUserRoleState('user');
      setUserRolesState(['user']);
      setIsAuthenticated(false);
      
      // Notify other components
      window.dispatchEvent(new Event('userRoleChanged'));
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      // Force a hard redirect to login page to ensure all state is cleared
      window.location.href = '/login';
    }
  };

  const isInstructorOrAdmin = () => {
    return checkInstructorOrAdmin();
  };

  const hasRole = (roleToCheck) => {
    return userRoles.includes(roleToCheck);
  };

  const value = {
    userRole,
    userRoles,
    isAuthenticated,
    isLoading,
    setUserRole,
    setUserRoles,
    setSingleRole,
    setAuth,
    logout,
    isInstructorOrAdmin,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 