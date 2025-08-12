// Quiz Service for handling quiz-related API calls
import { getAuthHeader } from './authHeader';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeader(),
});

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
 * Get all quizzes for a specific module
 * @param {string} moduleId - The ID of the module
 * @returns {Promise<Array>} Array of quiz objects
 */
export async function getModuleQuizzes(moduleId) {
  try {
    const response = await fetch(`${API_BASE}/api/quiz/modules/${moduleId}/quizzes`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch module quizzes: ${response.status}`);
    }

    const data = await response.json();
    // Support both { data: [...] } and direct array
    if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching module quizzes:', error);
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

/**
 * Get quiz questions for a specific quiz in a module
 * @param {string} moduleId - The ID of the module
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<Array>} Array of quiz questions
 */
export async function getModuleQuizQuestions(moduleId, quizId) {
  try {
    const response = await fetch(`${API_BASE}/api/quiz/modules/${moduleId}/quizzes/${quizId}/questions`, {
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
    console.error('Error fetching module quiz questions:', error);
    throw error;
  }
}

/**
 * Get quiz details by module and quiz ID
 * @param {string} moduleId - The ID of the module
 * @param {string} quizId - The ID of the quiz
 * @returns {Promise<Object>} Quiz details
 */
export async function getModuleQuizById(moduleId, quizId) {
  try {
    const response = await fetch(`${API_BASE}/api/quiz/modules/${moduleId}/quizzes/${quizId}`, {
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
    console.error('Error fetching module quiz:', error);
    throw error;
  }
}
