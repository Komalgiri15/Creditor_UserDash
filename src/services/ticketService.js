import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log('Ticket Service Base URL:', baseUrl); // Debug: print the base URL being used

// Helper to join base URL and path safely
function joinUrl(base, path) {
  if (base.endsWith('/')) base = base.slice(0, -1);
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}

export const createTicket = async (formData) => {
  // Backend's HttpOnly token cookie will be automatically sent with the request
  return axios.post(
    joinUrl(baseUrl, 'api/support-tickets/create'),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    }
  );
};