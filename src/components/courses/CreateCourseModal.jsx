import React, { useState } from 'react';
import { createCourse } from '../../services/courseService';

const CreateCourseModal = ({ isOpen, onClose, onCourseCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    learning_objectives: "",
    isHidden: false,
    course_status: "DRAFT",
    estimated_duration: "",
    max_students: 0,
    price: "",
    requireFinalQuiz: true,
    thumbnail: ""
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "thumbnail" && type === "url") {
      setForm((prev) => ({ ...prev, thumbnail: value }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.estimated_duration || !form.price) {
      setFormError("Title, duration, and price are required.");
      return;
    }
    setFormError("");
    setLoading(true);

    try {
      const learningObjectivesArray = form.learning_objectives
        ? form.learning_objectives.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];
      
      const payload = {
        title: form.title,
        description: form.description,
        learning_objectives: learningObjectivesArray,
        isHidden: form.isHidden,
        course_status: form.course_status,
        estimated_duration: form.estimated_duration,
        max_students: form.max_students ? Number(form.max_students) : 0,
        course_level: "BEGINNER",
        courseType: "OPEN",
        lockModules: "UNLOCKED",
        price: form.price,
        requireFinalQuiz: form.requireFinalQuiz,
        thumbnail: form.thumbnail || null
      };

      const response = await createCourse(payload);
      
      if (response.success) {
        onCourseCreated(response.data);
        onClose();
        setForm({
          title: "",
          description: "",
          learning_objectives: "",
          isHidden: false,
          course_status: "DRAFT",
          estimated_duration: "",
          max_students: 0,
          price: "",
          requireFinalQuiz: true,
          thumbnail: ""
        });
      } else {
        setFormError(response.message || "Failed to create course.");
      }
    } catch (err) {
      setFormError(err.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
           style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title*</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Objectives (one per line)</label>
            <textarea
              name="learning_objectives"
              value={form.learning_objectives}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Master neural network basics\nImplement deep learning models"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
              <input
                type="text"
                name="estimated_duration"
                value={form.estimated_duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 30 mins"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 0 or 199.99"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
              <input
                type="number"
                name="max_students"
                value={form.max_students}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 80"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Status</label>
              <select
                name="course_status"
                value={form.course_status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isHidden"
                checked={form.isHidden}
                onChange={handleInputChange}
              />
              <span className="text-sm">Hidden</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="requireFinalQuiz"
                checked={form.requireFinalQuiz}
                onChange={handleInputChange}
              />
              <span className="text-sm">Require Final Quiz</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
            <input
              type="url"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {form.thumbnail && (
              <img src={form.thumbnail} alt="Preview" className="mt-2 h-24 rounded shadow" onError={(e) => e.target.style.display = 'none'} />
            )}
          </div>
          {formError && <div className="text-sm text-red-600 py-2">{formError}</div>}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal; 