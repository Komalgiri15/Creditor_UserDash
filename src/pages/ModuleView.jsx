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
  const [iframeLoading, setIframeLoading] = useState(true);

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

  let fullUrl = module.resource_url;
  if (!module.resource_url.startsWith('http')) {
    fullUrl = `${import.meta.env.VITE_API_BASE_URL}${module.resource_url}`;
  }
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
              <div>
                <Button asChild variant="outline">
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Open in New Tab
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area with iframe */}
          <div className="flex-1 bg-gray-50 relative">
            {iframeLoading && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Loading Module Content</p>
                  <p className="text-sm text-gray-500">Please wait while the content loads...</p>
                </div>
              </div>
            )}

            <div className="h-screen w-full">
              <iframe
                src={fullUrl}
                className="w-full h-full border-0"
                title={module.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setIframeLoading(false)}
                onError={() => setIframeLoading(false)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
