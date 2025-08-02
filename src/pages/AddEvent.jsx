import React, { useState, useEffect } from "react";
import { useEventManagement } from '@/hooks/useEventManagement';
import { EventModal } from '@/components/events/EventModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { getUserRole } from '@/services/userService';
import { timezoneUtils, eventUtils } from '@/services/calendarService';

const DEFAULT_TIMEZONE = "America/New_York";

const AddEvent = () => {
  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showPastDateModal, setShowPastDateModal] = useState(false);
  const [showRecurringDeleteModal, setShowRecurringDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Form and editing state
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
  
  // Recurring event state
  const [recurringDeleteEvent, setRecurringDeleteEvent] = useState(null);
  const [deletingOccurrenceKey, setDeletingOccurrenceKey] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 5;
  
  // Date events
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // Custom hook for event management
  const {
    events,
    courses,
    loading,
    error,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleDeleteOccurrence,
    handleDeleteAllOccurrences,
    handleRestoreOccurrence,
    handleFetchEventDetails,
    handleFetchDeletedOccurrences,
    clearError
  } = useEventManagement();

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check permissions
    const currentRole = getUserRole();
    if (!currentRole || (currentRole !== 'admin' && currentRole !== 'instructor')) {
      alert("You don't have permission to create events. Only administrators and instructors can create events.");
      return;
    }

    const selectedCourse = courses.find(c => c.id === form.courseId);
    
    if (editIndex !== null) {
      // Update event
      const result = await handleUpdateEvent(form.id, form, selectedCourse, currentRole);
      if (result.success) {
        alert("Event updated successfully!");
        setEditIndex(null);
        setShowModal(false);
      } else {
        alert("Failed to update event: " + result.error);
      }
    } else {
      // Create event
      const result = await handleCreateEvent(form, selectedCourse, currentRole);
      if (result.success) {
        alert("Event created successfully!");
        setShowModal(false);
      } else {
        alert("Failed to create event: " + result.error);
      }
    }
  };

  const handleEdit = async (index) => {
    const event = events[index];
    const backendEvent = await handleFetchEventDetails(event.id);
    const eventData = backendEvent || event;
    
    setForm({
      id: eventData.id,
      title: eventData.title || '',
      description: eventData.description || '',
      startTime: eventData.startTime ? eventData.startTime.slice(0, 16) : '',
      endTime: eventData.endTime ? eventData.endTime.slice(0, 16) : '',
      timeZone: eventData.timeZone || DEFAULT_TIMEZONE,
      location: eventData.location || '',
      isRecurring: eventData.isRecurring || false,
      recurrence: eventData.recurrence || 'none',
      zoomLink: eventData.zoomLink || '',
      courseId: eventData.courseId || eventData.course_id || '',
    });
    
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = async (index) => {
    const event = events[index];
    
    if (event.isRecurring && event.occurrences && event.occurrences.length > 0) {
      const deletedOccurrences = await handleFetchDeletedOccurrences(event.id);
      setRecurringDeleteEvent({ ...event, index, deletedOccurrences });
      setShowRecurringDeleteModal(true);
      return;
    }
    
    setDeleteIndex(index);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;
    
    const event = events[deleteIndex];
    const result = await handleDeleteEvent(event.id);
    
    if (result.success) {
      alert("Event deleted successfully!");
    } else {
      alert("Failed to delete event: " + result.error);
    }
    
    setShowDeleteConfirmModal(false);
    setDeleteIndex(null);
  };

  // Calendar handlers
  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      setShowPastDateModal(true);
      return;
    }
    
    setSelectedDate(date);
    const eventsForDate = getEventsForDate(date);
    setSelectedDateEvents(eventsForDate);
    setShowDateEvents(true);
  };

  // Add a function to handle creating new event for the selected date
  const handleCreateEventForDate = () => {
    setForm(prev => ({
      ...prev,
      startTime: selectedDate.toISOString().slice(0, 16),
      endTime: new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
    }));
    setShowDateEvents(false);
    setShowModal(true);
  };

  // Add a function to close the date events modal
  const handleCloseDateEvents = () => {
    setShowDateEvents(false);
    setSelectedDateEvents([]);
    setSelectedDate(null);
  };

  // Utility functions
  const getEventsForDate = (date) => {
    if (!date) return [];
    
    return events.filter(ev => {
      const eventDate = ev.date || ev.startTime || ev.createdAt;
      if (!eventDate) return false;
      
      const evDate = new Date(eventDate);
      return (
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate()
      );
    });
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(calendarYear, calendarMonth, day);
      const dayEvents = getEventsForDate(date);
      
      days.push(
        <div
          key={day}
          className={`p-2 cursor-pointer hover:bg-gray-100 border ${
            selectedDate && 
            selectedDate.getDate() === day && 
            selectedDate.getMonth() === calendarMonth && 
            selectedDate.getFullYear() === calendarYear
              ? 'bg-blue-100 border-blue-300'
              : 'border-gray-200'
          } ${dayEvents.length > 0 ? 'bg-green-50' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="text-sm font-medium">{day}</div>
          {dayEvents.length > 0 && (
            <div className="text-xs text-green-600 mt-1 font-medium">
              {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const renderEventCard = (event, index) => {
    const eventStatus = eventUtils.getEventStatus(event);
    
    return (
      <Card key={event.id || index} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(index)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {timezoneUtils.formatTimeInUserTimezone(event.startTime, 'America/Los_Angeles')} - 
                {timezoneUtils.formatTimeInUserTimezone(event.endTime, 'America/Los_Angeles')}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
            )}
            {event.instructor && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{event.instructor}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className={`px-2 py-1 text-xs rounded-full ${
                eventStatus.status === 'live' 
                  ? 'bg-green-100 text-green-800'
                  : eventStatus.status === 'upcoming'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {eventStatus.text}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <Button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 text-lg font-semibold"
          size="lg"
        >
          Create Event
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <Button size="sm" variant="outline" onClick={clearError} className="ml-2">
            Dismiss
          </Button>
        </div>
      )}

      {/* Update the grid layout section to make calendar bigger and events narrower */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar - Make it bigger (3 columns) */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Calendar</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear(calendarYear - 1);
                      } else {
                        setCalendarMonth(calendarMonth - 1);
                      }
                    }}
                  >
                    ←
                  </Button>
                  <span className="text-sm">
                    {new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear(calendarYear + 1);
                      } else {
                        setCalendarMonth(calendarMonth + 1);
                      }
                    }}
                  >
                    →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium bg-gray-50 rounded">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events List - Make it narrower (1 column) */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600">No events found</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first event to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events
                    .slice((currentPage - 1) * EVENTS_PER_PAGE, currentPage * EVENTS_PER_PAGE)
                    .map((event, index) => (
                      <div key={event.id || index} className="border rounded-lg p-3 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm line-clamp-2">{event.title}</h4>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit((currentPage - 1) * EVENTS_PER_PAGE + index)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete((currentPage - 1) * EVENTS_PER_PAGE + index)}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {timezoneUtils.formatTimeInUserTimezone(event.startTime, 'America/Los_Angeles')}
                            </span>
                          </div>
                          
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          )}
                          
                          {event.instructor && (
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span className="line-clamp-1">{event.instructor}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className={`px-1 py-0.5 text-xs rounded-full ${
                              eventUtils.getEventStatus(event).status === 'live' 
                                ? 'bg-green-100 text-green-800'
                                : eventUtils.getEventStatus(event).status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {eventUtils.getEventStatus(event).text}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {/* Pagination */}
                  {events.length > EVENTS_PER_PAGE && (
                    <div className="flex justify-center mt-4 space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="text-xs px-2 py-1"
                      >
                        Prev
                      </Button>
                      <span className="px-2 py-1 text-xs">
                        {currentPage} / {Math.ceil(events.length / EVENTS_PER_PAGE)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(events.length / EVENTS_PER_PAGE), prev + 1))}
                        disabled={currentPage === Math.ceil(events.length / EVENTS_PER_PAGE)}
                        className="text-xs px-2 py-1"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditIndex(null);
          setForm({
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
        }}
        form={form}
        setForm={setForm}
        courses={courses}
        onSubmit={handleSubmit}
        isEditing={editIndex !== null}
        loading={loading}
      />

      {/* Past Date Modal */}
      <Dialog open={showPastDateModal} onOpenChange={setShowPastDateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Past Date Selected</DialogTitle>
          </DialogHeader>
          <p>You cannot create events for past dates.</p>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this event?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Date Events Modal */}
      <Dialog open={showDateEvents} onOpenChange={handleCloseDateEvents}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Events for {selectedDate?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">No events scheduled</p>
                <p className="text-sm text-muted-foreground mt-1">This date is free for scheduling</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => (
                  <div key={event.id || index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {timezoneUtils.formatTimeInUserTimezone(event.startTime, 'America/Los_Angeles')} - 
                              {timezoneUtils.formatTimeInUserTimezone(event.endTime, 'America/Los_Angeles')}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            eventUtils.getEventStatus(event).status === 'live' 
                              ? 'bg-green-100 text-green-800'
                              : eventUtils.getEventStatus(event).status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {eventUtils.getEventStatus(event).text}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const eventIndex = events.findIndex(e => e.id === event.id);
                            if (eventIndex !== -1) {
                              handleEdit(eventIndex);
                              setShowDateEvents(false);
                            }
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const eventIndex = events.findIndex(e => e.id === event.id);
                            if (eventIndex !== -1) {
                              handleDelete(eventIndex);
                              setShowDateEvents(false);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Fixed footer with buttons */}
          <div className="flex justify-between pt-4 border-t mt-4">
            <Button variant="outline" onClick={handleCloseDateEvents}>
              Close
            </Button>
            <Button onClick={handleCreateEventForDate}>
              Schedule New Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEvent;
