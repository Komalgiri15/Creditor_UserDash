import { useState, useEffect } from 'react';
import { 
  fetchAllCourses, 
  fetchCourseModules, 
  createModule, 
  updateModule, 
  deleteModule, 
  deleteCourse 
} from '../services/courseService';

export const useCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [courseModules, setCourseModules] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 4;

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCourses();
      setCourses(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  // Handle view modules
  const handleViewModules = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }

    setExpandedCourseId(courseId);
    
    // Fetch modules if not already loaded
    if (!courseModules[courseId]) {
      try {
        const modules = await fetchCourseModules(courseId);
        setCourseModules(prev => ({
          ...prev,
          [courseId]: modules
        }));
      } catch (err) {
        console.error('Error fetching modules:', err);
        setCourseModules(prev => ({
          ...prev,
          [courseId]: []
        }));
      }
    }
  };

  // Handle module creation
  const handleCreateModule = async (courseId, moduleData) => {
    try {
      await createModule(courseId, moduleData);
      // Refresh modules for the course
      const updatedModules = await fetchCourseModules(courseId);
      setCourseModules(prev => ({
        ...prev,
        [courseId]: updatedModules
      }));
    } catch (err) {
      console.error('Error creating module:', err);
      throw err;
    }
  };

  // Handle module update
  const handleUpdateModule = async (courseId, moduleId, moduleData) => {
    try {
      await updateModule(courseId, moduleId, moduleData);
      // Refresh modules for the course
      const updatedModules = await fetchCourseModules(courseId);
      setCourseModules(prev => ({
        ...prev,
        [courseId]: updatedModules
      }));
    } catch (err) {
      console.error('Error updating module:', err);
      throw err;
    }
  };

  // Handle module deletion
  const handleDeleteModule = async (courseId, module) => {
    try {
      const moduleData = {
        title: module.title,
        description: module.description || "test description",
        order: module.order || 1,
        estimated_duration: module.estimated_duration || 60,
        module_status: module.module_status || "DRAFT",
        thumbnail: module.thumbnail || "test thumbnail"
      };
      
      await deleteModule(courseId, module.id, moduleData);
      
      // Refresh modules for the course
      const updatedModules = await fetchCourseModules(courseId);
      setCourseModules(prev => ({
        ...prev,
        [courseId]: updatedModules
      }));
    } catch (err) {
      console.error('Error deleting module:', err);
      throw err;
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      throw err;
    }
  };

  // Handle course update
  const handleCourseUpdated = (updatedCourse) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? { ...c, ...updatedCourse } : c));
  };

  // Handle course creation
  const handleCourseCreated = (newCourse) => {
    setCourses(prev => [newCourse, ...prev]);
    setPage(0);
  };

  // Filter and paginate courses
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    (course.description || "").toLowerCase().includes(search.toLowerCase())
  );
  
  const paginatedCourses = filteredCourses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = (page + 1) * PAGE_SIZE < filteredCourses.length;

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    // State
    courses: paginatedCourses,
    allCourses: courses,
    loading,
    error,
    expandedCourseId,
    courseModules,
    search,
    page,
    hasPrev,
    hasNext,
    totalPages: Math.ceil(filteredCourses.length / PAGE_SIZE),
    
    // Actions
    setSearch,
    setPage,
    handleViewModules,
    handleCreateModule,
    handleUpdateModule,
    handleDeleteModule,
    handleDeleteCourse,
    handleCourseUpdated,
    handleCourseCreated,
    fetchCourses
  };
}; 