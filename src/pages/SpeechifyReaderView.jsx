import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpeechifyReader } from "@/components/courses/SpeechifyReader";

export function SpeechifyReaderView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { content, title } = location.state || { content: '', title: '' };

  useEffect(() => {
    // If no content is provided, navigate back but with a brief delay
    // to ensure the component fully mounts first
    if (!content) {
      setTimeout(() => navigate(-1), 100);
    }
    
    // Set body style to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body style
      document.body.style.overflow = '';
    };
  }, [content, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  return content ? (
    <SpeechifyReader
      content={content}
      title={title}
      onClose={handleClose}
    />
  ) : (
    // Provide a placeholder while checking for content
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading Speechify Reader...</p>
      </div>
    </div>
  );
}

export default SpeechifyReaderView;