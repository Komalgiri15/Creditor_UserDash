// Quiz Service for handling quiz-related API calls

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Backend handles authentication via cookies
  return {
    'Content-Type': 'application/json',
  };
};

// Get current user ID from localStorage or context
const getCurrentUserId = () => {
  // You can replace this with your actual user context
  return localStorage.getItem('userId') || 'userId-1';
};

/**
 * Start a quiz for a user
 * @param {string} quizId - The ID of the quiz to start
 * @returns {Promise<Object>} Quiz session data
 */
export async function startQuiz(quizId) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes/${quizId}/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to start quiz: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error starting quiz:', error);
    throw error;
  }
}

/**
 * Submit a completed quiz
 * @param {string} quizId - The ID of the quiz to submit
 * @param {Object} answers - User's answers to the quiz questions
 * @returns {Promise<Object>} Quiz results and score
 */
export async function submitQuiz(quizId, answers) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit quiz: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
}

/**
 * Get all quizzes for a user
 * @returns {Promise<Array>} Array of quiz objects
 */
export async function getUserQuizzes() {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch quizzes: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Handle different response structures
    if (data && data.data && Array.isArray(data.data)) {
      return data; // Return the full response with data array
    } else if (data && Array.isArray(data)) {
      return { data: data }; // Wrap in data property for consistency
    } else {
      console.warn('Unexpected API response structure:', data);
      return { data: [] };
    }
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    throw error;
  }
}

/**
 * Get quiz details by ID
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<Object>} Quiz details
 */
export async function getQuizById(quizId) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes/${quizId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch quiz: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
}

/**
 * Get quiz questions for a specific quiz
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<Array>} Array of quiz questions
 */
export async function getQuizQuestions(quizId) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes/${quizId}/questions`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch quiz questions: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
}

/**
 * Get quiz results and analytics
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<Object>} Quiz results and analytics
 */
export async function getQuizResults(quizId) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes/${quizId}/results`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch quiz results: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    throw error;
  }
}

/**
 * Get quiz progress and attempt history
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<Object>} Quiz progress and attempt history
 */
export async function getQuizProgress(quizId) {
  try {
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/api/quiz/user/${userId}/quizzes/${quizId}/progress`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch quiz progress: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    throw error;
  }
}
