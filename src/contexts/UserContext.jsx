import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '@/services/userService';

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

  // Fetch user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUserProfile();
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err.message);
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