import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Maximize, Minimize } from "lucide-react";

const Scrompack = () => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock module data - in production, you would fetch this based on courseId and moduleId
  const moduleData = {
    id: moduleId,
    title: "Introduction to React",
    scormUrl: `/ModulePackages/${courseId}/module${moduleId}/index.html`
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById("scorm-iframe");
    if (iframe) {
      if (isFullscreen) {
        document.exitFullscreen();
      } else {
        iframe.requestFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/courses/${courseId}`);
  };

  return (
    <div className="course-iframe-container bg-background">
      <div className="course-iframe-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">{moduleData.title}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleFullscreen}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="course-iframe-content">
        <iframe
          id="scorm-iframe"
          title={moduleData.title}
          src={moduleData.scormUrl}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Scrompack;
