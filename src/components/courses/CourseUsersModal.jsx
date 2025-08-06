import React, { useState, useEffect } from 'react';
import { fetchCourseUsers, unenrollUser } from '../../services/courseService';
import { X, Users, Search, UserCheck, UserX, Mail, Shield, Crown } from 'lucide-react';
import ConfirmationDialog from '../ui/ConfirmationDialog';

const CourseUsersModal = ({ isOpen, onClose, courseId }) => {
  const [courseUsers, setCourseUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState("");
  const [unenrollLoading, setUnenrollLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
  const [userToUnenroll, setUserToUnenroll] = useState(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scroll
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
    const user = courseUsers.find(u => u.user_id === userId);
    setUserToUnenroll(user);
    setShowUnenrollConfirm(true);
  };

  const confirmUnenroll = async () => {
    if (!userToUnenroll) return;
    
    setUnenrollLoading(prev => ({ ...prev, [userToUnenroll.user_id]: true }));
    try {
      const response = await unenrollUser(courseId, userToUnenroll.user_id);
      if (response.success) {
        // Remove the user from the list
        setCourseUsers(prev => prev.filter(user => user.user_id !== userToUnenroll.user_id));
        // Show success message
        alert('User unenrolled successfully!');
      } else {
        throw new Error(response.message || 'Failed to unenroll user');
      }
    } catch (err) {
      setError(err.message || "Failed to unenroll user");
    } finally {
      setUnenrollLoading(prev => ({ ...prev, [userToUnenroll.user_id]: false }));
      setShowUnenrollConfirm(false);
      setUserToUnenroll(null);
    }
  };

  const cancelUnenroll = () => {
    setShowUnenrollConfirm(false);
    setUserToUnenroll(null);
  };

  // Filter users based on search term
  const filteredUsers = courseUsers.filter(user => {
    const fullName = `${user.user.first_name} ${user.user.last_name}`.toLowerCase();
    const email = user.user.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  // Get role badge styling
  const getRoleBadgeStyle = (role) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin') || roleLower.includes('instructor')) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    } else if (roleLower.includes('user')) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) {
      return <Crown className="w-3 h-3" />;
    } else if (roleLower.includes('instructor')) {
      return <Shield className="w-3 h-3" />;
    } else {
      return <UserCheck className="w-3 h-3" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Course Users</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} enrolled
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}
          
          {usersLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((userData, index) => (
                <div 
                  key={userData.user_id} 
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          {userData.user.image ? (
                            <img 
                              src={userData.user.image} 
                              alt="User" 
                              className="w-12 h-12 rounded-full object-cover" 
                            />
                          ) : (
                            <span>
                              {userData.user.first_name?.[0]}{userData.user.last_name?.[0]}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {userData.user.first_name} {userData.user.last_name}
                          </h3>
                          <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                            ID: {userData.user_id}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-600">{userData.user.email}</p>
                        </div>

                        {/* Role Badge - Show only highest priority role */}
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            if (userData.user.user_roles && userData.user.user_roles.length > 0) {
                              const roles = userData.user.user_roles.map(roleObj => roleObj.role);
                              const priorityRoles = ['admin', 'instructor', 'user'];
                              const highestRole = priorityRoles.find(role => roles.includes(role)) || 'user';
                              
                              return (
                                <span 
                                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeStyle(highestRole)}`}
                                >
                                  {getRoleIcon(highestRole)}
                                  {highestRole}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUnenroll(userData.user_id)}
                        disabled={unenrollLoading[userData.user_id]}
                        className="group/btn flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300"
                      >
                        {unenrollLoading[userData.user_id] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                            <span className="text-sm font-medium">Unenrolling...</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4" />
                            <span className="text-sm font-medium">Unenroll</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No users found' : 'No users enrolled'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Users will appear here once they enroll in this course'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {courseUsers.length} users
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showUnenrollConfirm && (
        <ConfirmationDialog
          isOpen={showUnenrollConfirm}
          onClose={cancelUnenroll}
          onConfirm={confirmUnenroll}
          title="Unenroll Student"
          message={`Are you sure you want to unenroll ${userToUnenroll?.user?.first_name} ${userToUnenroll?.user?.last_name} from this course? This action cannot be undone and will remove their access to all course materials.`}
          confirmText="Unenroll Student"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </div>
  );
};

export default CourseUsersModal; 