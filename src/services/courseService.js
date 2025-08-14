import { getAuthHeader } from '../services/authHeader'; // adjust path as needed

export async function fetchAllCourses() {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getAllCourses`, {
      method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  credentials: 'include',
});
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  const data = await response.json();
  return data.data;
}

export async function fetchCourseById(courseId) {
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getCourseById/${courseId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  credentials: 'include',
});
if (!response.ok) {
  throw new Error('Failed to fetch course details');
}
const data = await response.json();
return data.data || data;
}

export async function fetchUserCourses() {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/getCourses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user courses');
  }
  const data = await response.json();
  return data.data;
}

export async function createCourse(courseData) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/createCourse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify(courseData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to create course (${response.status})`);
  }
  
  const data = await response.json();
  return data;
}

export async function updateCourse(courseId, courseData) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/editCourse/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify(courseData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to update course (${response.status})`);
  }
  
  const data = await response.json();
  return data;
}

export async function fetchCourseUsers(courseId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/getAllUsersByCourseId`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch course users');
  }
  
  const data = await response.json();
  return data.data || [];
}

export async function fetchCourseModules(courseId) {
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/modules/getAllModules`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  credentials: 'include',
});
if (!response.ok) {
  throw new Error('Failed to fetch course modules');
}
const data = await response.json();
return data.data || data; // Handle different response structures
}

export async function createModule(courseId, moduleData) {

const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/modules/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  credentials: 'include',
  body: JSON.stringify(moduleData),
});


if (!response.ok) {
  const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
  throw new Error(errorData.message || `Failed to create module (${response.status})`);
}

const data = await response.json();
return data.data || data;
}

export async function updateModule(courseId, moduleId, moduleData) {
const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/modules/${moduleId}/update`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  },
  credentials: 'include',
  body: JSON.stringify(moduleData),
});
if (!response.ok) {
  const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
  throw new Error(errorData.message || `Failed to update module (${response.status})`);
}
const data = await response.json();
return data.data || data;
}

export async function deleteModule(courseId, moduleId, moduleData) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/modules/${moduleId}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'text/plain',
      ...getAuthHeader(),
    },
    credentials: 'include',
    body: JSON.stringify(moduleData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to delete module (${response.status})`);
  }
  const data = await response.json();
  return data.data || data;
}

export async function deleteCourse(courseId) {
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/course/${courseId}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to delete course (${response.status})`);
  }
  
  const data = await response.json();
  return data.data || data;
}

export async function unenrollUser(courseId, userId) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/${courseId}/unenrollUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `Failed to unenroll user (${response.status})`);
  }
  
  const data = await response.json();
  return data;
}

// Example usage in a fetch call:
export async function someApiFunction() {
  const response = await fetch(`${API_BASE}/api/someEndpoint`, {
    method: 'GET', // or 'POST', etc.
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    credentials: 'include',
  });
  // ...existing code...
}