// Centralized calendar API service

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
    ...(token && { 'Authorization': `Bearer ${token}` })
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
    throw new Error(`API call failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

// Event filtering utilities
export const eventUtils = {
  filterDeletedOccurrences: async (events) => {
    const filteredEvents = [];
    
    for (const event of events) {
      if (event.isRecurring && event.occurrences && event.occurrences.length > 0) {
        try {
          const deletedOccurrences = await fetchDeletedOccurrences(event.id);
          const deletedStartTimes = deletedOccurrences.map(occ => 
            typeof occ === 'string' ? occ : occ.occurrence_date
          );
          
          const validOccurrences = event.occurrences.filter(occ => {
            const isDeleted = deletedStartTimes.includes(occ.startTime);
            return !isDeleted;
          });
          
          if (validOccurrences.length > 0) {
            filteredEvents.push({
              ...event,
              occurrences: validOccurrences
            });
          }
        } catch (error) {
          // If we can't fetch deleted occurrences, include the event as is
          filteredEvents.push(event);
        }
      } else {
        filteredEvents.push(event);
      }
    }
    
    return filteredEvents;
  },

  getEventStatus: (event) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    if (now >= start && now <= end) {
      return { status: 'live', text: 'Live Now' };
    } else if (now < start) {
      return { status: 'upcoming', text: 'Upcoming' };
    } else {
      return { status: 'ended', text: 'Ended' };
    }
  }
};

// Timezone utilities
export const timezoneUtils = {
  formatTimeInUserTimezone: (utcTime, userTimezone) => {
    if (!utcTime) return '';
    
    try {
      const date = new Date(utcTime);
      return date.toLocaleString('en-US', {
        timeZone: userTimezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return utcTime;
    }
  },

  getUserTimezone: () => {
    return localStorage.getItem('userTimezone') || 'America/Los_Angeles';
  }
};

// Main API functions
export async function getAllEvents(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events${query ? `?${query}` : ''}`;
    
    const data = await makeApiCall(url);
    return data.data || [];
  } catch (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }
}

export async function getUpcomingEvents(params = {}) {
  try {
    const now = new Date();
    const startDate = params.startDate || now.toISOString();
    const endDate = params.endDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now
    
    const queryParams = {
      startTime: startDate,
      endTime: endDate,
      ...params
    };
    
    const query = new URLSearchParams(queryParams).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events${query ? `?${query}` : ''}`;
    
    const data = await makeApiCall(url);
    
    // Process events to handle recurring vs non-recurring
    const upcomingEvents = [];
    
    (data.data || []).forEach(event => {
      if (event.isRecurring && event.occurrences && event.occurrences.length > 0) {
        // For recurring events, check each occurrence
        event.occurrences.forEach(occurrence => {
          const occurrenceStart = new Date(occurrence.startTime);
          
          // Only include occurrences that are in the future
          if (occurrenceStart >= now) {
            upcomingEvents.push({
              ...event,
              startTime: occurrence.startTime,
              endTime: occurrence.endTime,
              isOccurrence: true,
              originalEventId: event.id
            });
          }
        });
      } else {
        // For non-recurring events, use the main event times
        if (event.startTime) {
          const eventStart = new Date(event.startTime);
          
          // Only include events that are in the future
          if (eventStart >= now) {
            upcomingEvents.push({
              ...event,
              isOccurrence: false
            });
          }
        }
      }
    });
    
    // Sort by start time
    upcomingEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    return upcomingEvents;
  } catch (error) {
    throw new Error(`Failed to fetch upcoming events: ${error.message}`);
  }
}

export async function getCancelledEvents(userTimezone) {
  try {
    const startTimeUTC = new Date().toISOString();
    const userEndOfDay = new Date();
    userEndOfDay.setHours(23, 59, 59, 999);
    const endTimeUTC = userEndOfDay.toISOString();
    
    const params = { startTime: startTimeUTC, endTime: endTimeUTC };
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/cancelledevents?${query}`;
    
    const data = await makeApiCall(url);
    
    // Transform the cancelled events to match the expected format
    const transformedEvents = (data.data || []).map(cancelledEvent => {
      const event = cancelledEvent.event;
      return {
        id: cancelledEvent.id,
        eventId: cancelledEvent.eventId,
        title: event.title,
        description: event.description || '',
        startTime: cancelledEvent.occurrence_date,
        endTime: event.endTime,
        location: event.location || '',
        instructor: event.instructor || '',
        course: event.course,
        courseId: event.course?.id,
        courseName: event.course?.title,
        isCancelled: true,
        cancelledAt: cancelledEvent.createdAt,
        cancelledBy: cancelledEvent.UpdatedBy
      };
    });
    
    return transformedEvents;
  } catch (error) {
    throw new Error(`Failed to fetch cancelled events: ${error.message}`);
  }
}

export async function fetchDeletedOccurrences(eventId) {
  try {
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/deleted-occurrences`;
    const data = await makeApiCall(url);
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export async function getTodayEvents() {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    
    const params = {
      startTime: start.toISOString(),
      endTime: end.toISOString()
    };
    
    const data = await getAllEvents(params);
    
    // Filter and process events
    const todayEvents = [];
    
    data.forEach(event => {
      if (event.isRecurring && event.occurrences && event.occurrences.length > 0) {
        // For recurring events, check each occurrence
        event.occurrences.forEach(occurrence => {
          const occurrenceStart = new Date(occurrence.startTime);
          const occurrenceEnd = new Date(occurrence.endTime);
          
          // Check if this occurrence is today
          const isToday = (
            occurrenceStart.getFullYear() === now.getFullYear() &&
            occurrenceStart.getMonth() === now.getMonth() &&
            occurrenceStart.getDate() === now.getDate()
          );
          
          if (isToday) {
            // Create a new event object for this occurrence
            todayEvents.push({
              ...event,
              startTime: occurrence.startTime,
              endTime: occurrence.endTime,
              isOccurrence: true,
              originalEventId: event.id
            });
          }
        });
      } else {
        // For non-recurring events, use the main event times
        if (event.startTime && event.endTime) {
          const eventStart = new Date(event.startTime);
          const eventEnd = new Date(event.endTime);
          
          // Check if this event is today
          const isToday = (
            eventStart.getFullYear() === now.getFullYear() &&
            eventStart.getMonth() === now.getMonth() &&
            eventStart.getDate() === now.getDate()
          );
          
          if (isToday) {
            todayEvents.push({
              ...event,
              isOccurrence: false
            });
          }
        }
      }
    });
    
    // Sort by start time
    todayEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    return todayEvents;
  } catch (error) {
    throw new Error(`Failed to fetch today's events: ${error.message}`);
  }
} 
