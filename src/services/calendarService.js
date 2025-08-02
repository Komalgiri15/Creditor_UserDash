// Centralized calendar API service

export async function getAllEvents(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_BASE_URL}/calendar/events${query ? `?${query}` : ''}`;
    
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
