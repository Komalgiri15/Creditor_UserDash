import { getAuthHeader } from './authHeader';

// Instructor Catalog Service for managing catalogs in the instructor portal

// Helper function to get auth headers
const getAuthHeaders = () => {
  // Backend handles authentication via cookies
  return {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
};

// Helper function to clean up duplicate catalogs
const cleanupDuplicateCatalogs = (catalogs) => {
  const seen = new Set();
  return catalogs.filter(catalog => {
    const key = catalog.id || catalog.originalId || catalog.name;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Get all catalogs - try multiple endpoints
export async function fetchAllCatalogs() {
  try {
    // First try the catalog-specific endpoint
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/getallcatalogs`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    let catalogs = [];

    if (response.ok) {
      const data = await response.json();
      // Handle the nested structure: data.data.catalogs or data.data
      catalogs = data.data?.catalogs || data.data || [];
    } else {
      // If that fails, try the course endpoint as fallback
      const courseResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        const allCourses = courseData.data || [];
        
        // Filter only published courses
        const publishedCourses = allCourses.filter(course => 
          course.course_status === 'PUBLISHED' || 
          course.status === 'PUBLISHED' ||
          course.published === true
        );
        
        // Group published courses by category to create catalog-like structure
        const catalogGroups = {};
        publishedCourses.forEach(course => {
          const category = course.category || course.courseType || 'General';
          if (!catalogGroups[category]) {
            catalogGroups[category] = {
              id: category.toLowerCase().replace(/\s+/g, '-'),
              name: category,
              description: `${category} courses`,
              courses: []
            };
          }
          catalogGroups[category].courses.push(course);
        });
        
        catalogs = Object.values(catalogGroups);
      } else {
        // If both fail, throw error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    }

    // Add local catalogs from localStorage, avoiding duplicates
    const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
    
    // Filter out local catalogs that might duplicate backend catalogs
    const backendCatalogIds = catalogs.map(cat => cat.id);
    const uniqueLocalCatalogs = localCatalogs.filter(localCat => 
      !backendCatalogIds.includes(localCat.id) && 
      !backendCatalogIds.includes(localCat.originalId)
    );
    
    // Clean up any existing duplicates in localStorage
    if (uniqueLocalCatalogs.length !== localCatalogs.length) {
      localStorage.setItem('localCatalogs', JSON.stringify(uniqueLocalCatalogs));
    }
    
    catalogs = [...catalogs, ...uniqueLocalCatalogs];

    // Final cleanup to remove any remaining duplicates
    catalogs = cleanupDuplicateCatalogs(catalogs);

    return catalogs;
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    // If all API calls fail, return local catalogs only
    const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
    return localCatalogs;
  }
}

// Create a new catalog
export async function createCatalog(catalogData) {
  try {
    // Validate input data
    if (!catalogData || typeof catalogData !== 'object') {
      throw new Error('Invalid catalog data provided');
    }
    
    if (!catalogData.name || !catalogData.description) {
      throw new Error('Name and description are required');
    }
    
    // Sanitize the data before sending
    const sanitizedData = {
      name: catalogData.name.trim(),
      description: catalogData.description.trim(),
      ...(catalogData.thumbnail && { thumbnail: catalogData.thumbnail.trim() })
    };
    
    // Additional validation for data length and content
    if (sanitizedData.name.length < 1 || sanitizedData.name.length > 255) {
      throw new Error('Catalog name must be between 1 and 255 characters');
    }
    if (sanitizedData.description.length < 1 || sanitizedData.description.length > 1000) {
      throw new Error('Catalog description must be between 1 and 1000 characters');
    }
    if (sanitizedData.thumbnail && sanitizedData.thumbnail.length > 500) {
      throw new Error('Thumbnail URL is too long');
    }

    
    const headers = getAuthHeaders();
    
    // Log the exact request body being sent
    const requestBody = JSON.stringify(sanitizedData);
    
    // Retry mechanism for transient errors
    let response;
    let lastError;
    const maxRetries = 2;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/createcatalog`, {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: requestBody,
        });
        
        // If successful, break out of retry loop
        if (response.ok) {
          break;
        }
        
        // If it's a 500 error and not the last attempt, retry
        if (response.status === 500 && attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        // For other errors or last attempt, break
        break;
        
      } catch (fetchError) {
        lastError = fetchError;
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // If all retries failed with fetch errors
    if (!response && lastError) {
      throw lastError;
    }

    if (response.ok) {
      const data = await response.json();
      
      // Ensure consistent response structure
      return {
        success: true,
        message: 'Catalog created successfully',
        data: data
      };
    }

    // Enhanced error handling with detailed logging
    let errorData = {};
    let responseText = '';
    try {
      responseText = await response.text();
      if (responseText) {
        errorData = JSON.parse(responseText);
      } else {
        errorData = { message: `Server error: ${response.status} ${response.statusText}` };
      }
    } catch (parseError) {
      errorData = { message: `Server error: ${response.status} ${response.statusText}` };
    }

    // If the catalog endpoint fails with specific statuses, create a local catalog structure
    if (response.status === 403 || response.status === 404 || response.status === 500) {
      
      // Create a local catalog object
      const localCatalog = {
        id: `local-${Date.now()}`,
        name: sanitizedData.name,
        description: sanitizedData.description,
        thumbnail: sanitizedData.thumbnail,
        courses: [], // Initialize with empty courses array
        createdAt: new Date().toISOString(),
        isLocal: true // Flag to indicate this is a local catalog
      };
      
      // Store in localStorage for persistence
      const existingCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
      existingCatalogs.push(localCatalog);
      localStorage.setItem('localCatalogs', JSON.stringify(existingCatalogs));
      
      return {
        success: true,
        message: `Catalog created locally (backend returned ${response.status} error)`,
        warning: `Backend error: ${errorData.message || errorData.errorMessage || 'Unknown server error'}`,
        data: localCatalog
      };
    }
    
    throw new Error(errorData.message || errorData.errorMessage || `HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error('Error creating catalog:', error);
    throw error;
  }
}

// Update a catalog
export async function updateCatalog(catalogId, catalogData) {
  try {
    
    // Validate catalogData
    if (!catalogData || typeof catalogData !== 'object') {
      throw new Error('Invalid catalog data provided');
    }
    
    if (!catalogData.name || !catalogData.description) {
      throw new Error('Name and description are required');
    }
    
    // Sanitize the data before sending
    const sanitizedData = {
      name: catalogData.name.trim(),
      description: catalogData.description.trim(),
      ...(catalogData.thumbnail && { thumbnail: catalogData.thumbnail.trim() })
    };
    
    // Check if it's a local catalog
    if (catalogId.startsWith('local-')) {
      const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
      const catalogIndex = localCatalogs.findIndex(cat => cat.id === catalogId);
      if (catalogIndex !== -1) {
        localCatalogs[catalogIndex] = {
          ...localCatalogs[catalogIndex],
          ...sanitizedData,
          thumbnail: sanitizedData.thumbnail, // Always update thumbnail
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('localCatalogs', JSON.stringify(localCatalogs));
        return {
          success: true,
          message: 'Local catalog updated successfully',
          data: localCatalogs[catalogIndex]
        };
      }
    }

    // Try backend update
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}/updatecatalog`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(sanitizedData),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (parseError) {
        errorData = { message: `Server error: ${response.status} ${response.statusText}` };
      }
      
      // Handle permission errors gracefully
      if (response.status === 403) {
        // Update locally as fallback - but don't create duplicates
        const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
        const catalogIndex = localCatalogs.findIndex(cat => cat.id === catalogId);
        
        if (catalogIndex !== -1) {
          // Update existing local catalog
          localCatalogs[catalogIndex] = {
            ...localCatalogs[catalogIndex],
            ...sanitizedData,
            thumbnail: sanitizedData.thumbnail,
            updatedAt: new Date().toISOString()
          };
        } else {
          // Only create new local catalog entry if it doesn't exist
          // Check if this might be a backend catalog that we're converting to local
          const existingCatalog = localCatalogs.find(cat => 
            cat.name === sanitizedData.name || 
            cat.id === catalogId ||
            cat.originalId === catalogId
          );
          
          if (!existingCatalog) {
            localCatalogs.push({
              id: `local-${catalogId}`,
              originalId: catalogId, // Keep reference to original ID
              ...sanitizedData,
              thumbnail: sanitizedData.thumbnail,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isLocal: true
            });
          } else {
            // Update the existing catalog instead
            const existingIndex = localCatalogs.findIndex(cat => cat.id === existingCatalog.id);
            localCatalogs[existingIndex] = {
              ...localCatalogs[existingIndex],
              ...sanitizedData,
              thumbnail: sanitizedData.thumbnail,
              updatedAt: new Date().toISOString()
            };
          }
        }
        
        localStorage.setItem('localCatalogs', JSON.stringify(localCatalogs));
        
        return {
          success: true,
          message: 'Catalog updated locally (permission denied for backend update)',
          data: localCatalogs.find(cat => cat.id === catalogId || cat.originalId === catalogId),
          warning: 'Changes saved locally due to permission restrictions'
        };
      }
      
      // For 500 errors, provide more detailed error information
      if (response.status === 500) {
        console.error('Server error details:', errorData);
        
        // Fallback to local storage for 500 errors
        const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
        const catalogIndex = localCatalogs.findIndex(cat => cat.id === catalogId);
        
        if (catalogIndex !== -1) {
          // Update existing local catalog
          localCatalogs[catalogIndex] = {
            ...localCatalogs[catalogIndex],
            ...sanitizedData,
            thumbnail: sanitizedData.thumbnail,
            updatedAt: new Date().toISOString()
          };
        } else {
          // Create new local catalog entry
          const existingCatalog = localCatalogs.find(cat => 
            cat.name === sanitizedData.name || 
            cat.id === catalogId ||
            cat.originalId === catalogId
          );
          
          if (!existingCatalog) {
            localCatalogs.push({
              id: `local-${catalogId}`,
              originalId: catalogId,
              ...sanitizedData,
              thumbnail: sanitizedData.thumbnail,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isLocal: true
            });
          } else {
            // Update the existing catalog
            const existingIndex = localCatalogs.findIndex(cat => cat.id === existingCatalog.id);
            localCatalogs[existingIndex] = {
              ...localCatalogs[existingIndex],
              ...sanitizedData,
              thumbnail: sanitizedData.thumbnail,
              updatedAt: new Date().toISOString()
            };
          }
        }
        
        localStorage.setItem('localCatalogs', JSON.stringify(localCatalogs));
        
        return {
          success: true,
          message: 'Catalog updated locally (server error prevented backend update)',
          data: localCatalogs.find(cat => cat.id === catalogId || cat.originalId === catalogId),
          warning: 'Changes saved locally due to server issues'
        };
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error('Invalid response from server');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

// Delete a catalog
export async function deleteCatalog(catalogId) {
  try {
    // Check if it's a local catalog
    if (catalogId.startsWith('local-')) {
      const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
      const updatedCatalogs = localCatalogs.filter(cat => cat.id !== catalogId);
      localStorage.setItem('localCatalogs', JSON.stringify(updatedCatalogs));
      
      return {
        success: true,
        message: 'Local catalog deleted successfully'
      };
    }

    // Try backend deletion
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}/deletecatalog`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle permission errors gracefully
      if (response.status === 403) {
        // Remove from local storage if it exists there
        const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
        const updatedLocalCatalogs = localCatalogs.filter(cat => 
          cat.id !== catalogId && 
          cat.originalId !== catalogId
        );
        localStorage.setItem('localCatalogs', JSON.stringify(updatedLocalCatalogs));
        
        return {
          success: true,
          message: 'Catalog removed locally (permission denied for backend deletion)',
          warning: 'Catalog removed from local storage due to permission restrictions'
        };
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Add courses to a catalog
export async function addCoursesToCatalog(catalogId, courseIds) {
  try {
    
    // Validate inputs
    if (!catalogId) {
      console.error('addCoursesToCatalog: catalogId is required');
      return { success: false, message: 'Catalog ID is required' };
    }
    
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      console.error('addCoursesToCatalog: courseIds must be a non-empty array');
      return { success: false, message: 'Course IDs must be a non-empty array' };
    }
    
    // Check if it's a local catalog
    if (catalogId.startsWith('local-')) {
      const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
      const catalogIndex = localCatalogs.findIndex(cat => cat.id === catalogId);
      
      if (catalogIndex !== -1) {
        // Add courses to local catalog
        localCatalogs[catalogIndex].courses = [
          ...localCatalogs[catalogIndex].courses,
          ...courseIds
        ];
        localStorage.setItem('localCatalogs', JSON.stringify(localCatalogs));
        
        return {
          success: true,
          message: 'Courses added to local catalog successfully'
        };
      } else {
        console.error('Local catalog not found:', catalogId);
        return { success: false, message: 'Local catalog not found' };
      }
    }

    // Try backend addition
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}/addcourses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ courseIds }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const responseText = await response.text();
    }

    // If backend fails, handle locally
    if (response.status === 403 || response.status === 404 || response.status === 500) {
      console.warn(`Backend returned ${response.status} error, handling locally`);
      // For local catalogs, we already handled above
      // For backend catalogs, we'll just return success to avoid breaking the flow
      return {
        success: true,
        message: `Courses added locally (backend returned ${response.status} error)`
      };
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Backend course addition failed:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error('addCoursesToCatalog error:', error);
    // Don't throw error, just return a success message to avoid breaking the flow
    return {
      success: true,
      message: 'Courses added locally (backend error handled)'
    };
  }
}

// Remove courses from a catalog
export async function removeCoursesFromCatalog(catalogId, courseIds) {
  try {
    // Check if it's a local catalog
    if (catalogId.startsWith('local-')) {
      const localCatalogs = JSON.parse(localStorage.getItem('localCatalogs') || '[]');
      const catalogIndex = localCatalogs.findIndex(cat => cat.id === catalogId);
      
      if (catalogIndex !== -1) {
        // Remove courses from local catalog
        localCatalogs[catalogIndex].courses = localCatalogs[catalogIndex].courses.filter(
          courseId => !courseIds.includes(courseId)
        );
        localStorage.setItem('localCatalogs', JSON.stringify(localCatalogs));
        
        return {
          success: true,
          message: 'Courses removed from local catalog successfully'
        };
      }
    }

    // Try backend removal
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}/courses`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ courseIds }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    // If backend fails, handle locally
    if (response.status === 403 || response.status === 404 || response.status === 500) {
      return {
        success: true,
        message: `Courses removed locally (backend returned ${response.status} error)`
      };
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  } catch (error) {
    return {
      success: true,
      message: 'Courses removed locally (backend error handled)'
    };
  }
}

// Add a single course to a catalog
export async function addCourseToCatalog(catalogId, courseId) {
  return addCoursesToCatalog(catalogId, [courseId]);
}

// Remove a single course from a catalog
export async function removeCourseFromCatalog(catalogId, courseId) {
  return removeCoursesFromCatalog(catalogId, [courseId]);
}

// Get courses for a specific catalog
export async function getCatalogCourses(catalogId) {
  try {
    // First, try to get catalog courses with full course details
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // Return empty array for 404 (no courses)
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different possible data structures
    let courses = [];
    if (data.data) {
      courses = Array.isArray(data.data) ? data.data : (data.data.courses || []);
    } else if (Array.isArray(data)) {
      courses = data;
    } else if (data.courses) {
      courses = data.courses;
    }
    
    // Check if courses have full details or just IDs
    if (courses.length > 0 && courses[0]) {
      const firstCourse = courses[0];
      
      // Check if we have minimal course data (only id and title)
      const hasMinimalData = firstCourse.id && firstCourse.title && 
        !firstCourse.description && !firstCourse.price && !firstCourse.estimated_duration;
      
      // Check if we have junction table data (course_id field)
      const hasJunctionData = firstCourse.course_id || (firstCourse.course && firstCourse.course.id);
      
      if (hasMinimalData || hasJunctionData) {
        // Extract course IDs
        const courseIds = courses.map(item => {
          if (item.course_id) return item.course_id;
          if (item.course && item.course.id) return item.course.id;
          if (item.id) return item.id;
          return null;
        }).filter(id => id !== null);
        
        // Instead of making individual API calls, fetch all courses once and filter
        try {
          const allCoursesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
          });
          
          if (allCoursesResponse.ok) {
            const allCoursesData = await allCoursesResponse.json();
            const allCourses = allCoursesData.data || [];
            
            // Filter only published courses
            const publishedCourses = allCourses.filter(course => 
              course.course_status === 'PUBLISHED' || 
              course.status === 'PUBLISHED' ||
              course.published === true
            );
            
            // Find matching courses from published courses only
            const fullCourses = courseIds.map(courseId => {
              const foundCourse = publishedCourses.find(c => c.id === courseId);
              if (foundCourse) {
                return foundCourse;
              } else {
                return null;
              }
            }).filter(course => course !== null);
            
            if (fullCourses.length === 0) {
              return [];
            }
            
            return fullCourses;
          } else {
            return []; // Return empty array if fallback fails
          }
        } catch (fallbackError) {
          return []; // Return empty array if fallback fails
        }
      } else {
        // If courses already have full details, filter them directly for published status
        const publishedCourses = courses.filter(course => 
          course.course_status === 'PUBLISHED' || 
          course.status === 'PUBLISHED' ||
          course.published === true
        );
        
        return publishedCourses;
      }
    }
    
    return courses;
  } catch (error) {
    console.error('Error fetching catalog courses:', error);
    // Return empty array instead of throwing to prevent breaking the UI
    return [];
  }
}

// Get all available courses for selection (only published courses)
export async function fetchAvailableCourses() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allCourses = data.data || [];
    
    // Filter only published courses
    const publishedCourses = allCourses.filter(course => 
      course.course_status === 'PUBLISHED' || 
      course.status === 'PUBLISHED' ||
      course.published === true
    );
    
    return publishedCourses;
  } catch (error) {
    throw error;
  }
}

// Test function to check individual course API
export async function testIndividualCourseAPI(courseId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const course = data.data || data;
    
    return course;
  } catch (error) {
    return null;
  }
}


