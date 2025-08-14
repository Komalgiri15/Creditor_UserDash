import { getAuthHeader } from './authHeader';

// Centralized calendar API service

// Utility function to generate occurrences from recurrence rule
export function generateOccurrencesFromRule(event, maxOccurrences = 30) {
  if (!event.isRecurring || !event.recurrenceRule || !event.recurrenceRule.length) {
    return [];
  }

  const rule = event.recurrenceRule[0]; // Take the first rule
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const duration = endDate.getTime() - startDate.getTime();
  
  const occurrences = [];
  let currentDate = new Date(startDate);
  let count = 0;

  while (count < maxOccurrences) {
    // Check if we've reached the end date
    if (rule.endDate && currentDate > new Date(rule.endDate)) {
      break;
    }

    // Check if we've reached the count limit
    if (rule.count && count >= rule.count) {
      break;
    }

    // Add this occurrence
    const occurrenceStart = new Date(currentDate);
    const occurrenceEnd = new Date(currentDate.getTime() + duration);
    
    occurrences.push({
      startTime: occurrenceStart.toISOString(),
      endTime: occurrenceEnd.toISOString()
    });

    // Calculate next occurrence based on frequency
    switch (rule.frequency) {
      case 'DAILY':
        currentDate.setDate(currentDate.getDate() + (rule.interval || 1));
        break;
      case 'WEEKLY':
        currentDate.setDate(currentDate.getDate() + (7 * (rule.interval || 1)));
        break;
      case 'MONTHLY':
        currentDate.setMonth(currentDate.getMonth() + (rule.interval || 1));
        break;
      case 'YEARLY':
        currentDate.setFullYear(currentDate.getFullYear() + (rule.interval || 1));
        break;
      default:
        // Default to daily
        currentDate.setDate(currentDate.getDate() + 1);
    }

    count++;
  }

  return occurrences;
}

// Utility function to expand recurring events
export function expandRecurringEvents(events, maxOccurrences = 30) {
  const expanded = [];
  const now = new Date();
  
  // Get user timezone from localStorage
  const getUserTimezone = () => {
    return localStorage.getItem('userTimezone') || 'America/New_York';
  };
  
  const userTimezone = getUserTimezone();

  events.forEach(event => {
    if (event.isRecurring) {
      let occurrences = [];

      // If occurrences array exists and is not empty, use it
      if (Array.isArray(event.occurrences) && event.occurrences.length > 0) {
        occurrences = event.occurrences;
      } else {
        // Generate occurrences from recurrence rule
        occurrences = generateOccurrencesFromRule(event, maxOccurrences);
      }

      // Process each occurrence
      occurrences.forEach(occ => {
        const occStartDate = new Date(occ.startTime);
        if (occStartDate >= now) {
          const duration = new Date(occ.endTime) - new Date(occ.startTime);
          const occEndTime = new Date(occStartDate.getTime() + duration);
          
          expanded.push({
            ...event,
            date: occStartDate,
            startTime: occ.startTime,
            endTime: occEndTime.toISOString(),
            time: occStartDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZone: userTimezone 
            }),
            isOccurrence: true,
            originalEvent: event
          });
        }
      });
    } else if (event.startTime) {
      // Handle non-recurring events
      const eventDate = new Date(event.startTime);
      if (eventDate >= now) {
        expanded.push({
          ...event,
          date: eventDate,
          time: eventDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: userTimezone 
          }),
          isOccurrence: false
        });
      }
    }
  });

  return expanded;
}

export async function getAllEvents(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events${query ? `?${query}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      credentials: 'include', // send cookies if needed for auth
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch events:', response.status, errorText);
      throw new Error(`Failed to fetch events: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    return data.data || [];
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    throw error;
  }
}

export async function getAllUpcomingEvents(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events${query ? `?${query}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch upcoming events:', response.status, errorText);
      throw new Error(`Failed to fetch upcoming events: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error in getAllUpcomingEvents:', error);
    throw error;
  }
}
