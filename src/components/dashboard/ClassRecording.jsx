import React from "react";
import { Video, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClassRecording() {
  const driveLink = import.meta.env.VITE_DRIVE_FOLDER_URL;

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto">
      <div className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-800">
        <Video className="h-6 w-6 text-purple-500" />
        Class Recordings
      </div>
      <p className="text-gray-500 mt-1">Access past sessions at your convenience</p>

      <div className="mt-6 bg-[#f8f9ff] border-2 border-[#e4e4fb] rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left section with title and info */}
          <div className="flex flex-1 items-start sm:items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-full text-purple-700">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Sovereignty 101</h3>
              <p className="text-gray-600 text-sm mt-1">
                Explore the fundamental principles of digital sovereignty through this comprehensive session recording.
              </p>
            </div>
          </div>

          {/* Right section: button */}
          <div className="sm:self-center">
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#6b5cff] hover:bg-[#5b4bde] text-white text-sm font-medium px-4 py-2 rounded-md transition shadow-md w-full sm:w-auto text-center"
            >
              Coming Soon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}