// Event management service
import { getAllEvents } from './calendarService';

// Utility functions for authentication
const getAuthToken = () => {
  return localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
};

const getUserRole = () => {
  return localStorage.getItem('userRole') || 'user';
};

// Base API call function
const makeApiCall = async (url, options = {}) => {
  const token = getAuthToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'X-User-Role': getUserRole(),
  };

  console.log(' Making API call:', {
    url,
    method: options.method || 'GET',
    headers: defaultHeaders,
    hasBody: !!options.body
  });

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  console.log(' Response status:', response.status);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      body: errorText
    });
    throw new Error(`API call failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ API call successful:', data);
  return data;
};

// Event validation utilities
export const eventValidation = {
  validateRecurringEvent: (formData) => {
    const errors = [];
    
    if (formData.recurrence !== "none") {
      if (!formData.startTime) {
        errors.push("Start time is required for recurring events");
      }
      if (!formData.endTime) {
        errors.push("End time is required for recurring events");
      }
      if (formData.startTime && formData.endTime) {
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);
        if (end <= start) {
          errors.push("End time must be after start time");
        }
      }
      if (!formData.title.trim()) {
        errors.push("Title is required for recurring events");
      }
    }
    
    return errors;
  },

  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
};

// Event data transformation utilities
export const eventTransformers = {
  toIsoUtc: (dateString) => {
    if (!dateString) return "";
    
    try {
      const localDate = new Date(dateString);
      return localDate.toISOString();
    } catch (error) {
      console.error('Error converting date to UTC:', error);
      return "";
    }
  },

  createRecurrenceRule: (formData, isRecurring) => {
    if (!isRecurring) return undefined;

    const recurrenceMap = {
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
    };

    const startDate = new Date(formData.startTime);
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    
    return {
      frequency: recurrenceMap[formData.recurrence] || 'DAILY',
      interval: 1,
      endDate: endDate.toISOString()
    };
  },

  buildEventPayload: (formData, selectedCourse, currentRole) => {
    const isRecurring = formData.recurrence !== "none";
    const recurrenceRule = eventTransformers.createRecurrenceRule(formData, isRecurring);

    const payload = {
      title: formData.title,
      description: formData.description,
      startTime: eventTransformers.toIsoUtc(formData.startTime),
      endTime: eventTransformers.toIsoUtc(formData.endTime),
      location: formData.location || (formData.zoomLink ? formData.zoomLink : ""),
      isRecurring,
      calendarType: "GROUP",
      visibility: "PRIVATE",
      courseName: selectedCourse ? selectedCourse.title : ""
    };

    if (isRecurring && recurrenceRule) {
      payload.recurrenceRule = recurrenceRule;
    }

    return payload;
  }
};

// API Functions
export async function createEvent(payload) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events`;
    console.log('Creating event with payload:', payload);
    
    const data = await makeApiCall(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    console.log('Event created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function updateEvent(eventId, payload) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    console.log('🔄 PATCH URL:', url);
    console.log('🔄 Event ID being used:', eventId);
    console.log(' Payload being sent:', payload);
    
    const data = await makeApiCall(url, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    
    console.log('✅ Event updated successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating event:', error);
    throw error;
  }
}

export async function deleteEvent(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    console.log('🗑️ Deleting event with ID:', eventId);
    console.log('️ DELETE URL:', url);
    
    // Get auth token for debugging
    const token = getAuthToken();
    console.log('🗑️ Auth token available:', !!token);
    
    // Try the standard DELETE method first
    try {
      const data = await makeApiCall(url, {
        method: 'DELETE'
      });
      
      console.log('✅ Event deleted successfully:', data);
      return data;
    } catch (deleteError) {
      console.log('⚠️ Standard DELETE failed, trying alternative method...');
      
      // Try alternative: DELETE with empty body
      const data = await makeApiCall(url, {
        method: 'DELETE',
        body: JSON.stringify({})
      });
      
      console.log('✅ Event deleted successfully (alternative method):', data);
      return data;
    }
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    throw error;
  }
}

export async function fetchEventDetails(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    console.log('Fetching event details:', eventId);
    
    const data = await makeApiCall(url);
    console.log('Event details fetched:', data);
    return data.data || null;
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

export async function fetchDeletedOccurrences(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`;
    console.log('Fetching deleted occurrences for event:', eventId);
    
    const data = await makeApiCall(url);
    console.log('Deleted occurrences fetched:', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching deleted occurrences:', error);
    return [];
  }
}

export async function deleteOccurrence(eventId, occurrenceStartTime) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`;
    console.log('Deleting occurrence:', { eventId, occurrenceStartTime });
    
    const data = await makeApiCall(url, {
      method: 'POST',
      body: JSON.stringify({ occurrenceDate: occurrenceStartTime })
    });
    
    console.log('Occurrence deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting occurrence:', error);
    throw error;
  }
}

export async function deleteAllOccurrences(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`;
    console.log('Deleting all occurrences for event:', eventId);
    
    const data = await makeApiCall(url, {
      method: 'DELETE'
    });
    
    console.log('All occurrences deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting all occurrences:', error);
    throw error;
  }
}

export async function restoreOccurrence(eventId, occurrenceDate) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`;
    console.log('Restoring occurrence:', { eventId, occurrenceDate });
    
    const data = await makeApiCall(url, {
      method: 'DELETE',
      body: JSON.stringify({ occurrenceDate })
    });
    
    console.log('Occurrence restored successfully:', data);
    return data;
  } catch (error) {
    console.error('Error restoring occurrence:', error);
    throw error;
  }
}

export async function refreshEvents() {
  try {
    const events = await getAllEvents();
    return events.map(ev => ({
      ...ev,
      courseId: ev.courseId || ev.course_id
    }));
  } catch (error) {
    console.error('Error refreshing events:', error);
    return [];
  }
} 