// Centralized calendar API service

export async function getAllEvents(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events${query ? `?${query}` : ''}`;
    
    console.log('Fetching events from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // send cookies if needed for auth
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch events:', response.status, errorText);
      throw new Error(`Failed to fetch events: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Events fetched successfully:', data.data?.length || 0, 'events');
    
    // Log recurring events for debugging
    if (data.data) {
      const recurringEvents = data.data.filter(event => event.isRecurring || event.recurrenceRule);
      if (recurringEvents.length > 0) {
        console.log('Recurring events found:', recurringEvents.length);
        recurringEvents.forEach(event => {
          console.log('Recurring event:', {
            id: event.id,
            title: event.title,
            isRecurring: event.isRecurring,
            recurrenceRule: event.recurrenceRule,
            occurrences: event.occurrences?.length || 0
          });
        });
      }
    }
    
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
    
    console.log('Fetching upcoming events from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch upcoming events:', response.status, errorText);
      throw new Error(`Failed to fetch upcoming events: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Upcoming events fetched successfully:', data.data?.length || 0, 'events');
    return data.data || [];
  } catch (error) {
    console.error('Error in getAllUpcomingEvents:', error);
    throw error;
  }
} 
