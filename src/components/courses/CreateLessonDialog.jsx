import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export function CreateLessonDialog({ 
  isOpen, 
  onClose, 
  moduleId, 
  onLessonCreated,
  existingLessons = [],
  initialData = null,
  mode = "create",
  courseId
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    lessonNumber: "1",
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-calculate lesson number when dialog opens
  useEffect(() => {
    if (isOpen && mode === "create") {
      const lessonNumbers = existingLessons
        .map(lesson => parseInt(lesson.lessonNumber) || 0)
        .filter(num => !isNaN(num));
      
      const nextLessonNumber = lessonNumbers.length > 0 
        ? Math.max(...lessonNumbers) + 1 
        : 1;

      setForm({
        lessonNumber: nextLessonNumber.toString(),
        title: "",
        description: ""
      });
    } else if (isOpen && mode === "edit" && initialData) {
      setForm({
        lessonNumber: initialData.lessonNumber?.toString() || "1",
        title: initialData.title || "",
        description: initialData.description || ""
      });
    }
  }, [isOpen, mode, existingLessons, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!form.lessonNumber.trim() || isNaN(form.lessonNumber)) {
      setError("Lesson number must be a valid number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const lessonData = {
        lessonNumber: parseInt(form.lessonNumber),
        title: form.title.trim(),
        description: form.description.trim(),
        moduleId: moduleId,
        status: "DRAFT",
        createdAt: new Date().toISOString()
      };

      // Here you would typically call your API to create the lesson
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onLessonCreated(lessonData);
      
      toast({
        title: mode === "create" ? "Lesson created" : "Lesson updated",
        description: `"${form.title}" has been ${mode === "create" ? "created" : "updated"} successfully.`,
      });

      // Reset form and close dialog
      setForm({
        lessonNumber: "1",
        title: "",
        description: ""
      });
      onClose();
      
      // Navigate to lesson builder
      if (courseId && moduleId) {
        navigate(`/lesson-builder/${courseId}/${moduleId}/${lessonData.lessonNumber}`);
      }
    } catch (err) {
      setError(err.message || "Failed to save lesson");
      toast({
        title: "Error",
        description: err.message || "Failed to save lesson",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      lessonNumber: "1",
      title: "",
      description: ""
    });
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter details for your new lesson. You can change these later in the lesson settings.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lessonNumber">Lesson Number</Label>
            <Input
              id="lessonNumber"
              name="lessonNumber"
              type="number"
              min="1"
              value={form.lessonNumber}
              onChange={handleInputChange}
              placeholder="Lesson number"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Lesson title"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Brief description of the lesson"
              rows={3}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </form>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !form.title.trim()}
          >
            {loading ? "Creating..." : "Create Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
