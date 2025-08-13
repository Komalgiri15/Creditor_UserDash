import { getAuthHeader } from './authHeader';

// SCORM Service for handling backend API calls
// Replace the base URL with your actual backend API endpoint

class ScormService {
  // Fetch course data from backend
  static async fetchCourseData(moduleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${moduleId}/scorm`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching course data:', error);
      throw error;
    }
  }

  static async updateCourseProgress(courseId, moduleId, progress) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
        body: JSON.stringify({
          moduleId,
          progress,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }

  static async markModuleCompleted(courseId, moduleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking module as completed:', error);
      throw error;
    }
  }

  static async getUserProgress(courseId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}/user-progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  static async saveScormSession(courseId, moduleId, sessionData) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scorm/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId,
          moduleId,
          sessionData,
          timestamp: new Date().toISOString()
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving SCORM session:', error);
      throw error;
    }
  }

  static async getScormSession(courseId, moduleId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scorm/session/${courseId}/${moduleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching SCORM session:', error);
      throw error;
    }
  }

  static async getCourseAnalytics(courseId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      throw error;
    }
  }

  static async uploadScorm({ moduleId, file, uploadedBy, description, onProgress, onCancel }) {
    const formData = new FormData();
    formData.append('scorm', file);
    formData.append('module_id', moduleId);
    formData.append('uploaded_by', uploadedBy);
    formData.append('description', description);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('SCORM upload response:', data);
            resolve(data);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.message || `Failed to upload SCORM (${xhr.status})`));
          } catch {
            reject(new Error(`Failed to upload SCORM (${xhr.status})`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Store the xhr object so it can be cancelled
      if (onCancel) {
        onCancel(() => {
          xhr.abort();
        });
      }

      xhr.open('POST', `${import.meta.env.VITE_API_BASE_URL}/api/scorm/upload_scorm`);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  }

  static async deleteScorm(resourceId) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/scorm/deleteScorm/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed to delete SCORM (${response.status})`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting SCORM:', error);
      throw error;
    }
  }
}

export default ScormService;