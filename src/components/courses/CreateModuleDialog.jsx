import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createModule } from "@/services/courseService";

export function CreateModuleDialog({ 
  isOpen, 
  onClose, 
  courseId, 
  onModuleCreated,
  existingModules = [],
  initialData = null,
  mode = "create",
  onSave
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    order: 1,
    estimated_duration: 60,
    module_status: "DRAFT",
    thumbnail: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData && mode === "edit") {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        order: initialData.order || 1,
        estimated_duration: initialData.estimated_duration || 60,
        module_status: initialData.module_status || "DRAFT",
        thumbnail: initialData.thumbnail || ""
      });
    } else if (mode === "create") {
      setForm({
        title: "",
        description: "",
        order: existingModules.length + 1,
        estimated_duration: 60,
        module_status: "DRAFT",
        thumbnail: ""
      });
    }
  }, [initialData, mode, existingModules.length, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!form.title.trim()) {
        setError("Module title is required");
        setLoading(false);
        return;
      }
      const moduleData = {
        title: form.title.trim(),
        description: form.description.trim() || "test description",
        order: parseInt(form.order) || (existingModules.length + 1),
        estimated_duration: parseInt(form.estimated_duration) || 60,
        module_status: form.module_status || "DRAFT",
        thumbnail: form.thumbnail.trim() || "test thumbnail"
      };
      await onSave(moduleData);
      setForm({
        title: "",
        description: "",
        order: existingModules.length + 2,
        estimated_duration: 60,
        module_status: "DRAFT",
        thumbnail: ""
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save module");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      title: "",
      description: "",
      order: existingModules.length + 1,
      estimated_duration: 60,
      module_status: "DRAFT",
      thumbnail: ""
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{mode === "edit" ? "Edit Module" : "Create New Module"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Module Title*</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleInputChange}
              placeholder="Enter module title"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              placeholder="Enter module description"
              rows={3}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={form.order}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="estimated_duration">Duration (minutes)</Label>
              <Input
                id="estimated_duration"
                name="estimated_duration"
                type="number"
                value={form.estimated_duration}
                onChange={handleInputChange}
                placeholder="60"
                min="1"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="module_status">Module Status</Label>
            <Select
              value={form.module_status}
              onValueChange={(value) => handleSelectChange("module_status", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              type="text"
              value={form.thumbnail}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 py-2 bg-red-50 rounded-md px-3">
              {error}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (mode === "edit" ? "Saving..." : "Creating...") : (mode === "edit" ? "Save Changes" : "Create Module")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 