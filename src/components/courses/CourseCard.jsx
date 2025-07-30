import React, { useState } from 'react';
import { MoreVertical, Users, BookOpen, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const CourseCard = ({ 
  course, 
  onViewModules, 
  onViewUsers, 
  onEdit, 
  onDelete, 
  isExpanded,
  children 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    if (typeof duration === 'number') {
      return `${duration} min`;
    }
    return duration;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Course Header */}
      <div className="relative">
        {/* Thumbnail */}
        <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
          {course.thumbnail ? (
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end">
            <div className="p-4 w-full">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(course.course_status)}`}>
                {course.course_status}
              </span>
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onViewModules(course.id);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {isExpanded ? 'Hide' : 'View'} Modules
                </button>
                <button
                  onClick={() => {
                    onViewUsers(course.id);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  View Users
                </button>
                <button
                  onClick={() => {
                    onEdit(course);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Course
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    onDelete(course);
                    setShowOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {course.description || 'No description available'}
          </p>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {formatDuration(course.estimated_duration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.max_students || '∞'} students
            </span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg text-gray-900">
              ${course.price || '0'}
            </div>
            <div className="text-xs text-gray-500">Price</div>
          </div>
        </div>

        {/* Course Features */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          {course.isHidden && (
            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
              <EyeOff className="w-3 h-3" />
              Hidden
            </span>
          )}
          {course.requireFinalQuiz && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              Quiz Required
            </span>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && children && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard; 