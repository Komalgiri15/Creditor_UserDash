import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole, getUserRoles, setUserRole as setUserRoleUtil, setUserRoles as setUserRolesUtil, setSingleRole, clearUserData, isInstructorOrAdmin as checkInstructorOrAdmin } from '@/services/userService';

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

  useEffect(() => {
    // Initialize user roles on mount
    const role = getUserRole();
    const roles = getUserRoles();
    setUserRoleState(role);
    setUserRolesState(roles);
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

  const logout = () => {
    clearUserData();
    setUserRoleState('user');
    setUserRolesState(['user']);
    // Dispatch logout event for UserContext
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
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
    setUserRole,
    setUserRoles,
    setSingleRole,
    logout,
    isInstructorOrAdmin,
    hasRole,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 