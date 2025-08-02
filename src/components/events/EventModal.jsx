import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from './EventForm';

export const EventModal = ({ 
  isOpen, 
  onClose, 
  form, 
  setForm, 
  courses, 
  onSubmit, 
  isEditing = false,
  loading = false 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <EventForm
            form={form}
            setForm={setForm}
            courses={courses}
            onSubmit={onSubmit}
            onCancel={onClose}
            isEditing={isEditing}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};