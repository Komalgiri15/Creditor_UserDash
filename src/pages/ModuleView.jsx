import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink, BookOpen, Play, Shield, Zap } from "lucide-react";
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-6">
              {/* Back Button and Title Row */}
              <div className="flex items-start gap-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <Link to={`/dashboard/courses/${courseId}/modules`}>
                    <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    Back to Modules
                  </Link>
                </Button>
              </div>
              
              {/* Module Title and Description */}
              <div className="space-y-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {module.title}
                </h1>
                {module.description && (
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    {module.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
              <div className="max-w-4xl mx-auto">
                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <BookOpen size={28} className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                          Ready to Learn?
                        </h2>
                        <p className="text-blue-100 text-sm">
                          Interactive learning experience awaits
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-8">
                    {/* Description */}
                    <div className="text-center mb-8">
                      <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
                        This interactive module is designed to work best in a new tab for the optimal learning experience. 
                        Click the button below to open your content in a new window.
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                          <Play size={20} className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Full Functionality</h3>
                        <p className="text-sm text-gray-600">All interactive features work perfectly in the new tab</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                          <Zap size={20} className="text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Better Performance</h3>
                        <p className="text-sm text-gray-600">Optimized for smooth learning experience</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                          <Shield size={20} className="text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Secure Access</h3>
                        <p className="text-sm text-gray-600">Safe and secure learning environment</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="text-center space-y-4">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                        asChild
                      >
                        <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={20} className="mr-3" />
                          Open Module in New Tab
                        </a>
                      </Button>
                      
                      <p className="text-sm text-gray-500">
                        The module will open in a new browser tab for the best experience
                      </p>
                    </div>
                  </div>
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