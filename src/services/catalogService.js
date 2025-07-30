// Catalog Service for handling catalog-related API calls

export async function fetchAllCatalogs(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/catalog/getallcatalogs${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    // Handle the nested structure: data.data.courses or data.data
    return data.data?.courses || data.data || [];
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
      headers: {
        'Content-Type': 'application/json',
      },
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