/**
 * Dispatches a custom event to notify that the user avatar has changed
 * This helps components update without prop drilling or complex state management
 */
export const notifyAvatarChange = () => {
  // Use storage event as a communication channel between components
  localStorage.setItem('avatarLastUpdated', new Date().toISOString());
  
  // Also dispatch a custom event for components that are listening
  window.dispatchEvent(new Event('user-avatar-updated'));
};

import { getAuthHeader } from '../services/authHeader';

/**
 * Updates the user's avatar on the backend
 * @param {string} imageUrl - The new avatar URL
 * @returns {Promise<Object>} The response from the backend
 */
export const updateProfileAvatar = async (imageUrl) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/updateProfileAvatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      credentials: 'include',
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      throw new Error(`Failed to update avatar: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      // Update localStorage with the new avatar URL
      localStorage.setItem('userAvatar', imageUrl);
      
      // Update user profile in localStorage if available
      const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const updatedProfile = {
        ...currentProfile,
        image: imageUrl
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Notify other components about the avatar change
      notifyAvatarChange();
      
      return result;
    } else {
      throw new Error(result.message || 'Failed to update avatar');
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
};

/**
 * Gets the user's current avatar URL from backend or localStorage fallback
 * @returns {Promise<string>} The URL of the current avatar
 */
export const getUserAvatarUrl = async () => {
  try {
    // First try to get from backend
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getProfileAvatar`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
      },
      credentials: 'include', // Include cookies for authentication
    });
    
    if (response.ok) {
      const result = await response.json();
      
      if (result.success && result.data.hasAvatar && result.data.imageUrl) {
        // User has a custom avatar, save to localStorage and return
        localStorage.setItem('userAvatar', result.data.imageUrl);
        return result.data.imageUrl;
      } else {
        // User doesn't have a custom avatar, use default
        const defaultAvatar = '/default-avatar.png';
        localStorage.setItem('userAvatar', defaultAvatar);
        return defaultAvatar;
      }
    }
  } catch (error) {
    console.warn('Failed to fetch avatar from backend, using localStorage fallback:', error);
  }
  
  // Fallback to localStorage or default
  return localStorage.getItem('userAvatar') || '/default-avatar.png';
};

/**
 * Gets the user's avatar URL synchronously (for immediate display)
 * @returns {string} The URL of the current avatar
 */
export const getUserAvatarUrlSync = () => {
  return localStorage.getItem('userAvatar') || '/default-avatar.png';
};

/**
 * Updates the user's avatar URL in localStorage
 * @param {string} avatarUrl - The new avatar URL
 */
export const setUserAvatarUrl = (avatarUrl) => {
  localStorage.setItem('userAvatar', avatarUrl);
  notifyAvatarChange();
};

/**
 * Fetches and updates the avatar from backend
 * @returns {Promise<string>} The updated avatar URL
 */
export const refreshAvatarFromBackend = async () => {
  const avatarUrl = await getUserAvatarUrl();
  setUserAvatarUrl(avatarUrl);
  return avatarUrl;
};

/**
 * Gets the stored avatar configuration if it exists
 * @returns The stored avatar configuration object or null
 */
export const getAvatarConfig = () => {
  const configStr = localStorage.getItem('avatarConfig');
  if (configStr) {
    try {
      return JSON.parse(configStr);
    } catch (e) {
      console.error('Failed to parse avatar config', e);
      return null;
    }
  }
  return null;
};

/**
 * Validates an image file for use as an avatar
 * @param file The file to validate
 * @returns An object with validation result and optional error message
 */
export const validateAvatarImage = (file) => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: 'File must be an image' };
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, message: 'Image must be smaller than 5MB' };
  }
  
  return { valid: true };
};

// Professional SVG avatars collection
export const professionalAvatars = {
  male: [
    {
      id: 'male-business-1',
      url: 'https://api.dicebear.com/7.x/personas/svg?seed=business-male-1&backgroundColor=1A1F2C',
      alt: 'Professional male with suit'
    },
    {
      id: 'male-business-2',
      url: 'https://api.dicebear.com/7.x/personas/svg?seed=business-male-2&backgroundColor=0E172A&hair=short01,short02,short03',
      alt: 'Professional male with glasses'
    },
    {
      id: 'male-business-3',
      url: 'https://api.dicebear.com/7.x/personas/svg?seed=business-male-3&backgroundColor=333&facialHair=beard,beardMustache',
      alt: 'Professional male with beard'
    },
    {
      id: 'male-business-4',
      url: 'https://api.dicebear.com/7.x/notionists/svg?seed=professional-1&backgroundColor=3e4152',
      alt: 'Professional male portrait'
    },
    {
      id: 'male-business-5',
      url: 'https://api.dicebear.com/7.x/notionists/svg?seed=professional-2&backgroundColor=2c2f3c',
      alt: 'Professional young male'
    },
  ],
  female: [
    {
      id: 'female-business-1',
      url: 'https://api.dicebear.com/7.x/personas/svg?seed=business-female-1&backgroundColor=1A1F2C',
      alt: 'Professional female with suit'
    },
    {
      id: 'female-business-2',
      url: 'https://api.dicebear.com/7.x/personas/svg?seed=business-female-2&backgroundColor=0E172A',
      alt: 'Professional female with glasses'
    },
    {
      id: 'female-business-3',
      url: 'https://api.dicebear.com/7.x/personas/svg?seed=business-female-3&backgroundColor=333',
      alt: 'Professional female with bob haircut'
    },
    {
      id: 'female-business-4',
      url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=professional-1&backgroundColor=3e4152',
      alt: 'Professional female portrait'
    },
    {
      id: 'female-business-5',
      url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=professional-2&backgroundColor=2c2f3c',
      alt: 'Professional young female'
    },
  ]
};

/**
 * Get a random professional avatar URL
 * @returns A URL to a professional avatar
 */
export const getRandomProfessionalAvatar = () => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const avatars = professionalAvatars[gender];
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex].url;
};

/**
 * Gets all professional avatars
 * @returns An object containing male and female professional avatars
 */
export const getAllProfessionalAvatars = () => {
  return professionalAvatars;
};