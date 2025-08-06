import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile, getAuthToken } from '@/services/userService';

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

  // Listen for login events to refresh user profile
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token' && event.newValue) {
        // Token was added, refresh user profile
        console.log('Token detected, refreshing user profile');
        setTimeout(() => {
          loadUserProfile();
        }, 200); // Small delay to ensure token is fully set
      }
    };

    // Listen for localStorage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events (same tab)
    const handleUserLogin = () => {
      console.log('User login event detected, refreshing profile');
      setTimeout(() => {
        loadUserProfile();
      }, 200);
    };

    window.addEventListener('userLoggedIn', handleUserLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if token is available before fetching profile
      const token = getAuthToken();
      if (!token) {
        console.log('No token available, skipping profile fetch');
        setUserProfile(null);
        return;
      }
      
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