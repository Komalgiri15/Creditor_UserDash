// Catalog Service for handling catalog-related API calls
import Cookies from 'js-cookie';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = Cookies.get('token');
  
  // Try both Authorization header and cookie-based auth
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export async function fetchAllCatalogs(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/getallcatalogs${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Catalogs fetched:', data);
    // Handle the nested structure: data.data.catalogs
    return data.data?.catalogs || data.data || [];
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    throw error;
  }
}

export async function fetchCatalogById(catalogId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching catalog by ID:', error);
    throw error;
  }
}

export async function fetchCatalogCourses(catalogId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/${catalogId}/courses`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('No courses found for catalog:', catalogId);
        return []; // Return empty array for 404 (no courses)
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Catalog courses fetched:', data);
    
    // Handle different possible data structures
    let courses = [];
    if (data.data) {
      courses = Array.isArray(data.data) ? data.data : (data.data.courses || []);
    } else if (Array.isArray(data)) {
      courses = data;
    } else if (data.courses) {
      courses = data.courses;
    }
    
    console.log(`Raw courses for catalog ${catalogId}:`, courses);
    console.log(`Total courses found: ${courses.length}`);
    
    // Check if courses have full details or just IDs
    if (courses.length > 0 && courses[0]) {
      const firstCourse = courses[0];
      
      // Log the first course structure to understand the data format
      console.log('First course structure:', firstCourse);
      console.log('Available fields in first course:', Object.keys(firstCourse));
      
      // Check if we have minimal course data (only id and title)
      const hasMinimalData = firstCourse.id && firstCourse.title && 
        !firstCourse.description && !firstCourse.price && !firstCourse.estimated_duration;
      
      // Check if we have junction table data (course_id field)
      const hasJunctionData = firstCourse.course_id || (firstCourse.course && firstCourse.course.id);
      
      if (hasMinimalData || hasJunctionData) {
        console.log('Detected minimal or junction data, fetching full course details...');
        
        // Extract course IDs
        const courseIds = courses.map(item => {
          if (item.course_id) return item.course_id;
          if (item.course && item.course.id) return item.course.id;
          if (item.id) return item.id;
          return null;
        }).filter(id => id !== null);
        
        console.log('Extracted course IDs:', courseIds);
        
        // Fetch all courses and filter for published ones
        try {
                     const allCoursesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
             method: 'GET',
             headers: getAuthHeaders(),
             credentials: 'include',
           });
          
          if (allCoursesResponse.ok) {
            const allCoursesData = await allCoursesResponse.json();
            const allCourses = allCoursesData.data || [];
            
            console.log(`Fetched ${allCourses.length} total courses from getAllCourses`);
            
            // Filter only published courses
            const publishedCourses = allCourses.filter(course => 
              course.course_status === 'PUBLISHED' || 
              course.status === 'PUBLISHED' ||
              course.published === true
            );
            
            console.log(`Filtered ${publishedCourses.length} published courses out of ${allCourses.length} total courses`);
            
            // Find matching courses from published courses only
            const fullCourses = courseIds.map(courseId => {
              const foundCourse = publishedCourses.find(c => c.id === courseId);
              if (foundCourse) {
                return foundCourse;
              } else {
                console.log(`Course ID ${courseId} not found in published courses`);
                return null;
              }
            }).filter(course => course !== null);
            
            console.log(`Found ${fullCourses.length} matching published courses for catalog ${catalogId}`);
            
            // Temporary fallback for debugging - if no published courses found, return all courses
            if (fullCourses.length === 0 && courseIds.length > 0) {
              console.log('No published courses found, returning all courses for debugging');
              const allCoursesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'include',
              });
              
              if (allCoursesResponse.ok) {
                const allCoursesData = await allCoursesResponse.json();
                const allCourses = allCoursesData.data || [];
                
                const fallbackCourses = courseIds.map(courseId => {
                  const foundCourse = allCourses.find(c => c.id === courseId);
                  return foundCourse || null;
                }).filter(course => course !== null);
                
                console.log(`Fallback: Returning ${fallbackCourses.length} total courses for catalog ${catalogId}`);
                return fallbackCourses;
              }
            }
            
            return fullCourses;
          } else {
            console.log('Failed to fetch all courses, returning empty array');
            return [];
          }
        } catch (fallbackError) {
          console.error('Error in fallback course fetching:', fallbackError);
          return [];
        }
      } else {
        // If courses already have full details, filter them directly for published status
        console.log('Courses have full details, filtering directly...');
        
        const publishedCourses = courses.filter(course => {
          // Check multiple possible status field names and values
          const status = course.course_status || course.status || course.published || course.isPublished || course.publishStatus;
          const isPublished = status === 'PUBLISHED' || status === 'published' || status === true || status === 'true';
          
          console.log(`Course "${course.title || course.name || 'Unknown'}" status:`, {
            course_status: course.course_status,
            status: course.status,
            published: course.published,
            isPublished: course.isPublished,
            publishStatus: course.publishStatus,
            finalStatus: status,
            isPublished: isPublished
          });
          
          return isPublished;
        });
        
        console.log(`fetchCatalogCourses: Filtered ${publishedCourses.length} published courses out of ${courses.length} total courses for catalog ${catalogId}`);
        
        // If no published courses found, log all courses for debugging
        if (publishedCourses.length === 0 && courses.length > 0) {
          console.log('No published courses found. All courses:', courses.map(c => ({
            id: c.id,
            title: c.title || c.name,
            course_status: c.course_status,
            status: c.status,
            published: c.published,
            isPublished: c.isPublished,
            publishStatus: c.publishStatus
          })));
          
          // Temporary fallback for debugging - return all courses if no published ones found
          console.log('No published courses found, returning all courses for debugging');
          return courses;
        }
        
        return publishedCourses;
      }
    }
    
    return courses;
  } catch (error) {
    console.error('Error fetching catalog courses:', error);
    return []; // Return empty array on any error
  }
}

export async function searchCatalogs(searchTerm, filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/getallcatalogs?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const allCatalogs = data.data || [];
    
    // Apply client-side filtering if backend doesn't support it
    let filteredCatalogs = allCatalogs;
    
    if (searchTerm) {
      filteredCatalogs = filteredCatalogs.filter(catalog =>
        catalog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catalog.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.category && filters.category !== 'all') {
      filteredCatalogs = filteredCatalogs.filter(catalog =>
        catalog.category === filters.category
      );
    }
    
    return filteredCatalogs;
  } catch (error) {
    console.error('Error searching catalogs:', error);
    throw error;
  }
}

// Test function to check API endpoints
export async function testCatalogAPI() {
  try {
    console.log('Testing catalog API endpoints...');
    
    // Test fetchAllCatalogs
    const catalogs = await fetchAllCatalogs();
    console.log('fetchAllCatalogs result:', catalogs);
    
    if (catalogs.length > 0) {
      const firstCatalog = catalogs[0];
      console.log('Testing fetchCatalogCourses with first catalog:', firstCatalog.id);
      
      const courses = await fetchCatalogCourses(firstCatalog.id);
      console.log('fetchCatalogCourses result:', courses);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Catalog API test failed:', error);
    return { success: false, error: error.message };
  }
}

// Legacy function for backward compatibility - now fetches catalogs instead of courses
export async function fetchCatalogCoursesLegacy(params = {}) {
  console.warn('fetchCatalogCoursesLegacy is deprecated. Use fetchAllCatalogs instead.');
  return await fetchAllCatalogs(params);
}

// Legacy function for backward compatibility
export async function fetchCoursesByCategory(category) {
  console.warn('fetchCoursesByCategory is deprecated. Use fetchCatalogCourses(catalogId) instead.');
  try {
    const catalogs = await fetchAllCatalogs();
    const catalog = catalogs.find(cat => cat.name === category || cat.category === category);
    if (catalog) {
      return await fetchCatalogCourses(catalog.id);
    }
    return [];
  } catch (error) {
    console.error('Error fetching courses by category:', error);
    throw error;
  }
}

// Legacy function for backward compatibility
export async function fetchCourseCategories() {
  console.warn('fetchCourseCategories is deprecated. Use fetchAllCatalogs instead.');
  try {
    const catalogs = await fetchAllCatalogs();
    return catalogs.map(catalog => catalog.name || catalog.category || "General");
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error;
  }
} 