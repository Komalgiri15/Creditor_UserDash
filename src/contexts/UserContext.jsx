import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '@/services/userService';
import Cookies from 'js-cookie';
import { refreshAvatarFromBackend } from '@/lib/avatar-utils';

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

  // Listen for authentication changes
  useEffect(() => {
    const handleAuthChange = () => {
      // Always try to refresh profile when auth changes
      loadUserProfile();
    };

    // Listen for custom events
    window.addEventListener('userRoleChanged', handleAuthChange);
    window.addEventListener('userLoggedOut', () => {
      setUserProfile(null);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener('userRoleChanged', handleAuthChange);
      window.removeEventListener('userLoggedOut', () => {
        setUserProfile(null);
        setIsLoading(false);
      });
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch user profile - backend will determine if user is authenticated
      const data = await fetchUserProfile();
      setUserProfile(data);
      
      // Also load the user's avatar
      try {
        await refreshAvatarFromBackend();
      } catch (error) {
        console.warn('Failed to load avatar:', error);
      }
      
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
    
    // Also update localStorage for consistency
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
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