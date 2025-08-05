import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '@/services/userService';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile on mount and when authentication changes
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Listen for authentication changes
  useEffect(() => {
    const handleAuthChange = () => {
      // Check if there's a valid token
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (token) {
        // User is logged in, refresh profile
        loadUserProfile();
      } else {
        // User is logged out, clear profile
        setUserProfile(null);
        setIsLoading(false);
      }
    };

    // Listen for storage changes (when token is set/removed)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        handleAuthChange();
      }
    };

    // Listen for custom events
    window.addEventListener('userRoleChanged', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    // Initial check
    handleAuthChange();

    return () => {
      window.removeEventListener('userRoleChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (!token) {
        setUserProfile(null);
        setIsLoading(false);
        return;
      }

      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err.message);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
      detail: updatedProfile 
    }));
  };

  const refreshUserProfile = async () => {
    await loadUserProfile();
  };

  const value = {
    userProfile,
    isLoading,
    error,
    updateUserProfile,
    refreshUserProfile,
    loadUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 