import axios from 'axios';
import { getAuthHeader } from './authHeader';
// import { getAuthHeader } from './authHeader';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

// Helper function to join URL parts
const joinUrl = (base, path) => {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

// Fetch all tickets for admin/instructor
export const getAllTickets = async () => {
  return axios.get(
    joinUrl(baseUrl, 'api/support-tickets/'),
    {
      headers: {
        ...getAuthHeader(),
      },
      withCredentials: true
    }
  );
};

// Add a new support ticket
export const createSupportTicket = async (ticketData) => {
  return axios.post(
    joinUrl(baseUrl, 'api/support-tickets/'),
    ticketData,
    {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      withCredentials: true
    }
  );
};

// Alias for backward compatibility
export const createTicket = createSupportTicket;

// Add reply to a ticket (admin only)
export const addReplyToTicket = async (ticketId, replyData) => {
  const message = replyData?.message;
  const commonOptions = {
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
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
      headers: {
        ...getAuthHeader(),
      },
      withCredentials: true
    }
  );
};

// Get a single ticket by ID
export const getTicketById = async (ticketId) => {
  return axios.get(
    joinUrl(baseUrl, `api/support-tickets/${ticketId}`),
    {
      headers: {
        ...getAuthHeader(),
      },
      withCredentials: true
    }
  );
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status) => {
  return axios.patch(
    joinUrl(baseUrl, `api/support-tickets/${ticketId}/status`),
    { status },
    {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      withCredentials: true
    }
  );
};

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
