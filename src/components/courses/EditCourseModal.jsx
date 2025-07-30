import React, { useState, useRef, useEffect } from 'react';
import { updateCourse } from '../../services/courseService';

const EditCourseModal = ({ isOpen, onClose, courseData, onCourseUpdated }) => {
  const [editCourseData, setEditCourseData] = useState(courseData || {});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const editFormRef = useRef(null);

  // Update form data when courseData changes
  useEffect(() => {
    if (courseData) {
      setEditCourseData(courseData);
    }
  }, [courseData]);

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditCourseData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const payload = { ...editCourseData };
      delete payload.id;
      // Remove any fields not needed by backend
      ["created_at", "updated_at", "createdBy", "updatedBy", "deleted_at"].forEach(f => delete payload[f]);
      // Ensure thumbnail is included as a string
      if (editCourseData.thumbnail) {
        payload.thumbnail = editCourseData.thumbnail;
      }
      
      await updateCourse(editCourseData.id, payload);
      onCourseUpdated(editCourseData);
      onClose();
    } catch (err) {
      setEditError(err.message || "Failed to update course");
    } finally {
      setEditLoading(false);
    }
  };

  if (!isOpen || !courseData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Course</h2>
        <form onSubmit={handleEditSubmit} ref={editFormRef} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title*</label>
            <input
              type="text"
              name="title"
              value={editCourseData.title || ''}
              onChange={handleEditInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={editCourseData.description || ''}
              onChange={handleEditInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
              <input
                type="text"
                name="estimated_duration"
                value={editCourseData.estimated_duration || ''}
                onChange={handleEditInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <input
                type="number"
                name="price"
                value={editCourseData.price || ''}
                onChange={handleEditInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                value={editCourseData.max_students || ''}
                onChange={handleEditInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Status</label>
              <select
                name="course_status"
                value={editCourseData.course_status || 'DRAFT'}
                onChange={handleEditInputChange}
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
                checked={editCourseData.isHidden || false}
                onChange={handleEditInputChange}
              />
              <span className="text-sm">Hidden</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="requireFinalQuiz"
                checked={editCourseData.requireFinalQuiz || false}
                onChange={handleEditInputChange}
              />
              <span className="text-sm">Require Final Quiz</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
            <input
              type="url"
              name="thumbnail"
              value={editCourseData.thumbnail || ''}
              onChange={handleEditInputChange}
              placeholder="https://example.com/image.jpg"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {editCourseData.thumbnail && (
              <img src={editCourseData.thumbnail} alt="Preview" className="mt-2 h-24 rounded shadow" onError={(e) => e.target.style.display = 'none'} />
            )}
          </div>
          {editError && <div className="text-sm text-red-600 py-2">{editError}</div>}
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
              disabled={editLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editLoading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal; 