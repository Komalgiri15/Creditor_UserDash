import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { fetchCourseModules } from "@/services/courseService";

export function ModuleView() {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchModule = async () => {
      setIsLoading(true);
      setError("");
      try {
        const modules = await fetchCourseModules(courseId);
        const foundModule = modules.find(m => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);
        } else {
          setError("Module not found");
        }
      } catch (err) {
        setError("Failed to load module");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId && moduleId) {
      fetchModule();
    }
  }, [courseId, moduleId]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading module...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-4">
                  <span className="text-4xl">❌</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Failed to load module</h3>
                <p className="text-muted-foreground mb-4">{error || "Module not found"}</p>
                <Button asChild>
                  <Link to={`/dashboard/courses/${courseId}/modules`}>
                    Back to Modules
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!module.resource_url) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container py-6 max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-yellow-500 mb-4">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-lg font-medium mb-2">No Content Available</h3>
                <p className="text-muted-foreground mb-4">This module doesn't have any content yet.</p>
                <Button asChild>
                  <Link to={`/dashboard/courses/${courseId}/modules`}>
                    Back to Modules
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Use the resource_url directly if it's already a full URL, otherwise prepend the API base URL
  let fullUrl = module.resource_url;
  
  // If it's not already a full URL, prepend the API base URL
  if (!module.resource_url.startsWith('http')) {
    fullUrl = `${import.meta.env.VITE_API_BASE_URL}${module.resource_url}`;
  }
  
  // For S3 URLs, ensure they have the correct protocol
  if (fullUrl.includes('s3.amazonaws.com') && !fullUrl.startsWith('https://')) {
    fullUrl = fullUrl.replace('http://', 'https://');
  }
  


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/dashboard/courses/${courseId}/modules`}>
                    <ChevronLeft size={16} />
                    Back to Modules
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">{module.title}</h1>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="flex items-center justify-center h-full p-8">
              <div className="max-w-2xl mx-auto text-center">
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Learn?
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  This interactive module is designed to work best in a new tab for the optimal learning experience. 
                  Click the button below to open your content in a new window.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="w-8 h-8 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Full Functionality</h3>
                    <p className="text-sm text-gray-600">All interactive features work perfectly</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="w-8 h-8 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Better Performance</h3>
                    <p className="text-sm text-gray-600">Optimized for smooth learning experience</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="w-8 h-8 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Secure Access</h3>
                    <p className="text-sm text-gray-600">Safe and secure learning environment</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    asChild
                  >
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={20} className="mr-3" />
                      Open Module in New Tab
                    </a>
                  </Button>
                  
                  <p className="text-sm text-gray-500">
                    The module will open in a new browser tab
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModuleView; 