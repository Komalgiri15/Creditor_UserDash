// Lesson Service for handling lesson-related API calls
import { getAuthHeader } from './authHeader';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Backend handles authentication via cookies
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Upload lesson content for a module
 * @param {string} moduleId - The ID of the module
 * @param {File} file - The lesson file to upload
 * @returns {Promise<Object>} Upload response
 */
export async function uploadLesson(moduleId, file) {
  try {
    const formData = new FormData();
    formData.append('lesson', file);
    formData.append('moduleId', moduleId);

    const response = await fetch(`${API_BASE}/api/lessons/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload lesson: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error uploading lesson:', error);
    throw error;
  }
}

/**
 * Get lesson content for a module
 * @param {string} moduleId - The ID of the module
 * @returns {Promise<Object>} Lesson content
 */
export async function getLessonContent(moduleId) {
  try {
    const response = await fetch(`${API_BASE}/api/lessons/${moduleId}/content`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch lesson content: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    throw error;
  }
}

/**
 * Delete lesson content for a module
 * @param {string} moduleId - The ID of the module
 * @returns {Promise<Object>} Deletion response
 */
export async function deleteLesson(moduleId) {
  try {
    const response = await fetch(`${API_BASE}/api/lessons/${moduleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete lesson: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
}

/**
 * Get lesson preview URL for a module
 * @param {string} moduleId - The ID of the module
 * @returns {Promise<string>} Preview URL
 */
export async function getLessonPreviewUrl(moduleId) {
  try {
    const response = await fetch(`${API_BASE}/api/lessons/${moduleId}/preview`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch lesson preview: ${response.status}`);
    }

    const data = await response.json();
    return data.previewUrl || data.url || null;
  } catch (error) {
    console.error('Error fetching lesson preview:', error);
    throw error;
  }
}

/**
 * Update lesson metadata for a module
 * @param {string} moduleId - The ID of the module
 * @param {Object} metadata - Lesson metadata to update
 * @returns {Promise<Object>} Update response
 */
export async function updateLessonMetadata(moduleId, metadata) {
  try {
    const response = await fetch(`${API_BASE}/api/lessons/${moduleId}/metadata`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update lesson metadata: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error updating lesson metadata:', error);
    throw error;
  }
}

// Example usage in a fetch call:
export async function someApiFunction() {
  const response = await fetch(`${API_BASE}/api/someEndpoint`, {
    method: 'GET', // or 'POST', etc.
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
  });
  // ...existing code...
}

export default {
  uploadLesson,
  getLessonContent,
  deleteLesson,
  getLessonPreviewUrl,
  updateLessonMetadata,
};
