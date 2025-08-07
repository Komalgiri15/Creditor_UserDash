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

export async function fetchQuizzesByModule(moduleId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quiz/module/${moduleId}/quizzes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes for module');
  }
  const data = await response.json();
  return data.data || data;
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