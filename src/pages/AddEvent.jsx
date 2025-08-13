import React, { useState, useEffect } from "react";
import { currentUserId } from "@/data/currentUser";
import { getAllEvents } from "@/services/calendarService";
import { fetchUserProfile } from "@/services/userService";
import { getAuthHeader } from "@/services/authHeader";

const DEFAULT_TIMEZONE = "America/New_York";
const AddEvent = () => {
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [userTimezone, setUserTimezone] = useState(DEFAULT_TIMEZONE);
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    timeZone: DEFAULT_TIMEZONE,
    location: "",
    isRecurring: false,
    recurrence: "none",
    zoomLink: "",
    courseId: ""
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showPastDateModal, setShowPastDateModal] = useState(false);
  const [showRecurringDeleteModal, setShowRecurringDeleteModal] = useState(false);
  const [recurringDeleteEvent, setRecurringDeleteEvent] = useState(null);
  const [deletingOccurrence, setDeletingOccurrence] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deletingOccurrenceKey, setDeletingOccurrenceKey] = useState(null); // string or null
  const [modalMessage, setModalMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 5;
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedDateForEvents, setSelectedDateForEvents] = useState(null);

  // Sort events by startTime descending (most recent at top)
  const sortedEvents = [...events].sort((a, b) => {
    // If both have createdAt, use it; else fallback to startTime
    const aTime = a.createdAt ? new Date(a.createdAt) : new Date(a.startTime);
    const bTime = b.createdAt ? new Date(b.createdAt) : new Date(b.startTime);
    return bTime - aTime;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset to first page if events change
  useEffect(() => {
    setCurrentPage(1);
  }, [events]);

  // Get user role from localStorage
  const getUserRole = () => {
    return localStorage.getItem("userRole") || "";
  };

  // Decode JWT token to see what's in it
  const decodeToken = () => {
    // Backend handles authentication via cookies
    return null;
  };

  // Try to refresh the token to get one with role information
  const refreshToken = async () => {
    try {
      // This would require the user's credentials, which we don't have stored
      // For now, let's just log that we need a token with role information
      return false;
    } catch (error) {
     
      return false;
    }
  };

  // URL validation function
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Helper to format time in a given timezone
  const formatInTimezone = (dateString, tz, label) => {
    if (!dateString) return '';
    try {
      // Parse as local time (from datetime-local input)
      const [datePart, timePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      // Create a Date object in local time
      const localDate = new Date(year, month - 1, day, hour, minute);
      // Convert to the target timezone
      return `${label}: ${localDate.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: tz
      })}`;
    } catch (error) {
      
      return `${label}: Error`;
    }
  };

  // Validate recurring event data
  const validateRecurringEvent = (formData) => {
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
  };

  // Convert UTC ISO string to local datetime-local format
  const convertUtcToLocal = (utcIsoString) => {
    if (!utcIsoString) return '';
    try {
      // Parse the UTC ISO string
      const utcDate = new Date(utcIsoString);
      
      // Check if the date is valid
      if (isNaN(utcDate.getTime())) {
        return '';
      }
      
      // Convert to local time and format as YYYY-MM-DDTHH:MM
      const year = utcDate.getFullYear();
      const month = String(utcDate.getMonth() + 1).padStart(2, '0');
      const day = String(utcDate.getDate()).padStart(2, '0');
      const hours = String(utcDate.getHours()).padStart(2, '0');
      const minutes = String(utcDate.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      
      return '';
    }
  };

  // Debug function to test recurring event creation
  const debugRecurringEvent = () => {
    const testPayload = {
      title: "Test Recurring Event",
      description: "https://meet.google.com/test-recurring",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
      location: "Test Location",
      isRecurring: true,
      calendarType: "GROUP",
      visibility: "PRIVATE",
      courseName: "Test Course",
      userRole: getUserRole(),
      timeZone: "America/Los_Angeles",
      recurrenceRule: {
        frequency: "WEEKLY",
        interval: 1,
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        count: null,
        byDay: [],
        byMonthDay: [],
        byYearDay: [],
        byWeekNo: [],
        byMonth: [],
        bySetPos: [],
        weekStart: "MO"
      }
    };
    
    // Test the API call
    fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": getUserRole(),
      },
      body: JSON.stringify(testPayload),
      credentials: "include"
    })
    .then(response => {
      return response.text();
    })
    .then(text => {
      try {
        const data = JSON.parse(text);
      } catch (e) {
        // Response is not JSON
      }
    })
    .catch(error => {
      
    });
  };

  // Fetch user profile to get timezone and role
  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const data = await fetchUserProfile();
        const timezone = data.timezone || DEFAULT_TIMEZONE;
        setUserTimezone(timezone);
        // Update form timezone as well
        setForm(prev => ({ ...prev, timeZone: timezone }));
        
        // Set user role
        const role = getUserRole();
        setUserRole(role);
      } catch (err) {
        
      }
    };
    fetchUserProfileData();
  }, []);

  // Fetch courses from API with proper authentication
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          credentials: 'include'
        });
        const data = await response.json();
        if (data && data.data) {
          setCourses(data.data);
          // Set first course as default if available
          if (data.data.length > 0) {
            setForm(prev => ({ ...prev, courseId: data.data[0].id }));
          }
        }
      } catch (err) {
        
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        
      }
    };
    fetchEvents();
  }, []);

  // Generate calendar for selected month/year
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(calendarYear, calendarMonth, d));

  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clicked = new Date(date);
    clicked.setHours(0, 0, 0, 0);

    if (clicked < today) {
      setShowPastDateModal(true);
      return;
    }

    setSelectedDate(date);
    
    // Check if there are existing events for this date
    const eventsForDate = getEventsForDate(date);
    
    if (eventsForDate.length > 0) {
      // Show existing events for this date
      setSelectedDateEvents(eventsForDate);
      setSelectedDateForEvents(date);
      setShowDateEvents(true);
    } else {
      // No events exist, open the modal directly
      openEventModal(date);
    }
  };

  const openEventModal = (date) => {
    // Create a proper datetime string for the selected date in user's timezone
    const createDateTimeString = (date, hour = 9, minute = 0) => {
      // Create a date object for the selected date
      const selectedDate = new Date(date);
      selectedDate.setHours(hour, minute, 0, 0);
      
      // Format as YYYY-MM-DDTHH:MM for datetime-local input
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const hours = String(hour).padStart(2, '0');
      const minutes = String(minute).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setForm({
      id: "",
      title: "",
      description: "",
      startTime: date ? createDateTimeString(date, 9, 0) : "", // 9:00 AM
      endTime: date ? createDateTimeString(date, 10, 0) : "",  // 10:00 AM (1 hour later)
      timeZone: userTimezone, // Use user's timezone
      location: "",
      isRecurring: false,
      recurrence: "none",
      zoomLink: "",
      courseId: courses.length > 0 ? courses[0].id : ""
    });
    setEditIndex(null); // Reset edit index for new events
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Fetch event details for editing
  const fetchEventDetails = async (eventId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      const data = await res.json();
      return data.data || null;
    } catch (err) {
      return null;
    }
  };

  // Fetch deleted occurrences for a recurring event
  const fetchDeletedOccurrences = async (eventId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        credentials: 'include',
      });
      const data = await res.json();
      // Return array of deleted occurrence objects
      return (data.data || []);
    } catch (err) {
      
    }
  };

  // Edit handler: fetch event details and populate modal
  const handleEdit = async (index) => {
    const event = events[index];
    // Fetch latest event details from backend
    const backendEvent = await fetchEventDetails(event.id);
    const e = backendEvent || event;
    setSelectedDate(e.date ? new Date(e.date) : (e.startTime ? new Date(e.startTime) : null));
    
    setForm({
      id: e.id,
      title: e.title || '',
      description: e.description || '',
      startTime: convertUtcToLocal(e.startTime),
      endTime: convertUtcToLocal(e.endTime),
      timeZone: e.timeZone || userTimezone,
      location: e.location || '',
      isRecurring: e.isRecurring || false,
      recurrence: e.recurrence || 'none',
      zoomLink: e.zoomLink || '',
      courseId: e.courseId || e.course_id || (courses.length > 0 ? courses[0].id : ''),
    });
    setEditIndex(index);
    setShowModal(true);
    // If recurring, fetch deleted occurrences
    let deletedOccurrences = [];
    if ((e.isRecurring || e.recurrence !== 'none') && e.id) {
      deletedOccurrences = await fetchDeletedOccurrences(e.id);
    }
    setRecurringDeleteEvent({ ...e, index, deletedOccurrences });
  };

  const handleDelete = async (index) => {
    const event = events[index];
    // For non-recurring events, use DELETE /calendar/events/:eventId
    if (event.isRecurring && event.occurrences && event.occurrences.length > 0) {
      // Fetch deleted occurrences for this recurring event
      const deletedOccurrences = await fetchDeletedOccurrences(event.id);
      setRecurringDeleteEvent({ ...event, index, deletedOccurrences });
      setShowRecurringDeleteModal(true);
      return;
    }
    if (!event.id) {
      // If no id, just remove from local state
    setEvents(events.filter((_, i) => i !== index));
      return;
    }
    // Show confirmation modal for non-recurring event
    setDeleteIndex(index);
    setShowDeleteConfirmModal(true);
  };

  // Confirmed delete for non-recurring event
  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    const event = events[deleteIndex];
    try {
      // DELETE non-recurring event
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events/${event.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": getUserRole(), // Add role in header as well
          ...getAuthHeader(),
        },
        credentials: "include"
      });
      // Refetch events after deletion
      const data = await getAllEvents();
      // Normalize course_id to courseId for all events
      const normalizedEvents = data.map(ev => ({
        ...ev,
        courseId: ev.courseId || ev.course_id
      }));
      setEvents(normalizedEvents);
    } catch (err) {
      
    } finally {
      setShowDeleteConfirmModal(false);
      setDeleteIndex(null);
    }
  };

  // Delete a single occurrence of a recurring event (now POST)
  const handleDeleteOccurrence = async (eventId, occurrenceStartTime) => {
    setDeletingOccurrenceKey(occurrenceStartTime);
    try {
      // DELETE a single occurrence in a recurring event (POST)
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": getUserRole(),
          ...getAuthHeader(),
        },
        credentials: "include",
        body: JSON.stringify({ occurrenceDate: occurrenceStartTime })
      });
      // Refetch events after deletion
      const data = await getAllEvents();
      setEvents(data);
      setShowRecurringDeleteModal(false);
      setModalMessage("Event deleted");
    } catch (err) {
      
    } finally {
      setDeletingOccurrenceKey(null);
    }
  };

  // Delete all occurrences (the whole series)
  const handleDeleteAllOccurrences = async (eventId) => {
    setDeletingAll(true);
    try {
      // DELETE recurring event series
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events/recurring/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": getUserRole(),
          ...getAuthHeader(),
        },
        credentials: "include"
      });
      // Refetch events after deletion
      const data = await getAllEvents();
      setEvents(data);
      setShowRecurringDeleteModal(false);
    } catch (err) {
      
    } finally {
      setDeletingAll(false);
    }
  };

  // Restore a deleted occurrence in a recurring event (DELETE)
  const handleRestoreOccurrence = async (eventId, occurrenceDate) => {
    setDeletingOccurrenceKey(occurrenceDate);
    try {
      // RESTORE a single occurrence in a recurring event (DELETE)
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${eventId}/recurrence-exception`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": getUserRole(),
            ...getAuthHeader(),
          },
          credentials: "include",
          body: JSON.stringify({ occurrenceDate }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to restore occurrence");
      }
      // Refetch events after restore
      const data = await getAllEvents();
      setEvents(data);
      setShowRecurringDeleteModal(false);
      setModalMessage("Event restored successfully");
    } catch (err) {
     
      setModalMessage("Failed to restore event occurrence");
    } finally {
      setDeletingOccurrenceKey(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user has permission to create events
    const currentRole = getUserRole();
    if (!currentRole || (currentRole !== 'admin' && currentRole !== 'instructor')) {
     
      alert("You don't have permission to create events. Only administrators and instructors can create events.");
      return;
    }
    
    // Decode and log the JWT token to see what's in it
    const decodedToken = decodeToken();

    // Validate recurring event data
    const validationErrors = validateRecurringEvent(form);
    if (validationErrors.length > 0) {
      alert("Validation errors:\n" + validationErrors.join("\n"));
      return;
    }

    const isRecurring = form.recurrence !== "none";

    // Prepare payload for backend
    const selectedCourse = courses.find(c => c.id === form.courseId);
    const toIsoUtc = (dateString) => {
      if (!dateString) return "";
      
      try {
        // Create a date object from the input string (which is in user's local timezone)
        const localDate = new Date(dateString);
        
        // Convert to UTC directly - simpler and more reliable
        return localDate.toISOString();
      } catch (error) {
        
        return "";
      }
    };

    // Map recurrence value to frequency with proper structure
    const recurrenceMap = {
      daily: 'DAILY',
      weekly: 'WEEKLY',
      monthly: 'MONTHLY',
      yearly: 'YEARLY',
    };

    // Create proper recurrence rule structure
    let recurrenceRule = undefined;
    if (isRecurring) {
      // Calculate end date (1 year from start date)
      const startDate = new Date(form.startTime);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      recurrenceRule = {
        frequency: recurrenceMap[form.recurrence] || 'DAILY',
        interval: 1,
        endDate: endDate.toISOString()
      };
    }

    const payload = {
      title: form.title,
      description: form.description,
      startTime: toIsoUtc(form.startTime),
      endTime: toIsoUtc(form.endTime),
      location: form.location || (form.zoomLink ? form.zoomLink : ""),
      isRecurring,
      calendarType: "GROUP",
      visibility: "PRIVATE",
      course_id: selectedCourse ? selectedCourse.id : form.courseId
    };
    
    // Add recurrence rule if it's a recurring event
    if (isRecurring && recurrenceRule) {
      payload.recurrenceRule = recurrenceRule;
    }



    if (editIndex !== null) {
      // Update event in backend
      try {
        // Use different endpoint based on whether the event is recurring
        const endpoint = form.isRecurring 
          ? `${import.meta.env.VITE_API_BASE_URL}/calendar/events/recurring/${form.id}`
          : `${import.meta.env.VITE_API_BASE_URL}/calendar/events/${form.id}`;
        
        const patchRes = await fetch(endpoint, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-User-Role": currentRole, // Add role in header as well
          },
          body: JSON.stringify(payload),
          credentials: "include"
        });
        
        if (!patchRes.ok) {
          const errorText = await patchRes.text();
          let errorMessage = 'Failed to update event';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const patchData = await patchRes.json();
        
        // Refetch events after updating
        const data = await getAllEvents();
        setEvents(data);
        alert("Event updated successfully!");
      } catch (err) {
        
        alert(err.message || 'Failed to update event');
      }
      setEditIndex(null);
    } else {
      // Send to backend only on add
      try {
        const postRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/calendar/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          
            ...getAuthHeader(),
            "X-User-Role": currentRole, // If your backend still requires this header, keep it
          },
          body: JSON.stringify(payload),
          credentials: "include"
        });
        
        // Log the response status and body for debugging
        const responseText = await postRes.text();
        if (!postRes.ok) {
          let errorMessage = 'Failed to create event';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
            // Check if it's a role-related error
            if (postRes.status === 403 && errorData.message?.includes('Access restricted to admin, instructor roles')) {
              console.error("Role verification failed. Backend expects role in JWT token but token doesn't contain role information.");
              alert("Permission Error: Your account role cannot be verified by the server. Please contact support to ensure your instructor role is properly configured in the system.");
              return;
            }
          } catch (e) {
            errorMessage = responseText || errorMessage;
          }
          throw new Error(errorMessage);
        }
        
        const postData = JSON.parse(responseText);
        
        // Refetch events after adding
        const data = await getAllEvents();
        // Normalize course_id to courseId for all events
        const normalizedEvents = data.map(ev => ({
            ...ev,
            courseId: ev.courseId || ev.course_id // fallback to course_id if courseId is missing
          }));
        setEvents(normalizedEvents);
        alert("Event created successfully!");
      } catch (err) {
        alert("Failed to create event: " + err.message);
      }
    }
    
    setShowModal(false);
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleYearChange = (e) => {
    setCalendarYear(Number(e.target.value));
  };

  // Helper: get events for a specific date
  const getEventsForDate = (date) => {
    if (!date) return [];
    
    const eventsForDate = [];
    
    events.forEach(ev => {
      // Handle recurring events with occurrences
      if (ev.isRecurring && ev.occurrences && ev.occurrences.length > 0) {
        // Check each occurrence of the recurring event
        ev.occurrences.forEach(occurrence => {
          const occurrenceDate = new Date(occurrence.startTime);
          
          if (!isNaN(occurrenceDate.getTime())) {
            const isSameDate = (
              occurrenceDate.getFullYear() === date.getFullYear() &&
              occurrenceDate.getMonth() === date.getMonth() &&
              occurrenceDate.getDate() === date.getDate()
            );
            
            if (isSameDate) {
              // Check if this occurrence is not deleted
              const deletedOccurrences = ev.deletedOccurrences || [];
              const isDeleted = deletedOccurrences.some(deleted => {
                const deletedDate = typeof deleted === 'string' ? deleted : deleted.occurrence_date;
                return new Date(deletedDate).toDateString() === occurrenceDate.toDateString();
              });
              
              if (!isDeleted) {
                // Create a copy of the event with the occurrence's time
                const eventForDate = {
                  ...ev,
                  startTime: occurrence.startTime,
                  endTime: occurrence.endTime,
                  occurrenceDate: occurrenceDate
                };
                eventsForDate.push(eventForDate);
              }
            }
          }
        });
      } else {
        // Handle non-recurring events
        const eventDate = ev.date || ev.startTime || ev.createdAt;
        
        if (!eventDate) {
          
          return;
        }
        
        const evDate = new Date(eventDate);
        
        if (isNaN(evDate.getTime())) {
          console.log('Invalid date for event:', ev);
          return;
        }
        
        const isSameDate = (
          evDate.getFullYear() === date.getFullYear() &&
          evDate.getMonth() === date.getMonth() &&
          evDate.getDate() === date.getDate()
        );
        
        if (isSameDate) {
          eventsForDate.push(ev);
        }
      }
    });
    
    
    
    return eventsForDate;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Role:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            userRole === 'admin' ? 'bg-red-100 text-red-800' :
            userRole === 'instructor' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {userRole || 'Loading...'}
          </span>
          {userRole && userRole !== 'admin' && userRole !== 'instructor' && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              Read-only access
            </span>
          )}

        </div>
      </div>
      
      {/* Role Verification Warning */}
      {(() => {
        const token = decodeToken();
        if (token && !token.role && !token.userRole && (userRole === 'admin' || userRole === 'instructor')) {
          return (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Role Verification Issue
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your account shows you have <strong>{userRole}</strong> permissions, if you may experience permission errors when creating events. Please contact support to resolve this issue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={handlePrevMonth} 
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long' })} {calendarYear}
          </h3>
          <select 
            value={calendarYear} 
            onChange={handleYearChange} 
            className="px-3 py-1 border rounded-lg bg-white text-sm"
          >
            {(() => {
              const thisYear = new Date().getFullYear();
              return Array.from({ length: 10 }, (_, i) => thisYear + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ));
            })()}
          </select>
        </div>
        
        <button 
          onClick={handleNextMonth} 
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-8">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-medium text-gray-500 text-sm py-2">{d}</div>
        ))}
        {calendarDays.map((date, idx) => {
          const eventsForDate = getEventsForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={idx}
              className={`min-h-16 p-1 flex flex-col items-center border rounded-lg relative 
                ${date ? "hover:bg-blue-50 cursor-pointer" : "bg-gray-50 cursor-default"}
                ${isToday ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}
              onClick={() => date && handleDateClick(date)}
            >
              <span className={`text-sm ${isToday ? "font-bold text-blue-600" : "text-gray-700"}`}>
                {date ? date.getDate() : ""}
              </span>
              {eventsForDate.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {eventsForDate.slice(0, 5).map((event, i) => (
                    <span 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full ${
                        event.isRecurring ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                      title={event.title}
                    ></span>
                  ))}
                  {eventsForDate.length > 5 && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      title={`+${eventsForDate.length - 5} more events`}
                    ></span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Events List */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Upcoming Events</h3>
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">No events scheduled yet</p>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {paginatedEvents.map((event, i) => (
                <li key={event.id || i} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{event.title}
                        {event.isRecurring && (
                          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full align-middle">Recurring</span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      {event.courseId && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {courses.find(c => c.id === event.courseId)?.title || event.courseId}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:underline text-xs"
                          onClick={() => handleEdit(events.findIndex(e => e.id === event.id))}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline text-xs"
                          onClick={() => handleDelete(events.findIndex(e => e.id === event.id))}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500 space-x-4">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {(() => {
                        try {
                          const userTz = localStorage.getItem('userTimezone') || 'America/New_York';
                          const startDate = new Date(event.startTime);
                          return startDate.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: userTz 
                          });
                        } catch (error) {
                          console.error('Error formatting event date:', error);
                          return new Date(event.startTime).toLocaleDateString();
                        }
                      })()}
                    </span>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {(() => {
                        try {
                          const userTz = localStorage.getItem('userTimezone') || 'America/New_York';
                          return `${new Date(event.startTime).toLocaleString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true,
                            timeZone: userTz 
                          })} - ${new Date(event.endTime).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true,
                            timeZone: userTz 
                          })}`;
                        } catch (error) {
                          console.error('Error formatting event time:', error);
                          return `${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleTimeString()}`;
                        }
                      })()}
                    </span>
                    {event.recurrence && (
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {event.recurrence}
                      </span>
                    )}
                  </div>
                  {event.location && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
              >
                PREV
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
              >
                NEXT
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-5xl relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              onClick={() => {
                setShowModal(false);
                setEditIndex(null);
              }}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              {editIndex !== null ? 'Edit Event' : 'Schedule New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link* <span className="text-xs text-gray-500">(Enter the meeting URL)</span></label>
                    <input
                      type="url"
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://meet.google.com/abc-defg-hij or https://zoom.us/j/123456789"
                      required
                    />
                    {form.description && !isValidUrl(form.description) && (
                      <p className="text-xs text-red-500 mt-2">Please enter a valid URL (e.g., https://meet.google.com/...)</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time*</label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleFormChange}
                        className="w-full min-w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time*</label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleFormChange}
                        className="w-full min-w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  {/* Timezone preview for start/end time */}
                  {form.startTime && form.endTime && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-600 space-y-1.5">
                        <div className="font-medium text-gray-700 mb-1">Time Zone Preview:</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div><span className="font-medium">PST:</span> {formatInTimezone(form.startTime, 'America/Los_Angeles', 'PST')}</div>
                          <div><span className="font-medium">EST:</span> {formatInTimezone(form.startTime, 'America/New_York', 'EST')}</div>
                          <div><span className="font-medium">MST:</span> {formatInTimezone(form.startTime, 'America/Denver', 'MST')}</div>
                          <div><span className="font-medium">GMT:</span> {formatInTimezone(form.startTime, 'Europe/London', 'GMT')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone*</label>
                    <input
                      type="text"
                      name="timeZone"
                      value={form.timeZone}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-gray-100 cursor-not-allowed transition-all duration-200"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Timezone can be changed in your profile settings
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Physical location or meeting platform"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Related Course</label>
                    <select
                      name="courseId"
                      value={form.courseId}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recurrence</label>
                    <select
                      name="recurrence"
                      value={form.recurrence}
                      onChange={(e) => {
                        setForm(prev => ({
                          ...prev,
                          recurrence: e.target.value,
                          isRecurring: e.target.value !== "none"
                        }));
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                    >
                      <option value="none">Does not repeat</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditIndex(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  {editIndex !== null ? 'Update Event' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Past Date Warning Modal */}
      {showPastDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowPastDateModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-3">Cannot Schedule Event</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>You can't add an event on a past date.</p>
                <p>Please select today's date or a future date.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowPastDateModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Delete Modal */}
      {showRecurringDeleteModal && recurringDeleteEvent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
    <div className="bg-white rounded-xl shadow-2xl p-5 w-full max-w-3xl mx-4 relative">
      <button
        className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full p-1 hover:bg-gray-100"
        onClick={() => setShowRecurringDeleteModal(false)}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">Manage Recurring Event</h2>
          <p className="text-sm text-gray-600">This event repeats. Manage occurrences below:</p>
        </div>
        
        {/* Dual column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upcoming Occurrences Column */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-blue-50 px-4 py-3 border-b">
              <h3 className="text-sm font-medium text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Occurrences
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {recurringDeleteEvent.occurrences && recurringDeleteEvent.occurrences.map((occ, idx) => {
                const deletedOccurrences = recurringDeleteEvent.deletedOccurrences || [];
                const isDeleted = deletedOccurrences.includes(occ.startTime);
                // Skip if this occurrence is deleted
                if (isDeleted) return null;
                
                let dateLabel = "-";
                let timeLabel = "-";
                let endTimeLabel = "-";
                const startDateObj = new Date(occ.startTime);
                const endDateObj = new Date(occ.endTime);
                if (!isNaN(startDateObj.getTime())) {
                  dateLabel = startDateObj.toLocaleDateString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric', timeZone: userTimezone
                  });
                  timeLabel = startDateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit', minute: '2-digit', timeZone: userTimezone
                  });
                }
                if (!isNaN(endDateObj.getTime())) {
                  endTimeLabel = endDateObj.toLocaleTimeString(undefined, {
                    hour: '2-digit', minute: '2-digit', timeZone: userTimezone
                  });
                }
                return (
                  <li key={occ.startTime} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{dateLabel}</p>
                      <p className="text-xs text-gray-500">{timeLabel} - {endTimeLabel}</p>
                    </div>
                    <button
                      className={`ml-4 px-3 py-1 text-sm rounded-md transition-colors ${deletingOccurrenceKey === occ.startTime ? 'bg-gray-100 text-gray-400' : 'text-red-600 hover:bg-red-50 border border-red-100'}`}
                      disabled={deletingOccurrenceKey === occ.startTime}
                      onClick={() => handleDeleteOccurrence(recurringDeleteEvent.id, occ.startTime)}
                    >
                      {deletingOccurrenceKey === occ.startTime ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </span>
                      ) : 'Delete'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Deleted Occurrences Column */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-amber-50 px-4 py-3 border-b">
              <h3 className="text-sm font-medium text-amber-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deleted Occurrences
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {recurringDeleteEvent.deletedOccurrences && recurringDeleteEvent.deletedOccurrences.length > 0 ? (
                recurringDeleteEvent.deletedOccurrences.map((deletedObj) => {
                  // Support both string and object for backward compatibility
                  const occurrenceDate = typeof deletedObj === 'string' ? deletedObj : deletedObj.occurrence_date;
                  let dateLabel = "-";
                  let timeLabel = "-";
                  const dateObj = new Date(occurrenceDate);
                  if (!isNaN(dateObj.getTime())) {
                    dateLabel = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: userTimezone });
                    timeLabel = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: userTimezone });
                  }
                  return (
                    <li key={occurrenceDate} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{dateLabel}</p>
                        <p className="text-xs text-gray-500">{timeLabel}</p>
                      </div>
                      <button
                        className={`ml-4 px-3 py-1 text-sm rounded-md transition-colors ${deletingOccurrenceKey === occurrenceDate ? 'bg-gray-100 text-gray-400' : 'text-green-600 hover:bg-green-50 border border-green-100'}`}
                        disabled={deletingOccurrenceKey === occurrenceDate}
                        onClick={() => handleRestoreOccurrence(recurringDeleteEvent.id, occurrenceDate)}
                      >
                        {deletingOccurrenceKey === occurrenceDate ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Restoring...
                          </span>
                        ) : 'Restore'}
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-4 text-center">
                  <p className="text-sm text-gray-500">No deleted occurrences</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Delete All Button */}
        <div className="pt-3 border-t">
          <button
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${deletingAll ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            disabled={deletingAll}
            onClick={() => handleDeleteAllOccurrences(recurringDeleteEvent.id)}
          >
            {deletingAll ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting all occurrences...
              </span>
            ) : 'Delete entire series'}
          </button>
          <button
            className="w-full mt-2 py-2 px-4 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-300"
            onClick={() => setShowRecurringDeleteModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Confirm Delete Modal for non-recurring event */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => { setShowDeleteConfirmModal(false); setDeleteIndex(null); }}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-3">Confirm Delete</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>Are you sure you want to delete this event? This action cannot be undone.</p>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => { setShowDeleteConfirmModal(false); setDeleteIndex(null); }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Events Modal */}
      {showDateEvents && selectedDateForEvents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowDateEvents(false)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                Events for {selectedDateForEvents.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-600">
                  {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''} scheduled
                </p>
                <button
                  onClick={() => {
                    setShowDateEvents(false);
                    openEventModal(selectedDateForEvents);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  + Create New Event
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {selectedDateEvents.map((event, index) => (
                <div key={event.id || index} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{event.title}</h3>
                        {event.isRecurring && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Recurring</span>
                        )}
                      </div>
                      
                      {/* Course Name */}
                      {event.courseId && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {courses.find(c => c.id === event.courseId)?.title || event.courseId}
                          </span>
                        </div>
                      )}
                      
                      {/* Time */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {(() => {
                              try {
                                const userTz = localStorage.getItem('userTimezone') || 'America/New_York';
                                return `${new Date(event.startTime).toLocaleString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: true,
                                  timeZone: userTz 
                                })} - ${new Date(event.endTime).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: true,
                                  timeZone: userTz 
                                })}`;
                              } catch (error) {
                                return `${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleTimeString()}`;
                              }
                            })()}
                          </span>
                        </div>
                        
                        {/* Recurrence */}
                        {event.recurrence && (
                          <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{event.recurrence}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Description */}
                      {event.description && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-700">{event.description}</p>
                        </div>
                      )}
                      
                      {/* Location */}
                      {event.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => {
                          setShowDateEvents(false);
                          handleEdit(events.findIndex(e => e.id === event.id));
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => {
                          setShowDateEvents(false);
                          handleDelete(events.findIndex(e => e.id === event.id));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modalMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2">{modalMessage}</h3>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => setModalMessage("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEvent;
