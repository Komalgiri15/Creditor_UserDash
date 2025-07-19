import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Maximize, Minimize } from "lucide-react";

const MOCK_MODULE = {
  id: "mod1",
  title: "Introduction to React",
  scormUrl: "/ModulePackages/react-2023/module1/index.html" // Replace with actual uploaded SCORM path
};

const Scrompack = () => {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    navigate(-1); // Go back to CourseView
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{MOCK_MODULE.title}</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleFullscreen}>
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex-1">
        <iframe
          id="scorm-iframe"
          title={MOCK_MODULE.title}
          src={MOCK_MODULE.scormUrl}
          className="w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Scrompack;
