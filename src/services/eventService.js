// Event management service

import { getAuthHeader } from './authHeader';

// Utility functions for authentication
const getUserRole = () => {
  return localStorage.getItem('userRole') || 'user';
};

// Base API call function
const makeApiCall = async (url, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const errorText = await response.text();
    
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { message: errorText };
    }
    
    const error = new Error(`API call failed: ${response.status} ${JSON.stringify(errorData)}`);
    error.status = response.status;
    error.response = errorData;
    throw error;
  }

  const data = await response.json();
  return data;
};

// Event data transformation utilities
export const eventTransformers = {
  toIsoUtc: (dateString) => {
    if (!dateString) return "";
    
    try {
      const localDate = new Date(dateString);
      return localDate.toISOString();
    } catch (error) {
      return "";
    }
  },

  createRecurrenceRule: (formData) => {
    const recurrenceMap = {
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      yearly: 'YEARLY'
    };

    return {
      frequency: recurrenceMap[formData.recurrence] || 'DAILY',
      interval: formData.interval || 1,
      endDate: formData.endDate ? eventTransformers.toIsoUtc(formData.endDate) : undefined
    };
  },

  buildEventPayload: (formData, selectedCourse, userRole) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      startTime: eventTransformers.toIsoUtc(formData.startTime),
      endTime: eventTransformers.toIsoUtc(formData.endTime),
      location: formData.location || (formData.zoomLink ? formData.zoomLink : ""),
      isRecurring: formData.isRecurring || false,
      calendarType: "GROUP",
      visibility: "PRIVATE",
      course_id: selectedCourse?.id || formData.courseId,
      timeZone: formData.timeZone || "America/Los_Angeles"
    };

    // Add recurrence rule if it's a recurring event
    if (formData.isRecurring) {
      payload.recurrenceRule = eventTransformers.createRecurrenceRule(formData);
    }

    // Add user role for non-recurring events
    if (!formData.isRecurring && userRole) {
      payload.userRole = userRole;
    }

    return payload;
  }
};

// Event creation function
export async function createEvent(formData, selectedCourse, userRole) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events`;
    const payload = eventTransformers.buildEventPayload(formData, selectedCourse, userRole);
    
    const data = await makeApiCall(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Event update function
export async function updateEvent(eventId, payload) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    
    const data = await makeApiCall(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Event deletion function
export async function deleteEvent(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    
    const data = await makeApiCall(url, {
      method: 'DELETE'
    });
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Delete occurrence function
export async function deleteOccurrence(eventId, occurrenceStartTime) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`;
    
    const data = await makeApiCall(url, {
      method: 'POST',
      body: JSON.stringify({ occurrenceDate: occurrenceStartTime })
    });
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Fetch event details
export async function fetchEventDetails(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    const data = await makeApiCall(url, { method: 'GET' });
    return data;
  } catch (error) {
    throw error;
  }
}

// Fetch deleted occurrences
export async function fetchDeletedOccurrences(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/deleted-occurrences`;
    const data = await makeApiCall(url, { method: 'GET' });
    return data;
  } catch (error) {
    throw error;
  }
}

// Restore occurrence function
export async function restoreOccurrence(eventId, occurrenceDate) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/restore-occurrence`;
    
    const data = await makeApiCall(url, {
      method: 'POST',
      body: JSON.stringify({ occurrenceDate: occurrenceDate })
    });
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Event validation
export const eventValidation = {
  validateEventData: (formData) => {
    const errors = [];
    
    if (!formData.title?.trim()) {
      errors.push('Title is required');
    }
    
    if (!formData.startTime) {
      errors.push('Start time is required');
    }
    
    if (!formData.endTime) {
      errors.push('End time is required');
    }
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        errors.push('End time must be after start time');
      }
    }
    
    return errors;
  }
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