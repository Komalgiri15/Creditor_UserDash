import { useState, useEffect } from 'react';
import { 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  fetchEventDetails,
  fetchDeletedOccurrences,
  deleteOccurrence,
  deleteAllOccurrences,
  restoreOccurrence,
  refreshEvents,
  eventValidation,
  eventTransformers
} from '@/services/eventService';
import { fetchAllCourses } from '@/services/courseService';

export const useEventManagement = () => {
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const coursesData = await fetchAllCourses();
      setCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(err.message);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await refreshEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create event
  const handleCreateEvent = async (formData, selectedCourse, currentRole) => {
    try {
      setLoading(true);
      setError(null);

      // Validate form data
      const validationErrors = eventValidation.validateRecurringEvent(formData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Build payload
      const payload = eventTransformers.buildEventPayload(formData, selectedCourse, currentRole);
      
      // Create event
      await createEvent(payload);
      
      // Refresh events
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const handleUpdateEvent = async (eventId, formData, selectedCourse, currentRole) => {
    try {
      setLoading(true);
      setError(null);

      // Build payload
      const payload = eventTransformers.buildEventPayload(formData, selectedCourse, currentRole);
      
      // Update event
      await updateEvent(eventId, payload);
      
      // Refresh events
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      console.error("Failed to update event:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteEvent(eventId);
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete occurrence
  const handleDeleteOccurrence = async (eventId, occurrenceStartTime) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteOccurrence(eventId, occurrenceStartTime);
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      console.error("Failed to delete occurrence:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete all occurrences
  const handleDeleteAllOccurrences = async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteAllOccurrences(eventId);
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      console.error("Failed to delete all occurrences:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Restore occurrence
  const handleRestoreOccurrence = async (eventId, occurrenceDate) => {
    try {
      setLoading(true);
      setError(null);
      
      await restoreOccurrence(eventId, occurrenceDate);
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      console.error("Failed to restore occurrence:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch event details
  const handleFetchEventDetails = async (eventId) => {
    try {
      const eventDetails = await fetchEventDetails(eventId);
      return eventDetails;
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setError(err.message);
      return null;
    }
  };

  // Fetch deleted occurrences
  const handleFetchDeletedOccurrences = async (eventId) => {
    try {
      const deletedOccurrences = await fetchDeletedOccurrences(eventId);
      return deletedOccurrences;
    } catch (err) {
      console.error("Failed to fetch deleted occurrences:", err);
      setError(err.message);
      return [];
    }
  };

  // Initialize
  useEffect(() => {
    fetchCourses();
    fetchEvents();
  }, []);

  return {
    events,
    courses,
    loading,
    error,
    fetchEvents,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleDeleteOccurrence,
    handleDeleteAllOccurrences,
    handleRestoreOccurrence,
    handleFetchEventDetails,
    handleFetchDeletedOccurrences,
    clearError: () => setError(null)
  };
}; 