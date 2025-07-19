import React, { useState, useEffect } from "react";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000";

const PAGE_SIZE = 3;

const CreateCourse = ({ onCourseCreated }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    estimated_duration: "",
    price: "",
    thumbnail: ""
  });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:9000/api/getAllCourses");
        const response = await res.json();
        if (response.success) {
          setCourses(response.data);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail" && files && files[0]) {
      setForm((prev) => ({ ...prev, thumbnail: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.estimated_duration || !form.price) {
      setFormError("All fields except thumbnail are required.");
      setSuccess(false);
      return;
    }
    setFormError("");
    setSuccess(true);

    const newCourse = {
      id: `course-${courses.length + 1}`,
      title: form.title,
      description: form.description,
      category: form.category,
      estimated_duration: form.estimated_duration,
      price: form.price,
      thumbnail: form.thumbnail ? URL.createObjectURL(form.thumbnail) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isHidden: false,
      course_status: "DRAFT",
      instructor_id: "userId-1",
      courseType: "SEQUENTIAL",
      deleted_at: null,
      lockModules: "LOCKED",
      requireFinalQuiz: false,
      createdBy: null,
      updatedBy: null
    };

    setCourses([newCourse, ...courses]);
    if (onCourseCreated) {
      onCourseCreated(form);
    }
    setForm({
      title: "",
      description: "",
      category: "",
      estimated_duration: "",
      price: "",
      thumbnail: ""
    });
    setShowModal(false);
    setTimeout(() => setSuccess(false), 2000);
    setPage(0);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.description.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedCourses = filteredCourses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = (page + 1) * PAGE_SIZE < filteredCourses.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search courses..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
          onClick={() => setShowModal(true)}
        >
          Create Course
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading courses...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {paginatedCourses.map((course) => (
              <div key={course.id} className="flex flex-col border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow">
                <img
                  src={course.thumbnail ? course.thumbnail : PLACEHOLDER_IMAGE}
                  alt={course.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">{course.description}</p>
                  <div className="mt-auto space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Category: {course.category}</span>
                      <span>${course.price}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Duration: {course.estimated_duration} min
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCourses.length > PAGE_SIZE && (
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(page - 1)}
                disabled={!hasPrev}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter course description"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Web Development"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)*</label>
                  <input
                    type="number"
                    name="estimated_duration"
                    value={form.estimated_duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 120"
                    min="0"
                    required
                  />
                </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {formError && <div className="text-sm text-red-600 py-2">{formError}</div>}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourse;