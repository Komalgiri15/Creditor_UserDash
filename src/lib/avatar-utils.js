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

/**
 * Gets the user's current avatar URL
 * @returns The URL of the current avatar
 */
export const getUserAvatarUrl = () => {
  return localStorage.getItem('userAvatar') || '/default-avatar.png';
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