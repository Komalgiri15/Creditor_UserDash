import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
import { fetchCourseModules } from "@/services/courseService";
import { injectScormBridge } from "@/utils/scormBridge";

export function ModuleView() {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [iframeError, setIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeHeight, setIframeHeight] = useState("100vh");
  const [contentLoaded, setContentLoaded] = useState(false);
  const iframeRef = useRef(null);


  useEffect(() => {
    const fetchModule = async () => {
      setIsLoading(true);
      setError("");
      try {
        const modules = await fetchCourseModules(courseId);
        const foundModule = modules.find(m => m.id === moduleId);
        if (foundModule) {
          console.log('Module found:', foundModule);
          console.log('Resource URL:', foundModule.resource_url);
          setModule(foundModule);
        } else {
          setError("Module not found");
        }
      } catch (err) {
        console.error('Error fetching module:', err);
        setError("Failed to load module");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId && moduleId) {
      fetchModule();
    }
  }, [courseId, moduleId]);

  // Handle iframe message events for dynamic sizing and SCORM communication
  useEffect(() => {
    const handleMessage = (event) => {
      // Accept messages from the S3 bucket domain
      if (event.origin.includes('creditorappuniquebucket02082025.s3.us-east-1.amazonaws.com') ||
          event.origin === window.location.origin) {
        
        try {
          if (event.data && typeof event.data === 'object') {
            console.log('Received message from iframe:', event.data);
            
            // Handle resize messages
            if (event.data.type === 'resize' && event.data.data && event.data.data.height) {
              setIframeHeight(`${event.data.data.height}px`);
            }
            
            // Handle SCORM calls
            if (event.data.type === 'scorm-call') {
              console.log('SCORM call received:', event.data.data);
              // You can handle SCORM calls here if needed
            }
            
            // Handle content loaded
            if (event.data.type === 'content-loaded') {
              setContentLoaded(true);
            }
          }
        } catch (err) {
          console.warn('Error handling iframe message:', err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleIframeError = () => {
    console.error('Iframe failed to load:', module?.resource_url);
    setIframeError(true);
  };

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    setIframeError(false);
    
    // Try to inject the SCORM bridge script
    setTimeout(() => {
      try {
        if (iframeRef.current) {
          injectScormBridge(iframeRef.current);
        }
      } catch (err) {
        console.warn('Could not inject SCORM bridge:', err);
      }
    }, 1000);
    
    // Set content as loaded after a delay
    setTimeout(() => {
      setContentLoaded(true);
    }, 2000);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      iframeRef.current?.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

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

  // Handle the resource URL - it should be a complete URL from the API
  const resourceUrl = module.resource_url;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary/10 to-white border-b border-gray-200 px-0 py-0 shadow-sm">
            <div className="max-w-5xl mx-auto rounded-lg bg-white/90 backdrop-blur-md px-8 py-5 mt-6 mb-2 shadow-lg border-l-8 border-primary">
              {/* Back to Modules Button - Top Left */}
              <div className="mb-2">
                <Button variant="ghost" size="sm" asChild className="text-primary font-semibold hover:bg-primary/10 -ml-2">
                  <Link to={`/dashboard/courses/${courseId}/modules`}>
                    <ChevronLeft size={18} className="mr-1" />
                    Back to Modules
                  </Link>
                </Button>
              </div>
              {/* Module Title and Description */}
              <div className="flex flex-col items-start gap-2">
                <h1 className="text-2xl font-bold text-primary drop-shadow-sm tracking-tight mb-1">
                  {module.title}
                </h1>
                <p className="text-[15px] text-gray-700 font-normal leading-7 max-w-3xl text-left mb-0">
                  {module.description}
                </p>
              </div>
              {/* Fullscreen Button - Bottom Left */}
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="border-primary text-primary hover:bg-primary/10">
                  {isFullscreen ? <Minimize2 size={16} className="mr-2" /> : <Maximize2 size={16} className="mr-2" />}
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </Button>
              </div>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 relative bg-gray-50">
            {iframeError ? (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <span className="text-4xl">❌</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Failed to load content</h3>
                  <p className="text-muted-foreground mb-4">
                    The module content could not be loaded. Please try opening it in a new tab.
                  </p>
                  <Button asChild>
                    <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-2" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative">
                {/* Loading overlay */}
                {!contentLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Your content is loading...</p>
                    </div>
                  </div>
                )}
                
                {/* Iframe */}
                <iframe
                  ref={iframeRef}
                  src={resourceUrl}
                  className="w-full h-full border-0"
                  style={{ minHeight: iframeHeight }}
                  title={module.title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-top-navigation"
                  onError={handleIframeError}
                  onLoad={handleIframeLoad} 
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModuleView; 