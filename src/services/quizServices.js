// Service to handle quiz-related API calls
import axios from 'axios';

const QUIZ_API_URL = 'http://localhost:9000/api/quiz/Quiz';

export async function createQuiz(quizData) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/Quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizData),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to create quiz (${response.status})`);
  }
  return await response.json();
}

export async function bulkUploadQuestions(quizId, questionsPayload) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/admin/quizzes/${quizId}/questions/bulk-upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionsPayload),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to bulk upload questions (${response.status})`);
  }
  return await response.json();
}

/**
 * Fetches all quizzes for a specific module
 * @param {string} moduleId - The ID of the module to fetch quizzes for
 * @returns {Promise<Array>} Array of quiz objects
 * @throws {Error} If the request fails or returns an error
 */
export async function fetchQuizzesByModule(moduleId) {
  if (!moduleId) {
    throw new Error('Module ID is required to fetch quizzes');
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/quiz/modules/${moduleId}/quizzes`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const errorMessage = responseData.message || `Failed to fetch quizzes for module (${response.status})`;
      console.error('Error fetching quizzes:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      throw new Error(errorMessage);
    }

    // Return the data array directly if it exists, otherwise return an empty array
    return Array.isArray(responseData.data) ? responseData.data : [];
  } catch (error) {
    console.error('Error in fetchQuizzesByModule:', error);
    throw error;
  }
}

export async function fetchAllQuizzes() {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/getQuiz`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch all quizzes');
  }
  const data = await response.json();
  return data.data || data;
}

export async function getQuizById(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/${quizId}/getQuizById`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quiz by ID');
  }
  const data = await response.json();
  return data.data || data;
}

// New functions for quiz scores and user attempts
export async function fetchQuizScores(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/${quizId}/scores`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quiz scores');
  }
  const data = await response.json();
  return data.data || data;
}

export async function fetchUserQuizAttempts(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/${quizId}/attempts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user quiz attempts');
  }
  const data = await response.json();
  return data.data || data;
}

export async function fetchQuizAnalytics(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/${quizId}/analytics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quiz analytics');
  }
  const data = await response.json();
  return data.data || data;
}

export async function fetchQuizAdminAnalytics(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/admin/quizzes/${quizId}/analytics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quiz admin analytics');
  }
  const data = await response.json();
  return data.data || data;
}

export async function fetchQuizAdminScores(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/admin/quizzes/${quizId}/scores`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quiz admin scores');
  }
  const data = await response.json();
  return data.data || data;
}

export async function deleteQuiz(quizId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/admin/quizzes/${quizId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to delete quiz (${response.status})`);
  }
  return await response.json();
}

export async function updateQuiz(quizId, quizData) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/${quizId}/updateQuizz`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizData),
    credentials: 'include',
  });
  
  const responseData = await response.json();
  
  // Check if the response indicates success despite HTTP status
  if (responseData.success === true && responseData.code === 200) {
    return responseData;
  }
  
  // If not successful, throw error
  if (!response.ok) {
    const errorData = responseData || { message: 'Unknown error' };
    throw new Error(errorData.message || `Failed to update quiz (${response.status})`);
  }
  
  return responseData;
}

export async function updateQuestion(quizId, questionId, questionData) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/admin/quizzes/${quizId}/questions/${questionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(questionData),
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to update question (${response.status})`);
  }
  
  return await response.json();
}