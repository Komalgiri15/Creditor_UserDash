// src/services/searchService.js
import { getAuthHeader } from './authHeader';

export async function search(query) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`, {
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
    console.error('Error searching:', error);
    throw error;
  }
}
