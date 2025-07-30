import React, { useState, useEffect } from 'react';
import { fetchCourseUsers, unenrollUser } from '../../services/courseService';

const CourseUsersModal = ({ isOpen, onClose, courseId }) => {
  const [courseUsers, setCourseUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");
  const [unenrollLoading, setUnenrollLoading] = useState({});

  useEffect(() => {
    if (isOpen && courseId) {
      fetchUsers();
    }
  }, [isOpen, courseId]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setError("");
    try {
      const users = await fetchCourseUsers(courseId);
      setCourseUsers(users);
    } catch (err) {
      setError(err.message || "Failed to fetch course users");
      setCourseUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUnenroll = async (userId) => {
    if (!confirm('Are you sure you want to unenroll this user from the course?')) {
      return;
    }

    setUnenrollLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await unenrollUser(courseId, userId);
      if (response.success) {
        // Remove the user from the list
        setCourseUsers(prev => prev.filter(user => user.user_id !== userId));
        // Show success message
        alert('User unenrolled successfully!');
      } else {
        throw new Error(response.message || 'Failed to unenroll user');
      }
    } catch (err) {
      setError(err.message || "Failed to unenroll user");
    } finally {
      setUnenrollLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Course Users</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        
        {usersLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : courseUsers.length > 0 ? (
          <div className="space-y-3">
            {courseUsers.map((userData, index) => (
              <div key={userData.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {userData.user.image ? (
                      <img src={userData.user.image} alt="User" className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-blue-600 font-medium">
                        {userData.user.first_name?.[0]}{userData.user.last_name?.[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {userData.user.first_name} {userData.user.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{userData.user.email}</p>
                    <div className="flex gap-1 mt-1">
                      {userData.user.user_roles?.map((role, roleIndex) => (
                        <span key={roleIndex} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {role.role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">ID: {userData.user_id}</span>
                  <button
                    onClick={() => handleUnenroll(userData.user_id)}
                    disabled={unenrollLoading[userData.user_id]}
                    className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    {unenrollLoading[userData.user_id] ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                        Unenrolling...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Unenroll
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No users enrolled in this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseUsersModal; 