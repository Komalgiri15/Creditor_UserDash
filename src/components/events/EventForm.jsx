import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventValidation } from '@/services/eventService';

export const EventForm = ({ 
  form, 
  setForm, 
  courses, 
  onSubmit, 
  onCancel, 
  isEditing = false,
  loading = false 
}) => {
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 pb-4">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={handleFormChange}
          placeholder="Enter event title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description/Meeting Link</Label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleFormChange}
          placeholder="Enter description or meeting link"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleFormChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleFormChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="courseId">Course</Label>
        <Select value={form.courseId} onValueChange={(value) => handleSelectChange('courseId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={form.location}
          onChange={handleFormChange}
          placeholder="Enter location"
        />
      </div>

      <div>
        <Label htmlFor="recurrence">Recurrence</Label>
        <Select value={form.recurrence} onValueChange={(value) => handleSelectChange('recurrence', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select recurrence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Recurrence</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fixed footer with buttons */}
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}; 