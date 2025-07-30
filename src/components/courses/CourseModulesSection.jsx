import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

const CourseModulesSection = ({ 
  courseId, 
  modules, 
  isLoading, 
  onCreateModule, 
  onEditModule, 
  onDeleteModule 
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-500">Loading modules...</span>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900">Course Modules</h4>
        <button
          onClick={() => onCreateModule(courseId)}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Module
        </button>
      </div>
      
      {modules && modules.length > 0 ? (
        <div className="space-y-2">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h5 className="font-medium text-gray-900">{module.title}</h5>
                {module.description && (
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">Order: {module.order || 'N/A'}</span>
                  <span className="text-xs text-gray-500">Duration: {module.estimated_duration || 0} min</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    module.module_status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                    module.module_status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {module.module_status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="text-xs text-gray-500">ID: {module.id}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEditModule(courseId, module)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteModule(courseId, module)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No modules found for this course</p>
      )}
    </div>
  );
};

export default CourseModulesSection; 