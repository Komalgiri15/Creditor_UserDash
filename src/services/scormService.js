// SCORM Service for handling backend API calls
// Replace the base URL with your actual backend API endpoint

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';

class ScormService {
  // Fetch course data from backend
  static async fetchCourseData(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/scorm`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add your auth token
        }
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

  // Update course progress
  static async updateCourseProgress(courseId, moduleId, progress) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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

  // Mark module as completed
  static async markModuleCompleted(courseId, moduleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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

  // Get user's progress for a course
  static async getUserProgress(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/user-progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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

  // Save SCORM session data
  static async saveScormSession(courseId, moduleId, sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/scorm/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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

  // Get SCORM session data
  static async getScormSession(courseId, moduleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/scorm/session/${courseId}/${moduleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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

  // Get course analytics
  static async getCourseAnalytics(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
}

export default ScormService; 