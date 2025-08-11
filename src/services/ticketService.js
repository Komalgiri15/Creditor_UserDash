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

// Fetch all tickets for admin/instructor
export const getAllTickets = async () => {
  return axios.get(
    joinUrl(baseUrl, 'api/support-tickets/'),
    {
      withCredentials: true
    }
  );
};

// Add reply to a ticket (admin only)
export const addReplyToTicket = async (ticketId, replyData) => {
  const message = replyData?.message;
  const commonOptions = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };

  // Try variant 1: endpoint with ticketId in the path
  try {
    return await axios.post(
      joinUrl(baseUrl, `api/support-tickets/admin/reply/${ticketId}`),
      { message },
      commonOptions
    );
  } catch (error) {
    // If route not found, try variant 2: endpoint without id but with ticket_id in body
    if (error?.response?.status === 404) {
      return axios.post(
        joinUrl(baseUrl, 'api/support-tickets/admin/reply'),
        { ticket_id: ticketId, message },
        commonOptions
      );
    }
    throw error;
  }
};

// Fetch user's own tickets
export const getUserTickets = async () => {
  return axios.get(
    joinUrl(baseUrl, 'api/support-tickets/user/me'),
    {
      withCredentials: true
    }
  );
};