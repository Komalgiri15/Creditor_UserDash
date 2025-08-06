import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAllCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  addCoursesToCatalog,
  removeCoursesFromCatalog,
  fetchAvailableCourses,
  getCatalogCourses
} from "@/services/instructorCatalogService";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";


const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000";

const AddCatelog = () => {
  const { userRole, isInstructorOrAdmin } = useAuth();
  const [catalogs, setCatalogs] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    thumbnail: "",
    courses: []
  });
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdateRequest, setLastUpdateRequest] = useState(null);
  const [lastUpdateResponse, setLastUpdateResponse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const catalogsPerPage = 4;
  const [courseCounts, setCourseCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  
  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [catalogToDelete, setCatalogToDelete] = useState(null);

  // Test function to debug course association
  const testCourseAssociation = async (catalogId, courseIds) => {
    try {
      const result = await addCoursesToCatalog(catalogId, courseIds);
      
      // Verify the courses were added
      const courses = await getCatalogCourses(catalogId);
      
      return { success: true, courses };
    } catch (error) {
      console.error('Test failed:', error);
      return { success: false, error };
    }
  };

  // Test function to debug catalog ID extraction
  const testCatalogIdExtraction = (response) => {
    let catalogId = response.data?.data?.id || 
                   response.data?.data?._id ||
                   response.data?.id || 
                   response.data?._id || 
                   response.id || 
                   response._id ||
                   response.catalogId ||
                   response.catalog_id;
    
    return catalogId;
  };

  // Comprehensive refresh function that updates both catalogs and course counts
  const refreshCatalogsAndCounts = async () => {
    try {
      setRefreshing(true);
      
      // Fetch catalogs and available courses
      const [catalogsData, coursesData] = await Promise.all([
        fetchAllCatalogs(),
        fetchAvailableCourses()
      ]);
      
      // Ensure catalogs is always an array
      const catalogsArray = Array.isArray(catalogsData) ? catalogsData : [];
      
      setCatalogs(catalogsArray);
      setAvailableCourses(Array.isArray(coursesData) ? coursesData : []);
      
      // Fetch course counts for each catalog (only published courses)
      const counts = {};
      await Promise.all(
        (catalogsArray || []).map(async (catalog) => {
          try {
            const courses = await getCatalogCourses(catalog.id);
            counts[catalog.id] = courses.length;
          } catch (error) {
            console.error(`Failed to fetch courses for catalog ${catalog.id}:`, error);
            counts[catalog.id] = 0;
          }
        })
      );
      setCourseCounts(counts);
      
      // Show a brief success message for manual refresh
      if (!loading) {
        setFormSuccess("Data refreshed successfully!");
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setFormSuccess("");
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Failed to refresh catalogs and counts:', err);
      setError("Failed to refresh data. Please try again later.\n" + (err.message || ''));
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch catalogs and course counts on component mount
  useEffect(() => {
    const fetchDataAndCounts = async () => {
      try {
        setLoading(true);
        await refreshCatalogsAndCounts();
      } catch (err) {
        setError("Failed to load catalogs and courses. Please try again later.\n" + (err.message || ''));
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndCounts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === "courses") {
      const courseId = value;
      setForm(prev => {
        const newCourses = checked
          ? [...prev.courses, courseId]
          : prev.courses.filter(id => id !== courseId);
        return {
          ...prev,
          courses: newCourses
        };
      });
    } else {
      setForm(prev => {
        const newForm = { ...prev, [name]: value };
        return newForm;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      setFormError("Name and description are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      
      const catalogData = {
        name: form.name,
        description: form.description
      };
      if (form.thumbnail && form.thumbnail.trim() !== '') {
        catalogData.thumbnail = form.thumbnail;
      }
      setLastUpdateRequest({ editId, catalogData });
      let newCatalog;
      if (editId) {
        // Update existing catalog - send only essential fields
        const essentialCatalogData = {
          name: catalogData.name,
          description: catalogData.description,
          ...(catalogData.thumbnail && { thumbnail: catalogData.thumbnail })
        };
        newCatalog = await updateCatalog(editId, essentialCatalogData);
        
        // Check if there's a warning about local storage
        if (newCatalog.warning) {
          setFormSuccess(`${newCatalog.message} (${newCatalog.warning})`);
        } else {
          setFormSuccess("Catalog updated successfully!");
        }
      } else {
                  // Create new catalog
        try {
          newCatalog = await createCatalog(catalogData);
          
          // Check if there's a warning about local storage
          if (newCatalog.warning) {
            setFormSuccess(`${newCatalog.message} (${newCatalog.warning})`);
          } else {
            const courseMessage = form.courses.length > 0 ? ` with ${form.courses.length} course(s)` : '';
            setFormSuccess(`Catalog created successfully${courseMessage}!`);
          }
        } catch (createError) {
          
          // Provide more specific error messages
          if (createError.message.includes('500')) {
            setFormError("Server error occurred. Your changes have been saved locally. Please try again later or contact support if the issue persists.");
          } else if (createError.message.includes('403')) {
            setFormError("Permission denied. Your changes have been saved locally.");
          } else if (createError.message.includes('network')) {
            setFormError("Network error. Please check your internet connection and try again.");
          } else {
            setFormError(`Creation failed: ${createError.message}`);
          }
          return; // Exit early to prevent further processing
        }
      }
      setLastUpdateResponse(newCatalog);

      // Test catalog ID extraction
      const extractedCatalogId = testCatalogIdExtraction(newCatalog);

      // Handle course associations for both create and update
      
      // Try multiple possible locations for the catalog ID
      let catalogId = newCatalog.data?.data?.id || 
                     newCatalog.data?.data?._id ||
                     newCatalog.data?.id || 
                     newCatalog.data?._id || 
                     newCatalog.id || 
                     newCatalog._id ||
                     newCatalog.catalogId ||
                     newCatalog.catalog_id;
      
      // If we don't have a catalog ID, try to find it in the response
      if (!catalogId && newCatalog && typeof newCatalog === 'object') {
        const allKeys = Object.keys(newCatalog);
        
        // Deep search through nested objects
        const searchForId = (obj, path = '') => {
          if (!obj || typeof obj !== 'object') return;
          
          for (const key of Object.keys(obj)) {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            
            if (value && typeof value === 'object') {
              if (value.id || value._id) {
                const foundId = value.id || value._id;
                if (!catalogId) {
                  catalogId = foundId;
                }
              } else {
                // Recursively search nested objects
                searchForId(value, currentPath);
              }
            }
          }
        };
        
        searchForId(newCatalog);
      }
      
      // Store the selected courses for later use if we need fallback
      const selectedCourses = [...form.courses];
      
      // Handle course associations for updates (existing catalogs)
      if (catalogId && editId) {
        try {
          // For updates, we need to get the current courses and sync them
          let currentCourses = [];
          try {
            const currentCoursesData = await getCatalogCourses(editId);
            currentCourses = Array.isArray(currentCoursesData) ? currentCoursesData : [];
          } catch (error) {
            // Could not fetch current courses, proceeding with form data
          }
          
          const currentCourseIds = currentCourses.map(course => course.id || course._id || course);
          const newCourseIds = form.courses;
          
          // Find courses to add (in new but not in current)
          const coursesToAdd = newCourseIds.filter(id => !currentCourseIds.includes(id));
          // Find courses to remove (in current but not in new)
          const coursesToRemove = currentCourseIds.filter(id => !newCourseIds.includes(id));
          
          // Add new courses
          if (coursesToAdd.length > 0) {
            await addCoursesToCatalog(catalogId, coursesToAdd);
          }
          
          // Remove courses
          if (coursesToRemove.length > 0) {
            await removeCoursesFromCatalog(catalogId, coursesToRemove);
          }
        } catch (courseError) {
          console.error('Course association failed for update:', courseError);
        }
      }

      // Reset form and close modal
      setForm({ name: "", description: "", thumbnail: "", courses: [] });
      setShowModal(false);
      setEditId(null);
      
      // Always try to add courses, even if we don't have a catalog ID initially
      if (selectedCourses.length > 0) {
        
                 if (catalogId) {
           // We have a catalog ID, add courses directly
           try {
             // Add a small delay to ensure the catalog is fully created
             await new Promise(resolve => setTimeout(resolve, 500));
             
             const addResult = await addCoursesToCatalog(catalogId, selectedCourses);
             
             if (addResult.success) {
               
               // Verify the courses were actually added
               try {
                 await new Promise(resolve => setTimeout(resolve, 300));
                 const verifyCourses = await getCatalogCourses(catalogId);
                 
                 if (verifyCourses && verifyCourses.length > 0) {
                   setFormSuccess(prev => prev + ` (${verifyCourses.length} courses added successfully)`);
                 } else {
                   console.warn('Courses not found in catalog after addition');
                   setFormSuccess(prev => prev + ' (Warning: Courses may not have been added)');
                 }
               } catch (verifyError) {
                 console.warn('Could not verify course addition:', verifyError);
                 setFormSuccess(prev => prev + ' (Courses added, but verification failed)');
               }
             } else {
               console.warn('Course addition may have failed:', addResult);
               setFormSuccess(prev => prev + ' (Note: Course association may have failed)');
             }
           } catch (error) {
             console.error('Course addition failed:', error);
             setFormSuccess(prev => prev + ' (Note: Course association failed)');
           }
                  } else {
           // No catalog ID, try to find it in the updated list
           // Add delay to ensure catalog is fully created in backend
           await new Promise(resolve => setTimeout(resolve, 2000));
           await refreshCatalogsAndCounts();
          
          if (catalogs && catalogs.length > 0) {
            // Find the catalog by name more precisely
            const matchingCatalog = catalogs.find(cat => 
              cat.name === form.name || 
              cat.name === catalogData.name ||
              cat.name === newCatalog.data?.data?.name ||
              cat.name === newCatalog.data?.name
            );
            
                         if (matchingCatalog) {
               const fallbackCatalogId = matchingCatalog.id || matchingCatalog._id;
              
              if (fallbackCatalogId) {
                try {
                  const addResult = await addCoursesToCatalog(fallbackCatalogId, selectedCourses);
                  
                                   if (addResult.success) {
                   // Verify the courses were actually added
                   try {
                     await new Promise(resolve => setTimeout(resolve, 500));
                     const verifyCourses = await getCatalogCourses(fallbackCatalogId);
                     
                     if (verifyCourses && verifyCourses.length > 0) {
                       setFormSuccess(prev => prev + ` (${verifyCourses.length} courses added via fallback)`);
                     } else {
                       setFormSuccess(prev => prev + ' (Courses added via fallback, but verification failed)');
                     }
                   } catch (verifyError) {
                     console.warn('Could not verify fallback course addition:', verifyError);
                     setFormSuccess(prev => prev + ' (Courses added via fallback)');
                   }
                 } else {
                   setFormSuccess(prev => prev + ' (Fallback course addition failed)');
                 }
                } catch (fallbackError) {
                  console.error('Fallback course addition failed:', fallbackError);
                  setFormSuccess(prev => prev + ' (Fallback course addition failed)');
                }
              }
            }
          }
        }
      }
      
      // Final refresh to update the UI
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refreshCatalogsAndCounts();
    } catch (err) {
      setFormError((err && err.message ? err.message : "Failed to save catalog. Please try again.") + (err && err.stack ? "\n" + err.stack : ""));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (catalog) => {
    try {
      // Fetch the current courses associated with this catalog
      let catalogCourses = [];
      try {
        const coursesData = await getCatalogCourses(catalog.id);
        catalogCourses = Array.isArray(coursesData) ? coursesData : [];
      } catch (error) {
        // Fallback to courses from catalog object if API fails
        catalogCourses = catalog.courses || [];
      }

      // Extract course IDs from the courses array - handle both object and string cases
      const courseIds = catalogCourses.map(course => {
        if (typeof course === 'string') {
          return course;
        }
        if (typeof course === 'object' && course) {
          return course.id || course._id || course.courseId || course.course_id;
        }
        return course;
      }).filter(Boolean); // Remove any undefined/null values
      
      // More flexible matching - try to match by title if ID doesn't match
      const validCourseIds = courseIds.map(catalogCourseId => {
        // First try exact ID match
        const exactMatch = availableCourses.find(availableCourse => 
          availableCourse.id === catalogCourseId || 
          availableCourse._id === catalogCourseId || 
          availableCourse.courseId === catalogCourseId
        );
        
        if (exactMatch) {
          return exactMatch.id; // Return the standard ID format
        }
        
        // If no exact match, try to find by title (for cases where IDs might be different)
        const catalogCourse = catalogCourses.find(c => {
          const cId = typeof c === 'string' ? c : (c.id || c._id || c.courseId);
          return cId === catalogCourseId;
        });
        
        if (catalogCourse && typeof catalogCourse === 'object' && catalogCourse.title) {
          const titleMatch = availableCourses.find(availableCourse => 
            availableCourse.title === catalogCourse.title ||
            availableCourse.name === catalogCourse.title ||
            availableCourse.courseName === catalogCourse.title
          );
          
          if (titleMatch) {
            return titleMatch.id;
          }
        }
        
        return null; // No match found
      }).filter(Boolean); // Remove null values
      
      // Always sync form state with latest catalog data
      setForm({
        name: catalog.name || "",
        description: catalog.description || "",
        thumbnail: catalog.thumbnail || "",
        courses: validCourseIds
      });
      setEditId(catalog.id);
      setShowModal(true);
    } catch (error) {
      setFormError('Failed to load catalog details. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    // Find the catalog object to get its name
    const catalog = catalogs.find(cat => cat.id === id);
    setCatalogToDelete(catalog);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!catalogToDelete) return;
    try {
      const result = await deleteCatalog(catalogToDelete.id);
      
      // Show appropriate message
      if (result.warning) {
        setFormSuccess(`${result.message} (${result.warning})`);
      } else {
        setFormSuccess(result.message || "Catalog deleted successfully!");
      }
      
      // Refresh catalogs and course counts after successful deletion
      await refreshCatalogsAndCounts();
      setShowDeleteConfirm(false);
      setCatalogToDelete(null);
    } catch (err) {
      setFormError(err.message || "Failed to delete catalog. Please try again.");
      setShowDeleteConfirm(false);
      setCatalogToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCatalogToDelete(null);
  };


  // Fallback to ensure catalogs is always an array
  const safeCatalogs = Array.isArray(catalogs) ? catalogs : [];
  const totalPages = Math.ceil(safeCatalogs.length / catalogsPerPage);
  const paginatedCatalogs = safeCatalogs.slice((currentPage - 1) * catalogsPerPage, currentPage * catalogsPerPage);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading catalogs...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show refreshing overlay when refreshing data
  if (refreshing && !loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative">
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Refreshing data...</span>
          </div>
        </div>
        {/* Render the normal content behind the overlay */}
        <div className="opacity-50">
          {/* Permission Notice */}
          {!isInstructorOrAdmin() && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Limited Permissions</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You are logged in with role: <strong>{userRole || 'user'}</strong>. Catalog changes will be saved locally only. 
                    Contact an administrator to get instructor or admin permissions for full functionality.
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    <strong>Note:</strong> When you try to delete or update catalogs, they will be removed/updated from your local storage instead of the server.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Course Catalogs</h2>
            <div className="flex gap-3">
              <button
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={refreshCatalogsAndCounts}
                disabled={refreshing}
                title="Refresh catalogs and course counts"
              >
                {refreshing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Refreshing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </div>
                )}
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => { 
                  setShowModal(true); 
                  setEditId(null); 
                  setForm({ name: "", description: "", thumbnail: "", courses: [] }); 
                  setFormError("");
                  setFormSuccess("");
                }}
              >
                Add New Catalog
              </button>
            </div>
          </div>

          {formSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-green-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-green-800">{formSuccess}</p>
                  {formSuccess.includes('locally') && (
                    <p className="text-green-700 text-sm mt-1">
                      Your changes have been saved to your browser's local storage. 
                      They will persist until you clear your browser data.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {safeCatalogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No catalogs found</h3>
                <p className="mt-2 text-gray-500">Create your first catalog to organize your courses.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedCatalogs.map((catalog, index) => (
                  <div key={`${catalog.id}-${index}`} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <div className="flex">
                      <div className="w-1/3">
                        <img
                          src={catalog.thumbnail || PLACEHOLDER_IMAGE}
                          alt={catalog.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>
                      <div className="w-2/3 p-5 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{catalog.name}</h3>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(catalog)}
                              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                              aria-label="Edit"
                              title="Edit catalog"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(catalog.id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                              aria-label="Delete"
                              title="Delete catalog"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{catalog.description}</p>
                        
                        {/* Catalog metadata */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {courseCounts[catalog.id] || 0} published courses
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  className="px-4 py-2 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  className="px-4 py-2 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Permission Notice */}
      {!isInstructorOrAdmin() && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Limited Permissions</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You are logged in with role: <strong>{userRole || 'user'}</strong>. Catalog changes will be saved locally only. 
                Contact an administrator to get instructor or admin permissions for full functionality.
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                <strong>Note:</strong> When you try to delete or update catalogs, they will be removed/updated from your local storage instead of the server.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Course Catalogs</h2>
        <div className="flex gap-3">
          <button
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={refreshCatalogsAndCounts}
            disabled={refreshing}
            title="Refresh catalogs and course counts"
          >
            {refreshing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                Refreshing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </div>
            )}
          </button>
          {/* {process.env.NODE_ENV === 'development' && (
            // <button
            //   className="px-3 py-2.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-xs"
            //   onClick={() => {
            //     console.log('🔍 Debug Info:');
            //     console.log('Available courses:', availableCourses);
            //     console.log('Current catalogs:', catalogs);
            //     console.log('Course counts:', courseCounts);
            //     console.log('Form state:', form);
            //   }}
            //   title="Debug Info (Development Only)"
            // >
            //   Debug
            // </button>
          )} */}
          <button
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => { 
              setShowModal(true); 
              setEditId(null); 
              setForm({ name: "", description: "", thumbnail: "", courses: [] }); 
              setFormError("");
              setFormSuccess("");
            }}
          >
            Add New Catalog
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-green-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-green-800">{formSuccess}</p>
              {formSuccess.includes('locally') && (
                <p className="text-green-700 text-sm mt-1">
                  Your changes have been saved to your browser's local storage. 
                  They will persist until you clear your browser data.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      

      {safeCatalogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No catalogs found</h3>
            <p className="mt-2 text-gray-500">Create your first catalog to organize your courses.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedCatalogs.map((catalog, index) => (
              <div key={`${catalog.id}-${index}`} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                <div className="flex">
                  <div className="w-1/3">
                    <img
                      src={catalog.thumbnail || PLACEHOLDER_IMAGE}
                      alt={catalog.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <div className="w-2/3 p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{catalog.name}</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(catalog)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                          aria-label="Edit"
                          title="Edit catalog"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(catalog.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                          aria-label="Delete"
                          title="Delete catalog"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{catalog.description}</p>
                    
                    {/* Catalog metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {courseCounts[catalog.id] || 0} published courses
                      </span>
                    </div>
                    

                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              className="px-4 py-2 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              className="px-4 py-2 rounded border bg-gray-100 text-gray-700 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl sm:max-w-2xl w-full relative mx-4">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => { setShowModal(false); setEditId(null); }}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{editId ? "Edit Catalog" : "Create New Catalog"}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catalog Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Programming Fundamentals"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image URL</label>
                    <input
                      type="url"
                      name="thumbnail"
                      value={form.thumbnail}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {form.thumbnail && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-2">Preview:</p>
                        <img
                          src={form.thumbnail}
                          alt="Thumbnail preview"
                          className="w-20 h-20 object-cover rounded border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500" style={{display: 'none'}}>
                          Invalid URL
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Paste the URL of an image to use as the catalog thumbnail</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this catalog contains..."
                    rows={3}
                    required
                  />
                </div>
                
                <div>

                  
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Courses {editId && <span className="text-xs text-gray-500">(✓ = already in catalog)</span>}
                  </label>
                  {availableCourses.length === 0 ? (
                    <p className="text-gray-500 text-sm">No courses available. Please create some courses first.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                            {availableCourses.map(course => {
                        // Check if this course is selected using multiple ID formats
                        const isSelected = form.courses.some(selectedId => 
                          selectedId === course.id || 
                          selectedId === course._id || 
                          selectedId === course.courseId ||
                          selectedId === course.course_id
                        );
                        
                        return (
                          <label 
                            key={course.id} 
                            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="courses"
                              value={course.id}
                              checked={isSelected}
                              onChange={handleFormChange}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-700 truncate">
                                {course.title || course.name || course.courseName || 'Untitled Course'}
                              </div>
                              {course.description && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {course.description}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="text-blue-600 text-xs font-medium">
                                ✓ Added
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {form.courses.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {form.courses.length} course{form.courses.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>
                
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-red-800 text-sm">{formError}</p>
                        {!isInstructorOrAdmin() && formError.includes('403') && (
                          <p className="text-red-700 text-xs mt-1">
                            This error occurs because you don't have admin/instructor permissions. 
                            Your changes are being saved locally instead.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditId(null); }}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {editId ? "Saving..." : form.courses.length > 0 ? "Creating & Adding Courses..." : "Creating..."}
                      </div>
                    ) : (
                      editId ? "Save Changes" : form.courses.length > 0 ? `Create Catalog (${form.courses.length} courses)` : "Create Catalog"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Catalog"
          message={`Are you sure you want to delete the catalog "${catalogToDelete?.name || 'Unknown Catalog'}"? This action cannot be undone and will remove all associated course relationships.`}
          confirmText="Delete Catalog"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default AddCatelog;